// Crawl-style SEO verification of the built site. Runs automatically at the
// end of `npm run build`: any FAIL exits non-zero and aborts the deploy.
//
//   node scripts/verify-seo.mjs                      checks dist/ (static HTML, sitemap,
//                                                    robots/llms.txt, JSON-LD, redirects)
//   node scripts/verify-seo.mjs --base-url=<url>     ALSO checks a running site over HTTP
//                                                    (status codes, 404s, redirect hops) —
//                                                    use against a Vercel preview deploy.
//
// It reads HTML as a crawler does (raw bytes, no JavaScript), so a page that
// only works after React boots is treated as broken.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToRegexp, compile } from 'path-to-regexp'
import { getRoutes, getPrerenderRoutes } from './routes.mjs'
import {
  ORIGIN, BUSINESS, APPROVED_CITIES, UNAPPROVED_CITIES, NOINDEX_ROUTES, LEGACY_URLS, FAKE_URLS,
} from './seo-fixtures.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const BASE_URL = process.argv.find((a) => a.startsWith('--base-url='))?.slice('--base-url='.length).replace(/\/$/, '')
const MIN_WORDS = 250

// ---------------------------------------------------------------- reporting
const results = new Map() // category -> { fail: [], warn: [], checks: 0 }
function cat(name) {
  if (!results.has(name)) results.set(name, { fail: [], warn: [], checks: 0 })
  return results.get(name)
}
const check = (name, ok, msg) => { const c = cat(name); c.checks++; if (!ok) c.fail.push(msg) }
const warn = (name, msg) => cat(name).warn.push(msg)

// ---------------------------------------------------------------- html utils
const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
function attrs(tag) {
  const out = {}
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[m[1]] = decode(m[2])
  return out
}
function parse(html) {
  const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attrs(m[0]))
  const meta = tags('meta')
  const links = tags('link')
  const body = html.slice(html.indexOf('<body'))
  const text = decode(
    body
      .replace(/<div id="app-loader">[\s\S]*?<div class="phs-label">LOADING<\/div>\s*<\/div>/, ' ')
      .replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim()
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  return {
    title: decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim(),
    titleCount: (html.match(/<title>/g) || []).length,
    description: meta.find((m) => m.name === 'description')?.content,
    descriptionCount: meta.filter((m) => m.name === 'description').length,
    robots: meta.find((m) => m.name === 'robots')?.content,
    ogUrl: meta.find((m) => m.property === 'og:url')?.content,
    ogImage: meta.find((m) => m.property === 'og:image')?.content,
    canonicals: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    h1s: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()),
    text,
    words: text ? text.split(' ').length : 0,
    jsonLd,
    hrefs: [...body.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => decode(m[1])),
    assets: [...html.matchAll(/\b(?:src|href)="(\/[^"]+\.(?:js|css|webp|png|jpe?g|svg|ico|woff2?))"/g)].map((m) => m[1]),
  }
}
const fileFor = (route) => (route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.slice(1)}.html`))
const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p)
const cityOf = (route) => APPROVED_CITIES.find(([, slug]) => route === `/service-areas/${slug}` || route.startsWith(`/${slug}/`))

// ---------------------------------------------------------------- routes & redirects
if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ not built — run `npm run build` first.')
  process.exit(1)
}
const sitemapRoutes = getRoutes().map(([p]) => p)
const allRoutes = getPrerenderRoutes()
const realRoutes = new Set(allRoutes)
const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))
const redirects = vercel.redirects.map((r) => {
  const keys = []
  return { ...r, re: pathToRegexp(r.source, keys), keys, toPath: compile(r.destination, { validate: false }) }
})
/** First matching redirect's destination for a path (Vercel: first match wins), or null. */
function redirectTarget(p) {
  for (const r of redirects) {
    const m = r.re.exec(p)
    if (m) {
      const params = {}
      r.keys.forEach((k, i) => { params[k.name] = m[i + 1] })
      return { rule: r.source, to: r.toPath(params) }
    }
  }
  return null
}

// ---------------------------------------------------------------- 1. static HTML per page
const pages = new Map()
for (const route of allRoutes) {
  const f = fileFor(route)
  check('Route → HTML file mapping', existsSync(f), `${route}: missing ${path.relative(ROOT, f)}`)
  if (existsSync(f)) pages.set(route, parse(readFileSync(f, 'utf8')))
}
const notFound = existsSync(path.join(DIST, '404.html')) ? parse(readFileSync(path.join(DIST, '404.html'), 'utf8')) : null
check('Route → HTML file mapping', !!notFound, 'dist/404.html missing')

// Every generated .html file must be a known route (no stray prerendered fakes).
const walk = (d) => readdirSync(d).flatMap((n) => { const p = path.join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const rel = '/' + path.relative(DIST, f).replace(/\.html$/, '')
  const route = rel === '/index' ? '/' : rel
  check('Route → HTML file mapping', realRoutes.has(route) || rel === '/404', `unexpected HTML file dist${rel}.html (not a real route)`)
}

for (const [route, p] of pages) {
  const indexable = !NOINDEX_ROUTES.includes(route)
  check('Titles', p.titleCount === 1 && p.title.length > 0, `${route}: ${p.titleCount} <title> tags / empty title`)
  if (p.title.length > 65) warn('Titles', `${route}: title is ${p.title.length} chars (may truncate): "${p.title}"`)
  check('Meta descriptions', p.descriptionCount === 1 && !!p.description, `${route}: missing or duplicate meta description tag`)
  if (p.description && (p.description.length < 70 || p.description.length > 170)) warn('Meta descriptions', `${route}: description is ${p.description.length} chars`)
  check('Canonicals', p.canonicals.length === 1, `${route}: ${p.canonicals.length} canonical tags`)
  check('Canonicals', p.canonicals[0] === ORIGIN + route, `${route}: canonical "${p.canonicals[0]}" ≠ "${ORIGIN + route}"`)
  check('Canonicals', p.ogUrl === ORIGIN + route, `${route}: og:url "${p.ogUrl}" ≠ canonical`)
  check('Structured data', !!p.ogImage && p.ogImage.startsWith(ORIGIN) && !/\s/.test(p.ogImage), `${route}: og:image "${p.ogImage}" missing, off-origin or has unencoded spaces`)
  check('H1', p.h1s.length === 1 && p.h1s[0].length > 0, `${route}: ${p.h1s.length} H1s`)
  check('Content (not loading shell)', p.words >= (indexable ? MIN_WORDS : 30), `${route}: only ${p.words} visible words — shell-only or thin`)
  check('Robots directives', p.robots === (indexable ? 'index,follow' : 'noindex,follow'), `${route}: robots="${p.robots}", expected ${indexable ? 'index,follow' : 'noindex,follow'}`)
  const raw = readFileSync(fileFor(route), 'utf8')
  check('No dev/preview host leaks', !/localhost|127\.0\.0\.1|vercel\.app|__phs-prerender/.test(raw), `${route}: contains localhost/vercel.app/probe reference`)

  if (indexable) {
    check('Business info (NAP) on page', p.text.includes(BUSINESS.phoneDisplay), `${route}: phone ${BUSINESS.phoneDisplay} not in visible HTML`)
    check('Business info (NAP) on page', p.text.includes(BUSINESS.street), `${route}: address "${BUSINESS.street}" not in visible HTML`)
  }
  // City / service terminology: city pages must name their city in title AND H1.
  const city = cityOf(route)
  if (city) {
    check('City/service terminology', p.title.includes(city[0]) && (p.h1s[0] || '').includes(city[0]), `${route}: city "${city[0]}" missing from title or H1`)
  }
  const svcSlug = route.split('/').filter(Boolean).pop()
  const SERVICE_TERMS = { ac: 'air conditioning', hvac: 'hvac', 'water-heater-repair': 'water heater' }
  if (/^\/(plumbing|hvac|ac)(\/|$)|^\/water-heater-repair$|^\/(layton|clinton)\//.test(route)) {
    const words = (SERVICE_TERMS[svcSlug] || svcSlug.replace(/-/g, ' ')).split(' ').filter((w) => w.length > 2 && !['and', 'the', 'repair', 'replacement', 'service', 'services'].includes(w))
    const hay = `${p.title} ${p.h1s[0]}`.toLowerCase()
    check('City/service terminology', words.every((w) => hay.includes(w)), `${route}: service term "${words.join(' ')}" missing from title/H1 ("${p.title}" / "${p.h1s[0]}")`)
  }
  for (const bad of UNAPPROVED_CITIES) {
    check('Service-area accuracy', !`${p.title} ${p.h1s.join(' ')} ${p.description}`.toLowerCase().includes(bad), `${route}: title/H1/description targets unapproved city "${bad}"`)
  }
}

// Duplicates across indexable pages
const dupes = (field) => {
  const seen = new Map()
  for (const [route, p] of pages) if (!NOINDEX_ROUTES.includes(route)) seen.set(p[field], [...(seen.get(p[field]) || []), route])
  return [...seen].filter(([, rs]) => rs.length > 1)
}
for (const [t, rs] of dupes('title')) check('Duplicate titles', false, `"${t}" used by ${rs.join(', ')}`)
cat('Duplicate titles').checks++
for (const [d, rs] of dupes('description')) check('Duplicate descriptions', false, `"${d.slice(0, 60)}…" used by ${rs.join(', ')}`)
cat('Duplicate descriptions').checks++

// 404 page
if (notFound) {
  check('404 page', notFound.robots === 'noindex,follow', `404.html robots="${notFound.robots}"`)
  check('404 page', notFound.canonicals.length === 0, '404.html must not declare a canonical')
  check('404 page', notFound.title.startsWith('Page Not Found') && notFound.h1s.length === 1, '404.html is not the Not Found page')
}

// ---------------------------------------------------------------- 2. structured data
for (const [route, p] of pages) {
  const indexable = !NOINDEX_ROUTES.includes(route)
  if (indexable && route !== '/accessibility') check('Structured data', p.jsonLd.length > 0, `${route}: no JSON-LD`)
  for (const block of p.jsonLd) {
    let data
    try { data = JSON.parse(block) } catch { check('Structured data', false, `${route}: JSON-LD does not parse`); continue }
    const nodes = []
    const visit = (n) => { if (Array.isArray(n)) n.forEach(visit); else if (n && typeof n === 'object') { nodes.push(n); Object.values(n).forEach(visit) } }
    visit(data)
    const s = JSON.stringify(data)
    check('Structured data', !/aggregateRating|"review"|"Review"|ratingValue|reviewCount/.test(s), `${route}: JSON-LD contains review/rating markup (not allowed without verified source)`)
    check('Structured data', !/localhost|vercel\.app/.test(s), `${route}: JSON-LD references a non-production host`)
    for (const n of nodes) {
      if (n.telephone) check('Structured data', String(n.telephone).replace(/\D/g, '').endsWith(BUSINESS.phoneDigits), `${route}: telephone "${n.telephone}" ≠ business phone`)
      if (n['@type'] === 'PostalAddress') {
        check('Structured data', n.streetAddress === BUSINESS.street && n.addressLocality === BUSINESS.city && n.postalCode === BUSINESS.postalCode && n.addressRegion === BUSINESS.region,
          `${route}: PostalAddress ${n.streetAddress}, ${n.addressLocality} ${n.postalCode} ≠ confirmed address`)
      }
      if (n.provider?.['@id'] || n['@id']?.endsWith('#business')) {
        const id = n['@id'] ?? n.provider['@id']
        check('Structured data', id === `${ORIGIN}/#business`, `${route}: business @id "${id}"`)
      }
      if (n['@id'] === `${ORIGIN}/#business` && n.name) check('Structured data', n.name === BUSINESS.name, `${route}: business name "${n.name}"`)
      for (const key of ['url', 'item', 'logo', 'image']) {
        const v = typeof n[key] === 'string' ? n[key] : null
        if (v && v.startsWith('http')) {
          check('Structured data', v.startsWith(ORIGIN) || !v.includes('preventivehomesolutions'), `${route}: ${key} "${v}" not on canonical origin`)
          check('Structured data', !/\s/.test(v), `${route}: ${key} URL contains an unencoded space: "${v}"`)
        }
      }
      const areas = [n.areaServed].flat().filter(Boolean)
      for (const a of areas) {
        const nm = typeof a === 'string' ? a : a.name
        if (nm) check('Service-area accuracy', APPROVED_CITIES.some(([c]) => nm.startsWith(c)), `${route}: areaServed includes unapproved "${nm}"`)
      }
    }
  }
}

// ---------------------------------------------------------------- 3. internal links & assets
const linkIssues = new Map()
for (const [route, p] of pages) {
  for (const href of p.hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const target = norm(decodeURIComponent(href.split(/[?#]/)[0] || '/'))
    // Real routes and real static files (e.g. the footer's /sitemap.xml link).
    if (realRoutes.has(target) || (path.extname(target) && existsSync(path.join(DIST, target)))) continue
    const r = redirectTarget(target)
    const key = `${target}${r ? ` (redirects to ${r.to})` : ' (404)'}`
    linkIssues.set(key, [...(linkIssues.get(key) || []), route])
  }
  for (const a of p.assets) check('Internal links & assets', existsSync(path.join(DIST, decodeURIComponent(a))), `${route}: asset ${a} missing from dist`)
}
for (const [key, rs] of linkIssues) {
  if (key.endsWith('(404)')) check('Internal links & assets', false, `broken internal link ${key} on ${rs.length} page(s), e.g. ${rs[0]}`)
  else warn('Internal links & assets', `internal link to redirected URL ${key} on ${rs.length} page(s)`)
}
cat('Internal links & assets').checks++

// ---------------------------------------------------------------- 4. redirects (static simulation)
for (const route of allRoutes) {
  const r = redirectTarget(route)
  check('Redirects: never shadow real pages', !r, `real page ${route} is captured by redirect "${r?.rule}" → ${r?.to}`)
}
for (const r of vercel.redirects) {
  check('Redirects: config', r.permanent === true, `${r.source}: not a permanent (308/301) redirect`)
  if (!r.destination.includes(':')) check('Redirects: no chains/404 targets', realRoutes.has(r.destination), `${r.source} → ${r.destination}: destination is not a real page`)
}
for (const [old, expected] of Object.entries(LEGACY_URLS)) {
  const p = norm(old)
  if (expected === 'LIVE') { check('Redirects: legacy URL intent', realRoutes.has(p), `${old}: expected to still be a live page`); continue }
  const r = realRoutes.has(p) ? null : redirectTarget(p)
  if (expected === 404) {
    check('Redirects: legacy URL intent', !r && !realRoutes.has(p), `${old}: expected known-gap 404`)
    warn('Redirects: legacy URL intent', `known gap: ${old} returns 404 (no equivalent page exists on the new site)`)
    continue
  }
  check('Redirects: legacy URL intent', !!r, `${old}: not redirected — would 404 (expected → ${expected})`)
  if (!r) continue
  check('Redirects: legacy URL intent', r.to === expected, `${old}: redirects to ${r.to}, expected ${expected}`)
  check('Redirects: no chains/404 targets', realRoutes.has(r.to), `${old} → ${r.to}: destination is not a real page`)
  check('Redirects: no chains/404 targets', !redirectTarget(r.to), `${old} → ${r.to}: destination redirects again (chain/loop)`)
  const citySeg = p.split('/')[1]?.replace(/-ut(-hvac-contractor)?$/, '')
  if (APPROVED_CITIES.some(([, s]) => s === citySeg)) {
    check('Redirects: city intent preserved', r.to.includes(citySeg), `${old}: approved-city URL redirects to non-city page ${r.to}`)
    check('Redirects: city intent preserved', !['/plumbing', '/hvac', '/ac', '/'].includes(r.to), `${old}: redirects to generic ${r.to}`)
  }
}
for (const fake of FAKE_URLS) {
  const r = redirectTarget(fake)
  check('404 behavior (fake URLs)', !realRoutes.has(fake) && !r, `${fake}: ${realRoutes.has(fake) ? 'is prerendered as a real page' : `redirects to ${r?.to}`} — should 404`)
}

// ---------------------------------------------------------------- 5. sitemap
const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
check('Sitemap', locs.length === new Set(locs).size, `sitemap has ${locs.length - new Set(locs).size} duplicate URLs`)
check('Sitemap', locs.length === sitemapRoutes.length, `sitemap has ${locs.length} URLs, routes.mjs has ${sitemapRoutes.length}`)
for (const loc of locs) {
  check('Sitemap', loc.startsWith(ORIGIN + '/'), `${loc}: not on ${ORIGIN}`)
  const p = loc.slice(ORIGIN.length)
  check('Sitemap', realRoutes.has(p) && existsSync(fileFor(p)), `${loc}: not a real prerendered page (would 404)`)
  check('Sitemap', !NOINDEX_ROUTES.includes(p) && pages.get(p)?.robots === 'index,follow', `${loc}: page is not indexable`)
  check('Sitemap', pages.get(p)?.canonicals[0] === loc, `${loc}: page canonical is ${pages.get(p)?.canonicals[0]}`)
  check('Sitemap', !redirectTarget(p), `${loc}: URL is a redirect source`)
  check('Sitemap', !p.endsWith('/') || p === '/', `${loc}: trailing slash (site uses no trailing slashes)`)
  for (const bad of UNAPPROVED_CITIES) check('Sitemap', !p.includes(bad.replace(' ', '-')), `${loc}: unapproved city "${bad}"`)
}
for (const [city, slug] of APPROVED_CITIES) check('Sitemap', locs.includes(`${ORIGIN}/service-areas/${slug}`), `approved city ${city} missing from sitemap`)
const areaLocs = locs.filter((l) => l.includes('/service-areas/'))
check('Sitemap', areaLocs.length === APPROVED_CITIES.length, `sitemap has ${areaLocs.length} service-area URLs, expected ${APPROVED_CITIES.length}`)

// ---------------------------------------------------------------- 6. robots.txt / llms.txt / headers
const robots = readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
check('robots.txt', /^User-agent: \*$/m.test(robots), 'no "User-agent: *" group')
check('robots.txt', !/^Disallow:\s*\S/m.test(robots), 'robots.txt disallows a path (would block crawling)')
check('robots.txt', robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), 'Sitemap line missing or wrong origin')
const headerBlob = JSON.stringify(vercel.headers || [])
check('robots.txt', !/x-robots-tag/i.test(headerBlob), 'vercel.json sets an X-Robots-Tag header')
const llms = readFileSync(path.join(DIST, 'llms.txt'), 'utf8')
check('llms.txt', llms.startsWith('# Preventive Home Solutions'), 'llms.txt must start with "# Preventive Home Solutions"')
check('llms.txt', llms.includes(BUSINESS.phoneDisplay) && llms.includes(`${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`), 'llms.txt NAP does not match confirmed business info')
for (const u of llms.match(/https?:\/\/[^\s)]+/g) || []) {
  check('llms.txt', u === ORIGIN || (u.startsWith(ORIGIN + '/') && realRoutes.has(u.slice(ORIGIN.length))), `llms.txt link ${u} is not a real page on ${ORIGIN}`)
}
for (const [city] of APPROVED_CITIES) check('llms.txt', llms.includes(city), `llms.txt missing approved city ${city}`)
for (const bad of UNAPPROVED_CITIES) check('llms.txt', !llms.toLowerCase().includes(bad), `llms.txt mentions unapproved city "${bad}"`)
check('llms.txt', !/24\/7|same-day|\d(\.\d)? stars?|years/i.test(llms), 'llms.txt contains an unverified marketing claim (24/7, same-day, ratings, years)')

// ---------------------------------------------------------------- 7. optional live HTTP checks
if (BASE_URL) {
  const get = (p, redirect = 'manual') => fetch(BASE_URL + p, { redirect, headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; PHS-verify)' } })
  async function follow(p) {
    const hops = []
    let url = BASE_URL + p
    for (let i = 0; i < 10; i++) {
      const res = await fetch(url, { redirect: 'manual' })
      if (res.status >= 300 && res.status < 400) {
        const next = new URL(res.headers.get('location'), url).toString()
        if (hops.some((h) => h.to === next)) return { hops, loop: true, res }
        hops.push({ status: res.status, to: next }); url = next
      } else return { hops, res, finalPath: new URL(url).pathname }
    }
    return { hops, loop: true }
  }
  for (const route of allRoutes) {
    const res = await get(route)
    const body = await res.text()
    check('HTTP: real pages 200 + prerendered HTML', res.status === 200, `${route}: HTTP ${res.status}`)
    const t = decode(body.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
    check('HTTP: real pages 200 + prerendered HTML', t === pages.get(route)?.title, `${route}: served title "${t}" ≠ prerendered "${pages.get(route)?.title}" (shell served?)`)
  }
  for (const fake of FAKE_URLS) {
    const { hops, res, loop } = await follow(fake)
    const body = res ? await res.text() : ''
    // Vercel's Firewall blocks probes like /index.php and /wp-login.php with a
    // 403 before they reach the site; that's an acceptable "not found" outcome.
    if (res?.status === 403 && res.headers.get('x-vercel-mitigated') === 'deny') continue
    check('HTTP: fake URLs return 404', !loop && hops.length === 0 && res?.status === 404, `${fake}: ${loop ? 'redirect loop' : hops.length ? `redirected → ${hops.at(-1).to}` : `HTTP ${res?.status}`}`)
    check('HTTP: fake URLs return 404', body.includes('Page Not Found'), `${fake}: 404 body is not the PHS Not Found page`)
  }
  for (const [old, expected] of Object.entries(LEGACY_URLS)) {
    const { hops, res, loop, finalPath } = await follow(old)
    if (expected === 404) { check('HTTP: legacy redirects', res?.status === 404, `${old}: HTTP ${res?.status}`); continue }
    const want = expected === 'LIVE' ? norm(old) : expected
    check('HTTP: legacy redirects', !loop && res?.status === 200 && finalPath === want, `${old}: ended at ${finalPath} (HTTP ${res?.status}${loop ? ', LOOP' : ''}), expected ${want}`)
    check('HTTP: legacy redirects', hops.every((h) => [301, 308].includes(h.status)), `${old}: non-permanent redirect in chain ${hops.map((h) => h.status).join('→')}`)
    if (hops.length > 2) warn('HTTP: legacy redirects', `${old}: ${hops.length} hops (${hops.map((h) => new URL(h.to).pathname).join(' → ')})`)
  }
  for (const [file, type] of [['/robots.txt', 'text/plain'], ['/llms.txt', 'text/plain'], ['/sitemap.xml', 'xml']]) {
    const res = await get(file)
    check('HTTP: robots/llms/sitemap served', res.status === 200 && (res.headers.get('content-type') || '').includes(type), `${file}: HTTP ${res.status} ${res.headers.get('content-type')}`)
  }
}

// ---------------------------------------------------------------- report
let failed = 0
console.log(`\nSEO verification — ${pages.size} pages${BASE_URL ? `, live checks against ${BASE_URL}` : ''}\n`)
for (const [name, r] of results) {
  const status = r.fail.length ? 'FAIL' : 'PASS'
  if (r.fail.length) failed++
  console.log(`${status === 'PASS' ? '✅ PASS' : '❌ FAIL'}  ${name}  (${r.checks} checks${r.fail.length ? `, ${r.fail.length} failed` : ''}${r.warn.length ? `, ${r.warn.length} warnings` : ''})`)
  r.fail.slice(0, 15).forEach((m) => console.log(`         ✗ ${m}`))
  if (r.fail.length > 15) console.log(`         … ${r.fail.length - 15} more`)
  r.warn.forEach((m) => console.log(`         ⚠ ${m}`))
}
console.log(failed ? `\n${failed} categor${failed === 1 ? 'y' : 'ies'} FAILED` : '\nAll categories passed')
process.exit(failed ? 1 : 0)
