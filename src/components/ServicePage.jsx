import { useEffect } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import { SERVICE_PAGES, subServiceHref } from '../data/services.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

/* ----------------------------- Inline icons ----------------------------- */
/* Simple stroke icons keyed by name in the services data. */
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
  pump: <svg {...iconBase}><path d="M4 21h16M6 21v-7h12v7M9 14V8h6v6M12 8V3M9 5h6" /></svg>,
  sewer: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></svg>,
  faucet: <svg {...iconBase}><path d="M3 9h6v3H3zM9 10h4a4 4 0 0 1 4 4M17 14v3M17 20a2 2 0 0 1-2-2 2 2 0 0 1 4 0 2 2 0 0 1-2 2zM6 9V7h3" /></svg>,
  filter: <svg {...iconBase}><path d="M3 4h18l-7 8v7l-4 2v-9z" /></svg>,
  toilet: <svg {...iconBase}><path d="M6 3h4v4H6zM5 7h8v4a5 5 0 0 1-10 0zM9 16l-1 5h5l-1-5" /></svg>,
  alarm: <svg {...iconBase}><path d="M12 2v2M5 22h14M19 12a7 7 0 0 0-14 0v6h14v-6zM4 12H3m18 0h-1M6.3 6.3l-.7-.7m12.1.7.7-.7" /></svg>,
  disposal: <svg {...iconBase}><path d="M5 3h14l-1 5H6zM6 8v9a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8M10 13v3M14 13v3" /></svg>,
  flame: <svg {...iconBase}><path d="M12 2s-4 3.5-4 8a4 4 0 0 0 8 0c0-4.5-4-8-4-8z" /><path d="M12 12c-1.5 0-2.5 1-2.5 2.5S10.5 17 12 17s2.5-1 2.5-2.5S13.5 12 12 12z" /></svg>,
  boiler: <svg {...iconBase}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M10 15v3M14 15v3" /></svg>,
  heatpump: <svg {...iconBase}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M12 8v8M8 10l4-2 4 2M8 14l4 2 4-2" /></svg>,
  minisplit: <svg {...iconBase}><rect x="3" y="5" width="18" height="6" rx="2" /><path d="M6 8h8M7 15c0 1.5 1 2 1 3M12 15c0 1.5 1 2 1 3M17 15c0 1.5 1 2 1 3" /></svg>,
  thermostat: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  airflow: <svg {...iconBase}><path d="M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h9" /></svg>,
  wrench: <svg {...iconBase}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-2.2z" /></svg>,
  snowflake: <svg {...iconBase}><path d="M12 2v20m6-16-12 12m12 0L6 6m6-4-2 4m2-4 2 4m-8 6H4m16 0h-4M6 18l2-4m10 4-2-4" /></svg>,
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

/* ------------------------------- Page ---------------------------------- */
export default function ServicePage({ slug }) {
  const data = SERVICE_PAGES[slug]

  useEffect(() => {
    if (data) document.title = `${data.name} | Preventive Home Solutions`
  }, [data])

  if (!data) return null

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ---------------------------- Hero ---------------------------- */}
      {/* Light-blue background with the animated Strands effect (same look as
          the homepage band). */}
      <section className="relative overflow-hidden bg-phsSky text-white">
        {/* Animated strands background */}
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
        {/* Soft warmth glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left: copy */}
          <div>
            {/* Breadcrumb */}
            <Reveal as="nav" className="mb-6 flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold tracking-[0.2em] text-white/70">
              <a href="/" className="transition-colors hover:text-phsNavy">HOME</a>
              <span>/</span>
              <span className="text-phsNavy">{data.name.toUpperCase()}</span>
            </Reveal>

            <Reveal as="p" delay={100} className="mb-4 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow">
              {data.eyebrow}
            </Reveal>

            <Reveal as="h1" delay={150} className="font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
              {data.introTitle}
            </Reveal>

            <Reveal as="p" delay={250} className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
              {data.introText}
            </Reveal>

            <Reveal delay={350} className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/#scheduling"
                className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                Get a Free Quote
                <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-3 rounded-md border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20"
              >
                <PhoneIcon className="h-5 w-5" />
                {PHONE_DISPLAY}
              </a>
            </Reveal>
          </div>

          {/* Right: framed photo with the service shield icon */}
          <Reveal variant="scale" delay={250} className="relative">
            <div className="relative mx-auto w-full max-w-md bg-white p-3 shadow-2xl">
              <span className="absolute top-0 left-0 z-10 h-8 w-8 border-t-4 border-l-4 border-phsOrange" />
              <span className="absolute top-0 right-0 z-10 h-8 w-8 border-t-4 border-r-4 border-phsOrange" />
              <span className="absolute bottom-0 left-0 z-10 h-8 w-8 border-b-4 border-l-4 border-phsOrange" />
              <span className="absolute bottom-0 right-0 z-10 h-8 w-8 border-b-4 border-r-4 border-phsOrange" />
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={data.heroImage} alt={data.heroImageAlt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/30 to-transparent" />
              </div>
            </div>
            {/* Shield icon badge */}
            <div className="absolute -bottom-6 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white shadow-xl">
              <img src={data.iconSrc} alt={`${data.name} icon`} className="h-14 w-14 object-contain" />
            </div>
          </Reveal>
        </div>
      </section>

      <MarqueeBanner />

      {/* --------------------- Sub-services grid ---------------------- */}
      <section id="services" className="relative bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
              {data.eyebrow}
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              {data.servicesHeading}
            </Reveal>
            <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500">
              {data.servicesIntro}
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((svc, i) => (
              <Reveal key={svc.title} variant="up" delay={(i % 3) * 100} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-7 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.32)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-phsOrange/20 bg-phsOrange/10 text-phsOrange transition-all duration-500 group-hover:scale-110 group-hover:bg-phsOrange group-hover:text-white group-hover:border-transparent [&_svg]:h-7 [&_svg]:w-7">
                    {ICONS[svc.icon] ?? ICONS.wrench}
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                    {svc.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500">
                    {svc.description}
                  </p>
                  <a href={svc.slug ? subServiceHref(slug, svc.slug) : '/#scheduling'} className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange transition-colors hover:text-phsOrangeDark">
                    Read More
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Warning signs section ----------------- */}
      <section className="bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
              Know The Signs
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
              {data.warningTitle}
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.warnings.map((w, i) => (
              <Reveal key={w.title} variant="up" delay={i * 100} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-[#FAF8F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:bg-white hover:shadow-lg">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-phsOrange font-display text-lg font-black text-white">
                    {i + 1}
                  </div>
                  <h3 className="font-display text-base font-bold tracking-wide text-phsNavy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
