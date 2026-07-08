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

const DEFAULT_TO = 'Preventivehomeservices@gmail.com'
const BUSINESS_ADDRESS = '688 S Main St, Layton, UT 84041, United States'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length) {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  // Fallback: manually read the stream (some runtimes don't pre-parse).
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
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
  const {
    name, firstName, lastName, email, phone, service, message,
    section, recaptchaToken,
  } = body

  const fullName = (name || [firstName, lastName].filter(Boolean).join(' ')).trim()

  // Minimal server-side validation (never trust the client).
  if (!fullName || !phone || !service) {
    return res.status(400).json({ success: false, message: 'Please fill in your name, phone, and service.' })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })
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

  const rows = [
    ['Name', fullName],
    ['Phone', phone],
    ['Email', email || '—'],
    ['Service', service],
    ['Message', message || '—'],
    ['Source', section || 'Website form'],
  ]
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#16263d;max-width:560px">
      <h2 style="margin:0 0 4px;color:#0a2540">New Website Lead</h2>
      <p style="margin:0 0 16px;color:#647089;font-size:13px">${escapeHtml(section || 'Website form')}</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px;background:#f4ecdf;border:1px solid #e6ded4;font-weight:bold;width:120px">${escapeHtml(k)}</td>
            <td style="padding:8px 12px;border:1px solid #e6ded4">${escapeHtml(v)}</td>
          </tr>`
          )
          .join('')}
      </table>
      <p style="margin:16px 0 0;color:#647089;font-size:12px">${escapeHtml(BUSINESS_ADDRESS)}</p>
    </div>`

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')

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
        subject: `New ${service} request — ${fullName}`,
        html_body: html,
        text_body: text,
        ...(email ? { custom_headers: [{ header: 'Reply-To', value: email }] } : {}),
      }),
    })

    // SMTP2GO returns HTTP 200 even for some failures; the real result is in
    // data.data.succeeded / data.data.error.
    const data = await resp.json().catch(() => ({}))
    const succeeded = data?.data?.succeeded
    if (!resp.ok || !succeeded) {
      console.error('[api/contact] SMTP2GO error', resp.status, JSON.stringify(data))
      return res.status(502).json({
        success: false,
        message: 'We couldn’t send your request. Please call us at (385) 453-9428.',
      })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[api/contact] SMTP2GO request failed', err)
    return res.status(502).json({
      success: false,
      message: 'We couldn’t send your request. Please call us at (385) 453-9428.',
    })
  }
}
