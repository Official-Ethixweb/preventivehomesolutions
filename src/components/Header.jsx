import { useState } from 'react'

const PHONE = '(385) 453-9428'
const LOGO_SRC = '/preventive-home-solutions-logo-1-1-1536x772.jpg'

// color: 'blue' for Home (active) & Contact Us, 'orange' for the rest
const topLinks = [
  { label: 'Home', color: 'blue' },
  { label: 'About', color: 'orange' },
  { label: 'Blog', color: 'orange' },
  { label: 'Preventive Home Tips', color: 'orange' },
  { label: 'Maintenance', color: 'orange' },
  { label: 'Service Area', color: 'orange', hasDropdown: true },
  { label: 'Contact Us', color: 'blue' },
]

const serviceLinks = [
  { label: 'Cooling', hasDropdown: true },
  { label: 'Heating', hasDropdown: true },
  { label: 'Water Heaters', hasDropdown: true },
  { label: 'Drain Clearing', hasDropdown: true },
  { label: 'Plumbing', hasDropdown: true },
]

function Caret() {
  return (
    <svg
      className="ml-1 inline-block h-3 w-3 text-phsOrange"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 8L1.5 3.5h9L6 8z" />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Logo */}
        <a href="#" className="group flex shrink-0 items-center gap-3">
          <img
            src={LOGO_SRC}
            alt="Preventive Home Solutions"
            className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden text-2xl font-bold leading-tight text-phsOrange sm:block">
            Preventive
            <br />
            Home
            <br />
            Solutions
          </span>
        </a>

        {/* Desktop nav (two stacked rows) */}
        <div className="hidden flex-1 flex-col items-end gap-3 xl:flex">
          {/* Row 1 */}
          <nav className="flex w-full items-center justify-end gap-8 border-b border-gray-300 pb-3 text-[17px] font-semibold">
            {topLinks.map((l) => (
              <a
                key={l.label}
                href="#"
                className={`relative flex items-center whitespace-nowrap transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:opacity-80 hover:after:w-full ${
                  l.color === 'blue' ? 'text-phsBlue' : 'text-phsOrange'
                }`}
              >
                {l.label}
                {l.hasDropdown && <Caret />}
              </a>
            ))}
            <a
              href={`tel:${PHONE.replace(/[^0-9]/g, '')}`}
              className="whitespace-nowrap rounded bg-blue-100/70 px-2 py-1 font-bold text-phsBlue"
            >
              {PHONE}
            </a>
          </nav>

          {/* Row 2 */}
          <nav className="flex w-full items-center justify-end gap-9 text-[17px] font-semibold">
            {serviceLinks.map((l) => (
              <a
                key={l.label}
                href="#"
                className="relative flex items-center whitespace-nowrap text-phsOrange transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:opacity-80 hover:after:w-full"
              >
                {l.label}
                {l.hasDropdown && <Caret />}
              </a>
            ))}
            <a
              href="#scheduling"
              className="rounded-xl bg-phsBlue px-7 py-3.5 text-[17px] font-bold text-white shadow transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg active:translate-y-0 active:scale-95"
            >
              Schedule Online
            </a>
          </nav>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 xl:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="animate-slide-down border-t border-gray-200 bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {[...topLinks, ...serviceLinks].map((l) => (
              <a
                key={l.label}
                href="#"
                className={`flex items-center justify-between rounded px-2 py-2.5 text-[15px] font-semibold hover:bg-gray-50 ${
                  l.color === 'blue' ? 'text-phsBlue' : 'text-phsOrange'
                }`}
              >
                <span>{l.label}</span>
                {l.hasDropdown && <Caret />}
              </a>
            ))}
            <a
              href={`tel:${PHONE.replace(/[^0-9]/g, '')}`}
              className="mt-2 px-2 py-2 font-bold text-phsBlue"
            >
              {PHONE}
            </a>
            <a
              href="#scheduling"
              className="mt-2 rounded-md bg-phsBlue px-5 py-3 text-center font-bold text-white"
            >
              Schedule Online
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
