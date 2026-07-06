// Content for the Water Heater Repair & Installation service landing page.
// Drives ServicePageTemplate. See the ServiceContent typedef in that component.

/** @type {import('../components/ServicePageTemplate.jsx').ServiceContent} */
export const WATER_HEATER_CONTENT = {
  title: 'Water Heater Repair & Installation in Ogden, UT | Preventive Home Solutions',
  metaDescription:
    'Fast water heater repair, replacement, and tankless installation in Ogden and Northern Utah. Licensed plumbers, upfront pricing, same-day service, and written warranties. Call (385) 453-9428.',
  path: '/water-heater-repair',

  breadcrumbLabel: 'Water Heater Repair',
  parentBreadcrumb: 'Plumbing',
  parentHref: '/plumbing',

  heroImage: '/beforeandafterwaterheater.webp',
  heroImageAlt: 'Water heater installation and replacement job in Ogden, Utah',
  heroH1: 'Water Heater Repair & Installation in Ogden, UT — Hot Water Restored, Fast',

  introEyebrow: 'Water Heater Experts',
  introHeading: 'Reliable Hot Water for Every Northern Utah Home',
  hook:
    'A cold shower on a Utah winter morning is nobody’s idea of a good start. Whether your water heater is leaking, running out of hot water, or simply past its prime, our licensed plumbers diagnose the real problem and fix it right the first time. From same-day repairs to high-efficiency tank and tankless installations, we keep the hot water flowing.',

  serviceNoun: 'Water Heater',

  introBlocks: [
    {
      heading: 'Our Water Heater Services',
      list: [
        'Water heater repair (all makes and models)',
        'Tank water heater replacement & installation',
        'Tankless water heater installation',
        'Gas & electric water heater service',
        'Heat pump (hybrid) water heater installs',
        'Leaking tank diagnosis & repair',
        'Anode rod replacement & tank flushing',
        'Thermostat, heating element & pilot repair',
        'Emergency water heater replacement',
      ],
      callUs: true,
    },
    {
      heading: 'Water Heater Repair in Ogden & Northern Utah',
      paragraph:
        'Not every water heater problem means a full replacement. Our technicians troubleshoot no-hot-water calls, rumbling tanks, discolored water, and pilot or heating-element failures, then give you an honest recommendation on whether to repair or replace. We carry common parts on the truck so most repairs are handled in a single visit — often the same day you call.',
      callUs: true,
    },
    {
      heading: 'Tankless Water Heater Installation',
      paragraph:
        'Tankless (on-demand) water heaters heat water only as you use it, delivering endless hot water while cutting standby energy loss. If your household is tired of running out of hot water, a properly sized tankless system is a smart, space-saving upgrade for Northern Utah homes.',
      list: [
        'Endless on-demand hot water',
        'Lower monthly energy bills',
        'Compact, wall-mounted design',
        'Longer lifespan than tank units',
      ],
      callUs: true,
    },
    {
      heading: 'Signs You Need Water Heater Service',
      paragraph:
        'Water heaters rarely fail without warning. Catching the early signs can save you from a flooded basement and an emergency replacement.',
      list: [
        'Not enough hot water or it runs out fast',
        'Rusty, cloudy, or metallic-smelling water',
        'Popping or rumbling sounds from the tank',
        'Water pooling around the base of the unit',
        'The unit is more than 10–12 years old',
        'Rising energy bills with no change in usage',
      ],
      callUs: true,
    },
    {
      heading: 'Why Ogden Homeowners Trust Preventive Home Solutions',
      paragraph:
        'We’re a family-owned, licensed and insured team that has protected Northern Utah homes for over 35 years. Every water heater job comes with upfront pricing, clean and code-compliant workmanship, and a written warranty. When you choose Preventive, you’re not just hiring a plumber — you’re enlisting a guard committed to your home’s long-term comfort.',
      callUs: false,
    },
  ],

  faqs: [
    {
      q: 'How much does it cost to replace a water heater in Utah?',
      a: 'Cost depends on the type and size of unit, fuel source, and whether any code upgrades are needed. We always provide a clear, upfront quote before starting so you know the full price with no surprises. Standard tank replacements are typically the most affordable option, while tankless systems cost more upfront but save on energy long-term.',
    },
    {
      q: 'How long does a water heater installation take?',
      a: 'Most standard tank water heater replacements are completed in two to three hours. Tankless installations or conversions can take longer because they may require gas line, venting, or electrical upgrades. In most cases we can install a new unit the same day we assess it.',
    },
    {
      q: 'Should I repair or replace my water heater?',
      a: 'As a general rule, if your unit is under 8 years old and the repair is minor, repairing is usually the better value. If it’s over 10 years old, leaking from the tank, or needs a major component, replacement is typically the smarter long-term choice. Our technicians give you an honest recommendation either way.',
    },
    {
      q: 'Is a tankless water heater worth it?',
      a: 'For many Northern Utah households, yes. Tankless units deliver endless hot water, take up far less space, and last longer than traditional tanks while lowering standby energy costs. We’ll help you weigh the upfront investment against your hot-water demand and long-term savings.',
    },
    {
      q: 'Do you offer emergency water heater service?',
      a: 'Yes. A leaking or failed water heater can cause serious water damage, so we offer fast, same-day and emergency service seven days a week. Call (385) 453-9428 and our team will get hot water restored as quickly as possible.',
    },
  ],

  related: [
    { label: 'Plumbing Repair', href: '/plumbing' },
    { label: 'Drain & Sewer', href: '/plumbing' },
    { label: 'Heating & Furnace', href: '/hvac' },
    { label: 'Air Conditioning', href: '/ac' },
  ],
}
