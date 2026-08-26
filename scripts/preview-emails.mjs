// Local-only email design QA tool. Renders the ACTUAL owner + customer
// templates from api/_emailTemplate.js with realistic fixture data, wraps
// them in a simulated email-client frame (From/To/Subject header, like
// opening the real message in an inbox), and serves a small dashboard to
// flip between them at desktop (600px) and mobile (390px) widths.
//
// Never calls SMTP2GO, never touches production code or config — this is
// a read-only viewer around the same functions api/contact.js calls.
//
//   Usage: node scripts/preview-emails.mjs   (defaults to http://localhost:4321)

import { createServer } from 'node:http'
import {
  ownerEmailHtml,
  customerEmailHtml,
} from '../api/_emailTemplate.js'

const PORT = process.env.PREVIEW_PORT || 4321

// Realistic, clearly-fake fixture data — never real customer information.
const OWNER_FIXTURE = {
  fullName: 'Sarah Johnson',
  phone: '(385) 555-0147',
  email: 'sarah.johnson@example.com',
  service: 'Water Heater Repair',
  message: "Our water heater is leaking and we'd like someone to take a look as soon as possible.",
  section: 'Hero - Get Free Quote',
  submittedAt: 'August 27, 2026 · 3:45 PM',
}
const CUSTOMER_FIXTURE = {
  firstName: 'Sarah',
  service: 'Water Heater Repair',
  submittedAt: 'August 27, 2026 · 3:45 PM',
}

const ownerHtml = ownerEmailHtml(OWNER_FIXTURE)
const customerHtml = customerEmailHtml(CUSTOMER_FIXTURE)

const ownerSubject = `New PHS Lead - ${OWNER_FIXTURE.service} - ${OWNER_FIXTURE.fullName}`
const customerSubject = `Thanks, ${CUSTOMER_FIXTURE.firstName} - We Received Your PHS Request`

/** Simulated inbox header (From/To/Subject) above the actual rendered email
 * — same visual cue as opening a real message, never real production
 * addresses (owner's real inbox address is intentionally never shown). */
function emailFrameHeader({ from, to, replyTo, subject }) {
  const row = (label, value) => `
    <div style="display:flex;gap:10px;padding:3px 0;font:13px/1.5 -apple-system,Segoe UI,Arial,sans-serif;">
      <div style="width:64px;flex:none;color:#8a92a0;font-weight:600;">${label}</div>
      <div style="color:#1a2233;">${value}</div>
    </div>`
  return `
    <div style="background:#fff;border:1px solid #e1e5ea;border-bottom:none;padding:16px 20px;">
      ${row('From', 'Preventive Home Solutions')}
      ${row('To', to)}
      ${replyTo ? row('Reply-To', replyTo) : ''}
      ${row('Subject', `<strong>${subject}</strong>`)}
    </div>`
}

function page() {
  const ownerFrame = emailFrameHeader({
    to: 'PHS Owner',
    replyTo: OWNER_FIXTURE.email,
    subject: ownerSubject,
  })
  const customerFrame = emailFrameHeader({
    to: `Sarah Johnson &lt;${CUSTOMER_FIXTURE.firstName.toLowerCase()}.johnson@example.com&gt;`,
    subject: customerSubject,
  })

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PHS Email Template Preview</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, 'Segoe UI', Arial, sans-serif;
    background: #eef1f5;
    color: #16263d;
  }
  .topbar {
    background: #0a2540;
    color: #fff;
    padding: 18px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .topbar img { height: 34px; width: auto; display: block; }
  .topbar .title { font-weight: 800; font-size: 16px; letter-spacing: 0.01em; }
  .badge {
    margin-left: auto;
    background: #b8480d;
    color: #fff;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
  }
  .controls {
    background: #fff;
    border-bottom: 1px solid #e1e5ea;
    padding: 14px 28px;
    display: flex;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
  }
  .tabs, .viewport-toggle { display: flex; gap: 8px; }
  button.tab, button.vp {
    font: 700 13px/1 Arial, sans-serif;
    padding: 9px 18px;
    border: 1px solid #d6dae0;
    background: #fff;
    color: #445;
    cursor: pointer;
  }
  button.tab.active, button.vp.active {
    background: #0a2540;
    border-color: #0a2540;
    color: #fff;
  }
  .stage {
    padding: 48px 20px 100px;
    min-height: calc(100vh - 130px);
    display: flex;
    justify-content: center;
    background:
      radial-gradient(1200px 600px at 50% -10%, rgba(10,37,64,0.05), transparent 60%),
      repeating-linear-gradient(135deg, rgba(10,37,64,0.025) 0px, rgba(10,37,64,0.025) 1px, transparent 1px, transparent 26px);
  }
  .inbox-shell {
    width: 100%;
    max-width: 660px;
    margin: 0 auto;
    transition: max-width 0.2s ease;
  }
  .inbox-shell.mobile { max-width: 390px; }
  .inbox-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #e1e5ea;
    border-bottom: none;
    padding: 10px 16px;
    font: 700 12px/1 Arial, sans-serif;
    color: #8a92a0;
  }
  .inbox-toolbar .dot { width: 9px; height: 9px; border-radius: 50%; background: #d6dae0; }
  .inbox-toolbar .dot:nth-child(1) { background: #f3751b; }
  .device-label {
    text-align: center;
    font: 700 11px/1 Arial, sans-serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8a92a0;
    margin: 0 0 16px;
  }
  .frame-wrap {
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 30px 60px -24px rgba(10,37,64,0.3);
  }
  iframe { width: 100%; border: none; display: block; background: #f4ecdf; }
  .tabpanel { display: none; }
  .tabpanel.active { display: block; }
</style>
</head>
<body>
  <div class="topbar">
    <img src="https://www.preventivehomesolutions.com/main logo.webp" alt="Preventive Home Solutions">
    <div class="title">Email Template Preview</div>
    <div class="badge">Local Preview - Not Sent</div>
  </div>

  <div class="controls">
    <div class="tabs">
      <button class="tab active" data-tab="owner">Owner Email</button>
      <button class="tab" data-tab="customer">Customer Email</button>
    </div>
    <div class="viewport-toggle">
      <button class="vp active" data-vp="desktop">Desktop</button>
      <button class="vp" data-vp="mobile">Mobile</button>
    </div>
  </div>

  <div class="stage">
    <div id="panel-owner" class="tabpanel active">
      <div class="inbox-shell" id="shell-owner">
        <div class="device-label" id="vp-label-owner">Desktop · 600px email width</div>
        <div class="inbox-toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>&nbsp;&nbsp;Inbox - Preventive Home Solutions</div>
        <div class="frame-wrap" id="frame-owner">
          ${ownerFrame}
          <iframe id="iframe-owner" srcdoc="${ownerHtml.replace(/"/g, '&quot;')}" style="height:1400px;"></iframe>
        </div>
      </div>
    </div>
    <div id="panel-customer" class="tabpanel">
      <div class="inbox-shell" id="shell-customer">
        <div class="device-label" id="vp-label-customer">Desktop · 600px email width</div>
        <div class="inbox-toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>&nbsp;&nbsp;Inbox - Sarah Johnson</div>
        <div class="frame-wrap" id="frame-customer">
          ${customerFrame}
          <iframe id="iframe-customer" srcdoc="${customerHtml.replace(/"/g, '&quot;')}" style="height:1100px;"></iframe>
        </div>
      </div>
    </div>
  </div>

<script>
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tabpanel');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    panels.forEach((p) => p.classList.remove('active'));
    document.getElementById('panel-' + t.dataset.tab).classList.add('active');
  }));

  const vpButtons = document.querySelectorAll('.vp');
  vpButtons.forEach((b) => b.addEventListener('click', () => {
    vpButtons.forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const mobile = b.dataset.vp === 'mobile';
    ['owner', 'customer'].forEach((kind) => {
      const shell = document.getElementById('shell-' + kind);
      shell.style.maxWidth = mobile ? '390px' : '660px';
      document.getElementById('vp-label-' + kind).textContent = mobile ? 'Mobile · 390px viewport' : 'Desktop · 600px email width';
    });
  }));
</script>
</body>
</html>`
}

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(page())
})

server.listen(PORT, () => {
  console.log(`PHS email preview running at http://localhost:${PORT}`)
  console.log('Local-only — no emails are sent, no production code is touched.')
})
