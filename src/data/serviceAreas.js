// Content for the per-city service-area pages (/service-areas/<slug>).
// One template (AreaPageTemplate) renders every city; each entry only carries
// what actually differs between cities — everything else is generated from the
// city name so new areas are a five-line addition.
import { SERVICE_AREAS, areaSlug } from './nav.js'

const CITY_DETAILS = {
  Ogden: {
    county: 'Weber County',
    zips: ['84401', '84403', '84404', '84414'],
    intro:
      "From historic homes near 25th Street to newer builds on the east bench, Ogden's mix of old and new construction keeps our techs busy year-round. Aging galvanized pipes, hard water, and steep winter demands on furnaces are everyday work for us here.",
  },
  Clinton: {
    county: 'Davis County',
    zips: ['84015'],
    intro:
      'Clinton families count on us for fast, honest service — from water heaters that quit on cold mornings to AC tune-ups before the July heat. We live and work in northern Davis County, so response times stay short.',
  },
  Layton: {
    county: 'Davis County',
    zips: ['84040', '84041'],
    intro:
      "Layton is home base for Preventive Home Solutions — our shop sits right on Main Street. When your furnace, drain, or water heater acts up, we're often just minutes away.",
  },
  Syracuse: {
    county: 'Davis County',
    zips: ['84075'],
    intro:
      "Syracuse's fast-growing neighborhoods mean lots of builder-grade systems hitting their first repair years. We help homeowners get ahead of failures with maintenance plans and honest repair-or-replace advice.",
  },
  'West Point': {
    county: 'Davis County',
    zips: ['84015'],
    intro:
      'West Point homeowners trust us for everything from sump pumps that keep spring runoff out of basements to high-efficiency furnace upgrades that tame winter gas bills.',
  },
  Roy: {
    county: 'Weber County',
    zips: ['84067'],
    intro:
      "Roy's established neighborhoods often run original plumbing and HVAC that's ready for attention. We repair what can be repaired and shoot straight when replacement is the better value.",
  },
  Clearfield: {
    county: 'Davis County',
    zips: ['84015', '84016', '84089'],
    intro:
      'From starter homes to rentals near Hill AFB, Clearfield properties get hard use. We keep drains clear, water heaters reliable, and furnaces safe with same-day service across the city.',
  },
  Riverdale: {
    county: 'Weber County',
    zips: ['84405'],
    intro:
      "Riverdale sits right in the middle of our service map, so emergency calls get picked up fast. Plumbing, heating, or cooling — one call covers your home's whole comfort system.",
  },
  'Brigham City': {
    county: 'Box Elder County',
    zips: ['84302'],
    intro:
      "We're proud to serve Brigham City homeowners with the same day-one quality that built our reputation in Weber and Davis counties — no long-distance surcharges, no runaround.",
  },
  Kaysville: {
    county: 'Davis County',
    zips: ['84037'],
    intro:
      "Kaysville homes range from classic brick ramblers to brand-new builds, and we service them all — repipes, boiler work, AC installs, and everything in between.",
  },
}

/** Map of slug -> full page data for every listed service area. */
export const AREA_PAGES = Object.fromEntries(
  SERVICE_AREAS.map((city) => {
    const slug = areaSlug(city)
    const d = CITY_DETAILS[city] ?? { county: 'Northern Utah', zips: [], intro: '' }
    return [slug, { slug, city, ...d }]
  })
)

export const AREA_SLUGS = Object.keys(AREA_PAGES)
