// Adapter: turns an existing sub-service (parent + service from services.js)
// into the ServiceContent shape consumed by ServicePageTemplate — the same
// layout as the Water Heater Repair page. This lets every service in the nav
// use that one rich layout without hand-authoring each page.
import { subServiceHref } from './services.js'
import { PHONE_DISPLAY } from './nav.js'

const CITY = 'Ogden'

function buildFaqs(title, parentName) {
  const t = title
  const tl = title.toLowerCase()
  return [
    {
      q: `Do you offer free estimates for ${t}?`,
      a: `Yes. On-site estimates for ${tl} in ${CITY} and across Northern Utah are free, and you'll get upfront, fixed pricing before any work begins — no surprises.`,
    },
    {
      q: `How soon can you come out for ${t}?`,
      a: `For most ${parentName.toLowerCase()} calls we offer same-day appointments, and emergencies are prioritized 7 days a week. Call ${PHONE_DISPLAY} and we'll give you an honest arrival window.`,
    },
    {
      q: 'Are your technicians licensed and insured?',
      a: 'Yes. Every technician is licensed, insured, and background-checked, and our work is clean and code-compliant. Each job is backed by a written warranty.',
    },
    {
      q: `Do you warranty your ${t} work?`,
      a: `We do. Every ${tl} job comes with a written warranty, so you have lasting peace of mind after we leave.`,
    },
    {
      q: `Which areas do you cover for ${t}?`,
      a: `We serve ${CITY}, Layton, Clearfield, Syracuse, Roy, Riverdale, and all of Northern Utah — with no travel surcharges inside our service area.`,
    },
  ]
}

/**
 * @param {object} parent  A SERVICE_PAGES entry (plumbing / hvac / ac).
 * @param {object} service A sub-service from parent.services.
 * @returns ServiceContent for <ServicePageTemplate/>.
 */
export function subServiceToContent(parent, service) {
  const title = service.title
  const detail = service.detail ?? {}
  const intro = detail.intro || service.description
  const included = detail.included ?? []

  const introBlocks = []

  // 1) What we do — the intro paragraph.
  introBlocks.push({
    heading: `About Our ${title} Service`,
    paragraph: intro,
    callUs: true,
  })

  // 2) What's included — the bulleted list.
  if (included.length) {
    introBlocks.push({
      heading: `What Our ${title} Service Includes`,
      list: included,
      callUs: true,
    })
  }

  // 3) Warning signs (from the parent) — good, SEO-friendly local content.
  if (parent.warnings?.length) {
    introBlocks.push({
      heading: parent.warningTitle || `Signs You Need ${parent.name} Service`,
      list: parent.warnings.map((w) => `${w.title} — ${w.text}`),
      callUs: true,
    })
  }

  // 4) Why choose us.
  introBlocks.push({
    heading: `Why ${CITY} Homeowners Trust Preventive Home Solutions`,
    paragraph:
      `We're a family-owned, licensed and insured team that has protected Northern Utah homes for over 35 years. ` +
      `Every ${title.toLowerCase()} job comes with upfront pricing, clean and code-compliant workmanship, and a written warranty — ` +
      `so choosing Preventive means enlisting a guard for your home's long-term comfort.`,
    callUs: false,
  })

  const related = parent.services
    .filter((s) => s.slug && s.slug !== service.slug)
    .slice(0, 4)
    .map((s) => ({ label: s.title, href: subServiceHref(parent.slug, s.slug) }))

  return {
    title: `${title} in ${CITY}, UT | Preventive Home Solutions`,
    metaDescription:
      `Professional ${title.toLowerCase()} in ${CITY} and Northern Utah. ${service.description} ` +
      `Licensed, insured, same-day service with upfront pricing. Call ${PHONE_DISPLAY}.`,
    path: subServiceHref(parent.slug, service.slug),

    breadcrumbLabel: title,
    parentBreadcrumb: parent.name,
    parentHref: `/${parent.slug}`,

    heroImage: parent.heroImage,
    heroImageAlt: parent.heroImageAlt,
    heroH1: `Expert ${title} in ${CITY} & Northern Utah`,

    introEyebrow: parent.eyebrow,
    introHeading: `Professional ${title} You Can Count On`,
    hook: `${service.description} Backed by upfront pricing, same-day availability, and a written warranty on every job.`,

    serviceNoun: title,
    introBlocks,
    faqs: buildFaqs(title, parent.name),
    related,
  }
}
