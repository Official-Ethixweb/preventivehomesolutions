// Content for the conversion-focused SEO landing pages rendered by
// LandingPage.jsx at /plumbing-services, /hvac-services and
// /air-conditioning-services.
//
// Each entry is pure data: the visual system (theme, sections, forms, schema)
// lives in LandingPage.jsx and data/business.js. Icon keys map to the inline
// SVGs defined in LandingPage.jsx.

// The four trust pillars repeat across the site (hero promo column, why-us,
// footer). Shared here so every landing page stays consistent.
const TRUST_CHIPS = ['Same-Day Service', 'Licensed & Insured', 'Available 24/7', 'Since 1989']

// Why-Us reason cards. Nearly identical across trades, so shared with a small
// per-page tweak to the response line.
const sharedReasons = (trade) => [
  {
    icon: 'shield',
    title: 'Licensed & Insured',
    description: `Every ${trade} job is done by licensed, insured pros to code — with the paperwork to prove it.`,
  },
  {
    icon: 'clock',
    title: 'Same-Day & 24/7',
    description: 'Comfort emergencies can’t wait. We answer after hours and get to you fast, 7 days a week.',
  },
  {
    icon: 'tag',
    title: 'Upfront, Honest Pricing',
    description: 'Fixed quotes before any work begins — no surprises, no pressure, no upsells you don’t need.',
  },
  {
    icon: 'badge',
    title: 'Local Since 1989',
    description: 'A family-owned Northern Utah team with 35+ years protecting homes just like yours.',
  },
]

export const LANDING_PAGES = {
  'plumbing-services': {
    key: 'plumbing-services',
    path: '/plumbing-services',
    // ---- SEO / schema ----
    businessType: 'Plumber',
    serviceType: 'Plumbing',
    metaTitle: 'Plumbing Services in Northern Utah | Preventive Home Solutions',
    metaDescription:
      'Licensed plumbers in Layton & Northern Utah for repairs, drain cleaning, water heaters & sewer service. Same-day, 24/7 emergency help. Call (385) 453-9428.',
    serviceName: 'Plumbing Services',
    serviceDescription:
      'Full-service residential and commercial plumbing across Northern Utah — repairs, drain cleaning, water heaters, leak detection, and trenchless sewer service, available 24/7.',
    breadcrumbLabel: 'Plumbing Services',

    // ---- Hero ----
    eyebrow: 'Plumbing · Northern Utah',
    heroStatic: 'Northern Utah Plumbing',
    taglines: [
      'Fixed Right, The First Time',
      'Drains Cleared · No Clog Too Tough',
      'Burst Pipe? We’re On Call 24/7',
      'Licensed Plumbers Since 1989',
    ],
    heroSubtitle:
      'From a dripping faucet to a full repipe, our licensed plumbers protect your home from costly water damage — with clean, code-compliant work and honest pricing.',
    heroImage: '/Pot Filler Faucet Install in Ogden.webp',
    heroImageAlt: 'Licensed plumber installing a pot filler faucet in a Northern Utah home',
    mascotImage: '/process-mascot.webp',
    trustChips: TRUST_CHIPS,
    serviceNoun: 'Plumbing',
    serviceOptions: ['Plumbing Repair', 'Drain Cleaning', 'Water Heater', 'Sewer Service', 'Emergency', 'Other'],

    // ---- Services grid (4 core) ----
    servicesHeading: 'What Our Plumbers Do',
    servicesIntro: 'The same craftsmanship and honest pricing on every job — big or small.',
    services: [
      { icon: 'wrench', title: 'Plumbing Repair', href: '/plumbing', description: 'Leaks, low pressure, and worn fixtures diagnosed and fixed right the first time.' },
      { icon: 'snake', title: 'Drain Cleaning', href: '/plumbing/drain-cleaning', description: 'Clogged or slow drains cleared and cleaned to keep them flowing — no harsh chemicals.' },
      { icon: 'thermometer', title: 'Water Heaters', href: '/water-heater-repair', description: 'Repair, maintenance, and install for tank and tankless units — reliable hot water, guaranteed.' },
      { icon: 'sewer', title: 'Sewer Service', href: '/plumbing/sewer-services', description: 'Camera inspection, cleaning, and trenchless repair that keeps your main line clear.' },
    ],

    reasons: sharedReasons('plumbing'),

    // ---- Team / About ----
    team: {
      heading: 'Your Neighbors in the Trade',
      body: 'Preventive Home Solutions is a family-owned Northern Utah company — not a national chain. We treat your home like our own, showing up on time, cleaning up after ourselves, and standing behind every repair in writing.',
      points: [
        'Background-checked, licensed plumbers',
        'Straightforward, upfront quotes',
        'Written warranty on every job',
        'Trusted across 10+ Northern Utah cities',
      ],
      image: '/Pot Filler Faucet Install in Ogden.webp',
      imageAlt: 'Preventive Home Solutions plumber on a Northern Utah service call',
    },

    faqs: [
      { q: 'Do you offer 24/7 emergency plumbing?', a: 'Yes. Burst pipes and overflows don’t wait for business hours, so we’re on call after hours and on weekends for fast, same-day emergency response across Northern Utah.' },
      { q: 'Are your plumbers licensed and insured?', a: 'Every technician is fully licensed and insured, and all work is done to code. We provide the documentation and a written warranty on completed work.' },
      { q: 'How much does a plumbing repair cost?', a: 'We give a fixed, upfront quote before any work begins, so you always know the price ahead of time — no hourly surprises or hidden fees.' },
      { q: 'What areas do you serve?', a: 'We serve Layton, Ogden, Clearfield, Clinton, Syracuse, Roy, Kaysville, Riverdale, West Point, Brigham City, and the surrounding Northern Utah communities.' },
      { q: 'Can you clear a drain without harsh chemicals?', a: 'Yes. We use professional augers and hydro-jetting to clear and clean drains — safe, pipe-friendly methods that keep clogs gone longer without caustic store-bought chemicals.' },
    ],

    related: [
      { label: 'Heating & Furnace Service', href: '/hvac-services' },
      { label: 'Air Conditioning', href: '/air-conditioning-services' },
      { label: 'Water Heater Repair', href: '/water-heater-repair' },
      { label: 'Drain & Sewer', href: '/plumbing/sewer-services' },
    ],
  },

  'hvac-services': {
    key: 'hvac-services',
    path: '/hvac-services',
    businessType: 'HVACBusiness',
    serviceType: 'Heating',
    metaTitle: 'Heating & Furnace Repair in Northern Utah | Preventive Home Solutions',
    metaDescription:
      'Furnace repair, installation, boilers & heat pumps in Layton & Northern Utah. Same-day, 24/7 no-heat emergency service. Licensed HVAC pros. Call (385) 453-9428.',
    serviceName: 'Heating & HVAC Services',
    serviceDescription:
      'Furnace, boiler, heat pump, and mini-split service, repair, and installation across Northern Utah — keeping homes warm and energy bills in check, available 24/7.',
    breadcrumbLabel: 'Heating & HVAC',

    eyebrow: 'Heating & HVAC · Northern Utah',
    heroStatic: 'Northern Utah Heating',
    taglines: [
      'Built for Utah Winters',
      'No Heat? We’re On Call 24/7',
      'High-Efficiency Furnace Installs',
      'Certified HVAC Techs Since 1989',
    ],
    heroSubtitle:
      'When the temperature drops, your heating can’t afford to fail. We service, repair, and install furnaces, boilers, heat pumps, and mini-splits — keeping your home warm all season long.',
    heroImage: '/Heating furnace.webp',
    heroImageAlt: 'Technician installing a high-efficiency furnace in a Northern Utah home',
    mascotImage: '/process-mascot.webp',
    trustChips: TRUST_CHIPS,
    serviceNoun: 'Heating',
    serviceOptions: ['Furnace Repair', 'Furnace Installation', 'Boiler Service', 'Heat Pump', 'Emergency Heat', 'Other'],

    servicesHeading: 'What Our HVAC Techs Do',
    servicesIntro: 'From a no-heat emergency to a high-efficiency upgrade, we keep you comfortable through the coldest months.',
    services: [
      { icon: 'flame', title: 'Furnace Repair', href: '/hvac/furnace-repair', description: 'No-heat calls diagnosed and fixed fast, with honest repair-or-replace answers.' },
      { icon: 'boiler', title: 'Furnace Installation', href: '/hvac/furnace-installation', description: 'Right-sized, high-efficiency furnace installs that lower bills and heat every room evenly.' },
      { icon: 'heatpump', title: 'Heat Pumps', href: '/hvac/heat-pumps', description: 'Efficient systems that heat in winter and cool in summer from a single unit.' },
      { icon: 'thermostat', title: 'Boiler & Thermostats', href: '/hvac/boiler-service', description: 'Boiler service plus smart thermostat upgrades for steady heat and real savings.' },
    ],

    reasons: sharedReasons('heating'),

    team: {
      heading: 'Your Neighbors in the Trade',
      body: 'Preventive Home Solutions is a family-owned Northern Utah company — not a national chain. Our certified technicians keep your family warm through the coldest nights, with honest advice and work backed in writing.',
      points: [
        'NATE-minded, certified HVAC technicians',
        'Load-calculated, right-sized installs',
        'Written warranty on every job',
        'Trusted across 10+ Northern Utah cities',
      ],
      image: '/Heating furnace.webp',
      imageAlt: 'Preventive Home Solutions HVAC technician servicing a furnace',
    },

    faqs: [
      { q: 'My furnace stopped working — can you come today?', a: 'Yes. Lost heat in the middle of a Utah winter can’t wait, so we offer same-day and 24/7 emergency heating repair to get your home warm again fast.' },
      { q: 'Should I repair or replace my furnace?', a: 'We give you an honest recommendation based on the unit’s age, efficiency, and repair cost — never an automatic upsell. If a repair makes sense, we’ll say so.' },
      { q: 'Do you install high-efficiency systems?', a: 'Yes. We perform a load calculation to size the system correctly, then install high-efficiency furnaces, heat pumps, and mini-splits that lower your energy bills.' },
      { q: 'Are your HVAC technicians licensed and insured?', a: 'Every technician is fully licensed and insured, all installs are code-compliant, and completed work is backed by a written warranty.' },
      { q: 'What areas do you serve?', a: 'We serve Layton, Ogden, Clearfield, Clinton, Syracuse, Roy, Kaysville, Riverdale, West Point, Brigham City, and the surrounding Northern Utah communities.' },
    ],

    related: [
      { label: 'Air Conditioning', href: '/air-conditioning-services' },
      { label: 'Plumbing Services', href: '/plumbing-services' },
      { label: 'Heat Pumps', href: '/hvac/heat-pumps' },
      { label: 'Water Heater Repair', href: '/water-heater-repair' },
    ],
  },

  'air-conditioning-services': {
    key: 'air-conditioning-services',
    path: '/air-conditioning-services',
    businessType: 'HVACBusiness',
    serviceType: 'Air Conditioning',
    metaTitle: 'Air Conditioning Repair & Install in Northern Utah | Preventive Home Solutions',
    metaDescription:
      'AC repair, installation & tune-ups in Layton & Northern Utah. Same-day, 24/7 cooling service from licensed techs. Beat the Utah heat — call (385) 453-9428.',
    serviceName: 'Air Conditioning Services',
    serviceDescription:
      'AC repair, tune-ups, installation, and mini-split cooling across Northern Utah — reliable comfort that keeps your home cool and energy costs down, available 24/7.',
    breadcrumbLabel: 'Air Conditioning',

    eyebrow: 'Air Conditioning · Northern Utah',
    heroStatic: 'Northern Utah Cooling',
    taglines: [
      'Cool Air When You Need It Most',
      'Same-Day AC Repair',
      'High-Efficiency AC Installs',
      'Certified Cooling Techs Since 1989',
    ],
    heroSubtitle:
      'Utah summers get hot fast. Whether your AC needs a tune-up, a repair, or a full replacement, our certified technicians deliver reliable cooling and keep your energy costs down.',
    heroImage: '/AC installed 01.webp',
    heroImageAlt: 'Newly installed air conditioning condenser unit at a Northern Utah home',
    mascotImage: '/process-mascot.webp',
    trustChips: TRUST_CHIPS,
    serviceNoun: 'Cooling',
    serviceOptions: ['AC Repair', 'AC Installation', 'AC Tune-Up', 'Ductless Mini-Split', 'Emergency Cooling', 'Other'],

    servicesHeading: 'What Our Cooling Techs Do',
    servicesIntro: 'From routine tune-ups to brand-new high-efficiency systems, we keep your home cool all summer long.',
    services: [
      { icon: 'wrench', title: 'AC Repair', href: '/ac/ac-repair', description: 'Warm air or a unit that won’t start, diagnosed and repaired fast so comfort returns.' },
      { icon: 'snowflake', title: 'AC Installation', href: '/ac/ac-installation', description: 'Right-sized, high-efficiency AC installs that cool evenly and cut summer bills.' },
      { icon: 'wrench', title: 'AC Tune-Ups', href: '/ac/ac-tune-ups', description: 'Seasonal maintenance that boosts efficiency, prevents breakdowns, and extends system life.' },
      { icon: 'minisplit', title: 'Ductless Mini-Splits', href: '/ac/ductless-mini-splits', description: 'Zoned, quiet cooling for rooms, additions, and spaces without ductwork.' },
    ],

    reasons: sharedReasons('cooling'),

    team: {
      heading: 'Your Neighbors in the Trade',
      body: 'Preventive Home Solutions is a family-owned Northern Utah company — not a national chain. Our certified technicians keep your home cool through the hottest days, with upfront pricing and work backed in writing.',
      points: [
        'Certified, background-checked cooling techs',
        'Load-calculated, right-sized AC systems',
        'Written warranty on every job',
        'Trusted across 10+ Northern Utah cities',
      ],
      image: '/AC installed 01.webp',
      imageAlt: 'Preventive Home Solutions technician installing an AC condenser',
    },

    faqs: [
      { q: 'My AC is blowing warm air — can you help today?', a: 'Yes. An AC that quits on the hottest day can’t wait, so we offer same-day and 24/7 emergency cooling repair to get your home comfortable again fast.' },
      { q: 'How often should I have my AC tuned up?', a: 'Once a year, ideally in spring before the cooling season. A tune-up keeps the system efficient, prevents mid-summer breakdowns, and extends its life.' },
      { q: 'Should I repair or replace my AC?', a: 'We give you an honest recommendation based on the unit’s age, efficiency, and refrigerant type — a repair when it makes sense, a right-sized replacement when it doesn’t.' },
      { q: 'Do you install energy-efficient AC systems?', a: 'Yes. We perform a load calculation to size the system correctly, then install high-efficiency AC and heat-pump systems that lower your summer energy bills.' },
      { q: 'What areas do you serve?', a: 'We serve Layton, Ogden, Clearfield, Clinton, Syracuse, Roy, Kaysville, Riverdale, West Point, Brigham City, and the surrounding Northern Utah communities.' },
    ],

    related: [
      { label: 'Heating & Furnace Service', href: '/hvac-services' },
      { label: 'Plumbing Services', href: '/plumbing-services' },
      { label: 'Ductless Mini-Splits', href: '/ac/ductless-mini-splits' },
      { label: 'Indoor Air Quality', href: '/ac/indoor-air-quality' },
    ],
  },
}

export const LANDING_SLUGS = Object.keys(LANDING_PAGES)
