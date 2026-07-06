import { useState } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import { BLOG_POSTS, BLOG_AUTHOR } from '../data/blog.js'
import { POST_CONTENT } from '../data/postContent.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { useSeo, ORIGIN, SITE_NAME } from '../lib/seo.js'

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
function ClockIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-[#e6ded4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-[15px] font-bold text-phsNavy sm:text-base">{q}</span>
        <span className={`shrink-0 text-phsOrange transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[15px] leading-relaxed text-gray-500">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function ArticlePage({ post }) {
  const content = POST_CONTENT[post.slug]

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  )
    .concat(BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3)

  const published = new Date(post.date).toISOString()
  const faqs = content?.faqs ?? []

  useSeo({
    title: content?.metaTitle ?? `${post.title} | ${SITE_NAME}`,
    description: content?.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: content?.metaDescription ?? post.excerpt,
        image: ORIGIN + post.image,
        datePublished: published,
        dateModified: published,
        articleSection: post.category,
        keywords: (content?.keywords ?? []).join(', '),
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${ORIGIN}/og-image.png` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${ORIGIN}/blog/${post.slug}` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${ORIGIN}/blog/${post.slug}` },
        ],
      },
      ...(faqs.length
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]
        : []),
    ],
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ------------------------------ Hero ----------------------------- */}
      <article>
        <header className="bg-phsSky text-white">
          <div className="mx-auto max-w-[820px] px-6 py-14 lg:py-20">
            <Reveal as="nav" className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-white/90">
              <a href="/" className="transition-colors hover:text-phsOrange">HOME</a>
              <span>/</span>
              <a href="/blog" className="transition-colors hover:text-phsOrange">BLOG</a>
              <span>/</span>
              <span className="text-phsOrange">{post.category}</span>
            </Reveal>

            <Reveal as="span" delay={80} className="inline-block bg-phsOrange px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-white">
              {post.category}
            </Reveal>

            <Reveal as="h1" delay={120} className="mt-5 font-display text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.9rem]">
              {post.title}
            </Reveal>

            <Reveal delay={200} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] font-bold tracking-widest text-white/55">
              <span className="text-phsOrange">{BLOG_AUTHOR.toUpperCase()}</span>
              <span className="text-white/25">/</span>
              <span>{post.date}</span>
              {post.readTime && (
                <>
                  <span className="text-white/25">/</span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {post.readTime.toUpperCase()}
                  </span>
                </>
              )}
            </Reveal>
          </div>
        </header>

        {/* Featured image */}
        <div className="bg-phsSky">
          <div className="mx-auto max-w-[920px] px-6">
            <Reveal variant="scale" className="relative -mb-16 aspect-[16/8] w-full overflow-hidden bg-gray-100 shadow-2xl">
              <span className="pointer-events-none absolute -top-px -left-px z-10 h-8 w-8 border-t-[3px] border-l-[3px] border-phsOrange" />
              <span className="pointer-events-none absolute -top-px -right-px z-10 h-8 w-8 border-t-[3px] border-r-[3px] border-phsOrange" />
              <span className="pointer-events-none absolute -bottom-px -left-px z-10 h-8 w-8 border-b-[3px] border-l-[3px] border-phsOrange" />
              <span className="pointer-events-none absolute -bottom-px -right-px z-10 h-8 w-8 border-b-[3px] border-r-[3px] border-phsOrange" />
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            </Reveal>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white pt-28 pb-16 lg:pb-24">
          <div className="mx-auto max-w-[760px] px-6">
            {content ? (
              <div className="blog-prose" dangerouslySetInnerHTML={{ __html: content.body }} />
            ) : (
              <p className="text-gray-500">{post.excerpt}</p>
            )}

            {/* Inline CTA */}
            <div className="mt-12 border border-[#e6ded4] bg-[#FAF8F5] p-7 text-center">
              <p className="font-mono text-[11px] font-bold tracking-[0.22em] text-phsOrange">PREVENTIVE HOME SOLUTIONS</p>
              <p className="mt-3 font-display text-xl font-black leading-tight text-phsNavy sm:text-2xl">
                Need this handled by a licensed pro?
              </p>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-gray-500">
                Same-week plumbing, heating &amp; cooling service across Northern Utah.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/#scheduling"
                  className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-3.5 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  BOOK NOW
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-phsNavy/20 bg-white px-7 py-3.5 font-sans text-sm font-bold tracking-[0.12em] text-phsNavy shadow-sm transition-all duration-300 hover:border-phsOrange hover:text-phsOrange"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bg-[#FAF8F5] py-16 px-6 lg:py-20">
            <div className="mx-auto max-w-[760px]">
              <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange">
                FREQUENTLY ASKED
              </Reveal>
              <Reveal as="h2" delay={100} className="mb-8 font-display text-2xl font-black tracking-tight text-phsNavy sm:text-3xl">
                Questions homeowners ask us
              </Reveal>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-white py-16 px-6 lg:py-20">
          <div className="mx-auto max-w-[1200px]">
            <Reveal as="p" className="mb-3 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange">
              KEEP READING
            </Reveal>
            <Reveal as="h2" delay={100} className="mb-8 font-display text-2xl font-black tracking-tight text-phsNavy sm:text-3xl">
              More from the Field Manual
            </Reveal>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal
                  key={p.slug}
                  as="article"
                  variant="up"
                  delay={i * 110}
                  className="group flex flex-col overflow-hidden border border-[#e6ded4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_24px_45px_-18px_rgba(10,37,64,0.3)]"
                >
                  <a href={`/blog/${p.slug}`} className="flex flex-1 flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                      <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute top-4 left-4 z-10 bg-phsOrange px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-white">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 font-display text-[17px] font-bold leading-snug text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                        {p.title}
                      </h3>
                      <p className="mb-5 flex-1 text-[14px] leading-relaxed text-gray-500">{p.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-phsOrange">
                        READ MORE
                        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <a href="/blog" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-phsNavy transition-colors hover:text-phsOrange">
                VIEW ALL ARTICLES
                <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
