import { useState, useRef, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import GoogleReviews from './GoogleReviews.jsx'
import RotatingText from './RotatingText.jsx'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'
import { useSeo } from '../lib/seo.js'
import { BUSINESS, FULL_ADDRESS, buildLandingSchema } from '../data/business.js'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS, areaHref } from '../data/nav.js'

/* ------------------------------ Inline icons ---------------------------- */
const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
const ICONS = {
  pipe: <svg {...iconBase}><path d="M3 15v3a2 2 0 0 0 2 2h3M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M21 15v3a2 2 0 0 1-2 2h-3M9 12h6" /></svg>,
  snake: <svg {...iconBase}><path d="M4 6a3 3 0 0 1 6 0v12a3 3 0 0 0 6 0M20 6h-4M20 6l-2-2M20 6l-2 2" /></svg>,
  thermometer: <svg {...iconBase}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>,
  droplet: <svg {...iconBase}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>,
  sewer: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></svg>,
  filter: <svg {...iconBase}><path d="M3 4h18l-7 8v7l-4 2v-9z" /></svg>,
  alarm: <svg {...iconBase}><path d="M12 2v2M5 22h14M19 12a7 7 0 0 0-14 0v6h14v-6zM4 12H3m18 0h-1M6.3 6.3l-.7-.7m12.1.7.7-.7" /></svg>,
  flame: <svg {...iconBase}><path d="M12 2s-4 3.5-4 8a4 4 0 0 0 8 0c0-4.5-4-8-4-8z" /><path d="M12 12c-1.5 0-2.5 1-2.5 2.5S10.5 17 12 17s2.5-1 2.5-2.5S13.5 12 12 12z" /></svg>,
  boiler: <svg {...iconBase}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M10 15v3M14 15v3" /></svg>,
  heatpump: <svg {...iconBase}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M12 8v8M8 10l4-2 4 2M8 14l4 2 4-2" /></svg>,
  minisplit: <svg {...iconBase}><rect x="3" y="5" width="18" height="6" rx="2" /><path d="M6 8h8M7 15c0 1.5 1 2 1 3M12 15c0 1.5 1 2 1 3M17 15c0 1.5 1 2 1 3" /></svg>,
  thermostat: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  wrench: <svg {...iconBase}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-2.2z" /></svg>,
  snowflake: <svg {...iconBase}><path d="M12 2v20m6-16-12 12m12 0L6 6m6-4-2 4m2-4 2 4m-8 6H4m16 0h-4M6 18l2-4m10 4-2-4" /></svg>,
  shield: <svg {...iconBase}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>,
  clock: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  tag: <svg {...iconBase}><path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h8l8.6 8.6a1.4 1.4 0 0 1 0 2z" /><circle cx="7.5" cy="7.5" r="1.3" /></svg>,
  badge: <svg {...iconBase}><circle cx="12" cy="8" r="5" /><path d="m9 12-1 9 4-2 4 2-1-9" /></svg>,
}

function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* --------------------------- Shared strands bg -------------------------- */
function StrandsBg({ opacity = 0.5 }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Strands
        colors={['#f97316', '#ffffff', '#3b82f6']}
        count={3} speed={0.5} amplitude={1} waviness={1} thickness={0.6}
        glow={2.6} taper={3} spread={1} hueShift={0} intensity={0.6}
        saturation={1.95} opacity={opacity} scale={2.6}
      />
    </div>
  )
}

/* -------------------------- Booking Form (Homepage variant) ----------------------- */
function BookingForm({ serviceOptions, section, mobile = false }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [service, setService] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!service) {
      setError('Please choose a service.')
      return
    }
    if (recaptchaConfigured && !recaptchaToken) {
      setError('Please confirm you’re not a robot.')
      return
    }
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.target)
    try {
      await submitLead(
        {
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email') || '',
          service,
          message: formData.get('message') || '',
        },
        { section, recaptchaToken }
      )
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      recaptchaRef.current?.reset()
    }
  }

  const fieldClass =
    'w-full rounded-md border border-phsSky/15 bg-white/70 px-4 py-3 text-center text-sm text-phsInk placeholder:text-phsInk/40 outline-none transition-colors focus:border-phsSky focus:bg-white'
  const labelClass =
    'mb-1.5 block text-center font-mono text-[11.5px] lg:text-[11px] font-bold tracking-[0.18em] text-phsInk'

  if (submitted) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-phsOrange/15 text-phsOrange">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12.5 4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-phsInk">
          Request Received
        </h3>
        <p className="mt-2 max-w-xs text-sm text-phsInk/60">
          Our team will reach out shortly. For urgent needs, call {PHONE_DISPLAY}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-center font-mono max-lg:mt-[30px] max-lg:text-[12.6px] text-xs font-bold tracking-[0.24em] text-phsOrange">
        Request Service
      </p>
      <h2 className="mt-2 text-center font-sans max-lg:text-[25.2px] text-2xl font-extrabold leading-tight tracking-tight text-phsInk">
        Book Your Inspection
      </h2>

      <div className={mobile ? 'mt-4 space-y-2.5' : 'mt-6 space-y-4'}>
        <div>
          <label htmlFor="bf-name" className={labelClass}>Full Name</label>
          <input id="bf-name" name="name" type="text" required placeholder="Jane Doe" className={fieldClass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bf-phone" className={labelClass}>Phone</label>
            <input id="bf-phone" name="phone" type="tel" required placeholder="(385) 000-0000" className={fieldClass} />
          </div>
          <div className="relative">
            <label htmlFor="bf-service" className={labelClass}>Service</label>
            
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`${fieldClass} flex items-center justify-between !px-3`}
            >
              <span className={`block truncate ${service ? 'text-phsInk' : 'text-phsInk/40'}`}>
                {service || 'Select…'}
              </span>
              <svg className={`h-4 w-4 shrink-0 text-phsInk/40 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input type="text" name="service" value={service} required aria-label="Service" aria-hidden="true" tabIndex={-1} className="absolute bottom-0 left-1/2 w-0 h-0 opacity-0 pointer-events-none" readOnly />
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-phsSky/15 bg-white shadow-xl">
                  {serviceOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setService(s); setDropdownOpen(false) }}
                      className="block w-full px-4 py-3 text-center text-[13.5px] font-bold text-phsInk hover:bg-phsOrange/10 hover:text-phsOrange focus:bg-phsOrange/10 focus:text-phsOrange outline-none transition-colors border-b border-gray-50 last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {!mobile && (
          <div>
            <label htmlFor="bf-email" className={labelClass}>Email</label>
            <input id="bf-email" name="email" type="email" placeholder="jane@email.com" className={fieldClass} />
          </div>
        )}

        <div>
          <label htmlFor="bf-message" className={labelClass}>How can we help?</label>
          <textarea id="bf-message" name="message" rows={mobile ? 2 : 3} placeholder="Briefly describe the issue…" className={`${fieldClass} resize-none mx-auto block !w-[calc(100%-32px)]`} />
        </div>

        <Recaptcha
          ref={recaptchaRef}
          onChange={setRecaptchaToken}
          className={`${mobile ? '-mb-3' : '-mb-6'} flex origin-top justify-center [transform:scale(0.68)]`}
        />

        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="cta-diag cta-diag-orange group mx-auto flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md bg-phsOrange px-6 py-2.5 font-sans text-[14px] font-bold tracking-[0.12em] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed -mt-[10px]"
        >
          {submitting ? 'Sending...' : 'Book Now'}
          {!submitting && <ArrowIcon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  )
}

const FORM_DESIGN_WIDTH = 360



/* ------------------------- Sticky coupon / call bar --------------------- */
// Rotating offers pinned to the bottom of the viewport so the discount stays
// visible as the visitor scrolls, paired with a prominent tap-to-call button.
function StickyCouponBar({ coupons }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-phsOrangeDark bg-phsOrange text-white shadow-[0_-8px_28px_rgba(0,0,0,0.18)]">
      {/* On lg the extra side padding keeps the coupon + Call button clear of the
          fixed chatbot (bottom-right) and accessibility widget (bottom-left);
          below lg those widgets sit above the bar so no inset is needed. The wide
          max-width leaves the coupon enough room to show in full on one line. */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2.5 px-3 py-2.5 sm:gap-3.5 sm:px-5 sm:py-3 lg:pl-24 lg:pr-32">
        <span className="shrink-0 text-white/85 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6">{ICONS.tag}</span>
        <div className="rotate-oneline min-w-0 flex-1 overflow-hidden">
          <RotatingText
            texts={coupons}
            rotationInterval={3000}
            staggerDuration={0.01}
            staggerFrom="last"
            splitBy="characters"
            animatePresenceMode="popLayout"
            mainClassName="font-display text-[clamp(11px,2.4vw,18px)] whitespace-nowrap font-bold tracking-wide sm:tracking-widest"
            elementLevelClassName="will-change-transform"
          />
        </div>
        {/* Call button only from md up, where there's room for it beside the
            coupon without truncating the text. On phones the coupon uses the full
            bar width (the fixed header already keeps the phone number on screen). */}
        <a
          href={`tel:${PHONE_TEL}`}
          className="cta-diag cta-diag-white group hidden shrink-0 items-center gap-2 rounded-md bg-white px-4 py-2 font-sans text-sm font-black text-phsOrange shadow-sm transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          <PhoneIcon className="h-5 w-5" />
          Call&nbsp;{PHONE_DISPLAY}
        </a>
      </div>
    </div>
  )
}

/* ----------------------------- ZIP checker ------------------------------ */
// ZIP codes we service across Davis, Weber & Box Elder counties.
const SERVICE_ZIPS = new Set([
  '84040', '84041', '84037', '84025', '84015', '84016', '84075', '84067',
  '84401', '84403', '84404', '84405', '84414', '84408', '84302', '84315',
  '84010', '84014', '84054', '84056', '84087',
])

function ZipChecker() {
  const [zip, setZip] = useState('')
  const [result, setResult] = useState(null) // 'yes' | 'no' | null

  const check = (e) => {
    e.preventDefault()
    const clean = zip.trim().slice(0, 5)
    if (!/^\d{5}$/.test(clean)) { setResult(null); return }
    setResult(SERVICE_ZIPS.has(clean) ? 'yes' : 'no')
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
      <p className="font-display text-lg font-bold text-white">Do we service your ZIP?</p>
      <form onSubmit={check} className="mt-4 flex gap-2.5">
        <input
          value={zip}
          onChange={(e) => { setZip(e.target.value); setResult(null) }}
          type="text" inputMode="numeric" maxLength={5} placeholder="Enter ZIP code"
          className="w-full rounded-lg border border-white/20 bg-white/95 px-4 py-3 text-[15px] text-phsInk placeholder-gray-400 outline-none focus:ring-2 focus:ring-phsOrange/40"
        />
        <button type="submit" className="cta-diag cta-diag-orange shrink-0 rounded-lg bg-phsOrange px-5 py-3 font-bold text-white hover:-translate-y-0.5 hover:shadow-md">
          Check
        </button>
      </form>
      {result === 'yes' && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-green-500/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-bold text-green-200">
            <span className="[&_svg]:h-5 [&_svg]:w-5">{ICONS.shield}</span>
            Great news — we service your area!
          </p>
          <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-phsOrange px-4 py-2.5 text-sm font-bold text-white">
            <PhoneIcon className="h-4 w-4" /> Call Now
          </a>
        </div>
      )}
      {result === 'no' && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white/90">We may still be able to help — give us a call to confirm.</p>
          <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-phsOrange px-4 py-2.5 text-sm font-bold text-white">
            <PhoneIcon className="h-4 w-4" /> Call Now
          </a>
        </div>
      )}
    </div>
  )
}

/* -------------------------------- Page ---------------------------------- */
export default function LandingPage({ slug, data }) {
  useSeo({
    title: data.metaTitle,
    description: data.metaDescription,
    path: data.path,
    image: data.heroImage,
    jsonLd: buildLandingSchema({
      businessType: data.businessType,
      serviceType: data.serviceType,
      serviceName: data.serviceName,
      serviceDescription: data.serviceDescription,
      breadcrumbLabel: data.breadcrumbLabel,
      pageUrl: data.path,
      image: data.heroImage,
      faqs: data.faqs,
    }),
  })

  const [openFaq, setOpenFaq] = useState(0)

  const shieldFormRef = useRef(null)
  const [formScale, setFormScale] = useState(1)

  const mobileShieldFormRef = useRef(null)
  const [mobileFormScale, setMobileFormScale] = useState(1)

  useEffect(() => {
    const el = shieldFormRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (el.clientWidth) setFormScale(el.clientWidth / FORM_DESIGN_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = mobileShieldFormRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (el.clientWidth) setMobileFormScale(el.clientWidth / FORM_DESIGN_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`min-h-screen bg-[#FAF8F5] ${data.coupons ? 'pb-[68px] sm:pb-[64px]' : ''}`}>
      <TopBar />
      <Header isLanding={true} />
      <main>

      {/* ============================== Hero ============================== */}
      <section className="relative overflow-hidden bg-[#FAF8F5] text-phsInk">
        <img src={data.heroImage} alt={data.heroImageAlt} className="absolute inset-0 z-0 h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FAF8F5]/95 via-[#FAF8F5]/90 to-[#FAF8F5]/80" />
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-10 pb-12 lg:pt-14 lg:pb-24">
          {/* Breadcrumb */}
          <Reveal as="nav" className="mb-6 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-phsInk/50 sm:text-xs">
            <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
            <span>/</span>
            <span className="text-phsOrange">{data.breadcrumbLabel.toUpperCase()}</span>
          </Reveal>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left copy */}
            <div>
              <Reveal as="p" className="font-mono text-xs font-bold tracking-[0.28em] text-phsOrange drop-shadow">
                {data.eyebrow.toUpperCase()}
              </Reveal>
              <Reveal as="h1" delay={100} className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-5xl lg:text-6xl">
                {data.heroStatic}
              </Reveal>
              <Reveal delay={150} className="rotate-oneline mt-4 inline-grid max-w-full items-center overflow-hidden rounded-xl bg-phsOrange px-4 py-2.5 shadow-sm">
                {/* Invisible copies of every tagline, stacked in one grid cell, so
                    the box width is fixed to the LONGEST tagline and never grows or
                    shrinks as the visible line rotates. Rendered through RotatingText
                    too, so each ghost's width matches the animated line exactly. */}
                <span aria-hidden="true" className="pointer-events-none invisible col-start-1 row-start-1 grid">
                  {data.taglines.map((t) => (
                    <span key={t} className="col-start-1 row-start-1">
                      <RotatingText
                        texts={[t]}
                        auto={false}
                        splitBy="characters"
                        mainClassName="font-sans text-[clamp(14px,4vw,20px)] whitespace-nowrap font-bold normal-case tracking-normal text-white"
                      />
                    </span>
                  ))}
                </span>
                <span className="col-start-1 row-start-1 flex items-center">
                  <RotatingText
                    texts={data.taglines}
                    rotationInterval={3000}
                    staggerDuration={0.01}
                    staggerFrom="last"
                    splitBy="characters"
                    animatePresenceMode="popLayout"
                    mainClassName="font-sans text-[clamp(14px,4vw,20px)] whitespace-nowrap font-bold normal-case tracking-normal text-white"
                    elementLevelClassName="will-change-transform"
                  />
                </span>
              </Reveal>
              <Reveal as="p" delay={250} className="mt-6 max-w-xl text-[15px] leading-relaxed text-phsInk/70 sm:text-base">
                {data.heroSubtitle}
              </Reveal>

              <Reveal delay={350} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href={`tel:${PHONE_TEL}`}
                  className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                  <PhoneIcon className="h-5 w-5" /> Call {PHONE_DISPLAY}
                </a>
                <img src="/google-5star-ribbon.webp" alt="Google 5-Star Rated" width="1200" height="223"
                  decoding="async" className="h-auto w-[240px] max-w-full select-none sm:w-[260px]" />
              </Reveal>

              <Reveal delay={450} className="mt-7 flex flex-wrap gap-2.5">
                {data.trustChips.map((chip) => (
                  <span key={chip} className="inline-flex items-center gap-2 rounded-none border border-phsInk/15 bg-white px-3.5 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-phsInk/80 shadow-sm">
                    <span className="text-phsOrange [&_svg]:h-3.5 [&_svg]:w-3.5">{ICONS.shield}</span>{chip}
                  </span>
                ))}
              </Reveal>

              {/* Mobile-only Form Container */}
              <div id="quote-form" className="block lg:hidden scroll-mt-24 mx-auto mt-12 mb-10 w-[90%] max-w-[445px] relative drop-shadow-2xl text-phsInk">
                {/* Background Shield */}
                <img 
                  src="/shield.svg" 
                  alt="Shield Background" 
                  className="w-full h-auto relative z-0" 
                />
                {/* Shield Border Overlay */}
                <img 
                  src="/shield border.svg" 
                  alt="" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[127.7%] max-w-none pointer-events-none z-20" 
                />
                {/* Form Content */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-start px-[6%] pt-[14%]">
                  <div ref={mobileShieldFormRef} className="w-full flex justify-center">
                    <div
                      className="origin-top"
                      style={{
                        width: `${FORM_DESIGN_WIDTH}px`,
                        transform: `scale(${mobileFormScale})`,
                      }}
                    >
                      <BookingForm
                        serviceOptions={data.serviceOptions}
                        section={`Landing Hero (Mobile) — ${data.serviceName}`}
                        mobile
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column knight holding the shield with form overlaid (Desktop only) */}
            <Reveal variant="scale" delay={300} className="relative w-full max-w-[625px] lg:-translate-y-[90px] lg:-translate-x-[30px] lg:justify-self-end lg:-mt-8 lg:-ml-12 mt-4 lg:mt-0 hidden lg:block">
              <div className="relative lg:scale-[0.96] lg:origin-top">
                {/* Elemental aura behind the knight */}
                <div className="phs-fire-glow pointer-events-none absolute left-1/2 top-[16%] z-0 h-[60%] w-[72%] -translate-x-1/2 rounded-full bg-[#f3741b] blur-[70px]" />
                <div className="phs-water-glow pointer-events-none absolute left-1/2 top-[48%] z-0 h-[40%] w-[82%] -translate-x-1/2 rounded-full bg-[#38bdf8] blur-[70px]" />

                <img
                  src="/soldier-form.svg"
                  alt="Armored knight holding a shield"
                  width="637"
                  height="987"
                  className="w-full h-auto select-none pointer-events-none relative z-10"
                />
                {/* Form overlaid on the shield face */}
                <div
                  ref={shieldFormRef}
                  className="absolute z-20 text-phsInk"
                  style={{ top: '25%', left: 'calc(34% + 14px)', width: '53%' }}
                >
                  <div
                    style={{
                      width: `${FORM_DESIGN_WIDTH}px`,
                      transform: `scale(${formScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <BookingForm
                      serviceOptions={data.serviceOptions}
                      section={`Landing Hero (Desktop) — ${data.serviceName}`}
                      mobile
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {!data.coupons && <MarqueeBanner />}

      {/* ============================ Services =========================== */}
      <section className="relative bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">What We Do</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              {data.servicesHeading}
            </Reveal>
            <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500">{data.servicesIntro}</Reveal>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {data.services.map((svc, i) => (
              <Reveal key={svc.title} variant="up" delay={(i % 4) * 100} className="h-full">
                <a href={svc.href} className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-6 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.32)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-phsOrange/20 bg-phsOrange/10 text-phsOrange transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-phsOrange group-hover:text-white [&_svg]:h-7 [&_svg]:w-7">
                    {ICONS[svc.icon] ?? ICONS.wrench}
                  </div>
                  <h3 className="font-display text-base font-bold tracking-wide text-phsNavy transition-colors group-hover:text-phsOrange sm:text-lg">{svc.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500">{svc.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange">
                    Learn More <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= Why Us =========================== */}
      <section className="relative overflow-hidden bg-[#29ABE2] py-14 text-white lg:py-24">
        <StrandsBg opacity={0.35} />
        <div className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-white sm:text-sm">Why Homeowners Choose Us</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              The Best in the Trade
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.reasons.map((r, i) => (
              <Reveal key={r.title} variant="up" delay={(i % 4) * 100} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:bg-white/10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-phsOrange/15 text-phsOrange [&_svg]:h-7 [&_svg]:w-7">
                    {ICONS[r.icon] ?? ICONS.shield}
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-wide">{r.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/70">{r.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ Badges ============================ */}
      {/* Same badge sizes and breakout layout as the homepage (WhyChoose.jsx). */}
      <section className="relative overflow-hidden bg-white py-12 lg:py-16">
        <div className="relative left-1/2 w-[min(100vw,1500px)] -translate-x-1/2">
          <Reveal variant="scale" className="flex items-end justify-center gap-[36px] sm:gap-[68px] lg:gap-[84px] px-6 lg:px-10 flex-wrap sm:flex-nowrap">
            <img src="/Group 12.webp" alt="Angi Super Service Award" width="520" height="965" loading="lazy" decoding="async" className="h-[clamp(100px,35vw,208px)] sm:h-[320px] lg:h-[440px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
            <img src="/Group 13.webp" alt="35+ Years of Experience" width="520" height="973" loading="lazy" decoding="async" className="h-[clamp(120px,42vw,250px)] sm:h-[384px] lg:h-[528px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
            <img src="/Group 14.webp" alt="BBB Accredited Business" width="520" height="963" loading="lazy" decoding="async" className="h-[clamp(100px,35vw,208px)] sm:h-[320px] lg:h-[440px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
          </Reveal>
        </div>
      </section>

      {/* ============================= Team ============================= */}
      <section className="bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <p className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Meet The Team</p>
            <h2 className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">{data.team.heading}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-gray-500 sm:text-base">{data.team.body}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {data.team.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-phsOrange/10 text-phsOrange [&_svg]:h-4 [&_svg]:w-4"><CheckIcon /></span>
                  <span className="text-[15px] leading-relaxed text-phsNavy">{p}</span>
                </li>
              ))}
            </ul>
            <a href="/about-us" className="cta-diag cta-diag-orange group mt-8 inline-flex items-center gap-2.5 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
              Read More <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>

          <Reveal variant="right" delay={150} className="relative">
            <div className="relative mx-auto w-full max-w-md bg-white p-3 shadow-2xl">
              <span className="absolute top-0 left-0 z-10 h-8 w-8 border-t-4 border-l-4 border-phsOrange" />
              <span className="absolute top-0 right-0 z-10 h-8 w-8 border-t-4 border-r-4 border-phsOrange" />
              <span className="absolute bottom-0 left-0 z-10 h-8 w-8 border-b-4 border-l-4 border-phsOrange" />
              <span className="absolute bottom-0 right-0 z-10 h-8 w-8 border-b-4 border-r-4 border-phsOrange" />
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={data.team.image} alt={data.team.imageAlt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 z-20 rounded-xl border border-phsOrange/20 bg-white px-5 py-3 shadow-xl">
              <p className="font-display text-2xl font-black leading-none text-phsOrange">35+ Yrs</p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-phsNavy">Trusted in Northern Utah</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================== Reviews =========================== */}
      {/* Same live Google reviews block as the home page — the component
          renders its own "REVIEWS · REAL HOMEOWNERS" heading. */}
      <section className="bg-[#fbf7f0] pb-14 pt-2 lg:pb-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <GoogleReviews />
        </div>
      </section>

      {/* ========================= Service area ======================== */}
      <section className="relative overflow-hidden bg-[#29ABE2] py-14 text-white lg:py-24">
        <StrandsBg opacity={0.3} />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-start gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Service Area</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Proudly Serving Northern Utah
            </Reveal>
            <Reveal as="p" delay={150} className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
              From our Layton home base we cover Davis, Weber, and Box Elder counties. Check your ZIP or tap your city below.
            </Reveal>

            <Reveal delay={200} className="mt-7"><ZipChecker /></Reveal>

            {/* City list — links to local landing pages for SEO */}
            <Reveal delay={250} className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SERVICE_AREAS.map((city) => (
                <a key={city} href={areaHref(city)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-[11px] font-bold tracking-[0.1em] text-white/85 transition-all hover:border-phsOrange/40 hover:bg-white/10 hover:text-white">
                  <span className="text-phsOrange [&_svg]:h-3.5 [&_svg]:w-3.5">{ICONS.shield}</span>{city}
                </a>
              ))}
            </Reveal>

            {/* Visible NAP */}
            <Reveal delay={300} className="mt-8 space-y-2 border-t border-white/10 pt-6 text-sm text-white/80">
              <p className="font-bold text-white"><span className="font-bold text-white">Address:</span> {FULL_ADDRESS}</p>
              <p className="font-bold text-white"><span className="font-bold text-white">Phone:</span> <a href={`tel:${PHONE_TEL}`} className="font-bold text-white hover:underline">{PHONE_DISPLAY}</a></p>
              <p><span className="font-bold text-white">Email:</span> <a href={`mailto:${BUSINESS.email}`} className="text-phsOrange hover:underline">{BUSINESS.email}</a></p>
            </Reveal>
          </div>

          {/* Map */}
          <Reveal variant="right" delay={150} className="relative">
            <div className="overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
              <iframe
                title="Preventive Home Solutions service area — Northern Utah"
                src="https://www.google.com/maps?q=Layton,+UT&z=10&output=embed"
                className="h-[360px] w-full border-0 lg:h-[520px]"
                style={{ filter: 'grayscale(0.15) contrast(1.02) brightness(1.02)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>



      {/* =========================== FAQ =============================== */}
      <section className="bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-[850px] px-6">
          <div className="mb-10 text-center">
            <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">FAQs</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.1] tracking-tight text-phsInk sm:text-4xl">
              {data.serviceNoun} Questions, Answered
            </Reveal>
          </div>
          <div className="space-y-4">
            {data.faqs.map((item, i) => {
              const open = openFaq === i
              return (
                <Reveal key={item.q} delay={i * 60}>
                  <div className={`overflow-hidden rounded-xl border transition-all duration-300 ${open ? 'border-phsOrange bg-white shadow-md' : 'border-gray-200 bg-white/70 shadow-sm hover:bg-white'}`}>
                    <button type="button" onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}
                      className="flex w-full items-center justify-between px-6 py-5 text-left outline-none">
                      <span className="font-sans text-[15px] font-extrabold text-phsInk sm:text-base">{item.q}</span>
                      <svg className={`ml-4 h-4 w-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-phsOrange' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="px-6 pb-5 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">{item.a}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================= Related ============================= */}
      {data.related?.length > 0 && (
        <section className="bg-[#FAF8F5] py-14 lg:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Explore More</Reveal>
              <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">Related Services</Reveal>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.related.map((svc, i) => (
                <Reveal key={svc.href + svc.label} variant="up" delay={(i % 4) * 100} className="h-full">
                  <a href={svc.href} className="group flex h-full flex-col justify-between rounded-2xl border border-[#e6ded4] bg-white p-6 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.32)]">
                    <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy transition-colors group-hover:text-phsOrange">{svc.label}</h3>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange">
                      Learn More <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      </main>
      <Footer />
      {data.coupons && <StickyCouponBar coupons={data.coupons} />}
    </div>
  )
}
