import { useState } from 'react'
import Reveal from './Reveal.jsx'
import RotatingText from './RotatingText.jsx'

// The static heading reads "Heavy Duty Home Service"; the box rotates the specifics.
const BOX_PHRASES = [
  'Plumbing Repairs → Fixed Right, First Time',
  'HVAC Service → Built for Utah Winters',
  'Drain Clearing → No Clog Too Tough',
]

const PHONE_DISPLAY = '(385) 453-9428'
const PHONE_TEL = '3854539428'

const SERVICES = ['Plumbing', 'Heating', 'Cooling', 'Maintenance', 'Other']

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

/** Compact booking form used in the hero spec card. */
function BookingForm() {
  const [submitted, setSubmitted] = useState(false)

  const fieldClass =
    'w-full rounded-md border border-phsInk/15 bg-white/70 px-4 py-3 text-sm text-phsInk placeholder:text-phsInk/40 outline-none transition-colors focus:border-phsInk focus:bg-white'
  const labelClass =
    'mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-phsInk/55'

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
        <h3 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight text-phsInk">
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
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-phsOrange">
        Request Service
      </p>
      <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-phsInk">
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
          <div>
            <label htmlFor="bf-service" className={labelClass}>Service</label>
            <select id="bf-service" name="service" className={`${fieldClass} appearance-none`} defaultValue="">
              <option value="" disabled>Select…</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="bf-email" className={labelClass}>Email</label>
          <input id="bf-email" name="email" type="email" placeholder="jane@email.com" className={fieldClass} />
        </div>

        <div>
          <label htmlFor="bf-message" className={labelClass}>How can we help?</label>
          <textarea id="bf-message" name="message" rows={3} placeholder="Briefly describe the issue…" className={`${fieldClass} resize-none`} />
        </div>

        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-phsOrange px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-md active:translate-y-0"
        >
          Schedule Inspection
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-phsCream">
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
        {/* Left column */}
        <div>
          <Reveal
            as="p"
            delay={100}
            className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-phsOrange"
          >
            Established Defense — Northern Utah
          </Reveal>

          <Reveal
            as="h1"
            delay={200}
            className="mt-6 font-display font-extrabold uppercase leading-[1.0] tracking-tight text-phsInk"
          >
            {/* Two static lines */}
            <span className="block whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl">Heavy Duty</span>
            <span className="block whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl">Home Service</span>
            {/* Third line: animated box, single line */}
            <span className="rotate-oneline mt-4 flex w-fit max-w-full items-center overflow-hidden rounded-xl bg-phsOrange px-4 py-2.5 shadow-sm">
              <RotatingText
                texts={BOX_PHRASES}
                rotationInterval={3200}
                staggerDuration={0.01}
                staggerFrom="last"
                splitBy="characters"
                mainClassName="text-base font-bold normal-case tracking-normal text-white sm:text-lg lg:text-xl"
                elementLevelClassName="will-change-transform"
              />
            </span>
          </Reveal>

          <Reveal
            as="p"
            delay={350}
            className="mt-8 max-w-md text-lg leading-relaxed text-phsInk/60"
          >
            Mechanical systems engineered for endurance. We defend your home from
            the elements with technical precision and warrior-grade reliability.
          </Reveal>

          <Reveal delay={500} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#scheduling"
              className="group inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-lg active:translate-y-0"
            >
              Schedule Inspection
              <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-3 rounded-md border border-phsInk/25 bg-phsCream/60 px-7 py-4 font-semibold text-phsInk transition-all duration-300 hover:border-phsInk hover:bg-phsInk/5"
            >
              <PhoneIcon className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
          </Reveal>

          <Reveal delay={650} className="mt-12 flex flex-wrap items-center gap-3">
            <GoogleLogo className="h-6 w-auto" />
            <div className="flex text-lg text-yellow-400 drop-shadow-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-phsInk/70">
              Rated · 200+ Reviews
            </span>
          </Reveal>
        </div>

        {/* Right column — booking form card */}
        <Reveal variant="scale" delay={300} className="lg:justify-self-end">
          <div className="w-full max-w-[460px] rounded-2xl border border-phsInk/10 bg-[#fbf6ec] p-6 shadow-[0_30px_60px_-25px_rgba(22,38,61,0.4)] sm:p-7">
            <BookingForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
