// Generates public/sitemap.xml from the site's real route data, so it can
// never drift out of sync with what App.jsx actually serves. Excludes
// /thank-you (post-conversion utility page, noindexed — see ThankYouPage.jsx)
// since it should never be a search-landing target.
//
//   Usage: node scripts/generate-sitemap.mjs
//   Runs automatically before every build (see package.json "prebuild").

import { writeFileSync } from 'node:fs'
import { getRoutes } from './routes.mjs'

const ORIGIN = 'https://www.preventivehomesolutions.com'
const TODAY = new Date().toISOString().slice(0, 10)

const routes = getRoutes()

const body = routes
  .map(
    ([path, changefreq, priority]) => `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync('public/sitemap.xml', xml)
console.log(`Generated public/sitemap.xml with ${routes.length} URLs.`)
