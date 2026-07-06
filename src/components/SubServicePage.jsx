import ServicePageTemplate from './ServicePageTemplate.jsx'
import { getSubService } from '../data/services.js'
import { subServiceToContent } from '../data/serviceContent.js'

// Every nav sub-service (e.g. /hvac/furnace-repair) renders through the same
// Water Heater–style layout, generated from existing services.js data.
export default function SubServicePage({ parentSlug, childSlug }) {
  const match = getSubService(parentSlug, childSlug)
  if (!match) return null
  return <ServicePageTemplate content={subServiceToContent(match.parent, match.service)} />
}
