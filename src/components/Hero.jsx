import { useState, useEffect, useRef } from 'react'
import Reveal from './Reveal.jsx'
import RotatingText from './RotatingText.jsx'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'

// The static heading reads "Heavy Duty Home Service"; the box rotates the specifics.
const BOX_PHRASES = [
  'Plumbing Repairs → Fixed Right, First Time',
  'HVAC Service → Built for Utah Winters',
  'Drain Clearing → No Clog Too Tough',
]

const PHONE_DISPLAY = '(385) 453-9428'
const PHONE_TEL = '3854539428'

const SERVICES = ['Plumbing', 'Heating', 'Cooling', 'Maintenance', 'Other']

// Mirrors the "Why Choose" benefits, surfaced as quick bullets under the rating.
const WHY_CHOOSE_POINTS = [
  { text: 'Family-Owned & Local', icon: '/Group 18.svg' },
  { text: 'Fast & Reliable Response', icon: '/Group 19.svg', iconClass: '-translate-x-[3px]' },
  { text: 'Preventive Home Protection', icon: '/Group 20.svg' },
]

function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Official multi-color Google wordmark. */
function GoogleLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 272 92" className={className} role="img" aria-label="Google">
      <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
      <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
      <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
      <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.13l-.01.07zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
      <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
    </svg>
  )
}


/** Compact booking form used in the hero spec card.
 *  On mobile (`mobile` prop) the Email field is omitted so the four core
 *  fields name, phone, service, message fit the shield without cropping. */
function BookingForm({ mobile = false }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [service, setService] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // The service field is a custom dropdown backed by a readonly input, which
    // browsers skip during native validation, so enforce the choice here.
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
        { section: 'Hero — Book Your Inspection', recaptchaToken }
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
          Our team will reach out shortly to confirm your inspection. For
          urgent needs, call {PHONE_DISPLAY}.
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

      <div className="mt-6 space-y-4">
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
            <input type="text" name="service" value={service} required className="absolute bottom-0 left-1/2 w-0 h-0 opacity-0 pointer-events-none" readOnly />
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-phsSky/15 bg-white shadow-xl">
                  {SERVICES.map((s) => (
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
          <textarea id="bf-message" name="message" rows={3} placeholder="Briefly describe the issue…" className={`${fieldClass} resize-none mx-auto block !w-[calc(100%-32px)]`} />
        </div>

        {/* Captcha scaled down so it tucks into the shield's tapering lower
            half. The scaled box keeps its full 78px layout height, so pull the
            following content up to close the visual gap. */}
        <Recaptcha
          ref={recaptchaRef}
          onChange={setRecaptchaToken}
          className="-mb-6 flex origin-top justify-center [transform:scale(0.68)]"
        />

        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="cta-diag cta-diag-orange group mx-auto flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md bg-phsOrange px-6 py-2.5 font-sans text-[14px] font-bold tracking-[0.12em] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending...' : 'Book Now'}
          {!submitting && <ArrowIcon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  )
}

// Width (px) the booking form is designed at. The form is scaled uniformly so
// that this design width maps onto the shield region, keeping all of its
// content proportional to the shield as the screen resizes.
const FORM_DESIGN_WIDTH = 360

export default function Hero() {
  // Scale the shield form to match the shield's current rendered size.
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
    <section id="hero" className="relative w-full overflow-hidden bg-phsCream">
      <div className="relative mx-auto grid max-w-[1500px] items-start gap-8 px-[clamp(16px,5vw,20px)] sm:px-5 py-[clamp(24px,8vw,32px)] sm:py-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
        {/* Left column */}
        <div className="-mt-5 lg:mt-0">
          <Reveal
            as="p"
            delay={100}
            className="font-mono text-xs font-bold tracking-[0.28em] text-phsOrange"
          >
            TRUSTED HOME CARE · NORTHERN UTAH
          </Reveal>

          <Reveal
            as="h1"
            delay={200}
            className="mt-6 font-display font-black leading-[1.0] tracking-tight text-phsInk"
          >
            {/* Two static lines */}
            <span className="block font-display text-[clamp(1.75rem,8vw,2.25rem)] sm:text-5xl lg:text-6xl">Welcome to Your</span>
            <span className="block font-display text-[clamp(1.75rem,8vw,2.25rem)] sm:text-5xl lg:text-6xl mt-1.5">Comfort Sanctuary</span>
            {/* Third line: animated box, single line. Fixed width, so no layout
                animation is needed — a plain span keeps `motion` off this page. */}
            <span
              className="rotate-oneline mt-5 flex w-[320px] sm:w-[450px] lg:w-[480px] max-w-full items-center justify-center sm:justify-start overflow-hidden rounded-xl bg-phsOrange px-4 py-2.5 shadow-sm"
            >
              <RotatingText
                texts={BOX_PHRASES}
                rotationInterval={3200}
                staggerDuration={0.01}
                staggerFrom="last"
                splitBy="characters"
                animatePresenceMode="popLayout"
                mainClassName="font-sans text-[clamp(11px,3.2vw,14px)] whitespace-nowrap font-bold normal-case tracking-normal text-white sm:text-lg lg:text-xl"
                elementLevelClassName="will-change-transform"
              />
            </span>
          </Reveal>

          <Reveal
            as="p"
            delay={350}
            className="mt-8 max-w-md text-[clamp(15px,4.5vw,18px)] sm:text-lg leading-relaxed text-phsInk/70 font-sans"
          >
            <span className="lg:hidden">
              Trusted plumbing, heating, and cooling that keeps your Northern Utah home cozy all year.
            </span>
            <span className="hidden lg:inline">
              Northern Utah's premier shield for plumbing, heating, and cooling.
              We keep your family cozy, your pipes clear, and your home running beautifully through every season.
            </span>
          </Reveal>

          <Reveal delay={500} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#scheduling"
              className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              Schedule Inspection
              <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="cta-diag cta-diag-white inline-flex items-center justify-center gap-3 rounded-md border border-phsSky/25 bg-white px-7 py-4 font-semibold text-phsInk shadow-sm hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <PhoneIcon className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
          </Reveal>

          <div className="relative mt-2 lg:mt-3 w-fit animate-ribbon-in -ml-[5px] lg:ml-0">
            {/* Flag ribbon behind the rating bleeds to the left edge of the
                screen and ends just past the text. Absolute so it never affects
                the rating's own layout. */}
            <div
              className="pointer-events-none absolute inset-y-0 -right-2.5 lg:right-0 -left-12 lg:-translate-x-[70px] lg:origin-left lg:scale-x-[1.38] lg:scale-y-[1.15] lg:left-[calc(-1*max(2.5rem,calc((100vw_-_1500px)/2_+_2.5rem)))]"
              style={{
                backgroundImage: 'url("/flag for google rating.svg")',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className="relative z-10 inline-flex items-center gap-2 sm:gap-2.5 py-7 pl-6 pr-16 -translate-x-[33px] lg:-translate-x-[65px] lg:py-14 lg:pl-10">
              <GoogleLogo className="h-6 sm:h-7 w-auto shrink-0" />
              <div className="flex text-lg sm:text-xl text-yellow-400 drop-shadow-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="font-display text-xs sm:text-sm font-bold tracking-wider text-phsInk shrink-0 translate-y-[1px]">
                5-Star Rated
              </span>
            </div>
          </div>

          {/* Why-choose highlights, directly under the Google rating */}
          <Reveal delay={650} className="mt-5 lg:mt-9">
            <ul className="flex flex-col gap-3.5">
              {WHY_CHOOSE_POINTS.map((point) => (
                <li
                  key={point.text}
                  className="flex items-center gap-3 font-sans text-[clamp(16.8px,5.04vw,19.2px)] font-semibold text-phsInk"
                >
                  <img
                    src={point.icon}
                    alt=""
                    aria-hidden="true"
                    className={`h-[1.8rem] w-[1.8rem] shrink-0 object-contain ${point.iconClass || ''}`}
                  />
                  {point.text}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Mobile-only Form Container */}
          <div id="quote-form" className="block lg:hidden scroll-mt-24 mx-auto mt-12 mb-10 w-[90%] max-w-[445px] relative drop-shadow-2xl">
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
            {/* Form Content positioned inside the shield bounds. Horizontal
                padding is kept small so the fields reach toward the shield's
                inner edges; the form is scaled uniformly off the available
                width so it stays proportional as the screen resizes. */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-start px-[6%] pt-[14%]">
              <div ref={mobileShieldFormRef} className="w-full flex justify-center">
                <div
                  className="origin-top"
                  style={{
                    width: `${FORM_DESIGN_WIDTH}px`,
                    transform: `scale(${mobileFormScale})`,
                  }}
                >
                  <BookingForm mobile />
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Right column knight holding the shield, with the booking form on the shield face */}
        <Reveal variant="scale" delay={300} className="relative w-full max-w-[625px] lg:-translate-y-[90px] lg:-translate-x-[70px] lg:justify-self-end lg:-mt-8 lg:-ml-12 mt-4 lg:mt-0">

          {/* Desktop-only Knight with Form overlaid. The whole block is uniformly
              scaled, so the shield form (positioned/scaled off the knight's
              rendered width) grows proportionally with the knight. */}
          <div className="hidden lg:block relative lg:scale-[0.96] lg:origin-top">
            {/* Elemental aura behind the knight: fire-orange up top, water-blue below */}
            <div className="phs-fire-glow pointer-events-none absolute left-1/2 top-[16%] z-0 h-[60%] w-[72%] -translate-x-1/2 rounded-full bg-[#f3741b] blur-[70px]" />
            <div className="phs-water-glow pointer-events-none absolute left-1/2 top-[48%] z-0 h-[40%] w-[82%] -translate-x-1/2 rounded-full bg-[#38bdf8] blur-[70px]" />

            <img
              src="/soldier-form.svg"
              alt="Armored knight holding a shield"
              width="637"
              height="987"
              className="w-full h-auto select-none pointer-events-none relative z-10"
            />
            {/* Form overlaid on the shield face. The outer box scales its
                position/size with the shield via percentages; the inner form is
                scaled uniformly to fill it so its content stays proportional. */}
            <div
              ref={shieldFormRef}
              className="absolute z-20"
              style={{ top: '25%', left: 'calc(34% + 14px)', width: '53%' }}
            >
              <div
                style={{
                  width: `${FORM_DESIGN_WIDTH}px`,
                  transform: `scale(${formScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <BookingForm />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
