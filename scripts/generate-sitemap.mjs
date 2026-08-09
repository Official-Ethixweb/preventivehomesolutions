// Generates public/sitemap.xml from the site's real route data, so it can
// never drift out of sync with what App.jsx actually serves. Excludes
// /thank-you (post-conversion utility page, noindexed — see ThankYouPage.jsx)
// since it should never be a search-landing target.
//
//   Usage: node scripts/generate-sitemap.mjs
//   Runs automatically before every build (see package.json "prebuild").

import { writeFileSync } from 'node:fs'
import { SERVICE_PAGES } from '../src/data/services.js'
import { AREA_SLUGS } from '../src/data/serviceAreas.js'
import { LANDING_PAGES } from '../src/data/landingPages.js'
import { BLOG_POSTS } from '../src/data/blog.js'

const ORIGIN = 'https://www.preventivehomesolutions.com'
const TODAY = new Date().toISOString().slice(0, 10)

// [path, changefreq, priority]
const routes = []

routes.push(['/', 'weekly', '1.0'])
routes.push(['/about-us', 'monthly', '0.6'])
routes.push(['/accessibility', 'yearly', '0.3'])
routes.push(['/blog', 'weekly', '0.7'])
routes.push(['/water-heater-repair', 'monthly', '0.9'])

for (const data of Object.values(SERVICE_PAGES)) {
  routes.push([`/${data.slug}`, 'monthly', '0.9'])
  for (const svc of data.services) {
    if (svc.slug) routes.push([`/${data.slug}/${svc.slug}`, 'monthly', '0.8'])
  }
}

for (const slug of AREA_SLUGS) {
  routes.push([`/service-areas/${slug}`, 'monthly', '0.8'])
}

for (const data of Object.values(LANDING_PAGES)) {
  routes.push([data.path, 'monthly', '0.7'])
}

for (const post of BLOG_POSTS) {
  routes.push([`/blog/${post.slug}`, 'yearly', '0.6'])
}

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
