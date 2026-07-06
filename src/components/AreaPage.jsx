import { useEffect } from 'react'
import AreaPageTemplate from './AreaPageTemplate.jsx'
import { AREA_PAGES } from '../data/serviceAreas.js'
import { navigate } from '../router.js'

// Route component for /service-areas/<slug>. One template, every city.
export default function AreaPage({ slug }) {
  const area = AREA_PAGES[slug]

  // Unknown city slug → send the visitor to the areas section on the home page
  // instead of a blank screen.
  useEffect(() => {
    if (!area) navigate('/#areas-we-serve')
  }, [area])

  if (!area) return null
  return <AreaPageTemplate area={area} />
}
