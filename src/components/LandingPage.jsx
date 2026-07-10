import { useState, useRef, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import Process from './Process.jsx'
import GoogleReviews from './GoogleReviews.jsx'
import RotatingText from './RotatingText.jsx'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'
import { useSeo } from '../lib/seo.js'
import { BUSINESS, FULL_ADDRESS, buildLandingSchema } from '../data/business.js'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS, areaHref } from '../data/nav.js'
import { BLOG_POSTS } from '../data/blog.js'

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

/* ------------------------------ Lead form ------------------------------- */
/**
 * Conversion lead-capture form used twice per page.
 * variant "hero" → Residential/Commercial tabs + ZIP + SMS consent + terms.
 * variant "cta"  → compact contact card (name/email/phone/service).
 */
function LandingLeadForm({ serviceNoun, serviceOptions, section, variant = 'hero' }) {
  const isHero = variant === 'hero'
  const [propertyType, setPropertyType] = useState('Residential')
  const [service, setService] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!service) { setError('Please choose a service.'); return }
    if (recaptchaConfigured && !recaptchaToken) { setError('Please confirm you’re not a robot.'); return }
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.target)
    try {
      await submitLead(
        {
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email') || '',
          zip: fd.get('zip') || '',
          propertyType: isHero ? propertyType : undefined,
          service,
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

  const field =
    'w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-[15px] text-phsInk placeholder-gray-400 outline-none transition-all duration-200 focus:border-phsOrange focus:ring-2 focus:ring-phsOrange/20 focus:bg-white'

  if (submitted) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-phsOrange/10 text-phsOrange [&_svg]:h-7 [&_svg]:w-7">
          <CheckIcon />
        </div>
        <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-phsInk">Request Received</h3>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          Our team will reach out shortly. For urgent needs, call{' '}
          <a href={`tel:${PHONE_TEL}`} className="font-bold text-phsOrange">{PHONE_DISPLAY}</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl sm:p-7">
      <div className="mb-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-phsOrange">
          {isHero ? 'Free Estimate' : 'Contact Us'}
        </p>
        <h3 className="mt-1 font-display text-xl font-black tracking-tight text-phsInk sm:text-2xl">
          {isHero ? 'Send Your Request' : 'Get In Touch Today'}
        </h3>
      </div>

      {/* Residential / Commercial tabs (hero only) */}
      {isHero && (
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
          {['Residential', 'Commercial'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPropertyType(t)}
              className={`rounded-lg py-2.5 font-sans text-sm font-bold tracking-wide transition-all ${
                propertyType === t ? 'bg-phsOrange text-white shadow-sm' : 'text-phsInk/60 hover:text-phsInk'
              }`}
              aria-pressed={propertyType === t}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3.5">
        <input className={field} type="text" name="name" placeholder="Your name" required />
        <div className={isHero ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2' : 'space-y-3.5'}>
          <input className={field} type="tel" name="phone" placeholder="Phone number" required />
          <input className={field} type="email" name="email" placeholder="Email address" required />
        </div>

        <div className={isHero ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2' : ''}>
          {isHero && <input className={field} type="text" name="zip" placeholder="ZIP code" inputMode="numeric" required />}

          {/* Service dropdown (custom, backed by a readonly input for validation) */}
          <div className="relative">
            <button type="button" onClick={() => setDropdownOpen((v) => !v)} className={`${field} flex items-center justify-between text-left`}>
              <span className={`block truncate ${service ? 'text-phsInk' : 'text-gray-400'}`}>{service || 'Service needed'}</span>
              <svg className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input type="text" name="service" value={service} required readOnly aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 opacity-0" />
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                  {serviceOptions.map((s) => (
                    <button key={s} type="button" onClick={() => { setService(s); setDropdownOpen(false) }}
                      className="block w-full border-b border-gray-50 px-4 py-3 text-left text-[14px] font-medium text-phsInk outline-none transition-colors last:border-0 hover:bg-phsOrange/10 hover:text-phsOrange">
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* SMS opt-in (hero only) */}
        {isHero && (
          <label className="flex items-start gap-2.5 px-0.5 text-left">
            <input type="checkbox" name="sms_consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-phsOrange" />
            <span className="text-[11.5px] leading-snug text-gray-500">
              I agree to receive text messages from {BUSINESS.name} about my request. Msg &amp; data rates may apply.
            </span>
          </label>
        )}

        <Recaptcha ref={recaptchaRef} onChange={setRecaptchaToken} className="flex justify-center pt-1" />

        {error && <p className="text-center text-sm font-bold text-red-500">{error}</p>}

        <button type="submit" disabled={submitting}
          className="cta-diag cta-diag-orange w-full rounded-xl bg-phsOrange px-6 py-4 font-bold tracking-wider text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70">
          {submitting ? 'Sending…' : isHero ? 'Send Request' : 'Contact Us Today'}
        </button>

        {isHero && (
          <p className="text-center text-[11px] leading-snug text-gray-400">
            By submitting you agree to our <a href="#" className="underline hover:text-phsOrange">Terms</a> &amp;{' '}
            <a href="#" className="underline hover:text-phsOrange">Privacy Policy</a>.
          </p>
        )}
      </div>
    </form>
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

  // Three most-relevant blog teasers: prefer posts matching this trade.
  const trade = data.serviceType.toLowerCase()
  const blogPosts = (() => {
    const match = BLOG_POSTS.filter((p) =>
      trade.includes('plumb') ? p.category === 'PLUMBING' || p.category === 'DRAIN & SEWER'
        : trade.includes('heat') ? p.category === 'HVAC'
        : p.category === 'HVAC' || p.category === 'AIR QUALITY'
    )
    return (match.length >= 3 ? match : [...match, ...BLOG_POSTS]).slice(0, 3)
  })()

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>

      {/* ============================== Hero ============================== */}
      <section className="relative overflow-hidden bg-phsNavy text-white">
        <img src={data.heroImage} alt={data.heroImageAlt} className="absolute inset-0 z-0 h-full w-full object-cover" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-phsNavy/95 via-phsNavy/88 to-phsNavy/70" />
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-10 lg:pt-14">
          {/* Breadcrumb */}
          <Reveal as="nav" className="mb-6 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 sm:text-xs">
            <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
            <span>/</span>
            <span className="text-phsOrange">{data.breadcrumbLabel.toUpperCase()}</span>
          </Reveal>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left copy */}
            <div>
              <Reveal as="p" className="font-mono text-xs font-bold tracking-[0.28em] text-phsOrange drop-shadow">
                {data.eyebrow.toUpperCase()}
              </Reveal>
              <Reveal as="h1" delay={100} className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
                {data.heroStatic}
              </Reveal>
              <Reveal delay={150} className="mt-4 inline-flex max-w-full items-center overflow-hidden rounded-xl bg-phsOrange px-4 py-2.5 shadow-sm">
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
              </Reveal>
              <Reveal as="p" delay={250} className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
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
                  <span key={chip} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    <span className="text-phsOrange [&_svg]:h-3.5 [&_svg]:w-3.5">{ICONS.shield}</span>{chip}
                  </span>
                ))}
              </Reveal>
            </div>

            {/* Right mascot / technician */}
            <Reveal variant="scale" delay={250} className="relative hidden justify-center lg:flex">
              <img src={data.mascotImage} alt="" aria-hidden="true" className="w-full max-w-[420px] object-contain drop-shadow-2xl" />
            </Reveal>
          </div>

          {/* Lead-capture form band, flush at the bottom of the hero */}
          <div className="relative z-10 mt-10 grid gap-6 pb-12 lg:mt-14 lg:grid-cols-[1fr_320px] lg:pb-16">
            <LandingLeadForm
              serviceNoun={data.serviceNoun}
              serviceOptions={data.serviceOptions}
              section={`Landing Hero — ${data.serviceName}`}
              variant="hero"
            />
            {/* Promo column */}
            <div className="flex flex-col justify-center gap-5 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <ul className="space-y-3.5">
                {data.trustChips.map((chip) => (
                  <li key={chip} className="flex items-center gap-3 font-sans text-[15px] font-semibold text-white">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-phsOrange/15 text-phsOrange [&_svg]:h-4 [&_svg]:w-4">{ICONS.shield}</span>
                    {chip}
                  </li>
                ))}
              </ul>
              <a href={`tel:${PHONE_TEL}`}
                className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-2.5 rounded-md bg-phsOrange px-5 py-3.5 font-bold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                <PhoneIcon className="h-5 w-5" /> {PHONE_DISPLAY}
              </a>
              <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                Family-Owned · Since {BUSINESS.since}
              </p>
            </div>
          </div>
        </div>
      </section>

      <MarqueeBanner />

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
      <section className="relative overflow-hidden bg-phsNavy py-14 text-white lg:py-24">
        <StrandsBg opacity={0.35} />
        <div className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Why Homeowners Choose Us</Reveal>
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
      <section className="relative overflow-hidden bg-white py-12 lg:py-16">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-center gap-8 px-6 sm:gap-16">
          <img src="/Group 12.webp" alt="Angi Super Service Award" width="520" height="965" loading="lazy" decoding="async" className="h-[clamp(90px,22vw,150px)] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
          <img src="/Group 13.webp" alt="35+ Years of Experience" width="520" height="973" loading="lazy" decoding="async" className="h-[clamp(110px,26vw,180px)] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
          <img src="/Group 14.webp" alt="BBB Accredited Business" width="520" height="963" loading="lazy" decoding="async" className="h-[clamp(90px,22vw,150px)] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5" />
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
            <div className="absolute -bottom-5 -left-3 rounded-xl border border-phsOrange/20 bg-white px-5 py-3 shadow-xl">
              <p className="font-display text-2xl font-black leading-none text-phsOrange">35+ Yrs</p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-phsNavy">Trusted in Northern Utah</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================== Reviews =========================== */}
      <section className="bg-[#fbf7f0] py-14 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Reviews</Reveal>
          <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
            What Our Customers Are Saying
          </Reveal>
        </div>
        <GoogleReviews />
      </section>

      {/* ========================== CTA banner ========================= */}
      <section className="relative overflow-hidden bg-phsNavy py-14 text-white lg:py-24">
        <img src={data.heroImage} alt="" aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-phsNavy via-phsNavy/90 to-phsNavy/70" />
        <div className="pointer-events-none absolute -top-24 -left-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <p className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Ready When You Are</p>
            <h2 className="font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Book Your {data.serviceNoun} Service Today
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/80 sm:text-base">
              Same-day appointments, upfront pricing, and 24/7 emergency response across Northern Utah. Call now or send a request and we’ll get right back to you.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={`tel:${PHONE_TEL}`} className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                <PhoneIcon className="h-5 w-5" /> Call {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center justify-center gap-3 rounded-md border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20">
                Email Us
              </a>
            </div>
          </Reveal>
          <Reveal variant="right" delay={150}>
            <LandingLeadForm
              serviceNoun={data.serviceNoun}
              serviceOptions={data.serviceOptions}
              section={`Landing CTA — ${data.serviceName}`}
              variant="cta"
            />
          </Reveal>
        </div>
      </section>

      {/* ========================= Service area ======================== */}
      <section className="relative overflow-hidden bg-phsNavy py-14 text-white lg:py-24">
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
              <p><span className="font-bold text-white">Address:</span> {FULL_ADDRESS}</p>
              <p><span className="font-bold text-white">Phone:</span> <a href={`tel:${PHONE_TEL}`} className="text-phsOrange hover:underline">{PHONE_DISPLAY}</a></p>
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

      {/* ============= How it works (shared Process on sky band) ======= */}
      <div className="relative overflow-hidden bg-phsSky">
        <StrandsBg opacity={0.5} />
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 pt-12 lg:pt-24"><Process /></div>
      </div>

      {/* ============================ Blog ============================= */}
      <section className="bg-[#fbf7f0] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 text-center">
            <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Field Notes</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsInk sm:text-4xl">
              {data.serviceNoun} Know-How
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} as="article" variant="up" delay={i * 130}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <a href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img src={post.image} alt={post.title} width="800" height="500" loading="lazy" decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 z-10 rounded bg-phsOrange px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-white shadow-sm">{post.category}</span>
                </a>
                <div className="flex flex-1 flex-col p-6">
                  <a href={`/blog/${post.slug}`}>
                    <h3 className="mb-3 font-display text-[16px] font-bold leading-snug text-phsInk transition-colors group-hover:text-phsOrange sm:text-[17px]">{post.title}</h3>
                  </a>
                  <p className="mb-6 flex-1 text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">{post.excerpt}</p>
                  <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-phsOrange hover:text-phsOrangeDark">
                    Read <ArrowIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <a href="/blog" className="cta-diag cta-diag-orange group inline-flex items-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
              View Blogs <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
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
    </div>
  )
}
