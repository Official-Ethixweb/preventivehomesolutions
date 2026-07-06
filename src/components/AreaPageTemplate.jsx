import { useState } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import Process from './Process.jsx'
import WhyChoose from './WhyChoose.jsx'
import ShieldForm from './ShieldForm.jsx'
import { useSeo } from '../lib/seo.js'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS, areaHref } from '../data/nav.js'

/**
 * Reusable service-area landing page — one layout for every city.
 * Everything is generated from the small per-city entry in
 * src/data/serviceAreas.js (city, county, zips, intro), reusing the exact
 * design system of the service pages: full-bleed navy hero, mono eyebrows,
 * cta-diag buttons, shield form sidebar, Strands process band.
 */

const HERO_IMAGE = '/Van in Kaysville Call.webp'

/* ------------------------------- Icons --------------------------------- */
const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
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
const ShieldCheck = <svg {...iconBase}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>
const BadgeStar = <svg {...iconBase}><circle cx="12" cy="8" r="5" /><path d="m9 12-1 9 4-2 4 2-1-9M12 6l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 8.1l2-.3z" /></svg>
const DocIcon = <svg {...iconBase}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
const PinIcon = <svg {...iconBase}><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></svg>
const ClockBolt = <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>

function TrustChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-phsOrange">
      {icon}
      {label}
    </span>
  )
}

function StatCard({ icon, title, text }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e6ded4] bg-[#FAF8F5] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:bg-white hover:shadow-lg">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-phsOrange/20 bg-phsOrange/10 text-phsOrange [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </span>
      <h3 className="font-display text-base font-bold tracking-wide text-phsNavy">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{text}</p>
    </div>
  )
}

/* Services offered in every area — links to the real service pages. */
const AREA_SERVICES = [
  { label: 'Plumbing', href: '/plumbing', desc: 'Leaks, faucets, toilets, water lines, repipes, and emergency repairs.' },
  { label: 'Heating', href: '/hvac', desc: 'Furnaces, boilers, heat pumps, and mini-splits built for Utah winters.' },
  { label: 'Cooling / AC', href: '/ac', desc: 'AC repair, tune-ups, and high-efficiency installs for hot summers.' },
  { label: 'Water Heaters', href: '/water-heater-repair', desc: 'Tank and tankless repair, maintenance, and same-day replacement.' },
  { label: 'Drain & Sewer', href: '/plumbing/drain-cleaning', desc: 'Drain clearing, cleaning, camera inspections, and main-line work.' },
  { label: 'Emergency Service', href: '/plumbing/emergency-plumbing', desc: 'Fast response 7 days a week when it can’t wait.' },
]

/* City-interpolated FAQ set shared by all areas. */
function buildFaqs(city) {
  return [
    {
      q: `Do you charge extra to come out to ${city}?`,
      a: `No. ${city} is inside our standard Northern Utah service area, so there are no travel fees or long-distance surcharges. You get the same upfront, fixed pricing as every other city we serve.`,
    },
    {
      q: `How fast can you get to my home in ${city}?`,
      a: `For most of ${city} we offer same-day appointments, and emergency calls are prioritized 7 days a week. Call (385) 453-9428 and we'll give you an honest arrival window before we roll a truck.`,
    },
    {
      q: `Which services do you offer in ${city}?`,
      a: `Everything we do — plumbing, drains and sewer, water heaters, furnaces and boilers, and air conditioning. Repairs, maintenance plans, and full installations are all available to ${city} homeowners.`,
    },
    {
      q: 'Are your technicians licensed and insured?',
      a: 'Yes. Every technician is licensed, insured, and background-checked, and our work is clean and code-compliant. Each job is backed by a written warranty.',
    },
    {
      q: `Do you offer free estimates in ${city}?`,
      a: `Yes — on-site estimates for plumbing, heating, and cooling work in ${city} are free, and you'll always see the full fixed price before any work begins.`,
    },
  ]
}

/* ------------------------------ FAQ accordion --------------------------- */
function FaqAccordion({ title, faqs }) {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section className="relative overflow-hidden bg-[#fbf7f0] py-14 lg:py-24 px-6">
      <img
        src="/main logo.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{ opacity: 0.12 }}
      />
      <div className="relative mx-auto max-w-[850px]">
        <div className="mb-10 text-center">
          <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
            Faqs
          </Reveal>
          <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.1] tracking-tight text-phsInk sm:text-4xl lg:text-[2.75rem]">
            {title}
          </Reveal>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <Reveal key={item.q} delay={i * 80}>
                <div className={`group overflow-hidden rounded-xl border transition-all duration-300 ${open ? 'border-phsOrange bg-white shadow-md' : 'border-transparent bg-white/70 shadow-sm hover:border-gray-200 hover:bg-white'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left outline-none"
                    aria-expanded={open}
                  >
                    <span className="font-sans text-[15px] font-extrabold text-phsInk sm:text-base">{item.q}</span>
                    <span className="ml-4 flex-shrink-0">
                      <svg className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180 text-phsOrange' : 'rotate-0 text-gray-400 group-hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 pt-0 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">{item.a}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Template ------------------------------ */
export default function AreaPageTemplate({ area }) {
  const { slug, city, county, zips, intro } = area

  useSeo({
    title: `Plumbing, Heating & AC in ${city}, UT | Preventive Home Solutions`,
    description: `Licensed plumbing, heating, cooling, and water heater service in ${city}, Utah. Same-day appointments, upfront pricing, and written warranties. Call (385) 453-9428.`,
    path: `/service-areas/${slug}`,
    image: HERO_IMAGE,
  })

  const otherAreas = SERVICE_AREAS.filter((c) => c !== city)

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden text-white">
        <img src={HERO_IMAGE} alt={`Preventive Home Solutions service van in ${city}, Utah`} className="absolute inset-0 z-0 h-full w-full object-cover" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-phsNavy/90 via-phsNavy/80 to-phsNavy/70" />
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
          <Reveal as="nav" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 sm:text-xs">
            <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
            <span>/</span>
            <a href="/#areas-we-serve" className="transition-colors hover:text-phsOrange">AREAS WE SERVE</a>
            <span>/</span>
            <span className="text-phsOrange">{city.toUpperCase()}</span>
          </Reveal>

          <Reveal as="h1" delay={100} className="max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:max-w-4xl lg:text-6xl">
            Plumbing, Heating &amp; AC in {city}, UT — Your Local Home Comfort Guard
          </Reveal>

          <Reveal delay={200} className="mt-9">
            <a
              href={`tel:${PHONE_TEL}`}
              className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-8 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <PhoneIcon className="h-5 w-5" />
              Call {PHONE_DISPLAY}
            </a>
          </Reveal>

          <Reveal delay={300} className="mt-8 flex flex-wrap gap-3">
            <TrustChip icon={ShieldCheck} label="Licensed & Insured" />
            <TrustChip icon={PinIcon} label={`Serving ${county}`} />
            <TrustChip icon={DocIcon} label="Written Warranty" />
          </Reveal>
        </div>
      </section>

      <MarqueeBanner />

      {/* -------------------------- Two-column body ----------------------- */}
      <section className="bg-white py-14 lg:py-24">
        <div className="mx-auto flex flex-col-reverse lg:grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          {/* Main column */}
          <div>
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-phsOrange sm:text-sm">
              {city} Home Services
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              Trusted Plumbing, Heating &amp; Cooling for {city} Homes
            </Reveal>
            <Reveal as="p" delay={200} className="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-gray-500 sm:text-base">
              {intro}
            </Reveal>

            {/* Proof stat cards */}
            <Reveal delay={250} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={ClockBolt} title="Same-Day Service" text={`Fast response across ${city}, 7 days a week.`} />
              <StatCard icon={PinIcon} title="Local Team" text="Based in Layton — short drives, honest arrival windows." />
              <StatCard icon={DocIcon} title="Written Warranty" text="Every job backed in writing for lasting peace of mind." />
            </Reveal>

            {/* Services grid */}
            <div className="mt-12">
              <Reveal as="h2" className="font-display text-2xl font-black tracking-tight text-phsNavy sm:text-[1.75rem]">
                Services We Offer in {city}
              </Reveal>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {AREA_SERVICES.map((svc, i) => (
                  <Reveal key={svc.label} variant="up" delay={(i % 2) * 80}>
                    <a
                      href={svc.href}
                      className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:shadow-lg"
                    >
                      <h3 className="font-display text-base font-bold tracking-wide text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                        {svc.label}
                      </h3>
                      <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-gray-500">{svc.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange">
                        Learn More
                        <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Local map */}
            <div className="mt-12">
              <Reveal as="h2" className="font-display text-2xl font-black tracking-tight text-phsNavy sm:text-[1.75rem]">
                Proudly Serving {city}{zips.length > 0 && <> — {zips.join(', ')}</>}
              </Reveal>
              <Reveal delay={100} className="mt-6 overflow-hidden rounded-2xl border border-[#e6ded4] shadow-lg">
                <iframe
                  title={`${city}, Utah service area map`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(city)},+UT&z=12&output=embed`}
                  className="h-[320px] w-full border-0"
                  style={{ filter: 'grayscale(0.15) contrast(1.02) brightness(1.05) saturate(0.95)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </Reveal>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-40">
              <ShieldForm section={`Service Area — ${city}`} />
            </div>
          </aside>
        </div>
      </section>

      {/* --------------------------------- FAQ ---------------------------- */}
      <FaqAccordion title={`${city} Service FAQs`} faqs={buildFaqs(city)} />

      {/* --------------------- Shared band: How It Works ------------------ */}
      <div className="relative overflow-hidden bg-phsSky">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Strands
            colors={['#f97316', '#ffffff', '#3b82f6']}
            count={3}
            speed={0.5}
            amplitude={1}
            waviness={1}
            thickness={0.6}
            glow={2.6}
            taper={3}
            spread={1}
            hueShift={0}
            intensity={0.6}
            saturation={1.95}
            opacity={0.5}
            scale={2.6}
          />
        </div>
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 pt-12 lg:pt-24">
          <Process />
        </div>
      </div>

      <WhyChoose />

      {/* --------------------------- Other areas --------------------------- */}
      <section className="bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
              Territory Under Guard
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
              More Areas We Serve
            </Reveal>
          </div>
          <Reveal delay={150} className="flex flex-wrap justify-center gap-3">
            {otherAreas.map((c) => (
              <a
                key={c}
                href={areaHref(c)}
                className="rounded-full border border-phsSky/20 bg-white px-4 py-2.5 text-sm font-semibold text-phsInk/80 shadow-sm transition-colors hover:border-phsOrange/40 hover:text-phsOrange"
              >
                {c}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
