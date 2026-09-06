import Reveal from './Reveal.jsx'
import { COUPONS } from '../data/coupons.js'

/**
 * Home-page teaser for /coupons — the mobile nav (BottomNav) has no room for
 * every page as its own tab, so this section is how phone visitors ever find
 * the coupons at all, not just desktop nav + footer link.
 */

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

function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FEATURED = COUPONS.slice(0, 4)

export default function CouponsPreview() {
  return (
    <section className="bg-[#FAF8F5] py-14 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrangeDark sm:text-sm">
            Exclusive Offers
          </Reveal>
          <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
            Coupons &amp; Specials
          </Reveal>
          <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500">
            Real savings on the plumbing, heating, and cooling work you need most.
          </Reveal>
        </div>

        {/* Horizontal scroll on phones (no room for a grid); a real grid from
            sm up, matching every other card row on the site. */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-6 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-4">
          {FEATURED.map((c, i) => (
            <Reveal key={c.id} variant="up" delay={(i % 4) * 80} className="w-[240px] shrink-0 snap-start sm:w-auto">
              <a
                href="/coupons"
                className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-5 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.28)]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-phsOrange/10 text-phsOrange [&_svg]:h-5 [&_svg]:w-5">
                    {ICONS[c.icon]}
                  </span>
                  <span className="rounded-full bg-phsOrangeDark px-3 py-1 font-display text-xs font-black leading-none text-white shadow-sm">
                    {c.badge}
                  </span>
                </div>
                <h3 className="font-display text-base font-extrabold tracking-tight text-phsInk">{c.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-gray-500">{c.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-bold text-phsOrangeDark">
                  View Offer
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-9 text-center">
          <a
            href="/coupons"
            className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-8 py-4 font-sans text-sm font-bold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            View All Coupons
            <ArrowIcon className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
