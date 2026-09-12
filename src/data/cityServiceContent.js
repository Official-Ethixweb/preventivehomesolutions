// Adapter: combines a service-area city (src/data/serviceAreas.js) with a
// specific service into the ServiceContent shape ServicePageTemplate expects
// — the same reusable layout (and, importantly, the same local-business +
// service + FAQ + breadcrumb JSON-LD) every other service page already gets.
//
// This is deliberately data-driven rather than one-off JSX: adding a new
// city or service to CITY_SERVICES below is enough to get a fully-formed,
// schema-complete page with no new components. Layton is first because it's
// the highest-population city in the service area and currently has no
// dedicated per-service page — every other sub-service page targets Layton
// in its copy already (see serviceContent.js), but "Layton" has never been
// in the URL itself, which is what was actually asked for.
import { AREA_PAGES } from './serviceAreas.js'
import { PHONE_DISPLAY } from './nav.js'

// Service content not already covered by a services.js sub-service. Tankless
// water heaters get their own page (not folded into the combined "Water
// Heater" sub-service) because that's what was asked for, and because tank
// vs. tankless are genuinely different buying decisions worth their own page.
const TANKLESS_CONTENT = {
  title: 'Tankless Water Heater',
  description:
    'On-demand hot water with no storage tank — installation, sizing, and repair for gas and electric tankless systems.',
  intro:
    "Tankless water heaters heat water only when you need it, instead of keeping 40-50 gallons hot around the clock in a tank. That means an endless hot-water supply, a smaller footprint, and typically a longer service life than a standard tank unit. We size the unit to your home's actual hot-water demand — showers, laundry, dishwasher running at once — so you get real performance, not just a smaller box on the wall.",
  included: [
    'Whole-home and point-of-use tankless installation, gas or electric',
    'Correct sizing based on your household’s real hot-water demand',
    'Repair for ignition, flow-sensor, and error-code issues',
    'Descaling and maintenance to protect against Utah’s hard water',
    'Honest guidance on tank-to-tankless conversion, including venting and gas-line needs',
  ],
  warningTitle: 'Signs a Tankless Water Heater Repair or Install Is Worth a Look',
  warnings: [
    { title: 'Inconsistent Temperature', text: 'Water that swings hot and cold mid-shower often points to a flow or ignition issue.' },
    { title: 'Error Codes', text: 'Modern tankless units display a code when something is wrong — worth a diagnosis before it strands you without hot water.' },
    { title: 'Running Out of Hot Water', text: 'A tank that can’t keep up with your household is one of the most common reasons families switch to tankless.' },
    { title: 'Mineral Buildup', text: 'Northern Utah’s hard water can scale a tankless unit’s heat exchanger over time — regular descaling keeps it efficient.' },
  ],
}

/** Service content, keyed the same way it'll appear in the URL. */
const CITY_SERVICES_CONTENT = {
  'water-heater': {
    title: 'Water Heater',
    description: 'Repair, maintenance, and installation for tank and tankless water heaters, with reliable hot water guaranteed.',
    intro:
      "No hot water is more than an inconvenience — it's a home emergency. We repair, maintain, and install both tank and tankless water heaters, sized right for your household, so you get dependable hot water without wasting energy.",
    included: [
      'Repair for leaks, pilot, thermostat, and heating-element issues',
      'Flushes and maintenance that extend the life of your unit',
      'Tank and tankless installation, sized to your household',
      'Honest repair-vs-replace guidance before you spend a dollar',
    ],
    warningTitle: 'Signs Your Water Heater Needs Service',
    warnings: [
      { title: 'No Hot Water', text: 'Often a failed heating element, pilot, or thermostat — usually repairable same-day.' },
      { title: 'Rusty or Discolored Water', text: 'Can signal a corroding tank nearing the end of its life.' },
      { title: 'Popping or Rumbling Noises', text: 'Sediment buildup at the bottom of the tank reduces efficiency and shortens its lifespan.' },
      { title: 'Water Pooling Nearby', text: 'Any leak around the tank base is worth an immediate look before it becomes water damage.' },
    ],
  },
  'tankless-water-heater': TANKLESS_CONTENT,
}

/** Which service pages exist for which city, in the order the city's own
 * page should link to them. Layton only, for now — see file header. */
export const CITY_SERVICES = {
  layton: ['water-heater', 'tankless-water-heater'],
}

function buildFaqs(city, title) {
  const t = title
  const tl = title.toLowerCase()
  return [
    {
      q: `Do you install ${tl}s in ${city}?`,
      a: `Yes — ${tl} installation is one of the most common calls we get from ${city} homeowners, and it's often completed same-day. We'll give you upfront, fixed pricing before any work starts.`,
    },
    {
      q: `How fast can you get to ${city} for a ${tl} repair?`,
      a: `Our shop is on Main Street in Layton, so ${city} calls are usually among the fastest we can reach. Same-day appointments are available most days, with emergencies prioritized 7 days a week.`,
    },
    {
      q: `What does a ${tl} typically cost to repair or replace?`,
      a: `It depends on the unit and the issue, which is why we never quote blind over the phone — every job gets a free, on-site, fixed-price estimate before we start.`,
    },
    {
      q: `Are your ${city} technicians licensed and insured?`,
      a: `Yes. Every technician we send to a ${city} home is licensed, insured, and background-checked, and every ${tl} job is backed by a written warranty.`,
    },
  ]
}

/**
 * @param {string} citySlug     e.g. 'layton'
 * @param {string} serviceSlug  e.g. 'water-heater' or 'tankless-water-heater'
 * @returns ServiceContent for <ServicePageTemplate/>, or null if either slug
 *   isn't a real, registered combination (never 404s into a thin/blank page).
 */
export function cityServiceToContent(citySlug, serviceSlug) {
  if (!CITY_SERVICES[citySlug]?.includes(serviceSlug)) return null
  const area = AREA_PAGES[citySlug]
  const service = CITY_SERVICES_CONTENT[serviceSlug]
  if (!area || !service) return null

  const { city, zips } = area
  const { title, description, intro, included, warningTitle, warnings } = service
  const path = `/${citySlug}/${serviceSlug}`

  const introBlocks = [
    {
      heading: `${title} Service in ${city}, UT`,
      paragraph:
        `${intro} Our shop sits right on Main Street in Layton, so ${city} calls are typically some of the fastest we reach` +
        (zips.length ? ` — covering ${zips.join(' and ')}` : '') +
        ' and the surrounding neighborhoods.',
      callUs: true,
    },
    {
      heading: `What Our ${title} Service Includes`,
      list: included,
      callUs: true,
    },
  ]
  if (warnings?.length) {
    introBlocks.push({ heading: warningTitle, list: warnings.map((w) => `${w.title} — ${w.text}`), callUs: true })
  }
  introBlocks.push({
    heading: `Why ${city} Homeowners Trust Preventive Home Solutions`,
    paragraph:
      `We're a family-owned, licensed and insured team that has protected Northern Utah homes for over 35 years. ` +
      `Every ${title.toLowerCase()} job in ${city} comes with upfront pricing, clean and code-compliant workmanship, and a written warranty.`,
    callUs: false,
  })

  const otherServiceSlug = CITY_SERVICES[citySlug].find((s) => s !== serviceSlug)
  const related = otherServiceSlug
    ? [{ label: CITY_SERVICES_CONTENT[otherServiceSlug].title, href: `/${citySlug}/${otherServiceSlug}` }]
    : []
  related.push({ label: `${city} Service Area`, href: `/service-areas/${citySlug}` })

  const titleTag = `${title} in ${city}, UT | Preventive Home Solutions`
  return {
    title: titleTag.length <= 60 ? titleTag : `${title} in ${city}, UT`,
    metaDescription: `${description} Licensed, same-day ${title.toLowerCase()} service in ${city}, UT. Call ${PHONE_DISPLAY}.`,
    path,

    breadcrumbLabel: title,
    parentBreadcrumb: city,
    parentHref: `/service-areas/${citySlug}`,

    heroImage: '/Van in Kaysville Call.webp',
    heroImageAlt: `Preventive Home Solutions service van, ${city} Utah`,
    heroImageWidth: 900,
    heroImageHeight: 1200,
    heroH1: `Expert ${title} Service in ${city}, UT`,

    introEyebrow: `${city} Home Services`,
    introHeading: `Professional ${title} Service You Can Count On`,
    hook: `${description} Backed by upfront pricing, same-day availability, and a written warranty on every job.`,

    serviceNoun: title,
    introBlocks,
    faqs: buildFaqs(city, title),
    related,
  }
}
