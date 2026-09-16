// Business-approved facts and URL expectations that scripts/verify-seo.mjs
// checks the built site against. These are deliberately hardcoded (not derived
// from src/) so an accidental code change — a new city, a changed phone, a
// redirect to the wrong page — fails the build instead of shipping.

export const ORIGIN = 'https://www.preventivehomesolutions.com'

/** Confirmed current NAP (Google Business Profile, confirmed Sep 2026). */
export const BUSINESS = {
  name: 'Preventive Home Solutions',
  phoneDigits: '3854539428',
  phoneDisplay: '(385) 453-9428',
  street: '688 N Main St',
  city: 'Layton',
  region: 'UT',
  postalCode: '84041',
}

/** The only cities PHS serves. Layton is HQ. */
export const APPROVED_CITIES = [
  ['Ogden', 'ogden'],
  ['Clinton', 'clinton'],
  ['Layton', 'layton'],
  ['Syracuse', 'syracuse'],
  ['West Point', 'west-point'],
  ['Roy', 'roy'],
  ['Clearfield', 'clearfield'],
  ['Riverdale', 'riverdale'],
  ['Brigham City', 'brigham-city'],
  ['Kaysville', 'kaysville'],
]

/** Cities outside the approved area. They must never get a page, sitemap
 * entry, or title/H1 targeting — even when SEO tools suggest them. */
export const UNAPPROVED_CITIES = [
  'salt-lake', 'salt lake', 'orem', 'spanish-fork', 'spanish fork', 'springville', 'draper',
  'riverton', 'provo', 'sandy', 'murray', 'lehi', 'bountiful', 'farmington', 'plain-city', 'plain city',
]

/** Pages that must exist but must stay noindex and out of the sitemap. */
export const NOINDEX_ROUTES = ['/thank-you']

/**
 * Known URLs from the old WordPress site (found in Google's index, Semrush and
 * Search Console) -> the exact page each must end up on.
 *   string  = must 301 there in ONE redirect (after trailing-slash normalization)
 *   'LIVE'  = still a real page on the new site
 *   404     = intentionally not redirected (reported as a known gap)
 */
export const LEGACY_URLS = {
  // Old city hubs -> that city's service-area page (never generic trade pages)
  '/layton/': '/service-areas/layton',
  '/kaysville/': '/service-areas/kaysville',
  '/clearfield/': '/service-areas/clearfield',
  '/clinton/': '/service-areas/clinton',
  '/west-point/': '/service-areas/west-point',
  '/ogden/': '/service-areas/ogden',
  '/syracuse/': '/service-areas/syracuse',
  '/riverdale/': '/service-areas/riverdale',
  '/brigham-city/': '/service-areas/brigham-city',
  '/roy/': '/service-areas/roy',
  '/ogden-ut/': '/service-areas/ogden',
  '/syracuse-ut/': '/service-areas/syracuse',
  '/roy-ut-hvac-contractor/': '/service-areas/roy',
  '/ogden-ut-hvac-contractor/': '/service-areas/ogden',
  '/clearfield-ut-hvac-contractor/': '/service-areas/clearfield',
  // Old city + trade pages -> city page (no city+trade page exists yet)
  '/layton/plumbing/': '/service-areas/layton',
  '/layton/heating/': '/service-areas/layton',
  '/kaysville/plumbing/': '/service-areas/kaysville',
  '/kaysville/heating/': '/service-areas/kaysville',
  '/clearfield/plumbing/': '/service-areas/clearfield',
  '/west-point/plumbing/': '/service-areas/west-point',
  '/roy/plumbing/': '/service-areas/roy',
  '/roy/heating/': '/service-areas/roy',
  '/riverdale/plumbing/': '/service-areas/riverdale',
  '/brigham-city/plumbing/': '/service-areas/brigham-city',
  '/brigham-city/heating/': '/service-areas/brigham-city',
  '/ogden/heating/': '/service-areas/ogden',
  '/clinton/heating/': '/service-areas/clinton',
  // Old city + specific service -> exact city+service page where one exists
  '/layton/plumbing/water-heater-installation/': '/layton/water-heater',
  '/clinton/plumbing/no-hot-water/': '/clinton/water-heater',
  '/ogden/plumbing/water-heater-leaking/': '/service-areas/ogden',
  // Cities no longer served -> homepage (pre-existing behavior; owner to confirm)
  '/bountiful/': '/',
  '/bountiful/heating/': '/',
  '/farmington/': '/',
  // Old non-city service / company / blog URLs
  '/contact-us/': '/',
  '/about': '/about-us',
  '/maintenance/': '/',
  '/products/leak-detection/': '/leak-detection-services',
  '/plumbing/emergency-services/': '/plumbing/emergency-plumbing',
  '/heating/': '/hvac',
  '/heating/furnace-maintenance-and-repair/': '/hvac/furnace-repair',
  '/heating/boiler-service-and-maintenance/': '/hvac/boiler-service',
  '/heating/heat-pumps/': '/hvac/heat-pumps',
  '/cooling/ac-installation-and-replacement/': '/ac/ac-installation',
  '/cooling/ac-maintenance-repair/': '/ac/ac-repair',
  '/cooling/heat-pumps/': '/ac/heat-pumps',
  '/water-heaters/': '/water-heater-repair',
  '/water-heaters/water-heater-repair-and-maintenance/': '/water-heater-repair',
  '/water-heaters/tankless-waterheater/': '/layton/tankless-water-heater',
  '/water-heaters/tankless-water-heaters/': '/layton/tankless-water-heater',
  '/drain-clearing/main-line-clearing-and-cleaning/': '/plumbing/sewer-services',
  '/preventive-home-tips/': '/blog',
  '/home-maintenance-tips-for-every-season/': '/blog/home-maintenance-tips-every-season',
  '/seer2-and-2025-hvac-efficiency-standards-explained-for-utah-homeowners/': '/blog/seer2-2026-hvac-standards',
  '/emergency-plumbing-steps-what-to-do-before-the-technician-arrives/': '/blog/emergency-plumbing-steps',
  // Old URLs that are still real pages
  '/plumbing/': 'LIVE',
  '/plumbing/water-line-replacement/': 'LIVE',
  '/about-us/': 'LIVE',
  '/privacy-policy/': 'LIVE',
  '/terms-and-conditions/': 'LIVE',
}

/** Must return a true 404 — never 200, never redirected somewhere unrelated. */
export const FAKE_URLS = [
  '/this-page-does-not-exist',
  '/layton/not-a-real-service',
  '/service-areas/not-a-city',
  '/service-areas/salt-lake-city',
  '/salt-lake-city',
  '/orem/plumbing',
  '/draper',
  '/plumbing/not-a-service',
  '/hvac/furnace-repair/extra-segment',
  '/blog/not-a-real-post',
  '/Plumbing',
  '/index.php',
  '/wp-login.php',
  '/layton-ut-plumber',
  '/service-areas',
]
