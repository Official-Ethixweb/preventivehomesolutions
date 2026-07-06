// Content for the individual service pages (Plumbing, HVAC, AC Conditioning).
// Each entry drives one route (/plumbing, /hvac, /ac) rendered by ServicePage.
// Icon keys map to inline SVGs defined in ServicePage so this data stays plain.
//
// Every sub-service also has a `slug` and a `detail` block (intro + what's
// included). Those drive the dedicated sub-service pages rendered by
// ServiceDetailPage at nested routes like /plumbing/drain-cleaning.

export const SERVICE_PAGES = {
  plumbing: {
    slug: 'plumbing',
    eyebrow: 'Plumbing Services',
    name: 'Plumbing',
    iconSrc: '/Group 8.svg',
    heroImage: '/Pot Filler Faucet Install in Ogden.webp',
    heroImageAlt: 'Pot filler faucet installation in Ogden real job photo',
    introTitle: 'Professional Plumbing Solutions To Keep Your Home Running Smoothly',
    introText:
      "From a dripping faucet to a full repipe, our licensed plumbers handle it all with clean, code-compliant workmanship. We diagnose the real problem, fix it right the first time, and protect your Northern Utah home from costly water damage available 7 days a week.",
    servicesHeading: 'Our Expert Plumbing Services',
    servicesIntro:
      'Whatever the issue, the same craftsmanship and honest pricing. Here are the plumbing services our team handles every day.',
    services: [
      {
        title: 'Drain Cleaning',
        slug: 'drain-cleaning',
        icon: 'pipe',
        description: 'Clogged or slow drains cleared fast, then cleaned to keep them flowing no harsh chemicals.',
        detail: {
          intro:
            "A cleared drain isn't the same as a clean one. We flush away the grease, soap, and buildup coating your pipe walls so water flows freely and clogs stay gone longer no caustic store-bought chemicals that eat away at your pipes.",
          included: [
            'Full diagnosis of the clogged or slow-draining line',
            'Professional cleaning that removes buildup, not just the blockage',
            'Safe, pipe-friendly methods with no harsh chemical drain cleaners',
            'Simple tips to keep the drain flowing between visits',
          ],
        },
      },
      {
        title: 'Drain Clearing',
        slug: 'drain-clearing',
        icon: 'snake',
        description: 'Stubborn blockages broken up with professional augers and hydro-jetting for a lasting fix.',
        detail: {
          intro:
            'When a drain is fully blocked, you need it open now. We break through stubborn clogs with professional augers and hydro-jetting, then confirm the line is running the way it should.',
          included: [
            'Fast clearing of fully blocked kitchen, bath, and floor drains',
            'Powered augers and hydro-jetting for tough, deep clogs',
            'Root and grease blockages cut back to restore full flow',
            'Camera check available to confirm the line is clear',
          ],
        },
      },
      {
        title: 'Water Heater',
        slug: 'water-heater',
        icon: 'thermometer',
        description: 'Repair, maintenance, and installation for tank and tankless units, with reliable hot water guaranteed.',
        detail: {
          intro:
            'No hot water is more than an inconvenience. We repair, maintain, and install both tank and tankless water heaters right-sized for your home so you get dependable hot water without wasting energy.',
          included: [
            'Repair for leaks, pilot, thermostat, and heating-element issues',
            'Flushes and maintenance that extend the life of your unit',
            'Tank and tankless installation, sized to your household',
            'Honest repair-vs-replace guidance before you spend a dollar',
          ],
        },
      },
      {
        title: 'Leak Detection & Repair',
        slug: 'leak-detection-repair',
        icon: 'droplet',
        description: 'Hidden leaks pinpointed without tearing up your home, then repaired before damage spreads.',
        detail: {
          intro:
            'Hidden leaks quietly rot framing and spike your water bill. We pinpoint the source without tearing your home apart, then repair it before small drips turn into big damage.',
          included: [
            'Non-invasive leak location in walls, slabs, and under floors',
            'Pressure and moisture testing to find the true source',
            'Clean, lasting repairs to pipes and fittings',
            'Damage prevention before mold and rot set in',
          ],
        },
      },
      {
        title: 'Sump Pump',
        slug: 'sump-pump',
        icon: 'pump',
        description: 'Sump pump installs, swaps, and tune-ups that keep basements and crawlspaces dry through every storm.',
        detail: {
          intro:
            'Your sump pump is the last line of defense against a flooded basement. We install, replace, and service pumps and battery backups that keep working through the worst storms.',
          included: [
            'Sump pump installation and same-day replacement',
            'Battery backup systems for power-outage protection',
            'Testing and tune-ups before the wet season',
            'Basin cleaning and float-switch adjustment',
          ],
        },
      },
      {
        title: 'Sewer Services',
        slug: 'sewer-services',
        icon: 'sewer',
        description: 'Camera inspections, cleaning, and trenchless repair to keep your main line clear and protected.',
        detail: {
          intro:
            "Your main sewer line handles everything and when it backs up, it's a mess. We inspect, clean, and repair sewer lines with camera diagnostics and trenchless methods that spare your yard.",
          included: [
            'In-line camera inspection to see the real problem',
            'Cleaning and hydro-jetting of blocked main lines',
            'Trenchless repair options that protect your landscaping',
            'Root intrusion and collapsed-line solutions',
          ],
        },
      },
      {
        title: 'Water Line Replacement',
        slug: 'water-line-replacement',
        icon: 'pipe',
        description: 'Corroded or leaking supply lines replaced with durable modern piping built to last decades.',
        detail: {
          intro:
            'Corroded or leaking supply lines mean low pressure, discolored water, and rising bills. We replace aging lines with durable modern piping built to last decades.',
          included: [
            'Full inspection of your incoming water service line',
            'Replacement of corroded galvanized or leaking pipe',
            'Modern, long-lasting PEX or copper materials',
            'Restored water pressure and clean, clear water',
          ],
        },
      },
      {
        title: 'Faucet Replacement',
        slug: 'faucet-replacement',
        icon: 'faucet',
        description: 'New faucets installed cleanly better flow, no drips, and a finish that matches your space.',
        detail: {
          intro:
            'A dripping or dated faucet wastes water and drags down your kitchen or bath. We install new fixtures cleanly better flow, no leaks, and a finish that fits your space.',
          included: [
            'Removal and haul-away of your old faucet',
            'Clean installation of kitchen, bath, and utility faucets',
            'Leak-free connections and proper shut-off valves',
            'Guidance on durable, water-saving fixtures',
          ],
        },
      },
      {
        title: 'Water Quality Filters',
        slug: 'water-quality-filters',
        icon: 'filter',
        description: 'Whole-home filtration and softeners for cleaner, better-tasting water and longer-lasting fixtures.',
        detail: {
          intro:
            "Northern Utah's hard water scales your fixtures and dulls your water. We install whole-home filtration and softeners for cleaner, better-tasting water and longer-lasting appliances.",
          included: [
            'Water testing to match the right system to your home',
            'Whole-home filtration and water-softener installation',
            'Under-sink and drinking-water filter options',
            'Reduced scale buildup on fixtures and appliances',
          ],
        },
      },
      {
        title: 'Toilet Repair or Replacement',
        slug: 'toilet-repair-replacement',
        icon: 'toilet',
        description: 'Running, leaking, or worn-out toilets repaired or replaced with efficient, water-saving models.',
        detail: {
          intro:
            'A running or leaking toilet can waste hundreds of gallons a month. We repair the ones worth saving and replace the rest with efficient, water-saving models.',
          included: [
            'Repair of running, leaking, and weak-flushing toilets',
            'Wax-ring, fill-valve, and flapper replacement',
            'Installation of efficient, high-performance toilets',
            'Secure, leak-free set and haul-away of the old unit',
          ],
        },
      },
      {
        title: 'Emergency Services',
        slug: 'emergency-plumbing',
        icon: 'alarm',
        description: "Burst pipe or overflow? We're on call after hours for fast, same-day emergency response.",
        detail: {
          intro:
            "Burst pipes and overflows don't wait for business hours. We're on call after hours and on weekends for fast, same-day response that stops the damage.",
          included: [
            'After-hours and weekend emergency response',
            'Burst-pipe, overflow, and no-water calls',
            'Fast shut-off and damage control on arrival',
            'Straightforward pricing, even in an emergency',
          ],
        },
      },
      {
        title: 'Garbage Disposal',
        slug: 'garbage-disposal',
        icon: 'disposal',
        description: 'Jammed or dead disposals repaired or replaced so your kitchen sink runs smoothly again.',
        detail: {
          intro:
            'A jammed or dead disposal brings the whole kitchen sink to a halt. We repair what we can and swap in a quieter, more powerful unit when it is time.',
          included: [
            'Diagnosis of jams, leaks, and motor failures',
            'Repair or full replacement of the disposal unit',
            'Quieter, higher-horsepower upgrade options',
            'Leak-tested connections and clean cleanup',
          ],
        },
      },
    ],
    warningTitle: 'How To Know When Your Plumbing System Needs Attention',
    warnings: [
      { title: 'Slow Drains', text: 'Water pooling in sinks or tubs is an early sign of a building clog worth clearing now.' },
      { title: 'Low Water Pressure', text: 'A sudden drop can point to a hidden leak, buildup, or a failing line in the system.' },
      { title: 'Water Stains', text: 'Discoloration on walls, ceilings, or floors usually means water is escaping where it should not.' },
      { title: 'High Water Bills', text: 'An unexplained spike often traces back to a silent leak running around the clock.' },
    ],
  },

  hvac: {
    slug: 'hvac',
    eyebrow: 'Heating Services',
    name: 'HVAC',
    iconSrc: '/Group 9.svg',
    heroImage: '/Heating furnace.webp',
    heroImageAlt: 'Furnace heating system installation real job photo',
    introTitle: 'Reliable Heating Built For Northern Utah Winters',
    introText:
      "When the temperature drops, your heating system can't afford to fail. We service, repair, and install furnaces, boilers, heat pumps, and mini-splits keeping your home warm, your air clean, and your energy bills in check all season long.",
    servicesHeading: 'Our Expert Heating Services',
    servicesIntro:
      'From a no-heat emergency to a high-efficiency upgrade, our certified technicians keep your home comfortable through the coldest months.',
    services: [
      {
        title: 'Furnace Repair',
        slug: 'furnace-repair',
        icon: 'flame',
        description: 'No-heat calls diagnosed and fixed fast, with honest answers on whether to repair or replace.',
        detail: {
          intro:
            'When the heat quits on a cold Utah night, you need it back fast. We diagnose no-heat calls quickly and give you honest answers on whether to repair or replace.',
          included: [
            'Fast diagnosis of no-heat and short-cycling furnaces',
            'Ignitor, blower, thermostat, and sensor repairs',
            'Safety check of the heat exchanger and gas connections',
            'Clear repair-vs-replace recommendations',
          ],
        },
      },
      {
        title: 'Furnace Installation',
        slug: 'furnace-installation',
        icon: 'flame',
        description: 'Right-sized, high-efficiency furnace installs that lower bills and heat every room evenly.',
        detail: {
          intro:
            'A right-sized, high-efficiency furnace heats every room evenly and cuts your gas bill. We match the system to your home and install it clean.',
          included: [
            'Load calculation to size the furnace correctly',
            'High-efficiency furnace options to lower your bills',
            'Clean, code-compliant installation and haul-away',
            'Full testing and airflow balancing at start-up',
          ],
        },
      },
      {
        title: 'Boiler Service',
        slug: 'boiler-service',
        icon: 'boiler',
        description: 'Boiler maintenance, repair, and replacement for steady, comfortable radiant and baseboard heat.',
        detail: {
          intro:
            "Boilers deliver steady, comfortable radiant heat when they're maintained. We service, repair, and replace boilers to keep your baseboards and radiators warm.",
          included: [
            'Repair of leaks, pressure, and no-heat issues',
            'Annual maintenance for safe, efficient operation',
            'Boiler replacement and system upgrades',
            'Radiant and baseboard heat troubleshooting',
          ],
        },
      },
      {
        title: 'Heat Pumps',
        slug: 'heat-pumps',
        icon: 'heatpump',
        description: 'Efficient heat pump systems that heat in winter and cool in summer from a single unit.',
        detail: {
          intro:
            'A heat pump heats in winter and cools in summer from one efficient system. We install and service heat pumps that trim your energy bills year-round.',
          included: [
            'Right-sized heat pump selection for your home',
            'Installation and full-system changeouts',
            'Repair and seasonal maintenance',
            'Efficient year-round heating and cooling',
          ],
        },
      },
      {
        title: 'Ductless Mini-Splits',
        slug: 'ductless-mini-splits',
        icon: 'minisplit',
        description: 'Zoned mini-split comfort for additions, basements, and rooms your ductwork never reached.',
        detail: {
          intro:
            'Mini-splits bring comfort to additions, basements, and rooms your ducts never reached. We install quiet, zoned systems with no ductwork required.',
          included: [
            'Zoned comfort for hard-to-heat rooms',
            'Ductless mini-split installation, no ducts needed',
            'Single- and multi-zone system options',
            'Quiet, energy-efficient operation',
          ],
        },
      },
      {
        title: 'Thermostats',
        slug: 'thermostats',
        icon: 'thermostat',
        description: 'Smart and programmable thermostat upgrades for precise control and real energy savings.',
        detail: {
          intro:
            'The right thermostat gives you precise control and real savings. We install and set up smart and programmable thermostats that work with your system.',
          included: [
            'Smart and programmable thermostat installation',
            'Wiring and compatibility check with your system',
            'Setup, scheduling, and app connection',
            'Guidance to get the most energy savings',
          ],
        },
      },
      {
        title: 'Air Handlers',
        slug: 'air-handlers',
        icon: 'airflow',
        description: 'Air handler service and installation for quiet, consistent airflow throughout your home.',
        detail: {
          intro:
            'Your air handler moves conditioned air through your home. We service and install units for quiet, consistent airflow in every room.',
          included: [
            'Air handler repair and replacement',
            'Blower motor and coil service',
            'Quiet, balanced airflow throughout the home',
            'Pairing with heat pump and AC systems',
          ],
        },
      },
      {
        title: 'Heating Maintenance',
        slug: 'heating-maintenance',
        icon: 'wrench',
        description: 'Seasonal tune-ups that catch small problems early and keep your system running safely.',
        detail: {
          intro:
            'A seasonal tune-up catches small problems before they leave you cold. We inspect, clean, and test your heating system so it runs safely all winter.',
          included: [
            'Full inspection and safety check',
            'Cleaning of burners, coils, and components',
            'Filter change and airflow check',
            'Early warning on parts nearing failure',
          ],
        },
      },
      {
        title: 'Indoor Air Quality',
        slug: 'indoor-air-quality',
        icon: 'filter',
        description: 'Filtration, humidifiers, and fresh-air solutions for healthier, cleaner indoor air.',
        detail: {
          intro:
            'The air inside your home can be dirtier than the air outside. We add filtration, humidifiers, and fresh-air solutions for healthier, cleaner indoor air.',
          included: [
            'Whole-home air filtration and purification',
            'Humidifiers and dehumidifiers for balanced air',
            'Fresh-air ventilation options',
            'Cleaner air for allergy and asthma relief',
          ],
        },
      },
      {
        title: 'Emergency Heating',
        slug: 'emergency-heating',
        icon: 'alarm',
        description: "Lost heat overnight? We're on call for fast, same-day emergency heating repair.",
        detail: {
          intro:
            "Lost heat overnight in the middle of winter can't wait. We're on call for fast, same-day emergency heating repair to get your home warm again.",
          included: [
            'After-hours and weekend heating response',
            'No-heat and system-failure calls',
            'Fast diagnosis and on-the-spot repairs',
            'Temporary-heat guidance while parts arrive',
          ],
        },
      },
    ],
    warningTitle: 'Signs Your Heating System Needs Service',
    warnings: [
      { title: 'Uneven Heating', text: 'Cold rooms while others bake usually means airflow, ducting, or a failing component.' },
      { title: 'Rising Energy Bills', text: 'A climbing gas or power bill with no change in habits points to a system losing efficiency.' },
      { title: 'Strange Noises', text: 'Banging, rattling, or whistling from the furnace is a warning to get it checked early.' },
      { title: 'Short Cycling', text: 'A system that turns on and off constantly is stressed and headed for a breakdown.' },
    ],
  },

  ac: {
    slug: 'ac',
    eyebrow: 'Cooling Services',
    name: 'AC Conditioning',
    iconSrc: '/Group 10.svg',
    heroImage: '/AC installed 01.webp',
    heroImageAlt: 'Air conditioning unit installation real job photo',
    introTitle: 'Cool, Comfortable Air When You Need It Most',
    introText:
      "Utah summers get hot fast. Whether your AC needs a tune-up, a repair, or a full replacement, our certified technicians deliver reliable cooling that keeps your home comfortable and your energy costs down with same-day service available.",
    servicesHeading: 'Our Expert Cooling Services',
    servicesIntro:
      'From routine tune-ups to brand-new high-efficiency systems, we keep your home cool and your air clean all summer long.',
    services: [
      {
        title: 'AC Repair',
        slug: 'ac-repair',
        icon: 'wrench',
        description: 'Warm air or a unit that won’t start, diagnosed and repaired fast so comfort returns quickly.',
        detail: {
          intro:
            "Warm air from the vents on a hot day means something's wrong. We diagnose and repair AC problems fast so comfort returns quickly.",
          included: [
            'Diagnosis of warm air, no-start, and weak cooling',
            'Compressor, capacitor, and fan-motor repairs',
            'Refrigerant leak checks and recharge',
            'Honest repair-vs-replace guidance',
          ],
        },
      },
      {
        title: 'AC Installation',
        slug: 'ac-installation',
        icon: 'snowflake',
        description: 'Right-sized, high-efficiency AC installs that cool evenly and cut your summer energy bills.',
        detail: {
          intro:
            'A right-sized, high-efficiency AC cools evenly and cuts your summer bills. We match the system to your home and install it clean.',
          included: [
            'Load calculation to size the system correctly',
            'High-efficiency AC options to lower your bills',
            'Clean installation and old-unit haul-away',
            'Full testing and performance check at start-up',
          ],
        },
      },
      {
        title: 'AC Tune-Ups',
        slug: 'ac-tune-ups',
        icon: 'wrench',
        description: 'Seasonal maintenance that boosts efficiency, prevents breakdowns, and extends system life.',
        detail: {
          intro:
            'A seasonal tune-up keeps your AC efficient and prevents mid-summer breakdowns. We clean, test, and fine-tune the whole system.',
          included: [
            'Coil cleaning and refrigerant-level check',
            'Electrical and safety inspection',
            'Filter change and airflow test',
            'Early detection of worn parts',
          ],
        },
      },
      {
        title: 'Heat Pumps',
        slug: 'heat-pumps',
        icon: 'heatpump',
        description: 'Year-round comfort from a single efficient system that both cools and heats your home.',
        detail: {
          intro:
            'One efficient system that both cools and heats your home all year. We install and service heat pumps sized for Utah’s climate.',
          included: [
            'Right-sized heat pump selection',
            'Installation and system changeouts',
            'Repair and seasonal maintenance',
            'Efficient cooling in summer, heating in winter',
          ],
        },
      },
      {
        title: 'Ductless Mini-Splits',
        slug: 'ductless-mini-splits',
        icon: 'minisplit',
        description: 'Zoned cooling for rooms, additions, and spaces without ductwork quiet and efficient.',
        detail: {
          intro:
            'Mini-splits deliver quiet, zoned cooling to rooms and additions without ductwork. We install efficient single- and multi-zone systems.',
          included: [
            'Zoned cooling for ductless spaces',
            'Single- and multi-zone installation',
            'Quiet, high-efficiency operation',
            'Repair and maintenance service',
          ],
        },
      },
      {
        title: 'Indoor Air Quality',
        slug: 'indoor-air-quality',
        icon: 'filter',
        description: 'Filtration and air purification that keep your cool air clean and easy to breathe.',
        detail: {
          intro:
            'Cool air should be clean air too. We add filtration and purification that keep the air your AC circulates fresh and easy to breathe.',
          included: [
            'Whole-home filtration and air purification',
            'Cleaner air circulated with your cooling',
            'Allergy- and dust-reducing solutions',
            'Options matched to your system',
          ],
        },
      },
      {
        title: 'Thermostats',
        slug: 'thermostats',
        icon: 'thermostat',
        description: 'Smart thermostat upgrades for precise cooling control and lower energy use.',
        detail: {
          intro:
            'A smart thermostat gives you precise cooling control and lower energy use. We install and configure the right one for your system.',
          included: [
            'Smart and programmable thermostat installation',
            'Compatibility and wiring check',
            'Setup, scheduling, and app connection',
            'Real energy savings all summer',
          ],
        },
      },
      {
        title: 'Refrigerant Service',
        slug: 'refrigerant-service',
        icon: 'droplet',
        description: 'Leak checks and proper refrigerant charging so your system cools at full capacity.',
        detail: {
          intro:
            'Low refrigerant means weak cooling and a struggling compressor. We find leaks and charge your system properly so it cools at full capacity.',
          included: [
            'Refrigerant leak detection and repair',
            'Proper charging to manufacturer spec',
            'Compressor and pressure diagnostics',
            'Restored cooling capacity and efficiency',
          ],
        },
      },
      {
        title: 'Coil Cleaning',
        slug: 'coil-cleaning',
        icon: 'snowflake',
        description: 'Evaporator and condenser coil cleaning to restore efficiency and airflow.',
        detail: {
          intro:
            "Dirty coils choke your AC's efficiency and airflow. We clean evaporator and condenser coils to restore cooling and lower your energy use.",
          included: [
            'Evaporator and condenser coil cleaning',
            'Restored airflow and cooling capacity',
            'Lower energy use and longer system life',
            'Inspection for corrosion and damage',
          ],
        },
      },
      {
        title: 'Emergency Cooling',
        slug: 'emergency-cooling',
        icon: 'alarm',
        description: "AC out on the hottest day? We're on call for fast, same-day emergency cooling repair.",
        detail: {
          intro:
            "An AC that dies on the hottest day of the year can't wait. We're on call for fast, same-day emergency cooling repair.",
          included: [
            'After-hours and weekend cooling response',
            'No-cool and system-failure calls',
            'Fast diagnosis and on-the-spot repairs',
            'Straightforward emergency pricing',
          ],
        },
      },
    ],
    warningTitle: 'Signs Your AC Needs Attention',
    warnings: [
      { title: 'Warm Air', text: 'Air that isn’t cold often means low refrigerant, a dirty coil, or a failing compressor.' },
      { title: 'Weak Airflow', text: 'Little air from the vents points to a clogged filter, duct issue, or blower problem.' },
      { title: 'Rising Energy Bills', text: 'A spike in summer cooling costs usually means the system is working harder than it should.' },
      { title: 'Strange Smells', text: 'Musty or burning odors when the AC runs are a sign to get it inspected right away.' },
    ],
  },
}

export const SERVICE_SLUGS = Object.keys(SERVICE_PAGES)

/** URL path for a sub-service page, e.g. plumbing + drain-cleaning -> /plumbing/drain-cleaning */
export function subServiceHref(parentSlug, childSlug) {
  return `/${parentSlug}/${childSlug}`
}

/**
 * Resolve a sub-service by parent + child slug. Returns the parent page data
 * and the matched sub-service, or null if either slug is unknown.
 */
export function getSubService(parentSlug, childSlug) {
  const parent = SERVICE_PAGES[parentSlug]
  if (!parent) return null
  const service = parent.services.find((s) => s.slug === childSlug)
  if (!service) return null
  return { parent, service }
}
