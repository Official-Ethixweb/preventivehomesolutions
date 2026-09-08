// Every tracking script (GA4, Google Ads, Microsoft Clarity) must fire only
// on the real, live domain. Gating purely on "is a measurement ID present"
// (the previous approach) silently breaks the moment anyone's local .env
// happens to carry the same keys used in production — which is exactly what
// happened here: local dev and automated testing were sending real hits to
// the live GA4/Ads/Clarity properties, polluting the traffic data a small,
// low-volume local business actually needs to trust.
const PRODUCTION_HOSTS = new Set(['www.preventivehomesolutions.com', 'preventivehomesolutions.com'])

export function isProductionHost() {
  if (typeof window === 'undefined') return false
  return PRODUCTION_HOSTS.has(window.location.hostname)
}
