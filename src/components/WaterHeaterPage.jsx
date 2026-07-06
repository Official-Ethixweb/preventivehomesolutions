import ServicePageTemplate from './ServicePageTemplate.jsx'
import { WATER_HEATER_CONTENT } from '../data/waterHeaterService.js'

// Real service page built on the reusable template: /water-heater-repair
export default function WaterHeaterPage() {
  return <ServicePageTemplate content={WATER_HEATER_CONTENT} />
}
