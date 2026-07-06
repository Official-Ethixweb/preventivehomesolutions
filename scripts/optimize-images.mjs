// One-shot image optimizer for the /public folder.
//
// The source photos are WebP but encoded at near-lossless quality (200–370 KB
// each), which dominated Lighthouse's "Improve image delivery" finding. This
// re-encodes every WebP at a high-but-web-appropriate quality and caps the
// longest edge at MAX_EDGE px (nothing on the site is displayed larger than
// ~600 CSS px, so 1200 still covers 2× retina). Downscale only — never upscale.
//
// Originals are tracked in git, so `git checkout -- public` reverts everything.
// Run with:  npm run optimize:images

import sharp from 'sharp'
import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIR = 'public'
const MAX_EDGE = 1200
const QUALITY = 80
// Social/preview and icon assets are consumed by external scrapers or the
// browser chrome — leave their format/size untouched.
const SKIP = new Set(['og-image.png', 'favicon.png'])

const kb = (n) => Math.round(n / 1024)

const files = (await readdir(DIR)).filter(
  (f) => /\.webp$/i.test(f) && !SKIP.has(f)
)

let before = 0
let after = 0

for (const f of files) {
  const p = path.join(DIR, f)
  const startSize = (await stat(p)).size
  // Read into a buffer first so sharp never holds an OS handle on the path —
  // otherwise overwriting the same file fails on Windows (EBUSY/UNKNOWN).
  const input = await readFile(p)
  const meta = await sharp(input).metadata()

  const needsResize = Math.max(meta.width, meta.height) > MAX_EDGE
  const buf = await sharp(input)
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer()

  // Only overwrite if we actually saved bytes.
  if (buf.length < startSize) {
    await writeFile(p, buf)
  }
  const endSize = Math.min(buf.length, startSize)

  before += startSize
  after += endSize
  console.log(
    `${f.padEnd(42)} ${String(kb(startSize)).padStart(4)}KB -> ${String(
      kb(endSize)
    ).padStart(4)}KB${needsResize ? '  (resized)' : ''}`
  )
}

console.log(
  `\nTotal: ${kb(before)}KB -> ${kb(after)}KB  (saved ${kb(
    before - after
  )}KB, ${Math.round((1 - after / before) * 100)}%)`
)
