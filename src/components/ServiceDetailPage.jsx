import { useEffect } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import { getSubService, subServiceHref } from '../data/services.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

/* ------------------------------ Icons ---------------------------------- */
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

/* Why-homeowners-choose-us points reused across every sub-service page. */
const WHY_POINTS = [
  { title: 'Licensed & Insured', text: 'Clean, code-compliant work from a team that stands behind every job.' },
  { title: 'Upfront Pricing', text: 'Honest quotes before we start no surprises when the work is done.' },
  { title: 'Available 7 Days a Week', text: 'Same-day and emergency service when you need it most.' },
  { title: 'Local to Northern Utah', text: 'Built for the homes and seasons we live and work in every day.' },
]

/* ------------------------------- Page ---------------------------------- */
export default function ServiceDetailPage({ parentSlug, childSlug }) {
  const match = getSubService(parentSlug, childSlug)

  useEffect(() => {
    if (match) {
      document.title = `${match.service.title} | ${match.parent.name} | Preventive Home Solutions`
    }
  }, [match])

  if (!match) return null

  const { parent, service } = match
  const detail = service.detail ?? {}
  const related = parent.services.filter((s) => s.slug !== service.slug).slice(0, 6)

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ---------------------------- Hero ---------------------------- */}
      <section className="relative overflow-hidden bg-phsSky text-white">
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

        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Left: copy */}
          <div>
            {/* Breadcrumb */}
            <Reveal as="nav" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 sm:text-xs">
              <a href="/" className="transition-colors hover:text-phsNavy">HOME</a>
              <span>/</span>
              <a href={`/${parent.slug}`} className="transition-colors hover:text-phsNavy">{parent.name.toUpperCase()}</a>
              <span>/</span>
              <span className="text-phsNavy">{service.title.toUpperCase()}</span>
            </Reveal>

            <Reveal as="p" delay={100} className="mb-4 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow">
              {parent.eyebrow}
            </Reveal>

            <Reveal as="h1" delay={150} className="font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
              {service.title}
            </Reveal>

            <Reveal as="p" delay={250} className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
              {detail.intro ?? service.description}
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
                <img src={parent.heroImage} alt={parent.heroImageAlt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/30 to-transparent" />
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white shadow-xl">
              <img src={parent.iconSrc} alt={`${parent.name} icon`} className="h-14 w-14 object-contain" />
            </div>
          </Reveal>
        </div>
      </section>

      <MarqueeBanner />

      {/* --------------------- What's included ----------------------- */}
      <section className="relative bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
                What&apos;s Included
              </Reveal>
              <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                {service.title} Done Right
              </Reveal>
              <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500">
                {service.description}
              </Reveal>

              <Reveal delay={300} className="mt-8">
                <a
                  href="/#scheduling"
                  className="group inline-flex items-center gap-2 font-display text-sm font-bold text-phsOrange transition-colors hover:text-phsOrangeDark"
                >
                  Schedule this service
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Reveal>
            </div>

            <ul className="grid gap-4">
              {(detail.included ?? []).map((point, i) => (
                <Reveal as="li" key={point} variant="up" delay={i * 80}>
                  <div className="flex items-start gap-4 rounded-2xl border border-[#e6ded4] bg-white p-5 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.28)]">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-phsOrange/10 text-phsOrange [&_svg]:h-5 [&_svg]:w-5">
                      <CheckIcon />
                    </span>
                    <p className="text-[15px] leading-relaxed text-phsNavy">{point}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------- Why choose us ------------------------- */}
      <section className="bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
              Why Homeowners Choose Us
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
              The Preventive Home Solutions Standard
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_POINTS.map((p, i) => (
              <Reveal key={p.title} variant="up" delay={i * 100} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-[#FAF8F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:bg-white hover:shadow-lg">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-phsOrange font-display text-lg font-black text-white">
                    {i + 1}
                  </div>
                  <h3 className="font-display text-base font-bold tracking-wide text-phsNavy">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Related services ---------------------- */}
      {related.length > 0 && (
        <section className="bg-[#FAF8F5] py-14 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
                {parent.eyebrow}
              </Reveal>
              <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                Explore More {parent.name} Services
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((svc, i) => (
                <Reveal key={svc.slug} variant="up" delay={(i % 3) * 100} className="h-full">
                  <a
                    href={subServiceHref(parent.slug, svc.slug)}
                    className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-7 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.32)]"
                  >
                    <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                      {svc.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500">{svc.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange">
                      Learn More
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={`/${parent.slug}`}
                className="group inline-flex items-center gap-2 font-display text-sm font-bold text-phsNavy transition-colors hover:text-phsOrange"
              >
                View all {parent.name} services
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
