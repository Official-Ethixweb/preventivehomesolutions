import { useEffect, useRef, useState } from 'react'
import BottomNav from './BottomNav.jsx'
import { SERVICE_GROUPS, SERVICE_AREAS, PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

const LOGO_SRC = '/main logo.png'

const SERVICES = Array.from(new Set(SERVICE_GROUPS.flatMap(g => g.items)))

const MENUS = {
  services: { label: 'Services', items: SERVICES },
  areas: { label: 'Areas We Serve', items: SERVICE_AREAS },
}

function CaretIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null) // 'services' | 'areas' | null
  const [query, setQuery] = useState('')

  // Swap to a compact, pinned nav once the user scrolls past the full header.
  // (position:sticky is unreliable here because an ancestor uses overflow-x:
  // hidden, so the compact bar is a separate position:fixed overlay instead.)
  const fullHeaderRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const h = fullHeaderRef.current?.offsetHeight ?? 120
      setScrolled(window.scrollY > h - 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Keep showing the last menu's content while the panel fades out.
  const lastKeyRef = useRef('services')
  if (openMenu) lastKeyRef.current = openMenu
  const display = MENUS[openMenu ?? lastKeyRef.current]
  
  const isServices = (openMenu ?? lastKeyRef.current) === 'services'

  const filteredGroups = isServices
    ? SERVICE_GROUPS.map((group) => {
        const filteredItems = group.items.filter((item) =>
          item.toLowerCase().includes(query.trim().toLowerCase())
        )
        return { ...group, filteredItems }
      }).filter((group) => group.filteredItems.length > 0)
    : []

  const filteredAreas = !isServices
    ? SERVICE_AREAS.filter((area) =>
        area.toLowerCase().includes(query.trim().toLowerCase())
      )
    : []

  const showMenu = (key) => {
    setOpenMenu(key)
    setQuery('')
  }
  const closeMenu = () => {
    setOpenMenu(null)
    setQuery('')
  }

  const navLinkClass =
    'font-sans text-[15px] font-semibold text-phsInk/75 transition-colors hover:text-phsInk'

  // Desktop nav links (services + areas open the dropdown; about/blog jump).
  // Shared by the full header and the compact sticky nav.
  const renderNavLinks = (extraClass = '') => (
    <nav className={`hidden items-center gap-6 lg:flex ${extraClass}`}>
      <button
        type="button"
        onMouseEnter={() => showMenu('services')}
        aria-expanded={openMenu === 'services'}
        aria-haspopup="true"
        className={`flex items-center gap-1 ${navLinkClass}`}
      >
        Services
        <CaretIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${openMenu === 'services' ? 'rotate-180' : ''}`} />
      </button>
      <button
        type="button"
        onMouseEnter={() => showMenu('areas')}
        aria-expanded={openMenu === 'areas'}
        aria-haspopup="true"
        className={`flex items-center gap-1 ${navLinkClass}`}
      >
        Areas We Serve
        <CaretIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${openMenu === 'areas' ? 'rotate-180' : ''}`} />
      </button>
      <a href="/about-us" onMouseEnter={closeMenu} className={navLinkClass}>
        About Us
      </a>
      <a href="/blog" onMouseEnter={closeMenu} className={navLinkClass}>
        Blog
      </a>
    </nav>
  )

  // The full-width dropdown panel (services / areas grid). Rendered under
  // whichever bar is active the full header or the compact sticky nav.
  const renderMegaMenu = () => (
    <div
      className={`absolute inset-x-0 top-full border-t border-phsSky/10 bg-phsCream shadow-xl transition-all duration-200 ease-out ${
        openMenu ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
      }`}
    >
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-10">
        <div className="mb-4 flex items-center gap-2 rounded-md border border-phsSky/15 bg-white px-3 py-2.5 focus-within:border-phsSky sm:max-w-sm">
          <SearchIcon className="h-4 w-4 shrink-0 text-phsInk/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${display.label.toLowerCase()}…`}
            className="w-full bg-transparent text-sm text-phsInk outline-none placeholder:text-phsInk/40"
          />
        </div>

        {isServices ? (
          filteredGroups.length === 0 ? (
            <p className="py-4 text-sm text-phsInk/40">No matches</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 items-start">
              {filteredGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-3">
                  {group.filteredItems.map((item, idx) => {
                    const isTopItem = idx === 0
                    return (
                      <div
                        key={item}
                        className={`rounded-xl border border-phsSky/10 bg-white/60 px-4 py-3 shadow-sm relative flex flex-col justify-center min-h-[58px] hover:border-phsOrange/30 hover:bg-white transition-all duration-300 ${
                          isTopItem ? 'pt-6' : ''
                        }`}
                      >
                        {isTopItem && (
                          <span className="absolute -top-2.5 left-3 rounded bg-phsOrange px-2.5 py-0.5 text-[7.5px] font-mono font-bold tracking-widest text-white shadow-sm">
                            {group.title}
                          </span>
                        )}

                        <a
                          href="/#services"
                          onClick={closeMenu}
                          className="block text-[13px] font-bold text-phsInk/85 hover:text-phsOrange leading-snug transition-colors duration-200"
                        >
                          {item}
                        </a>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        ) : (
          filteredAreas.length === 0 ? (
            <p className="py-4 text-sm text-phsInk/40">No matches</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 lg:grid-cols-5 items-start">
              {filteredAreas.map((item) => (
                <a
                  key={item}
                  href="/#areas-we-serve"
                  onClick={closeMenu}
                  className="block rounded-xl border border-phsSky/10 bg-white/60 px-4 py-3 shadow-sm flex flex-col justify-center min-h-[58px] text-[13px] font-bold text-phsInk/85 hover:border-phsOrange/30 hover:bg-white hover:text-phsOrange transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Compact, pinned nav that slides in once scrolled past the full header */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-phsCream/95 backdrop-blur shadow-md transition-transform duration-300 ease-out ${
          scrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
        onMouseLeave={closeMenu}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-[clamp(12px,4vw,20px)] sm:px-5 py-2.5 lg:px-10">
          <a href="/" onMouseEnter={closeMenu} className="group flex items-center gap-2.5">
            <img
              src={LOGO_SRC}
              alt="Preventive Home Solutions"
              className="h-[61.6px] lg:h-14 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:block font-display text-base lg:text-lg font-extrabold leading-tight text-phsInk">
              Preventive Home Solutions
            </span>
          </a>
          <div className="flex items-center gap-5 xl:gap-7">
            {renderNavLinks()}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                onMouseEnter={closeMenu}
                className="phone-glow cta-diag cta-diag-white inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 font-sans text-[11px] sm:text-sm font-bold text-phsInk whitespace-nowrap"
              >
                <PhoneIcon className="h-3.5 w-3.5 text-phsSky" />
                {PHONE_DISPLAY}
              </a>
              <a
                href="/#scheduling"
                onMouseEnter={closeMenu}
                className="cta-diag cta-diag-orange rounded-md bg-phsOrange px-3 sm:px-5 py-1.5 sm:py-2.5 font-sans text-[11px] sm:text-sm font-bold text-white shadow-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
        {scrolled && renderMegaMenu()}
      </div>

      <header
        className="relative z-40 w-full bg-phsCream/95 backdrop-blur"
        onMouseLeave={closeMenu}
      >
        <div
          ref={fullHeaderRef}
          className="mx-auto flex max-w-[1500px] items-center justify-center lg:justify-between gap-4 sm:gap-6 px-[clamp(12px,4vw,20px)] sm:px-5 pt-3 pb-[6px] lg:pt-4 lg:px-10"
        >
        {/* Logo */}
        <a
          href="/"
          onMouseEnter={closeMenu}
          className="group flex flex-col items-center gap-1.5 text-center lg:flex-row lg:gap-3 lg:text-left"
        >
          <img
            src={LOGO_SRC}
            alt="Preventive Home Solutions"
            className="h-[clamp(9.8438rem,41.5625vw,13.125rem)] w-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.05] lg:h-[clamp(5.0781rem,9.0625vw,8.75rem)] lg:translate-y-[5px]"
          />
          <span className="font-display text-[clamp(16px,5vw,20px)] sm:text-xl font-extrabold leading-tight text-phsInk lg:max-w-none">
            Preventive Home Solutions
          </span>
        </a>

        {/* Right cluster: nav + phone + CTA grouped together */}
        <div className="hidden items-center gap-5 lg:flex">
          {renderNavLinks('gap-7')}

          {/* Phone as a button */}
          <a
            href={`tel:${PHONE_TEL}`}
            onMouseEnter={closeMenu}
            className="cta-diag cta-diag-white hidden items-center gap-2 rounded-md border border-phsSky/20 bg-white px-4 py-2.5 font-sans text-sm font-bold text-phsInk shadow-sm hover:-translate-y-0.5 hover:shadow-md xl:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>

          {/* Highlighted CTA */}
          <a
            href="/#scheduling"
            onMouseEnter={closeMenu}
            className="cta-diag cta-diag-orange rounded-md bg-phsOrange px-6 py-3 font-sans text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            Get Free Quote
          </a>
        </div>

      </div>

      {/* Mobile bottom navigation (replaces the hamburger) */}
      <BottomNav />

      {/* Full-width mega menu under the full header */}
      {renderMegaMenu()}
    </header>
    </>
  )
}
