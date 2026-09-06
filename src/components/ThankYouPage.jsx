import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useSeo } from '../lib/seo.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8 12.5 2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Reached after any lead form submits successfully (see submitLead in
   src/lib/submitForm.js, which navigates here once the conversion fires). */
export default function ThankYouPage() {
  useSeo({
    title: 'Thank You | Preventive Home Solutions',
    description: "We've received your request and will be in touch shortly.",
    path: '/thank-you',
    noindex: true,
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>
        <section className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-phsOrange/10 text-phsOrange">
            <CheckIcon className="h-9 w-9" />
          </div>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-phsNavy sm:text-4xl">
            Thanks! We've received your request
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-500 sm:text-base">
            We'll be in touch shortly to confirm the details. For urgent needs, call us at{' '}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-phsOrange">
              {PHONE_DISPLAY}
            </a>.
          </p>
          <a
            href="/"
            className="cta-diag cta-diag-orange mt-9 inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-3.5 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Back to Home
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
