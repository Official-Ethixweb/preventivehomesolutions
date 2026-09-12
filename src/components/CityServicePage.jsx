import ServicePageTemplate from './ServicePageTemplate.jsx'
import { cityServiceToContent } from '../data/cityServiceContent.js'

// City + service combo pages (e.g. /layton/water-heater), rendered through
// the same rich ServicePageTemplate every other service page uses — same
// design, same local-business/service/FAQ/breadcrumb schema, generated from
// city + service data instead of hand-authored per page.
export default function CityServicePage({ citySlug, serviceSlug }) {
  const content = cityServiceToContent(citySlug, serviceSlug)
  if (!content) return null
  return <ServicePageTemplate content={content} />
}
