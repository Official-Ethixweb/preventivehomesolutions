// Shared PHS-branded email design system for api/contact.js's two
// transactional emails (owner lead alert + customer confirmation).
//
// Built to inherit the real PHS brand from src/data/business.js,
// src/data/nav.js, and tailwind.config.js — not a generic template:
//   - Colors: phsNavy/phsOrange/phsOrangeDark/phsCream/phsInk, the same
//     tokens the website itself uses (see tailwind.config.js).
//   - phsOrangeDark (not phsOrange) is used anywhere orange sits behind
//     white text, mirroring the same WCAG-contrast fix already applied
//     across the live site's marquee/badges — see MarqueeBanner.jsx.
//   - Square-cornered buttons/cards + fully-round pill badges, matching
//     the site's global "heavy-duty" shape rule (src/index.css: every
//     rounded-* is forced square except true pills).
//   - Voice matches ThankYouPage.jsx's existing customer-facing copy
//     ("Thanks — we've received your request...").
// Table-based layout with inline CSS throughout — the only markup style
// that renders consistently across Gmail, Outlook, Apple Mail, and
// Yahoo Mail, none of which reliably support modern CSS layout or
// external/embedded stylesheets in email.

const COLORS = {
  navy: '#0a2540',
  ink: '#16263d',
  orange: '#f3751b',
  orangeDark: '#b8480d',
  cream: '#f4ecdf',
  sky: '#1b6e9e',
  border: '#e6ded4',
  muted: '#647089',
  white: '#ffffff',
}

const LOGO_URL = 'https://www.preventivehomesolutions.com/main logo.webp'
const SITE_URL = 'https://www.preventivehomesolutions.com'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** A single labeled row inside an info card table. */
function infoRow(label, value, { emphasis = false } = {}) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:10px 16px;background:${COLORS.cream};border:1px solid ${COLORS.border};border-right:none;font:700 12px/1.4 Arial,Helvetica,sans-serif;color:${COLORS.navy};width:130px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 16px;border:1px solid ${COLORS.border};font:${emphasis ? '700' : '400'} 14px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.ink};vertical-align:top;">${value}</td>
    </tr>`
}

/** Square-cornered PHS button — matches the site's cta-diag-orange shape (no border-radius). */
function button(label, href, { variant = 'orange' } = {}) {
  const bg = variant === 'orange' ? COLORS.orangeDark : COLORS.navy
  return `
    <a href="${href}" style="display:inline-block;background:${bg};color:${COLORS.white};font:700 15px/1 Arial,Helvetica,sans-serif;text-decoration:none;padding:14px 28px;letter-spacing:0.02em;">${escapeHtml(label)}</a>`
}

/** The shared shell every PHS transactional email is wrapped in: preheader,
 * logo header on navy, white content well, PHS footer. `accentLabel` is the
 * small pill under the logo (e.g. "NEW LEAD" / "REQUEST RECEIVED") that
 * differentiates the owner and customer emails at a glance. */
function shell({ preheader, accentLabel, accentColor, bodyHtml }) {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<title>Preventive Home Solutions</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  table { border-collapse:collapse !important; }
  body { margin:0; padding:0; width:100% !important; background:${COLORS.cream}; }
  a { color:${COLORS.orangeDark}; }
  @media only screen and (max-width:600px) {
    .phs-container { width:100% !important; }
    .phs-px { padding-left:20px !important; padding-right:20px !important; }
    .phs-stack td { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.cream};">
  <div style="display:none;font-size:1px;color:${COLORS.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="phs-container" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${COLORS.white};">

          <!-- Header: navy band, PHS logo, accent pill -->
          <tr>
            <td align="center" style="background:${COLORS.navy};padding:32px 24px 28px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <img src="${LOGO_URL}" width="56" height="56" alt="Preventive Home Solutions" style="display:block;margin:0 auto 14px;width:56px;height:56px;">
              </a>
              <div style="font:800 18px/1.2 Arial,Helvetica,sans-serif;color:${COLORS.white};letter-spacing:0.01em;">Preventive Home Solutions</div>
              <div style="margin-top:14px;">
                <span style="display:inline-block;background:${accentColor};color:${COLORS.white};font:800 11px/1 Arial,Helvetica,sans-serif;letter-spacing:0.12em;text-transform:uppercase;padding:7px 16px;border-radius:999px;">${escapeHtml(accentLabel)}</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="phs-px" style="padding:36px 40px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="phs-px" style="background:${COLORS.navy};padding:28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font:700 13px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.white};padding-bottom:10px;">
                    Preventive Home Solutions
                  </td>
                </tr>
                <tr>
                  <td style="font:400 12px/1.7 Arial,Helvetica,sans-serif;color:#9fb3c8;">
                    688 N Main St, Layton, UT 84041, United States<br>
                    <a href="tel:3854539428" style="color:#9fb3c8;text-decoration:none;">(385) 453-9428</a>
                    &nbsp;·&nbsp;
                    <a href="${SITE_URL}" style="color:#9fb3c8;text-decoration:none;">preventivehomesolutions.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="font:400 11px/1.6 Arial,Helvetica,sans-serif;color:#6f8399;padding-top:14px;border-top:1px solid #1c3a57;margin-top:14px;">
                    Thank you for trusting Preventive Home Solutions.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Owner / internal lead-alert email — the "action center." Optimized to be
 * scanned in 5-10 seconds: who, what, how to reach them, immediately.
 */
export function ownerEmailHtml({ fullName, phone, email, service, message, section, submittedAt }) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;font:800 22px/1.3 Arial,Helvetica,sans-serif;color:${COLORS.navy};">New lead received</h1>
    <p style="margin:0 0 28px;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:${COLORS.muted};">Someone requested service through the PHS website. Details below.</p>

    <div style="font:800 11px/1 Arial,Helvetica,sans-serif;color:${COLORS.orangeDark};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Customer Information</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${infoRow('Name', escapeHtml(fullName), { emphasis: true })}
      ${infoRow('Phone', `<a href="tel:${escapeHtml(String(phone).replace(/\D/g, ''))}" style="color:${COLORS.ink};text-decoration:none;font-weight:700;">${escapeHtml(phone)}</a>`)}
      ${email ? infoRow('Email', `<a href="mailto:${escapeHtml(email)}" style="color:${COLORS.ink};text-decoration:none;">${escapeHtml(email)}</a>`) : ''}
    </table>

    <div style="font:800 11px/1 Arial,Helvetica,sans-serif;color:${COLORS.orangeDark};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Request Details</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('Service', escapeHtml(service), { emphasis: true })}
      ${message ? infoRow('Message', escapeHtml(message).replace(/\n/g, '<br>')) : ''}
      ${infoRow('Source', escapeHtml(section || 'Website form'))}
      ${infoRow('Submitted', escapeHtml(submittedAt))}
    </table>

    <!-- Action card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};border:1px solid ${COLORS.border};">
      <tr>
        <td style="padding:20px 24px;">
          <div style="font:800 13px/1.4 Arial,Helvetica,sans-serif;color:${COLORS.navy};margin-bottom:4px;">Ready to follow up</div>
          <div style="font:400 13px/1.6 Arial,Helvetica,sans-serif;color:${COLORS.muted};margin-bottom:16px;">Reply directly to this email to reach ${email ? 'the customer' : 'our records'} - Reply-To is already set${email ? " to the customer's address" : ''}.</div>
          ${button(`Call ${phone}`, `tel:${String(phone).replace(/\D/g, '')}`)}
        </td>
      </tr>
    </table>
  `
  return shell({
    preheader: 'New service request received through the PHS website.',
    accentLabel: 'New Lead',
    accentColor: COLORS.orangeDark,
    bodyHtml,
  })
}

export function ownerEmailText({ fullName, phone, email, service, message, section, submittedAt }) {
  const lines = [
    'NEW LEAD RECEIVED',
    'Someone requested service through the PHS website.',
    '',
    'CUSTOMER INFORMATION',
    `Name: ${fullName}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : null,
    '',
    'REQUEST DETAILS',
    `Service: ${service}`,
    message ? `Message: ${message}` : null,
    `Source: ${section || 'Website form'}`,
    `Submitted: ${submittedAt}`,
    '',
    `Reply to this email to reach ${email ? 'the customer directly (Reply-To is set)' : 'our records'}, or call ${phone}.`,
    '',
    '- Preventive Home Solutions · 688 N Main St, Layton, UT 84041',
  ].filter((l) => l !== null)
  return lines.join('\n')
}

/**
 * Customer-facing confirmation email — the "trust + confirmation" moment.
 * Deliberately minimal: no internal routing, no technical details, only
 * what reassures the customer their request was received.
 */
export function customerEmailHtml({ firstName, service, submittedAt }) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;font:800 22px/1.3 Arial,Helvetica,sans-serif;color:${COLORS.navy};">Thanks, ${escapeHtml(firstName)} - we've got your request</h1>
    <p style="margin:0 0 28px;font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${COLORS.ink};">Thank you for reaching out to Preventive Home Solutions. We've received your request and our team will review the details shortly.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${infoRow('Service Requested', escapeHtml(service), { emphasis: true })}
      ${infoRow('Submitted', escapeHtml(submittedAt))}
    </table>

    <!-- Next steps card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};border:1px solid ${COLORS.border};margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <div style="font:800 13px/1.4 Arial,Helvetica,sans-serif;color:${COLORS.navy};margin-bottom:6px;">What happens next?</div>
          <div style="font:400 14px/1.65 Arial,Helvetica,sans-serif;color:${COLORS.ink};">Our team will review your request and contact you soon to confirm the details and help with the next step.</div>
        </td>
      </tr>
    </table>

    <!-- Urgent help -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLORS.border};">
      <tr>
        <td align="center" style="padding:24px;">
          <div style="font:800 13px/1.4 Arial,Helvetica,sans-serif;color:${COLORS.navy};margin-bottom:4px;">Need help sooner?</div>
          <div style="font:400 13px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.muted};margin-bottom:16px;">Call us directly - we're here to help.</div>
          ${button('(385) 453-9428', 'tel:3854539428')}
        </td>
      </tr>
    </table>
  `
  return shell({
    preheader: 'Your request has been received by Preventive Home Solutions.',
    accentLabel: 'Request Received',
    accentColor: COLORS.sky,
    bodyHtml,
  })
}

export function customerEmailText({ firstName, service, submittedAt }) {
  return [
    `Thanks, ${firstName} - we've got your request.`,
    '',
    "Thank you for reaching out to Preventive Home Solutions. We've received your request and our team will review the details shortly.",
    '',
    `Service Requested: ${service}`,
    `Submitted: ${submittedAt}`,
    '',
    'WHAT HAPPENS NEXT?',
    'Our team will review your request and contact you soon to confirm the details and help with the next step.',
    '',
    'Need help sooner? Call us directly at (385) 453-9428.',
    '',
    '- Preventive Home Solutions · 688 N Main St, Layton, UT 84041',
  ].join('\n')
}

export { escapeHtml }
