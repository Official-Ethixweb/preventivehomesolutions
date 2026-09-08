import { useEffect, useState } from 'react'
import { SERVICE_GROUPS, SERVICE_AREAS, PHONE_DISPLAY, PHONE_TEL, LICENSE_NUMBER, areaHref } from '../data/nav.js'

/**
 * Mobile hamburger menu: a right-side slide-in drawer with a dark backdrop.
 * Replaces the old bottom "castle wall" shield tab bar (BottomNav) — same
 * underlying nav data (SERVICE_GROUPS / SERVICE_AREAS), a conventional
 * drawer instead of a fixed bottom bar. Desktop is untouched; the trigger
 * button living in Header.jsx is lg:hidden, so this never opens above `lg`.
 */

function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
function ChevronIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z" />
    </svg>
  )
}

const linkRowClass = 'block border-b border-black/5 py-3.5 font-sans text-[16px] font-bold text-phsInk transition-colors hover:text-phsOrange'

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null) // 'services' | 'areas' | null

  // Lock background scroll while the drawer is open, same pattern as the
  // full-screen chat panel and the old bottom-nav sheets used.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Collapse any open accordion section each time the drawer closes, so it
  // doesn't reopen mid-scroll-position next time.
  useEffect(() => {
    if (!open) setExpanded(null)
  }, [open])

  const toggle = (key) => setExpanded((v) => (v === key ? null : key))

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-phsInk/60 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[95] flex w-[86%] max-w-[380px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between bg-phsNavy px-5 py-4">
          <span className="font-display text-base font-extrabold text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2">
          <a href="/" onClick={onClose} className={linkRowClass}>
            Home
          </a>

          <button
            type="button"
            onClick={() => toggle('services')}
            aria-expanded={expanded === 'services'}
            className="flex w-full items-center justify-between border-b border-black/5 py-3.5 font-sans text-[16px] font-bold text-phsInk"
          >
            Services
            <ChevronIcon className={`h-4 w-4 text-phsInk/50 transition-transform duration-300 ${expanded === 'services' ? 'rotate-180' : ''}`} />
          </button>
          {expanded === 'services' && (
            <div className="space-y-4 border-b border-black/5 py-4 pl-1">
              {SERVICE_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-phsOrange">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="block py-1.5 text-[14px] text-phsInk/75 transition-colors hover:text-phsOrange"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => toggle('areas')}
            aria-expanded={expanded === 'areas'}
            className="flex w-full items-center justify-between border-b border-black/5 py-3.5 font-sans text-[16px] font-bold text-phsInk"
          >
            Areas We Serve
            <ChevronIcon className={`h-4 w-4 text-phsInk/50 transition-transform duration-300 ${expanded === 'areas' ? 'rotate-180' : ''}`} />
          </button>
          {expanded === 'areas' && (
            <div className="flex flex-wrap gap-2 border-b border-black/5 py-4 pl-1">
              {SERVICE_AREAS.map((city) => (
                <a
                  key={city}
                  href={areaHref(city)}
                  onClick={onClose}
                  className="rounded-full border border-phsSky/20 bg-phsCream px-3.5 py-1.5 text-[13px] font-semibold text-phsInk/75 transition-colors hover:border-phsOrange/40 hover:text-phsOrange"
                >
                  {city}
                </a>
              ))}
            </div>
          )}

          <a href="/coupons" onClick={onClose} className={linkRowClass}>
            Coupons
          </a>
          <a href="/about-us" onClick={onClose} className={linkRowClass}>
            About Us
          </a>
          <a href="/blog" onClick={onClose} className={`${linkRowClass} border-b-0`}>
            Blog
          </a>
        </nav>

        <div className="space-y-3 border-t border-black/5 bg-phsCream px-5 py-4">
          <a
            href={`tel:${PHONE_TEL}`}
            onClick={onClose}
            className="cta-diag cta-diag-orange flex items-center justify-center gap-2 rounded-md bg-phsOrange px-5 py-3.5 font-sans text-sm font-bold text-white shadow-md"
          >
            <PhoneIcon className="h-4 w-4" /> Call {PHONE_DISPLAY}
          </a>
          <a
            href="/#scheduling"
            onClick={onClose}
            className="cta-diag cta-diag-white flex items-center justify-center rounded-md border border-phsOrange/50 bg-white px-5 py-3.5 font-sans text-sm font-bold text-phsOrange shadow-sm"
          >
            Get Free Quote
          </a>
          <p className="text-center text-[11px] font-semibold text-phsInk/50">
            Licensed &amp; Insured · Lic. #{LICENSE_NUMBER}
          </p>
        </div>
      </div>
    </>
  )
}
