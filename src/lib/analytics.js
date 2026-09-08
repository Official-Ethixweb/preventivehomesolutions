import { useEffect } from 'react'
import { usePath } from '../router.js'
import { isProductionHost } from './isProductionHost.js'

// Google Analytics 4 (gtag.js) integration.
//
// The Measurement ID is read from VITE_GA_MEASUREMENT_ID (public — it is safe to
// expose in the client bundle, exactly like the reCAPTCHA site key). Every
// function here is a no-op unless BOTH the ID is configured AND we're running
// on the real production domain (see isProductionHost.js) — local dev, Vercel
// previews, and anyone testing against a copied .env never send hits, even if
// the env var happens to be populated.
//
// This SPA does its own client-side routing, so we disable gtag's automatic
// page_view and send one manually on every route change (see useAnalytics()).
// Conversion events (lead forms, click-to-call, CTA clicks) are sent from the
// central helpers below so tracking stays consistent across every page.

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
export const analyticsConfigured = Boolean(GA_MEASUREMENT_ID) && isProductionHost()

/** Inject gtag.js once and configure the property (manual page_view mode). */
export function initAnalytics() {
  if (!analyticsConfigured || typeof window === 'undefined') return
  if (window.__phsGaInit) return
  window.__phsGaInit = true

  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(s)
}

// Google Ads conversion tracking.
//
// Separate channel from GA4 above: the Ads tag itself (AW-16752767608), and
// these labels come straight from the conversion-action snippets in the Ads
// UI. They are public client-side identifiers, so they live in code rather
// than an env var — same reasoning as the reCAPTCHA site key.
//
// Conversion events fire only on a real lead action (a tel: tap, a successful
// form POST), never on page load, so "Page load" conversion actions must be
// set to Click in Ads.
const ADS_ID = 'AW-16752767608'

export const ADS_LABELS = {
  // "PHS - Phone Click" conversion action.
  phoneCall: 'lhRSCJmp3qUcEPjkq7Q-',
  // "PHS - Form Submission" conversion action.
  leadForm: 'mIKoCM2ax6UcEPjkq7Q-',
}

/** Inject the Ads base tag once. Used to be a hardcoded, unconditional
 * <script> in index.html — loading it here instead means it's gated by
 * isProductionHost() like every other tracking script, so it stops firing on
 * every local/dev/preview page load regardless of env var contents. */
export function initAdsTag() {
  if (!isProductionHost() || typeof window === 'undefined') return
  if (window.__phsAdsInit) return
  window.__phsAdsInit = true

  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
  }
  window.gtag('js', new Date())
  window.gtag('config', ADS_ID)

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`
  document.head.appendChild(s)
}

/**
 * Report a Google Ads conversion. Safe to call from anywhere: no-ops on the
 * server, when the Ads tag hasn't loaded, and when the label isn't configured.
 */
export function trackAdsConversion(label) {
  if (!label || typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` })
  if (import.meta.env.DEV) console.debug('[Ads]', label)
}

/**
 * Send a GA4 event. Safe to call whether or not analytics is configured — a
 * no-op when gtag hasn't loaded (local dev, previews, or before initAnalytics()
 * has run), and in dev it logs to the console so events are verifiable without
 * a live Measurement ID.
 *
 * `opts.beacon` marks the hit `transport_type: 'beacon'`, gtag.js's own
 * mechanism for events fired right before a context change (a tel: tap that
 * backgrounds the tab for the phone app, a lead redirect to /thank-you) — it
 * queues the hit via navigator.sendBeacon instead of a regular XHR/fetch, so
 * the request is handed off immediately rather than possibly being caught
 * mid-flight. Use it for click_to_call and generate_lead; every other event
 * fires with the page in no danger of changing context, so the default
 * (ordinary request) is fine.
 */
export function trackEvent(name, params = {}, { beacon = false } = {}) {
  if (typeof window === 'undefined') return
  const payload = beacon ? { ...params, transport_type: 'beacon' } : params
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload)
  } else if (import.meta.env.DEV) {
    // No GTM container reads this repo's dataLayer, so pushing a plain
    // {event, ...} object here would never actually be sent anywhere — it
    // would just sit in the array looking like it worked. Surface that in
    // dev instead of pretending the event was queued.
    console.debug('[GA4] gtag not initialized yet — dropped event:', name, payload)
  }
  if (import.meta.env.DEV) console.debug('[GA4]', name, payload)
}

/** Manually record a page_view for the given SPA path. */
export function trackPageView(path) {
  if (!analyticsConfigured || typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: document.title,
  })
}

/**
 * App-level analytics hook. Boots gtag, records a page_view on every route
 * change, and installs a single delegated click listener that turns the site's
 * existing markup into conversion events — no per-button wiring required:
 *   - tel:  links      → `click_to_call`
 *   - mailto: links    → `email_click`
 *   - `.cta-diag` CTAs → `cta_click`  (submit buttons excluded; those fire
 *                                       `generate_lead` from submitForm instead)
 */
export function useAnalytics() {
  const path = usePath()

  useEffect(() => {
    initAnalytics()
    initAdsTag()
  }, [])
  useEffect(() => { trackPageView(path) }, [path])

  useEffect(() => {
    const onClick = (e) => {
      const anchor = e.target.closest('a')
      if (anchor) {
        const href = anchor.getAttribute('href') || ''
        const label = anchor.textContent.trim().slice(0, 60)
        if (href.startsWith('tel:')) {
          trackEvent('click_to_call', { link_url: href, phone_number: href.replace('tel:', ''), link_text: label }, { beacon: true })
          trackAdsConversion(ADS_LABELS.phoneCall)
          return
        }
        if (href.startsWith('mailto:')) {
          trackEvent('email_click', { link_url: href, link_text: label })
          return
        }
      }
      // Branded CTA buttons/links all carry the `cta-diag` class. Skip form
      // submit buttons — their conversion is the `generate_lead` event.
      const cta = e.target.closest('.cta-diag')
      if (cta && !(cta.tagName === 'BUTTON' && cta.getAttribute('type') === 'submit')) {
        trackEvent('cta_click', {
          cta_text: cta.textContent.trim().slice(0, 60),
          cta_href: cta.getAttribute('href') || '',
          page_path: window.location.pathname,
        })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
