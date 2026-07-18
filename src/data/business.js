// Single source of truth for Preventive Home Solutions' NAP (Name, Address,
// Phone) and the JSON-LD structured-data builders that feed per-page SEO.
//
// The landing pages inject these schemas through useSeo({ jsonLd }). Keeping the
// business facts here means the phone/email/address show up identically in the
// visible markup AND the structured data crawlers read.
import { ORIGIN } from '../lib/seo.js'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS } from './nav.js'

export const BUSINESS = {
  name: 'Preventive Home Solutions',
  legalName: 'Preventive Home Solutions',
  phoneDisplay: PHONE_DISPLAY,
  phoneTel: PHONE_TEL,
  // Client-provided email + physical address (Layton showroom/office).
  email: 'Preventivehomeservices@gmail.com',
  address: {
    street: '688 N Main St',
    city: 'Layton',
    region: 'UT',
    postalCode: '84041',
    country: 'US',
  },
  // Approx coordinates for the Layton address (used in LocalBusiness geo).
  geo: { lat: 41.0512, lng: -111.9711 },
  since: '1989',
  priceRange: '$$',
  // Rating shown in AggregateRating markup. These should be updated to the
  // business's real Google totals when available.
  rating: { value: '5.0', count: '127' },
}

/** Full one-line postal address, e.g. for a visible contact block. */
export const FULL_ADDRESS = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}, United States`

/** PostalAddress node reused by every schema that needs an address. */
function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  }
}

/** Cities served, as schema.org City nodes for `areaServed`. */
function areaServed() {
  return SERVICE_AREAS.map((city) => ({
    '@type': 'City',
    name: `${city}, UT`,
  }))
}

/** Open-24/7 opening hours specification (Mon–Sun, all day). */
function openingHours() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  }
}

function aggregateRating() {
  return {
    '@type': 'AggregateRating',
    ratingValue: BUSINESS.rating.value,
    reviewCount: BUSINESS.rating.count,
    bestRating: '5',
    worstRating: '1',
  }
}

/**
 * LocalBusiness node. `businessType` narrows the schema.org type per trade
 * ('Plumber' | 'HVACBusiness'). `pageUrl` becomes the node's canonical url.
 */
export function localBusinessSchema({ businessType = 'HVACBusiness', pageUrl, image } = {}) {
  const url = pageUrl ? ORIGIN + pageUrl : ORIGIN
  return {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': `${ORIGIN}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url,
    telephone: `+1-${BUSINESS.phoneTel.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`,
    email: BUSINESS.email,
    image: image ? (image.startsWith('http') ? image : ORIGIN + image) : `${ORIGIN}/og-image.png`,
    logo: `${ORIGIN}/main logo.webp`,
    priceRange: BUSINESS.priceRange,
    foundingDate: BUSINESS.since,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: areaServed(),
    openingHoursSpecification: openingHours(),
    aggregateRating: aggregateRating(),
  }
}

/**
 * Service node describing the trade offered on this landing page, linked back
 * to the LocalBusiness as the provider.
 */
export function serviceSchema({ serviceType, name, description, pageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name,
    description,
    url: pageUrl ? ORIGIN + pageUrl : ORIGIN,
    provider: { '@id': `${ORIGIN}/#business` },
    areaServed: areaServed(),
    aggregateRating: aggregateRating(),
  }
}

/** FAQPage node from the page's on-screen question/answer pairs. */
export function faqSchema(faqs = []) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** BreadcrumbList node: Home › [current landing page]. */
export function breadcrumbSchema({ label, pageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: label, item: ORIGIN + pageUrl },
    ],
  }
}

/**
 * Assemble every JSON-LD node for a landing page into the array useSeo expects.
 * Order: LocalBusiness, Service, FAQPage, BreadcrumbList.
 */
export function buildLandingSchema({
  businessType,
  serviceType,
  serviceName,
  serviceDescription,
  breadcrumbLabel,
  pageUrl,
  image,
  faqs,
}) {
  const nodes = [
    localBusinessSchema({ businessType, pageUrl, image }),
    serviceSchema({ serviceType, name: serviceName, description: serviceDescription, pageUrl }),
    breadcrumbSchema({ label: breadcrumbLabel, pageUrl }),
  ]
  const faq = faqSchema(faqs)
  if (faq) nodes.splice(2, 0, faq)
  return nodes
}
