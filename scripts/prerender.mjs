// Snapshots every real route into static HTML under dist/, so the FIRST byte
// of HTML for each URL carries that page's own title, meta description,
// canonical, H1, body copy, internal links and JSON-LD — instead of every URL
// returning the identical bare SPA shell (which is what SEMrush's crawler,
// AI/LLM fetchers and Google's first, pre-render indexing pass all saw).
//
// It also produces dist/404.html. vercel.json has no SPA catch-all rewrite,
// so unknown URLs get a real HTTP 404 instead of a "200 OK" soft-404.
//
// How it works: after `vite build`, this boots Vite's preview server over
// dist/, visits every route in headless Chromium, waits for the page to
// finish rendering, and writes the rendered DOM to dist/<route>.html
// (served extensionless via "cleanUrls" in vercel.json). React re-renders on
// top of it on load, so runtime behavior is unchanged. The static loader
// overlay is put back into each snapshot so visitors see exactly the same
// loading hand-off as before, with no flash of un-hydrated content.
//
// Strict by design: if ANY page can't be snapshotted (or Chromium can't launch
// at all), the script exits non-zero and the build fails — locally and on
// Vercel. A failed Vercel build never replaces the current production
// deployment, so the live site stays as-is instead of silently shipping
// shell-only pages. scripts/verify-seo.mjs then re-checks the output.
//
//   Usage: node scripts/prerender.mjs   (runs automatically in `npm run build`)

import { chromium } from 'playwright-core'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { getPrerenderRoutes } from './routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')
const PORT = 4174
const ORIGIN = 'https://www.preventivehomesolutions.com'
const ON_VERCEL = Boolean(process.env.VERCEL)
// Any path the router doesn't know renders NotFoundPage — snapshot one for 404.html.
const NOT_FOUND_PROBE = '/__phs-prerender-404-probe'

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found — run `vite build` before prerendering.')
  process.exit(1)
}

// The untouched SPA shell: source of the static loader markup re-inserted
// into every snapshot.
const shell = await readFile(path.join(DIST, 'index.html'), 'utf8')
const loaderMatch = shell.match(/<div id="app-loader">[\s\S]*?<div class="phs-label">LOADING<\/div>\s*<\/div>/)
if (!loaderMatch) {
  console.error('Could not find #app-loader markup in dist/index.html — did index.html change?')
  process.exit(1)
}
const loaderHtml = loaderMatch[0]

/** Route path -> output file inside dist/ ("/" -> index.html, "/a/b" -> a/b.html). */
function outFile(route) {
  return route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.slice(1)}.html`)
}

async function launchBrowser() {
  if (ON_VERCEL) {
    // Vercel's build image has no system libraries for Playwright's own
    // Chromium; @sparticuz/chromium ships a self-contained build for it.
    const { default: sparticuz } = await import('@sparticuz/chromium')
    return chromium.launch({
      executablePath: await sparticuz.executablePath(),
      args: sparticuz.args,
      headless: true,
    })
  }
  return chromium.launch()
}

async function snapshot(page, route, { expectNotFound = false } = {}) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
  // The H1 landing in the DOM is the real readiness signal (lazy route chunks).
  await page.waitForSelector('h1', { timeout: 15000 })
  // Let App's loader hide and useSeo's effect (title/meta/canonical/JSON-LD) commit.
  await page.waitForFunction(() => document.querySelector('link[rel="canonical"]'), null, { timeout: 5000 })
  await page.waitForTimeout(400)

  const title = await page.title()
  const isNotFound = title.startsWith('Page Not Found')
  if (isNotFound !== expectNotFound) {
    throw new Error(
      expectNotFound
        ? `expected the 404 page but got "${title}"`
        : 'rendered NotFoundPage — routes.mjs and App.jsx are out of sync'
    )
  }
  const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
  if (!expectNotFound && canonical !== ORIGIN + route) {
    throw new Error(`canonical is "${canonical}", expected "${ORIGIN + route}"`)
  }

  let html = await page.content()
  // Restore the static loader so the pre-hydration paint matches the SPA
  // shell exactly (React's own <Loader/> takes over seamlessly on mount).
  html = html.replace('<div id="root">', `<div id="root">${loaderHtml}`)
  if (expectNotFound) {
    // 404.html is served for every unknown URL, so it must not claim any
    // canonical/og:url (it's already noindex, and the server sends a 404).
    html = html
      .replace(/<link rel="canonical"[^>]*>/, '')
      .replace(/<meta property="og:url"[^>]*>/, '')
    if (html.includes(NOT_FOUND_PROBE)) throw new Error('404 snapshot still references the probe path')
  }
  return html
}

const routes = getPrerenderRoutes()
const outputs = new Map() // file -> html; written only if every page succeeds
const total = routes.length + 1 // + 404.html
const failed = []

const previewServer = await preview({ preview: { port: PORT, strictPort: true } })
let browser
try {
  browser = await launchBrowser()
  const page = await browser.newPage()
  for (const route of routes) {
    try {
      outputs.set(outFile(route), await snapshot(page, route))
    } catch (err) {
      failed.push([route, err.message])
    }
  }
  try {
    outputs.set(path.join(DIST, '404.html'), await snapshot(page, NOT_FOUND_PROBE, { expectNotFound: true }))
  } catch (err) {
    failed.push(['404.html', err.message])
  }
} catch (err) {
  failed.push(['(browser launch)', err.message])
} finally {
  await browser?.close()
  await new Promise((resolve) => previewServer.httpServer.close(resolve))
}

console.log(`Prerendered ${outputs.size}/${total} pages (incl. 404.html).`)
if (failed.length || outputs.size !== total) {
  console.error('❌ Prerender failed — refusing to ship shell-only pages. Build aborted.')
  failed.forEach(([r, msg]) => console.error(`  ${r}: ${msg}`))
  process.exit(1)
}

for (const [file, html] of outputs) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
}
