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
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

/**
 * Reusable SEO service-landing page.
 *
 * Every section is driven by the CONTENT object (see the typedef below) so a
 * new service page is just a data file + a one-line wrapper. The visual system
 * (Strands hero treatment, orange cta-diag buttons, mono eyebrows, phsNavy /
 * phsSky / phsOrange palette, shield booking form, Reveal animations) is reused
 * verbatim from the home page — nothing new is invented here.
 *
 * @typedef {Object} IntroBlock
 * @property {string}   [heading]   Optional H2 for the block.
 * @property {string}   [paragraph] Optional body paragraph.
 * @property {string[]} [list]      Optional bulleted list.
 * @property {boolean}  [callUs]    Show the inline "Call Us: [phone]" line.
 *
 * @typedef {Object} ServiceContent
 * @property {string} title            Full <title> / og:title text.
 * @property {string} metaDescription  Meta + og description (~150-160 chars).
 * @property {string} path             Canonical pathname, e.g. '/water-heater-repair'.
 * @property {string} breadcrumbLabel  Current page crumb, e.g. 'Water Heater Repair'.
 * @property {string} parentBreadcrumb Parent crumb label, e.g. 'Plumbing'.
 * @property {string} parentHref       Parent crumb href, e.g. '/plumbing'.
 * @property {string} heroImage        Full-bleed hero photo.
 * @property {string} heroImageAlt     Alt text for the hero photo.
 * @property {string} heroH1           Keyword-rich H1 (city + service + hook).
 * @property {string} introEyebrow     Uppercase mono eyebrow.
 * @property {string} introHeading     H2 intro heading.
 * @property {string} hook             2-3 sentence intro hook.
 * @property {string} serviceNoun      Noun used in "Our [noun] Services", form dropdown, etc.
 * @property {IntroBlock[]} introBlocks Ordered content blocks (first = 9-item service list).
 * @property {{q:string,a:string}[]} faqs
 * @property {{label:string,href:string}[]} related  Exactly 4 related-service links.
 * @property {string} [since]          Founding year for the "Since [year]" trust chip.
 */

const SINCE_YEAR = '1989' // Matches the "35+ Years of Experience" badge on the site.

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
function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
const ShieldCheck = <svg {...iconBase}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>
const BadgeStar = <svg {...iconBase}><circle cx="12" cy="8" r="5" /><path d="m9 12-1 9 4-2 4 2-1-9M12 6l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 8.1l2-.3z" /></svg>
const DocIcon = <svg {...iconBase}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
const ClockBolt = <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
const TagIcon = <svg {...iconBase}><path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h8l8.6 8.6a1.4 1.4 0 0 1 0 2z" /><circle cx="7.5" cy="7.5" r="1.3" /></svg>

/* -------------------------- Small sub-components ------------------------ */
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

function CallUsLine() {
  return (
    <p className="mt-5 font-display text-sm font-bold tracking-wide text-phsNavy">
      Call Us:{' '}
      <a href={`tel:${PHONE_TEL}`} className="text-phsOrange transition-colors hover:text-phsOrangeDark">
        {PHONE_DISPLAY}
      </a>
    </p>
  )
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
export default function ServicePageTemplate({ content }) {
  const {
    title, metaDescription, path, breadcrumbLabel, parentBreadcrumb, parentHref,
    heroImage, heroImageAlt, heroH1, introEyebrow, introHeading, hook, serviceNoun,
    introBlocks = [], faqs = [], related = [], since = SINCE_YEAR,
  } = content

  useSeo({ title, description: metaDescription, path, image: heroImage })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden text-white">
        {/* Full-bleed service photo */}
        <img src={heroImage} alt={heroImageAlt} className="absolute inset-0 z-0 h-full w-full object-cover" />
        {/* ~80% brand-color overlay for legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-phsNavy/90 via-phsNavy/80 to-phsNavy/70" />
        {/* Warm brand glow, matching the home band */}
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
          {/* Breadcrumb */}
          <Reveal as="nav" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 sm:text-xs">
            <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
            <span>/</span>
            <a href={parentHref} className="transition-colors hover:text-phsOrange">{parentBreadcrumb.toUpperCase()}</a>
            <span>/</span>
            <span className="text-phsOrange">{breadcrumbLabel.toUpperCase()}</span>
          </Reveal>

          <Reveal as="h1" delay={100} className="max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:max-w-4xl lg:text-6xl">
            {heroH1}
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

          {/* Trust chips */}
          <Reveal delay={300} className="mt-8 flex flex-wrap gap-3">
            <TrustChip icon={ShieldCheck} label="Licensed & Insured" />
            <TrustChip icon={BadgeStar} label={`Since ${since}`} />
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
              {introEyebrow}
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              {introHeading}
            </Reveal>
            <Reveal as="p" delay={200} className="mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-500 sm:text-base">
              {hook}
            </Reveal>

            {/* Proof stat cards */}
            <Reveal delay={250} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={ClockBolt} title="Same-Day Service" text="Fast response when comfort can’t wait, 7 days a week." />
              <StatCard icon={TagIcon} title="Upfront Pricing" text="Honest, fixed quotes before any work begins." />
              <StatCard icon={DocIcon} title="Written Warranty" text="Every job backed in writing for lasting peace of mind." />
            </Reveal>

            {/* Content blocks */}
            <div className="mt-12 space-y-10">
              {introBlocks.map((block, i) => (
                <Reveal key={block.heading || i} variant="up">
                  <div>
                    {block.heading && (
                      <h2 className="font-display text-2xl font-black tracking-tight text-phsNavy sm:text-[1.75rem]">
                        {block.heading}
                      </h2>
                    )}
                    {block.paragraph && (
                      <p className={`${block.heading ? 'mt-4' : ''} max-w-[68ch] text-[15px] leading-relaxed text-gray-600`}>
                        {block.paragraph}
                      </p>
                    )}
                    {block.list && (
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {block.list.map((li) => (
                          <li key={li} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-phsOrange/10 text-phsOrange [&_svg]:h-4 [&_svg]:w-4">
                              <CheckIcon />
                            </span>
                            <span className="text-[15px] leading-relaxed text-phsNavy">{li}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {block.callUs && <CallUsLine />}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-40">
              <ShieldForm serviceNoun={serviceNoun} />
            </div>
          </aside>
        </div>
      </section>

      {/* --------------------------------- FAQ ---------------------------- */}
      <FaqAccordion title={`${serviceNoun} FAQs`} faqs={faqs} />

      {/* -------- Appended shared sections: How It Works / Why / Quotes ---- */}
      {/* Process is designed for the sky band (white text), so wrap it the
          same way the home page does. */}
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

      {/* --------------------------- Related links ------------------------ */}
      {related.length > 0 && (
        <section className="bg-[#FAF8F5] py-14 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">
                Explore More
              </Reveal>
              <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl">
                Related Services
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((svc, i) => (
                <Reveal key={svc.href + svc.label} variant="up" delay={(i % 4) * 100} className="h-full">
                  <a
                    href={svc.href}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-[#e6ded4] bg-white p-6 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.32)]"
                  >
                    <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                      {svc.label}
                    </h3>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrange">
                      Learn More
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
