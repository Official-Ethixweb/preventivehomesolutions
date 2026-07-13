import { LICENSE_NUMBER, PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { FULL_ADDRESS, BUSINESS } from '../data/business.js'

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#29ABE2] text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-16 pb-28 text-center lg:pb-16">
        {/* Logo */}
        <img
          src="/main logo.webp"
          alt="Preventive Home Solutions"
          width="420"
          height="420"
          loading="lazy"
          decoding="async"
          className="h-24 w-auto"
        />

        {/* Tagline */}
        <p className="mt-4 font-sans text-lg font-bold text-white">
          Licensed &amp; Insured Plumbing, Heating &amp; Cooling — serving Northern Utah
        </p>

        {/* Phone (emphasized) */}
        <p className="mt-3 font-sans text-xl font-black text-white sm:text-2xl">
          Call{' '}
          <a href={`tel:${PHONE_TEL}`} className="underline decoration-2 underline-offset-4 hover:opacity-80">
            {PHONE_DISPLAY}
          </a>{' '}
          for 24/7 service.
        </p>

        {/* Address + email — each on its own line, centered (no clipping) */}
        <div className="mt-6 flex flex-col items-center gap-2 font-sans text-[14px] font-bold text-white/90 sm:text-[15px]">
          <span className="inline-flex items-center gap-2">
            <PinIcon />
            {FULL_ADDRESS}
          </span>
          <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center gap-2 whitespace-nowrap hover:opacity-80">
            <MailIcon />
            {BUSINESS.email}
          </a>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full max-w-xs bg-white/20" />

        {/* Copyright + license + minimal links */}
        <p className="mt-6 font-sans text-[13px] text-white/80">
          © {new Date().getFullYear()} Preventive Home Solutions. All rights reserved. · Lic. #{LICENSE_NUMBER}
        </p>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[13px] font-semibold text-white/80">
          <a href="/accessibility" className="hover:text-white">Accessibility</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
        </nav>
      </div>
    </footer>
  )
}
