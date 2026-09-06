// Coupons shown on the /coupons landing page. Mirrors the offers live on the
// old WordPress site's /coupons page so the new page launches with real,
// already-published discounts rather than placeholder copy.
//
// `serviceKey` maps a coupon to a SERVICE_OPTIONS key in CouponRequestForm so
// "Claim This Offer" can pre-select the matching service chip; 'all' means no
// single service applies (a sitewide discount) and nothing gets pre-selected.

export const COUPONS = [
  {
    id: 'military',
    icon: 'star',
    badge: '10% OFF',
    title: 'Military Discount',
    category: 'All Services',
    serviceKey: 'all',
    description: 'Thank you for your service. Active and retired military save 10% on any plumbing, heating, or cooling job.',
  },
  {
    id: 'first-responders',
    icon: 'badge',
    badge: '10% OFF',
    title: 'Police & Firefighters',
    category: 'All Services',
    serviceKey: 'all',
    description: 'A standing 10% discount for the police officers and firefighters who protect our community.',
  },
  {
    id: 'tank-water-heater',
    icon: 'thermometer',
    badge: '$250 OFF',
    title: 'Tank Water Heater',
    category: 'Water Heaters',
    serviceKey: 'water-heater',
    description: 'Save $250 on a new tank water heater installation parts and labor included.',
  },
  {
    id: 'tankless-water-heater',
    icon: 'droplet',
    badge: '$1,000 OFF',
    title: 'Tankless Water Heater',
    category: 'Water Heaters',
    serviceKey: 'water-heater',
    description: 'Upgrade to endless hot water and save $1,000 on a tankless water heater installation.',
  },
  {
    id: 'water-softener',
    icon: 'filter',
    badge: '$500 OFF',
    title: 'Water Softener',
    category: 'Plumbing',
    serviceKey: 'plumbing',
    description: "Protect your pipes and fixtures from Northern Utah's hard water save $500 on a new water softener system.",
  },
  {
    id: 'plumbing-parts',
    icon: 'pipe',
    badge: '$50 OFF',
    title: 'Plumbing Repair Parts',
    category: 'Plumbing',
    serviceKey: 'plumbing',
    description: 'Take $50 off the parts on any plumbing repair job we complete for you.',
  },
  {
    id: 'furnace-parts',
    icon: 'flame',
    badge: '$50 OFF',
    title: 'Furnace Repair Parts',
    category: 'HVAC / Heating',
    serviceKey: 'heating',
    description: 'Take $50 off the parts on any furnace repair job, keeping your home warm for less.',
  },
]

export const COUPON_DISCLAIMER =
  'Mention this coupon when you call or submit the form below. One coupon per household. Cannot be combined with other offers or discounts. Ask your technician for full details.'
