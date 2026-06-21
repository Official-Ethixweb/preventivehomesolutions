import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SERVICE_GROUPS, SERVICE_AREAS, PHONE_TEL } from '../data/nav.js'

/* Icons stroke based, inherit color via currentColor. */
function HomeIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </svg>
  )
}

function WrenchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2l-5.6 5.6a1.6 1.6 0 0 0 2.3 2.3l5.6-5.6a4 4 0 0 0 5.2-5.2l-2.3 2.3-2.1-.2-.2-2.1z" />
    </svg>
  )
}

function QuoteIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4h6a2 2 0 0 1 2 2v13a1 1 0 0 1-1.5.9L12 18l-3.5 1.9A1 1 0 0 1 7 19V6a2 2 0 0 1 2-2z" />
      <path d="M9.5 9h5M9.5 12.5h3" />
    </svg>
  )
}

function PinIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function EmergencyIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z" />
    </svg>
  )
}

/* Shield plate behind each icon. Colors shift with state. */
function Shield({ active, center, children }) {
  const size = center ? 'h-[56px] w-[50px]' : 'h-[42px] w-[38px]'

  let plate
  if (center) {
    plate = 'fill-phsOrange stroke-phsOrangeDark'
  } else if (active) {
    plate = 'fill-phsOrange/15 stroke-phsOrange'
  } else {
    plate = 'fill-phsInk/[0.04] stroke-phsInk/30'
  }

  const glow = center
    ? 'drop-shadow-[0_5px_12px_rgba(243,116,27,0.5)]'
    : active
      ? 'drop-shadow-[0_0_8px_rgba(243,116,27,0.35)]'
      : ''

  return (
    <span className={`relative flex items-center justify-center ${size}`}>
      <svg viewBox="0 0 52 58" className={`absolute inset-0 h-full w-full ${glow}`} fill="none" aria-hidden="true">
        <path
          d="M26 2 L48 9 V27 C48 41 38 51.5 26 56 C14 51.5 4 41 4 27 V9 Z"
          className={plate}
          strokeWidth={center ? 2.5 : active ? 2 : 1.5}
          strokeLinejoin="round"
        />
      </svg>
      {/* Finial on the raised center shield */}
      {center && (
        <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-phsBlue ring-2 ring-phsCream shadow-[0_0_10px_2px_rgba(26,155,240,0.85)]" />
      )}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </span>
  )
}

const ITEMS = [
  { key: 'home', label: 'Home', href: '/#hero', Icon: HomeIcon },
  { key: 'services', label: 'Services', sheet: 'services', Icon: WrenchIcon },
  { key: 'quote', label: 'Get Quote', href: '/#quote-form', Icon: QuoteIcon, center: true },
  { key: 'areas', label: 'Areas', sheet: 'areas', Icon: PinIcon },
  { key: 'emergency', label: 'Emergency', href: `tel:${PHONE_TEL}`, Icon: EmergencyIcon },
]

/* Shared chip style for sheet links. */
const chipClass =
  'rounded-full border border-phsSky/20 bg-white px-3.5 py-2 text-[13px] font-semibold text-phsInk/80 transition-colors hover:border-phsOrange/40 hover:text-phsOrange'

/* Bottom-sheet pop-up listing services (grouped) or service areas. */
function NavSheet({ kind, onClose }) {
  const title = kind === 'services' ? 'Our Services' : 'Areas We Serve'

  return createPortal(
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 animate-fade-in bg-phsInk/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[78vh] animate-sheet-up overflow-y-auto rounded-t-2xl border-t-2 border-phsOrange/40 bg-phsCream px-5 pt-3 pb-10 shadow-[0_-12px_40px_rgba(0,0,0,0.25)]">
        {/* Grabber */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-phsInk/15" />

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-phsInk">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-phsSky/20 text-phsInk"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {kind === 'services' ? (
          <div className="flex flex-col gap-5">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-phsOrange">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <a key={item} href="/#services" onClick={onClose} className={chipClass}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <a key={area} href="/#areas-we-serve" onClick={onClose} className={chipClass}>
                {area}
              </a>
            ))}
          </div>
        )}

        <a
          href="/#scheduling"
          onClick={onClose}
          className="cta-diag cta-diag-orange mt-7 flex w-full items-center justify-center rounded-md bg-phsOrange px-5 py-3.5 font-sans text-sm font-bold tracking-wide text-white shadow-sm"
        >
          {kind === 'services' ? 'Book This Service' : 'Schedule in Your Area'}
        </a>
      </div>
    </div>,
    document.getElementById('root')
  )
}

/**
 * Mobile-only bottom navigation styled as a castle wall with shield tabs,
 * matching the site's knight/shield theme. Services and Areas open pop-up
 * sheets; Emergency is a quick-dial. Replaces the header hamburger.
 */
export default function BottomNav() {
  const [active, setActive] = useState('home')
  const [sheet, setSheet] = useState(null) // 'services' | 'areas' | null

  // Scroll-spy: highlight the section sitting across the viewport center.
  useEffect(() => {
    const map = { hero: 'home', services: 'services', 'areas-we-serve': 'areas' }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && map[e.target.id]) setActive(map[e.target.id])
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Lock body scroll while a sheet is open.
  useEffect(() => {
    if (!sheet) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [sheet])

  return (
    <>
      {sheet && <NavSheet kind={sheet} onClose={() => setSheet(null)} />}

      {createPortal(
        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
          {/* Castle wall */}
          <nav className="relative flex items-end justify-around gap-1 bg-phsCream px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(0,0,0,0.15)]">
            {/* Glowing light-blue top line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-phsBlue shadow-[0_0_14px_2px_rgba(26,155,240,0.75)]"
            />
            {ITEMS.map((item) => {
              const isActive = item.center
                ? false
                : item.sheet
                  ? sheet === item.sheet || active === item.key
                  : active === item.key

              const iconColor = item.center
                ? 'text-white'
                : isActive
                  ? 'text-phsOrange'
                  : 'text-phsInk/45'

              const labelColor = item.center || isActive ? 'text-phsOrange' : 'text-phsInk/55'

              const inner = (
                <>
                  <Shield active={isActive} center={item.center}>
                    <item.Icon className={`${item.center ? 'h-6 w-6' : 'h-5 w-5'} ${iconColor}`} />
                  </Shield>
                  <span className={`font-sans text-[10.5px] font-bold tracking-wide ${labelColor}`}>
                    {item.label}
                  </span>
                </>
              )

              const wrapperClass = `flex flex-1 flex-col items-center gap-1 ${
                item.center ? '-mt-8' : 'pt-1'
              }`

              if (item.sheet) {
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSheet(item.sheet)}
                    className={wrapperClass}
                    aria-label={item.label}
                  >
                    {inner}
                  </button>
                )
              }

              return (
                <a key={item.key} href={item.href} className={wrapperClass}>
                  {inner}
                </a>
              )
            })}
          </nav>
        </div>,
        document.getElementById('root')
      )}
    </>
  )
}
