import { useMemo, useState } from 'react'
import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import Strands from './Strands.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import { BLOG_POSTS, BLOG_AUTHOR } from '../data/blog.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { useSeo, ORIGIN, SITE_NAME } from '../lib/seo.js'

/* ------------------------------ Inline icons ----------------------------- */
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

/* Orange L-brackets that frame an element reused from the brand's photo
   framing so the blog feels part of the same "guard" system. */
function CornerBrackets() {
  return (
    <>
      <span className="pointer-events-none absolute -top-px -left-px z-10 h-6 w-6 border-t-[3px] border-l-[3px] border-phsOrange" />
      <span className="pointer-events-none absolute -top-px -right-px z-10 h-6 w-6 border-t-[3px] border-r-[3px] border-phsOrange" />
      <span className="pointer-events-none absolute -bottom-px -left-px z-10 h-6 w-6 border-b-[3px] border-l-[3px] border-phsOrange" />
      <span className="pointer-events-none absolute -bottom-px -right-px z-10 h-6 w-6 border-b-[3px] border-r-[3px] border-phsOrange" />
    </>
  )
}

function PostMeta({ post, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold tracking-widest text-gray-500 ${className}`}>
      <span className="text-phsOrange">{BLOG_AUTHOR.toUpperCase()}</span>
      <span className="text-gray-300">/</span>
      <span>{post.date}</span>
      {post.readTime && (
        <>
          <span className="text-gray-300">/</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {post.readTime.toUpperCase()}
          </span>
        </>
      )}
    </div>
  )
}

/* ------------------------------- Page ---------------------------------- */
export default function BlogPage() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))],
    []
  )
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () => (active === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === active)),
    [active]
  )
  const [featured, ...rest] = filtered

  // SEO: per-page meta + Blog structured data listing every article.
  useSeo({
    title: 'Field Notes Plumbing, HVAC & Home Maintenance Blog | Preventive Home Solutions',
    description:
      'Expert plumbing, heating, cooling and home-maintenance advice for Northern Utah homeowners. Real tips from the licensed techs at Preventive Home Solutions.',
    path: '/blog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${SITE_NAME} Field Notes`,
      description:
        'Plumbing, HVAC and home-maintenance advice for Northern Utah homeowners from Preventive Home Solutions.',
      url: `${ORIGIN}/blog`,
      publisher: { '@type': 'Organization', name: SITE_NAME, logo: `${ORIGIN}/og-image.png` },
      blogPost: BLOG_POSTS.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        image: ORIGIN + p.image,
        datePublished: new Date(p.date).toISOString(),
        articleSection: p.category,
        author: { '@type': 'Organization', name: SITE_NAME },
        description: p.excerpt,
      })),
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* ------------------------------ Hero ----------------------------- */}
      <section className="relative overflow-hidden bg-phsSky text-white">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Strands
            colors={['#f97316', '#ffffff', '#3b82f6']}
            count={3}
            speed={0.5}
            amplitude={1}
            waviness={1}
            thickness={0.6}
            glow={2.6}
            taper={3}
            spread={1}
            hueShift={0}
            intensity={0.6}
            saturation={1.95}
            opacity={0.5}
            scale={2.6}
          />
        </div>
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 text-center lg:py-24">
          <Reveal as="nav" className="mb-6 flex items-center justify-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 sm:text-xs">
            <a href="/" className="transition-colors hover:text-phsNavy">HOME</a>
            <span>/</span>
            <span className="text-phsNavy">FIELD NOTES</span>
          </Reveal>

          <Reveal as="p" delay={100} className="mb-4 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow sm:text-sm">
            The Guard's Field Manual
          </Reveal>

          <Reveal as="h1" delay={150} className="mx-auto max-w-3xl font-display text-4xl font-black leading-[1.03] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
            Tips, Tactics &amp; Field Notes for Your Home
          </Reveal>

          <Reveal as="p" delay={250} className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
            Straight-from-the-truck advice on plumbing, heating, cooling, and seasonal upkeep written by the licensed
            techs who protect Northern Utah homes every day.
          </Reveal>
        </div>
      </section>

      <MarqueeBanner />

      {/* --------------------------- Listing ----------------------------- */}
      <section
        id="blog"
        className="relative scroll-mt-24 bg-[#FAF8F5] py-16 px-6 lg:py-24"
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,37,64,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(10,37,64,0.025) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      >
        <div className="relative mx-auto max-w-[1200px]">
          {/* Category filter chips */}
          <Reveal className="mb-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {categories.map((cat) => {
              const on = active === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition-all duration-300 sm:text-[11px] ${
                    on
                      ? 'border-phsOrange bg-phsOrange text-white shadow-[0_8px_20px_-6px_rgba(243,116,27,0.55)]'
                      : 'border-phsNavy/15 bg-white text-phsNavy/70 hover:border-phsOrange/50 hover:text-phsOrange'
                  }`}
                  aria-pressed={on}
                >
                  {cat}
                </button>
              )
            })}
          </Reveal>

          {/* Featured post */}
          {featured && (
            <Reveal
              as="article"
              variant="up"
              className="group mb-12 overflow-hidden rounded-3xl border border-[#e6ded4] bg-white shadow-[0_24px_55px_-20px_rgba(10,37,64,0.28)]"
            >
              <a href={`/blog/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100 lg:aspect-auto">
                <CornerBrackets />
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-5 left-5 z-20 rounded bg-phsOrange px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-white shadow-sm">
                  FEATURED · {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <PostMeta post={featured} className="mb-4" />
                <h2 className="font-display text-2xl font-black leading-[1.1] tracking-tight text-phsNavy transition-colors duration-300 group-hover:text-phsOrange sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-gray-500">{featured.excerpt}</p>
                <span className="mt-7 inline-flex w-fit items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-phsOrange transition-colors group-hover:text-phsOrangeDark">
                  READ ARTICLE
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
              </a>
            </Reveal>
          )}

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal
                key={post.slug}
                as="article"
                variant="up"
                delay={(i % 3) * 110}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6ded4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_24px_45px_-18px_rgba(10,37,64,0.3)]"
              >
                <a href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/65 via-phsNavy/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute top-4 left-4 z-10 rounded bg-phsOrange px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-white shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <PostMeta post={post} className="mb-3" />
                  <h3 className="mb-3 font-display text-[17px] font-bold leading-snug text-phsNavy transition-colors duration-300 group-hover:text-phsOrange">
                    {post.title}
                  </h3>
                  <p className="mb-6 flex-1 text-[14px] leading-relaxed text-gray-500">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-phsOrange transition-colors duration-300 group-hover:text-phsOrangeDark">
                      READ MORE
                      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="font-display text-xs font-black text-phsNavy/10">PHS</span>
                  </div>
                </div>
                </a>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center font-mono text-sm tracking-widest text-phsNavy/50">
              No articles in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* ----------------------------- CTA band -------------------------- */}
      <section className="relative overflow-hidden bg-phsNavy py-16 px-6 text-white lg:py-20">
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-phsSky/30 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-3 font-mono text-xs font-bold tracking-[0.28em] text-phsOrange">NEED REINFORCEMENTS?</p>
            <h2 className="max-w-xl font-display text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              Spotted a problem in one of these articles at your place?
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/90">
              Our licensed techs are a phone call away same-week service across Northern Utah.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href="/#scheduling"
              className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              BOOK NOW
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20"
            >
              <PhoneIcon className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
