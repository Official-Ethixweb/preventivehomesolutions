// Vercel serverless function: /api/contact
//
// Receives a lead from any site form, verifies the Google reCAPTCHA token,
// then emails the submission via the SMTP2GO API. All secrets live in Vercel
// environment variables and never reach the browser:
//
//   SMTP2GO_API_KEY        SMTP2GO API key (secret, format "api-...")
//   MAIL_FROM              Verified sender in SMTP2GO (single sender or verified domain)
//   MAIL_TO                Recipient (default: Preventivehomeservices@gmail.com)
//   RECAPTCHA_SECRET_KEY   Google reCAPTCHA secret key
//   RECAPTCHA_MIN_SCORE    Optional score threshold (default 0.5)

import {
  ownerEmailHtml,
  ownerEmailText,
  customerEmailHtml,
  customerEmailText,
} from './_emailTemplate.js'

const DEFAULT_TO = 'Preventivehomeservices@gmail.com'

const MAX_BODY_BYTES = 100 * 1024 // 100KB — far more than a lead form needs

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length) {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  // Fallback: manually read the stream (some runtimes don't pre-parse).
  // Capped so a runaway/malicious body can't be buffered into memory in full.
  const chunks = []
  let total = 0
  for await (const chunk of req) {
    total += chunk.length
    if (total > MAX_BODY_BYTES) return { __tooLarge: true }
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return {} }
}

async function verifyRecaptcha(token, remoteip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  // No secret configured → skip verification (keeps preview/dev usable).
  if (!secret) return { ok: true, skipped: true }
  if (!token) return { ok: false, reason: 'missing-token' }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || '0.5')
  const params = new URLSearchParams({ secret, response: token })
  if (remoteip) params.append('remoteip', remoteip)

  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = await resp.json()
    if (!data.success) return { ok: false, reason: 'failed', data }
    if (typeof data.score === 'number' && data.score < minScore) {
      return { ok: false, reason: 'low-score', data }
    }
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: 'verify-error', error: String(err) }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const body = await readBody(req)
  if (body.__tooLarge) {
    return res.status(413).json({ success: false, message: 'Request too large.' })
  }
  const {
    name, firstName, lastName, email, phone, service, message,
    section, recaptchaToken,
  } = body

  const fullName = (name || [firstName, lastName].filter(Boolean).join(' ')).trim()

  // Minimal server-side validation (never trust the client — these fields can
  // arrive from a direct API call, not just the site's own forms).
  if (!fullName || !phone || !service) {
    return res.status(400).json({ success: false, message: 'Please fill in your name, phone, and service.' })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })
  }
  // Reject implausibly long field values — well past any real name/phone/
  // service/message, but tight enough to stop a garbage or malicious payload
  // from bloating the outgoing email or exhausting SMTP2GO's limits.
  const FIELD_MAX = { fullName: 200, phone: 40, email: 200, service: 200, message: 4000, section: 200 }
  const tooLong =
    fullName.length > FIELD_MAX.fullName ||
    String(phone).length > FIELD_MAX.phone ||
    (email && String(email).length > FIELD_MAX.email) ||
    String(service).length > FIELD_MAX.service ||
    (message && String(message).length > FIELD_MAX.message) ||
    (section && String(section).length > FIELD_MAX.section)
  if (tooLong) {
    return res.status(400).json({ success: false, message: 'One of the fields is too long. Please shorten it and try again.' })
  }

  // 1) Verify the human.
  const remoteip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  const captcha = await verifyRecaptcha(recaptchaToken, remoteip)
  if (!captcha.ok) {
    return res.status(400).json({
      success: false,
      message: 'We couldn’t verify that you’re human. Please refresh and try again.',
    })
  }

  // 2) Send the email via SMTP2GO.
  // Trim to defend against stray whitespace/newlines pasted into the env var,
  // which SMTP2GO rejects with a 403 "api_key ... wasn't in the correct format".
  const apiKey = (process.env.SMTP2GO_API_KEY || '').trim()
  const from = (process.env.MAIL_FROM || '').trim()
  const to = (process.env.MAIL_TO || DEFAULT_TO).trim()
  if (!apiKey || !from) {
    console.error('[api/contact] Missing SMTP2GO_API_KEY or MAIL_FROM env var.')
    return res.status(500).json({
      success: false,
      message: 'Email delivery isn’t configured yet. Please call us at (385) 453-9428.',
    })
  }

  // Human-readable submission time (server timezone; UTC is unambiguous
  // across the owner's inbox regardless of where they open it).
  const submittedAt =
    new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }) + ' UTC'

  // Sends one SMTP2GO email/send request and reports back whether SMTP2GO's
  // own queue actually accepted it (see the note below on what "succeeded"
  // does and doesn't guarantee). Shared by both the owner notification and
  // the customer confirmation — two entirely distinct send operations, each
  // with its own SMTP2GO email_id, never conflated with one another.
  async function sendMail(kind, { to, subject, html_body, text_body, replyTo }) {
    try {
      const resp = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: {
          'X-Smtp2go-Api-Key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: from,
          to: [to],
          subject,
          html_body,
          text_body,
          ...(replyTo ? { custom_headers: [{ header: 'Reply-To', value: replyTo }] } : {}),
        }),
      })

      // SMTP2GO returns HTTP 200 even for some failures; the real result is
      // in data.data.succeeded / data.data.error. Note "succeeded" means
      // SMTP2GO accepted the message into its own send queue, not that the
      // recipient's mail server has actually accepted or delivered it —
      // that requires a separate lookup against SMTP2GO's Activity/
      // Search-Activity API using email_id, which this endpoint doesn't do.
      const data = await resp.json().catch(() => ({}))
      const succeeded = data?.data?.succeeded
      const emailId = data?.data?.email_id
      if (!resp.ok || !succeeded) {
        console.error('[api/contact] SMTP2GO error', { kind, status: resp.status, body: JSON.stringify(data) })
        return { ok: false, emailId: null }
      }
      // Safe, PII-free record of the SMTP2GO transaction so a delivery issue
      // can be correlated to a specific message via SMTP2GO's own dashboard
      // (search by email_id) — no lead details (name/phone/email) logged.
      console.log('[api/contact] SMTP2GO accepted', { kind, emailId })
      return { ok: true, emailId }
    } catch (err) {
      console.error('[api/contact] SMTP2GO request failed', { kind, error: String(err) })
      return { ok: false, emailId: null }
    }
  }

  // 1) Notify the business — this is the email that actually matters for
  // the lead to be actioned, so its outcome decides the API response.
  const ownerFields = { fullName, phone, email, service, message, section, submittedAt }
  const ownerResult = await sendMail('owner', {
    to,
    subject: `New PHS Lead - ${service} - ${fullName}`,
    html_body: ownerEmailHtml(ownerFields),
    text_body: ownerEmailText(ownerFields),
    replyTo: email || undefined,
  })
  const ownerNotification = ownerResult.ok ? 'success' : 'failure'
  if (ownerNotification === 'failure') {
    console.log('[api/contact] result', { ownerNotification, customerConfirmation: 'skipped' })
    return res.status(502).json({
      success: false,
      message: 'We couldn’t send your request. Please call us at (385) 453-9428.',
    })
  }

  // 2) Confirm receipt to the customer, if they gave an email — best-effort:
  // its outcome never flips the API response to failure, since the lead has
  // already reached the business either way (only logged on failure so it
  // can be followed up on, never surfaced to the visitor as an error).
  let customerConfirmation = 'skipped'
  if (email) {
    const firstName = fullName.split(' ')[0]
    const customerFields = { firstName, service, submittedAt }
    const customerResult = await sendMail('customer', {
      to: email,
      subject: `Thanks, ${firstName} - We Received Your PHS Request`,
      html_body: customerEmailHtml(customerFields),
      text_body: customerEmailText(customerFields),
    })
    customerConfirmation = customerResult.ok ? 'success' : 'failure'
  }

  console.log('[api/contact] result', { ownerNotification, customerConfirmation })
  return res.status(200).json({ success: true })
}
