// Shared lead-submission helper used by every site form (Hero booking form,
// Contact "Get a Free Quote", and the service-page shield form).
//
// The reCAPTCHA v2 token comes from the visible checkbox widget (passed in via
// opts.recaptchaToken). We POST the lead as JSON to the Vercel serverless
// function at /api/contact, which verifies the token and sends the email
// through SMTP2GO. Secrets never touch the client.

const ENDPOINT = '/api/contact'

/**
 * @param {Object} fields   Form fields (name/firstName/lastName, email, phone, service, message…)
 * @param {Object} [opts]
 * @param {string} [opts.section]         Human label for where the lead came from.
 * @param {string} [opts.recaptchaToken]  Token from the reCAPTCHA v2 widget.
 * @returns {Promise<{success:true}>}  Resolves on success, throws Error(message) otherwise.
 */
export async function submitLead(fields, { section, recaptchaToken } = {}) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, section, recaptchaToken }),
    })
  } catch {
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
  return data
}
