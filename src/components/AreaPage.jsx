import AreaPageTemplate from './AreaPageTemplate.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { AREA_PAGES } from '../data/serviceAreas.js'

// Route component for /service-areas/<slug>. One template, every city.
export default function AreaPage({ slug }) {
  const area = AREA_PAGES[slug]

  // Unknown city slug → a real 404 (noindexed, with links back to real
  // pages), not a silent client-side redirect — that left crawlers seeing
  // what looked like an indexable duplicate of the homepage.
  if (!area) return <NotFoundPage />
  return <AreaPageTemplate area={area} />
}
