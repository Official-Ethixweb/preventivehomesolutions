// Snapshots every real route into static HTML under dist/, so crawlers and
// tools that don't execute JavaScript (SEMrush's site-audit crawler, many AI
// crawlers/LLM fetchers, link unfurlers) see real per-page title/meta/H1/
// content/links instead of the bare SPA shell — Googlebot already renders JS
// fine (verified live), so this doesn't change Google's view, but it closes a
// real gap for every crawler that doesn't.
//
// How it works: after `vite build` produces the normal SPA in dist/, this
// script boots a local static server over that dist/ folder, visits every
// route in a headless browser, waits for the app to finish rendering (same
// signal App.jsx's own loading screen uses — network-idle plus a settle
// delay), and writes the fully-rendered DOM as dist/<route>/index.html.
// React still hydrates on top of this HTML on load — this only changes what
// the FIRST byte of HTML contains, not the app's runtime behavior at all.
//
//   Usage: node scripts/prerender.mjs   (must run after `vite build`)
//
//   NOT wired into the build/deploy pipeline (no "postbuild" script) —
//   Vercel's build container isn't confirmed to reliably support installing
//   Playwright's Chromium binary, and Googlebot already renders this SPA's
//   JS correctly (verified live), so the main payoff here is closing the gap
//   for non-JS crawlers (SEMrush's own audit crawler, some AI/LLM fetchers),
//   not Google rankings. Run manually and verify against a preview deploy
//   before ever making this part of the production build.

import { chromium } from 'playwright'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { getRoutes } from './routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')
const PORT = 4174

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `vite build` before prerendering.')
  process.exit(1)
}

// Vite's own preview server serves dist/ the same way it'll be deployed,
// so this snapshot reflects real production serving behavior.
const previewServer = await preview({ preview: { port: PORT, strictPort: true } })
const BASE = `http://localhost:${PORT}`

const routes = getRoutes().map(([p]) => p)
// Skip the homepage — it already lives at dist/index.html, no separate
// directory needed, and re-snapshotting it would double the eager assets.
const targets = routes.filter((p) => p !== '/')

const browser = await chromium.launch()
const page = await browser.newPage()

let ok = 0
let failed = []

for (const route of targets) {
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 })
    // Wait for the real page content to mount (App.jsx's own loading screen
    // covers #root until images/lazy chunks are ready, so the H1 landing in
    // the DOM is the actual readiness signal — not just network-idle).
    await page.waitForSelector('h1', { timeout: 15000 })
    // Small settle so useSeo's effect (title/meta/canonical/JSON-LD) has
    // definitely committed after the H1 appears.
    await page.waitForTimeout(300)

    const title = await page.title()
    if (title.includes('Page Not Found')) {
      throw new Error(`route resolved to NotFoundPage — check routes.mjs / App.jsx are in sync`)
    }

    const html = await page.content()
    const outDir = path.join(DIST, route.replace(/^\//, ''))
    await mkdir(outDir, { recursive: true })
    await writeFile(path.join(outDir, 'index.html'), html)
    ok++
  } catch (err) {
    failed.push([route, err.message])
  }
}

await browser.close()
await new Promise((resolve) => previewServer.httpServer.close(resolve))

console.log(`Prerendered ${ok}/${targets.length} routes.`)
if (failed.length) {
  console.error('Failed routes:')
  failed.forEach(([r, msg]) => console.error(`  ${r}: ${msg}`))
  process.exit(1)
}
