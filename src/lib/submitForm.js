// Shared lead-submission helper used by every site form (Hero booking form,
// Contact "Get a Free Quote", the service-page shield form, and the landing
// page forms).
//
// The reCAPTCHA v2 token comes from the visible checkbox widget (passed in via
// opts.recaptchaToken). We POST the lead as JSON to the Vercel serverless
// function at /api/contact, which verifies the token and sends the email
// through SMTP2GO. Secrets never touch the client. On success we navigate to
// /thank-you after firing the GA4/Ads conversion events, so every caller gets
// the confirmation page without wiring it up individually.

import { trackEvent, trackAdsConversion, ADS_LABELS } from './analytics.js'
import { navigate } from '../router.js'

const ENDPOINT = '/api/contact'

/**
 * @param {Object} fields   Form fields (name/firstName/lastName, email, phone, service, message…)
 * @param {Object} [opts]
 * @param {string} [opts.section]         Human label for where the lead came from.
 * @param {string} [opts.recaptchaToken]  Token from the reCAPTCHA v2 widget.
 * @returns {Promise<{success:true}>}  Resolves on success, throws Error(message) otherwise.
 */
// A hung request (dropped connection, server never responds) would otherwise
// leave the caller's "Sending…" state stuck forever with no way to retry.
const TIMEOUT_MS = 15000

export async function submitLead(fields, { section, recaptchaToken } = {}) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, section, recaptchaToken }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new Error('That took too long. Please check your connection and try again, or call us at (385) 453-9428.')
    }
    throw new Error('Network error, please try again.')
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    // Non-JSON response (e.g. hitting the SPA fallback in local `vite` dev where
    // the serverless function isn't running).
    throw new Error(
      'We couldn’t send your request right now. Please call us at (385) 453-9428.'
    )
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Something went wrong. Please try again or call us.')
  }

  // GA4 conversion: a lead form was submitted successfully. `section` tells us
  // which form/page it came from (Hero, Contact, Landing CTA, etc.).
  trackEvent('generate_lead', {
    form_section: section || 'Unknown',
    service: fields.service || '',
    property_type: fields.propertyType || '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })

  // Google Ads conversion for the same lead, so paid-search spend is attributed.
  trackAdsConversion(ADS_LABELS.leadForm)

  // Send the visitor to the confirmation page. Runs after the conversion fire
  // above, never before/instead of it.
  navigate('/thank-you')

  return data
}
