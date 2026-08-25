import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useSeo } from '../lib/seo.js'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS, areaHref } from '../data/nav.js'

/* Rendered for any path the router doesn't recognize (old links, typos,
   removed pages). Noindexed so it never competes with real pages in search,
   but still a real, useful page — not a dead end — since some visitors will
   land here from stale backlinks or bookmarks. */
export default function NotFoundPage() {
  useSeo({
    title: 'Page Not Found | Preventive Home Solutions',
    description: 'The page you were looking for could not be found. Find plumbing and HVAC services in Layton, UT and Northern Utah.',
    path: typeof window !== 'undefined' ? window.location.pathname : '/404',
    noindex: true,
  })

  const popularLinks = [
    { label: 'Plumbing Services', href: '/plumbing' },
    { label: 'Heating & HVAC', href: '/hvac' },
    { label: 'Air Conditioning', href: '/ac' },
    { label: 'Water Heater Repair', href: '/water-heater-repair' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>
        <section className="mx-auto flex min-h-[50vh] max-w-[820px] flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-phsOrange">
            404 Error
          </p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-phsNavy sm:text-4xl">
            We couldn't find that page
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-500 sm:text-base">
            The page you're looking for may have been moved or no longer exists. Here are a few
            places to start, or call us directly at{' '}
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

          <div className="mt-14 w-full border-t border-gray-100 pt-10">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Popular Services
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {popularLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-phsNavy transition hover:border-phsOrange hover:text-phsOrange"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 w-full">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Service Areas
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {SERVICE_AREAS.map((city) => (
                <a
                  key={city}
                  href={areaHref(city)}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-phsNavy transition hover:border-phsOrange hover:text-phsOrange"
                >
                  {city}, UT
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
