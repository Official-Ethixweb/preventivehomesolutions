import { useRef, useState } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import Strands from './Strands.jsx'
import CouponRequestForm from './CouponRequestForm.jsx'
import { useSeo } from '../lib/seo.js'
import { trackEvent } from '../lib/analytics.js'
import { localBusinessSchema, breadcrumbSchema } from '../data/business.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { COUPONS, COUPON_DISCLAIMER } from '../data/coupons.js'

/* ----------------------------- Inline icons ----------------------------- */
const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  star: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.6 5.8 21.4l1.6-7-5.4-4.7 7.1-.6z" /></svg>,
  badge: (
    <svg {...iconBase}>
      <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3z" />
      <path d="M12 8.3l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="currentColor" stroke="none" />
    </svg>
  ),
  thermometer: <svg {...iconBase}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>,
  droplet: <svg {...iconBase}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>,
  filter: <svg {...iconBase}><path d="M3 4h18l-7 8v7l-4 2v-9z" /></svg>,
  pipe: <svg {...iconBase}><path d="M3 15v3a2 2 0 0 0 2 2h3M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M21 15v3a2 2 0 0 1-2 2h-3M9 12h6" /></svg>,
  flame: <svg {...iconBase}><path d="M12 2s-4 3.5-4 8a4 4 0 0 0 8 0c0-4.5-4-8-4-8z" /><path d="M12 12c-1.5 0-2.5 1-2.5 2.5S10.5 17 12 17s2.5-1 2.5-2.5S13.5 12 12 12z" /></svg>,
}

function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function ScissorsIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6.2" cy="6.2" r="2.2" />
      <circle cx="6.2" cy="17.8" r="2.2" />
      <path d="M8.1 7.6 20 19M8.1 16.4 20 5" />
    </svg>
  )
}

/* Faux barcode: uneven repeating bars, purely decorative (not a real code). */
const BARCODE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(22,38,61,0.32) 0px, rgba(22,38,61,0.32) 2px, transparent 2px, transparent 4px, rgba(22,38,61,0.32) 4px, rgba(22,38,61,0.32) 5px, transparent 5px, transparent 8px, rgba(22,38,61,0.32) 8px, rgba(22,38,61,0.32) 10px, transparent 10px, transparent 12px, rgba(22,38,61,0.32) 12px, rgba(22,38,61,0.32) 13px, transparent 13px, transparent 16px)',
}

/** The page grid's background: the perforation "notches" are punched circles
 * of this same color so they read as cut-outs rather than orange/white dots. */
const GRID_BG = '#FAF8F5'

/** One coupon rendered as a tear-off ticket stub: an info half, a punched
 * perforation seam (dashed line + side notches, like a roll of raffle
 * tickets), and a stub half carrying the dollar value and the CTAs. */
function CouponTicket({ coupon, index, onClaim }) {
  return (
    <div className="group relative flex h-full flex-col border-2 border-dashed border-phsOrange/30 bg-white shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:border-phsOrange/60 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.28)]">
      {/* Info half */}
      <div className="flex flex-1 flex-col p-6 pb-8">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-phsOrange/10 text-phsOrange [&_svg]:h-6 [&_svg]:w-6">
          {ICONS[coupon.icon]}
        </span>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-phsOrangeDark">{coupon.category}</p>
        <h3 className="mt-1 font-display text-lg font-extrabold tracking-tight text-phsInk">{coupon.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{coupon.description}</p>
      </div>

      {/* Perforation seam, torn from the info half to the value stub */}
      <div className="relative shrink-0">
        <span aria-hidden="true" className="absolute -left-[13px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full" style={{ background: GRID_BG }} />
        <span aria-hidden="true" className="absolute -right-[13px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full" style={{ background: GRID_BG }} />
        <div className="border-t-2 border-dashed border-phsInk/15" />
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white text-phsInk/25 [&_svg]:h-3.5 [&_svg]:w-3.5">
          <ScissorsIcon />
        </span>
      </div>

      {/* Value stub */}
      <div className="flex flex-col items-center gap-4 bg-phsOrange/[0.05] px-6 pb-6 pt-7 text-center">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-phsOrangeDark">TOTAL SAVINGS</p>
          <p className="font-display text-[2.5rem] font-black leading-none tracking-tight text-phsOrangeDark">{coupon.badge}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <a
            href={`tel:${PHONE_TEL}`}
            className="cta-diag cta-diag-orange inline-flex flex-1 items-center justify-center gap-2 bg-phsOrange px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <PhoneIcon className="h-3.5 w-3.5" /> Call Now
          </a>
          <button
            type="button"
            onClick={() => onClaim(coupon)}
            className="inline-flex flex-1 items-center justify-center border border-phsOrange/50 bg-white px-4 py-2.5 text-[13px] font-bold text-phsOrangeDark transition-colors hover:border-phsOrange hover:bg-phsOrange/10"
          >
            Claim This Offer
          </button>
        </div>
        <span aria-hidden="true" className="h-5 w-full max-w-[160px]" style={BARCODE_STYLE} />
        <p className="font-mono text-[9px] tracking-[0.14em] text-gray-500">COUPON NO. PHS-{String(index + 1).padStart(3, '0')}</p>
      </div>
    </div>
  )
}

const TRUST_CHIPS = ['Same-Day Service', 'Licensed & Insured', 'Available 7 Days', 'Since 1989']

const HOW_IT_WORKS = [
  { title: 'Pick your services', desc: 'Tap every icon that applies: plumbing, heating, cooling, whatever the job needs.' },
  { title: 'Tell us the details', desc: "Add your contact info and a quick note if there's anything specific going on." },
  { title: 'We call to confirm', desc: 'A real person calls back to schedule your visit, discount already applied.' },
]

/** Seal badge for the BBB-verified "Business Started" date, a distinct fact
 * (legal entity registration) from the "35+ Years Experience / Since 1989"
 * trade-experience claim used sitewide, so it's kept as its own medallion
 * rather than folded into that copy. */
function RegisteredSeal() {
  return (
    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border-2 border-phsOrange bg-white shadow-md">
      <div className="absolute inset-[6px] rounded-full border border-dashed border-phsOrange/50" />
      <div className="relative flex flex-col items-center text-center leading-none">
        <span className="mb-1 text-phsOrange [&_svg]:h-4 [&_svg]:w-4">{ICONS.star}</span>
        <span className="font-mono text-[7.5px] font-bold tracking-[0.08em] text-phsInk">UTAH REGISTERED</span>
        <span className="font-mono text-[7.5px] font-bold tracking-[0.08em] text-phsInk">BUSINESS</span>
        <span className="mt-1 font-display text-base font-black leading-none text-phsOrangeDark">2024</span>
      </div>
    </div>
  )
}

export default function CouponsPage() {
  const formSectionRef = useRef(null)
  const [selectedCoupon, setSelectedCoupon] = useState(null)

  useSeo({
    title: 'Coupons & Specials | Preventive Home Solutions',
    description:
      `Save on plumbing, heating, cooling & water heater service in Layton, UT and Northern Utah. Military & first-responder discounts too. Call ${PHONE_DISPLAY}.`,
    path: '/coupons',
    jsonLd: [
      localBusinessSchema({ pageUrl: '/coupons' }),
      breadcrumbSchema({ label: 'Coupons', pageUrl: '/coupons' }),
    ],
  })

  function claimCoupon(coupon) {
    trackEvent('coupon_claim_click', { coupon_id: coupon.id, coupon_title: coupon.title })
    setSelectedCoupon(coupon)
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden bg-phsSky text-white">
          <div className="pointer-events-none absolute inset-0 z-0">
            <Strands
              colors={['#f97316', '#ffffff', '#3b82f6']}
              count={3} speed={0.5} amplitude={1} waviness={1} thickness={0.6}
              glow={2.6} taper={3} spread={1} hueShift={0} intensity={0.6}
              saturation={1.95} opacity={0.5} scale={2.6}
            />
          </div>
          <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1000px] px-6 py-16 text-center lg:py-24">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow sm:text-sm">
              EXCLUSIVE OFFERS
            </Reveal>
            <Reveal as="h1" delay={100} className="font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
              Coupons &amp; Specials
            </Reveal>
            <Reveal as="p" delay={200} className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-lg">
              Real savings on the plumbing, heating, and cooling work Northern Utah homeowners need most. No sign-up games, just call or claim an offer below.
            </Reveal>

            <Reveal delay={300} className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
              {TRUST_CHIPS.map((chip) => (
                <span key={chip} className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm">
                  {chip}
                </span>
              ))}
            </Reveal>

            <Reveal delay={350} className="mt-8 flex justify-center">
              <RegisteredSeal />
            </Reveal>
          </div>
        </section>

        {/* --------------------------- Coupon grid --------------------------- */}
        <section className="py-14 lg:py-20" style={{ background: GRID_BG }}>
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {COUPONS.map((c, i) => (
                <Reveal key={c.id} variant="up" delay={(i % 3) * 80} className="h-full">
                  <CouponTicket coupon={c} index={i} onClaim={claimCoupon} />
                </Reveal>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-[12.5px] leading-relaxed text-gray-500">
              {COUPON_DISCLAIMER}
            </p>
          </div>
        </section>

        {/* ------------------------------- Form ------------------------------ */}
        <section ref={formSectionRef} id="coupon-form" className="scroll-mt-24 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
              {/* Left: photo, pitch, how it works, phone callout */}
              <div>
                <Reveal variant="left" className="overflow-hidden border-2 border-phsOrange/20 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)]">
                  <img
                    src="/Van in Kaysville Call.webp"
                    alt="Preventive Home Solutions technician arriving on a Northern Utah service call"
                    loading="lazy"
                    decoding="async"
                    className="h-[280px] w-full object-cover object-[50%_38%] sm:h-[360px]"
                  />
                </Reveal>

                <Reveal as="p" delay={100} className="mb-4 mt-8 font-mono text-xs font-bold tracking-[0.25em] text-phsOrangeDark sm:text-sm">
                  Ready When You Are
                </Reveal>
                <Reveal as="h2" delay={150} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
                  Claim Your Discount
                </Reveal>
                <Reveal as="p" delay={200} className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-500">
                  Pick everything you need help with, tell us a little about the job, and we'll follow up with pricing, discount already applied.
                </Reveal>

                <Reveal delay={250} className="mt-9 space-y-5">
                  {HOW_IT_WORKS.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-phsOrange bg-phsOrange/10 font-display text-sm font-black text-phsOrangeDark">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-base font-extrabold tracking-tight text-phsInk">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-gray-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </Reveal>

                <Reveal delay={300} className="mt-9 flex items-center gap-4 border-t border-[#e6ded4] pt-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-phsOrange text-white [&_svg]:h-5 [&_svg]:w-5">
                    <PhoneIcon />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-500">Prefer to talk it through?</p>
                    <a href={`tel:${PHONE_TEL}`} className="font-display text-lg font-extrabold text-phsInk transition-colors hover:text-phsOrange">
                      Call {PHONE_DISPLAY}
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right: the request form */}
              <Reveal variant="right" delay={150}>
                <CouponRequestForm selectedCoupon={selectedCoupon} onClearCoupon={() => setSelectedCoupon(null)} />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
