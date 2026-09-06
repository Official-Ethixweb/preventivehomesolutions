// Single source of truth for every real, indexable route the SPA serves.
// Consumed by generate-sitemap.mjs (sitemap.xml) and prerender.mjs (static
// HTML snapshots) so neither can drift out of sync with the other or with
// what App.jsx actually renders.
import { SERVICE_PAGES } from '../src/data/services.js'
import { AREA_SLUGS } from '../src/data/serviceAreas.js'
import { LANDING_PAGES } from '../src/data/landingPages.js'
import { BLOG_POSTS } from '../src/data/blog.js'

/** @returns {[path: string, changefreq: string, priority: string][]} */
export function getRoutes() {
  const routes = []

  routes.push(['/', 'weekly', '1.0'])
  routes.push(['/about-us', 'monthly', '0.6'])
  routes.push(['/coupons', 'weekly', '0.8'])
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

  return routes
}
