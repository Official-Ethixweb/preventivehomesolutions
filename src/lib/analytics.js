import { useEffect } from 'react'
import { usePath } from '../router.js'

// Google Analytics 4 (gtag.js) integration.
//
// The Measurement ID is read from VITE_GA_MEASUREMENT_ID (public — it is safe to
// expose in the client bundle, exactly like the reCAPTCHA site key). When the ID
// isn't configured, every function here is a no-op, so local dev and previews
// never send hits.
//
// This SPA does its own client-side routing, so we disable gtag's automatic
// page_view and send one manually on every route change (see useAnalytics()).
// Conversion events (lead forms, click-to-call, CTA clicks) are sent from the
// central helpers below so tracking stays consistent across every page.

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
export const analyticsConfigured = Boolean(GA_MEASUREMENT_ID)

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
// Separate channel from GA4 above: the Ads tag itself (AW-16752767608) is loaded
// in index.html, and these labels come straight from the conversion-action
// snippets in the Ads UI. They are public client-side identifiers, so they live
// in code rather than an env var — same reasoning as the reCAPTCHA site key.
//
// Fired only on a real lead action (a tel: tap, a successful form POST), never
// on page load, so "Page load" conversion actions must be set to Click in Ads.
const ADS_ID = 'AW-16752767608'

export const ADS_LABELS = {
  // "PHS - Phone Click" conversion action.
  phoneCall: 'lhRSCJmp3qUcEPjkq7Q-',
  // "PHS - Form Submission" conversion action.
  leadForm: 'mIKoCM2ax6UcEPjkq7Q-',
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
 * Send a GA4 event. Safe to call whether or not analytics is configured — it
 * falls back to a dataLayer push, and in dev it logs to the console so events
 * are verifiable without a live Measurement ID.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params })
  }
  if (import.meta.env.DEV) console.debug('[GA4]', name, params)
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

  useEffect(() => { initAnalytics() }, [])
  useEffect(() => { trackPageView(path) }, [path])

  useEffect(() => {
    const onClick = (e) => {
      const anchor = e.target.closest('a')
      if (anchor) {
        const href = anchor.getAttribute('href') || ''
        const label = anchor.textContent.trim().slice(0, 60)
        if (href.startsWith('tel:')) {
          trackEvent('click_to_call', { link_url: href, phone_number: href.replace('tel:', ''), link_text: label })
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
