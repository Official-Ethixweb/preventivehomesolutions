import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import Strands from './Strands.jsx'
import CardSwap, { Card } from './CardSwap.jsx'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { useSeo, ORIGIN, SITE_NAME } from '../lib/seo.js'

/* ----------------------------- Inline icons ----------------------------- */
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
const iconBase = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
const VALUE_ICONS = {
  shield: <svg {...iconBase}><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" /><path d="m9.5 12 1.8 1.8 3.2-3.6" /></svg>,
  pulse: <svg {...iconBase}><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>,
  badge: <svg {...iconBase}><circle cx="12" cy="9" r="6" /><path d="m9 14-1.5 7L12 19l4.5 2L15 14" /><path d="m9.5 9 1.6 1.6L14 7.6" /></svg>,
  clock: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
}

// Shared Strands config for the fixed animated backdrop behind the light-blue
// sections (same look as the rest of the site).
const STRANDS_PROPS = {
  colors: ['#f97316', '#ffffff', '#3b82f6'],
  count: 3,
  speed: 0.5,
  amplitude: 1,
  waviness: 1,
  thickness: 0.6,
  glow: 2.6,
  taper: 3,
  spread: 1,
  hueShift: 0,
  intensity: 0.6,
  saturation: 1.95,
  opacity: 0.5,
  scale: 2.6,
}

/* Work-only photos for the swapping hero stack (no team shots, no labels). */
const SHOWCASE = [
  '/AC installed 01.webp',
  '/Heating furnace.webp',
  '/Pot Filler Faucet Install in Ogden.webp',
  '/beforeandafterwaterheater.webp',
  '/Van in Kaysville Call.webp',
]

const VALUES = [
  { icon: 'shield', title: 'Integrity First', text: 'Honest assessments and upfront, fixed pricing. No upsells, no surprises just the work your home actually needs.' },
  { icon: 'pulse', title: 'Proactive, Not Reactive', text: 'We stop failures before they breach. Preventive maintenance that catches small problems before they become emergencies.' },
  { icon: 'badge', title: 'Certified Craft', text: 'Highly skilled, licensed and insured technicians who treat every home and every homeowner with respect.' },
  { icon: 'clock', title: 'Always On Call', text: 'Emergency and same-day availability, seven days a week, because water and weather do not keep business hours.' },
]

const PROMISES = [
  'Upfront, fixed pricing before any work begins',
  'Licensed, background-checked technicians',
  'Clean, respectful work in your home',
  'Honest recommendations repair or replace',
  'Emergency & same-day service, 7 days a week',
  'Workmanship you can count on, season after season',
]

export default function AboutPage() {
  useSeo({
    title: 'About Us Plumbing, Heating & Cooling in Northern Utah | Preventive Home Solutions',
    description:
      'Meet Preventive Home Solutions the licensed crew defending Northern Utah homes with plumbing, heating and cooling. 35+ years of experience, proactive care, transparent pricing.',
    path: '/about-us',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `About ${SITE_NAME}`,
      url: `${ORIGIN}/about-us`,
      about: { '@type': 'HVACBusiness', name: SITE_NAME, areaServed: 'Northern Utah', telephone: '+1-385-453-9428' },
    },
  })

  return (
    <div className="relative min-h-screen bg-white">
      {/* Fixed, continuous light-blue animated backdrop. It is viewport-anchored,
          so it stays in place while scrolling only the transparent light-blue
          sections (Stats, Get a Free Quote) reveal it; every other section is
          opaque and covers it. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-phsSky">
        <Strands {...STRANDS_PROPS} />
      </div>

      {/* All page content sits above the backdrop. */}
      <div className="relative z-10">
        <TopBar />
        <Header />
        <main>

        {/* ============================== HERO ============================== */}
        <section className="relative overflow-hidden bg-[#FAF8F5]">
          {/* soft brand glows (static, no animation) */}
          <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-phsOrange/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-phsSky/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:gap-8 lg:py-20">
            {/* Left: copy */}
            <div>
              <Reveal as="nav" className="mb-6 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-phsNavy/50">
                <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
                <span>/</span>
                <span className="text-phsOrange">ABOUT US</span>
              </Reveal>

              <Reveal as="p" delay={80} className="mb-5 inline-flex items-center gap-2 border border-phsNavy/15 bg-white px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-phsNavy/70 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-phsOrange" />
                LICENSED · INSURED · NORTHERN UTAH
              </Reveal>

              <Reveal as="h1" delay={140} className="font-display text-4xl font-black leading-[1.02] tracking-tight text-phsNavy sm:text-5xl lg:text-[3.4rem]">
                The guard behind every <span className="text-phsOrange">protected</span> home.
              </Reveal>

              <Reveal as="p" delay={220} className="mt-6 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base">
                Preventive Home Solutions is a Northern Utah crew built on a simple idea: defend homes before they fail.
                Plumbing, heating, and cooling one certified team, three trades, every season.
              </Reveal>

              <Reveal delay={300} className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/#scheduling"
                  className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  BOOK NOW
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-phsNavy/20 bg-white px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-phsNavy shadow-sm transition-all duration-300 hover:border-phsOrange hover:text-phsOrange"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
              </Reveal>
            </div>

            {/* Right: swapping showcase of real jobs */}
            <div className="relative mt-8 h-[clamp(360px,100vw,460px)] lg:mt-0 lg:h-[540px] w-full flex justify-center items-center">
              <CardSwap
                width="clamp(260px, 75vw, 340px)"
                height="clamp(320px, 90vw, 420px)"
                cardDistance={32}
                verticalDistance={36}
                delay={2600}
                skewAmount={4}
                pauseOnHover={false}
              >
                {SHOWCASE.map((src) => (
                  <Card key={src} className="overflow-hidden">
                    <img src={src} alt="Preventive Home Solutions completed work" className="absolute inset-0 h-full w-full object-cover" />
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </section>

        {/* ============================= MISSION ============================= */}
        <section className="bg-white py-16 px-6 lg:py-24">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal as="p" className="font-sans text-xs font-bold tracking-[0.25em] text-phsOrange">OUR MISSION</Reveal>
              <Reveal as="h2" delay={100} className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                Stop the failure before it breaches.
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal className="border-l-4 border-phsOrange pl-6">
                <p className="font-sans text-xl font-bold leading-snug text-phsNavy sm:text-2xl">
                  We are your go-to garrison for reliable plumbing, heating, and cooling defense in Northern Utah.
                </p>
              </Reveal>
              <Reveal delay={120} className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                <p>
                  Founded on the principles of integrity, professionalism, and proactive care, we exist to protect every
                  home we touch from a minor leak to a full HVAC overhaul. Whether it&rsquo;s a complex installation or a
                  routine tune-up, our team is here to make sure your home runs smoothly and efficiently, no matter the season.
                </p>
                <p>
                  When you choose Preventive, you&rsquo;re not just hiring a service. You&rsquo;re enlisting a guard committed
                  to your home&rsquo;s long-term endurance.
                </p>
              </Reveal>
              <Reveal delay={200} className="mt-7">
                <p className="font-display text-2xl font-bold text-phsNavy/80">
                  The Preventive Team
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== STATS (light-blue band) ==================== */}
        {/* Transparent: reveals the fixed animated backdrop. */}
        <section className="relative py-14 px-6 text-white lg:py-20">
          <div className="relative mx-auto grid max-w-[1100px] grid-cols-2 gap-y-10 lg:grid-cols-4">
            {[
              { end: 35, suffix: '+', label: 'Years of Experience' },
              { end: 7, suffix: '', label: 'Days a Week' },
              { end: 3, suffix: '', label: 'Trades, One Team' },
              { end: 5, suffix: '★', label: 'Star Rated Service' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <CountUp end={s.end} suffix={s.suffix} className="font-display text-5xl font-black text-white drop-shadow sm:text-6xl" />
                <p className="mt-3 font-mono text-[11px] font-bold tracking-[0.18em] text-white/85 sm:text-xs">
                  {s.label.toUpperCase()}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================= VALUES ============================= */}
        <section className="bg-[#FAF8F5] py-16 px-6 lg:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Reveal as="p" className="font-mono text-xs font-bold tracking-[0.25em] text-phsOrange">WHAT WE STAND FOR</Reveal>
              <Reveal as="h2" delay={100} className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                The standard we hold the line on.
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} variant="up" delay={(i % 4) * 90} className="h-full">
                  <div className="group relative flex h-full flex-col border border-[#e6ded4] bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_24px_45px_-18px_rgba(10,37,64,0.3)]">
                    <span className="pointer-events-none absolute top-0 left-0 h-6 w-6 border-t-[3px] border-l-[3px] border-phsOrange opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-[3px] border-r-[3px] border-phsOrange opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-phsOrange/20 bg-phsOrange/10 text-phsOrange transition-all duration-500 group-hover:scale-110 group-hover:bg-phsOrange group-hover:text-white [&_svg]:h-7 [&_svg]:w-7">
                      {VALUE_ICONS[v.icon]}
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy">{v.title}</h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ PROMISE ============================ */}
        <section className="bg-white py-16 px-6 lg:py-24">
          <div className="mx-auto grid max-w-[1150px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Framed photo */}
            <Reveal variant="left" className="relative mx-auto w-full max-w-md">
              <div className="relative bg-white p-3 shadow-2xl">
                <span className="absolute top-0 left-0 z-10 h-9 w-9 border-t-4 border-l-4 border-phsOrange" />
                <span className="absolute top-0 right-0 z-10 h-9 w-9 border-t-4 border-r-4 border-phsOrange" />
                <span className="absolute bottom-0 left-0 z-10 h-9 w-9 border-b-4 border-l-4 border-phsOrange" />
                <span className="absolute bottom-0 right-0 z-10 h-9 w-9 border-b-4 border-r-4 border-phsOrange" />
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img src="/IMG_6217.webp" alt="Preventive Home Solutions technician on the job" className="h-full w-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/25 to-transparent" />
                </div>
              </div>
            </Reveal>

            {/* Checklist */}
            <div>
              <Reveal as="p" className="font-mono text-xs font-bold tracking-[0.25em] text-phsOrange">OUR PROMISE</Reveal>
              <Reveal as="h2" delay={100} className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                What you can count on, every visit.
              </Reveal>
              <ul className="mt-8 space-y-4">
                {PROMISES.map((p, i) => (
                  <Reveal as="li" key={p} delay={i * 70} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-phsOrange/10 text-phsOrange">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
                    </span>
                    <span className="text-[15px] leading-relaxed text-gray-700">{p}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= GET A FREE QUOTE (light-blue band) ============= */}
        {/* Transparent: reveals the same fixed animated backdrop. */}
        <section className="relative py-16 px-6 text-white lg:py-20">
          <div className="relative mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <p className="mb-3 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow">GET A FREE QUOTE</p>
              <h2 className="max-w-xl font-display text-2xl font-black leading-tight tracking-tight drop-shadow-sm sm:text-3xl">
                Ready to put a certified team in your corner?
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/90">
                Same-week plumbing, heating &amp; cooling service across Northern Utah.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="/#scheduling"
                className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                BOOK NOW
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-white/15 px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-white/80 hover:bg-white/25"
              >
                <PhoneIcon className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        </main>
        <Footer />
      </div>
    </div>
  )
}
