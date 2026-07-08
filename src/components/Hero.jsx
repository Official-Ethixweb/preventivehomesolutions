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
          <textarea id="bf-message" name="message" rows={mobile ? 2 : 3} placeholder="Briefly describe the issue…" className={`${fieldClass} resize-none mx-auto block !w-[calc(100%-32px)]`} />
        </div>

        {/* Captcha scaled down so it tucks into the shield's tapering lower
            half. The scaled box keeps its full 78px layout height, so pull the
            following content up to close the visual gap — but on mobile leave a
            small gap so the Book Now button sits cleanly below it. */}
        <Recaptcha
          ref={recaptchaRef}
          onChange={setRecaptchaToken}
          className={`${mobile ? '-mb-3' : '-mb-6'} flex origin-top justify-center [transform:scale(0.68)]`}
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

          <div className="mt-3 lg:mt-5 animate-ribbon-in">
            <img
              src="/google-5star-ribbon.webp"
              alt="Google 5-Star Rated"
              width="1200"
              height="223"
              decoding="async"
              className="h-auto w-[300px] sm:w-[350px] lg:w-[430px] max-w-full select-none pointer-events-none"
            />
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
