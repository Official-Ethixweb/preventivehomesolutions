// Shared navigation data used by both the desktop header menus and the
// mobile bottom-nav pop-ups. Keep these lists in one place so they stay in sync.
// Each service item carries the href of its real service page (parent pages
// live at /plumbing, /hvac, /ac; sub-services at /<parent>/<slug>; the water
// heater landing page at /water-heater-repair).
export const SERVICE_GROUPS = [
  {
    title: 'Cooling',
    items: [
      { label: 'AC Maintenance & Repair', href: '/ac/ac-repair' },
      { label: 'AC Tune-Up & Maintenance', href: '/ac/ac-tune-ups' },
      { label: 'AC Installation and Replacement', href: '/ac/ac-installation' },
      { label: 'Heat Pumps', href: '/ac/heat-pumps' },
      { label: 'Mini Splits', href: '/ac/ductless-mini-splits' },
      { label: 'Indoor Air Quality', href: '/ac/indoor-air-quality' },
    ],
  },
  {
    title: 'Heating',
    items: [
      { label: 'Furnace Maintenance and Repair', href: '/hvac/furnace-repair' },
      { label: 'Furnace Installation and Replacement', href: '/hvac/furnace-installation' },
      { label: 'Boiler Service and Maintenance', href: '/hvac/boiler-service' },
      { label: 'Thermostats Replacements', href: '/hvac/thermostats' },
      { label: 'Ductless Mini-Splits', href: '/hvac/ductless-mini-splits' },
      { label: 'Air Handler', href: '/hvac/air-handlers' },
    ],
  },
  {
    title: 'Water Heaters',
    items: [
      { label: 'Water Heater Repair and Maintenance', href: '/water-heater-repair' },
      { label: 'Water Heater Installation and Replacement', href: '/water-heater-repair' },
      { label: 'Tankless Waterheater', href: '/water-heater-repair' },
    ],
  },
  {
    title: 'Drain & Sewer',
    items: [
      { label: 'Drain Clearing', href: '/plumbing/drain-clearing' },
      { label: 'Drain Cleaning', href: '/plumbing/drain-cleaning' },
      { label: 'Main Line Clearing and Cleaning', href: '/plumbing/sewer-services' },
      { label: 'Sewer Services', href: '/plumbing/sewer-services' },
      { label: 'Sump Pumps', href: '/plumbing/sump-pump' },
    ],
  },
  {
    title: 'Plumbing',
    items: [
      { label: 'Leak Detection & Repair', href: '/plumbing/leak-detection-repair' },
      { label: 'Faucet Replacement', href: '/plumbing/faucet-replacement' },
      { label: 'Toilet Repair and Replacement', href: '/plumbing/toilet-repair-replacement' },
      { label: 'Water Quality Filters', href: '/plumbing/water-quality-filters' },
      { label: 'Water Line Replacement', href: '/plumbing/water-line-replacement' },
      { label: '24/7', href: '/plumbing/emergency-plumbing' },
      { label: 'Garbage Disposal', href: '/plumbing/garbage-disposal' },
    ],
  },
]

export const SERVICE_AREAS = [
  'Ogden',
  'Clinton',
  'Layton',
  'Syracuse',
  'West Point',
  'Roy',
  'Clearfield',
  'Riverdale',
  'Brigham City',
  'Kaysville',
]

/** URL slug for a service-area city, e.g. 'West Point' -> 'west-point'. */
export function areaSlug(city) {
  return city.toLowerCase().replace(/\s+/g, '-')
}

/** Href of a city's service-area page, e.g. '/service-areas/ogden'. */
export function areaHref(city) {
  return `/service-areas/${areaSlug(city)}`
}

export const PHONE_DISPLAY = '(385) 453-9428'
export const PHONE_TEL = '3854539428'
export const LICENSE_NUMBER = '1428845-5501'
