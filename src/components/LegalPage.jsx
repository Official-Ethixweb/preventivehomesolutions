import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useSeo } from '../lib/seo.js'
import { breadcrumbSchema } from '../data/business.js'
import { LEGAL_LAST_UPDATED } from '../data/legal.js'

/* Shared layout for /privacy-policy and /terms-and-conditions. Deliberately
   plain (no WebGL/animation): these are reference pages people read or link
   to from forms, so fast, stable, printable text matters most. */
export default function LegalPage({ doc }) {
  useSeo({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: doc.path,
    jsonLd: [breadcrumbSchema({ label: doc.title, pageUrl: doc.path })],
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>
        <section className="bg-phsSky text-white">
          <div className="mx-auto max-w-[820px] px-6 py-14 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-white/90">
              <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
              <span>/</span>
              <span className="text-phsOrange">{doc.title.toUpperCase()}</span>
            </nav>
            <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">{doc.title}</h1>
            <p className="mt-4 font-mono text-xs font-bold tracking-[0.18em] text-white/80">
              LAST UPDATED: {LEGAL_LAST_UPDATED.toUpperCase()}
            </p>
          </div>
        </section>

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[820px] px-6 text-[15px] leading-relaxed text-gray-600 sm:text-base">
            <p className="text-gray-700">{doc.intro}</p>

            {doc.sections.map((section) => (
              <div key={section.heading} className="mt-10">
                <h2 className="font-display text-2xl font-black tracking-tight text-phsNavy">{section.heading}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-3">{p}</p>
                ))}
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-phsOrange">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {doc.links?.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <h2 className="font-display text-lg font-black tracking-tight text-phsNavy">Related Links</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {doc.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="font-semibold text-phsOrange underline underline-offset-2 hover:text-phsOrangeDark"
                        {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
