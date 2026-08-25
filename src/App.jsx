import TopBar from './components/TopBar.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MarqueeBanner from './components/MarqueeBanner.jsx'
import Services from './components/Services.jsx'
import WhyChoose from './components/WhyChoose.jsx'
import BeforeAfter from './components/BeforeAfter.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import Process from './components/Process.jsx'
import About from './components/About.jsx'
import BandStrands from './components/BandStrands.jsx'
import AreasWeServe from './components/AreasWeServe.jsx'
import Faq from './components/Faq.jsx'
import Blog from './components/Blog.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'
import AccessibilityWidget from './components/AccessibilityWidget.jsx'
import { SERVICE_PAGES, getSubService } from './data/services.js'
import { LANDING_PAGES } from './data/landingPages.js'
import { BLOG_POSTS } from './data/blog.js'
import { usePath, useLinkInterceptor } from './router.js'
import { useAnalytics } from './lib/analytics.js'
import { setLoading } from './loading.js'
import { useSeo } from './lib/seo.js'
import { localBusinessSchema, faqSchema } from './data/business.js'
import { HOME_FAQS } from './data/homeFaqs.js'
import { useEffect, useState, lazy, Suspense } from 'react'

// The ChatBot (700+ lines) isn't needed for first paint or interaction, so it
// ships in its own chunk and only mounts once the browser is idle — keeping it
// off the critical path for FCP/LCP and out of the main bundle.
const ChatBot = lazy(() => import('./components/ChatBot.jsx'))

/** Mounts its children only after the browser goes idle (or a short timeout). */
function DeferUntilIdle({ children }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500))
    const cic = window.cancelIdleCallback || clearTimeout
    const id = ric(() => setReady(true), { timeout: 3000 })
    return () => cic(id)
  }, [])
  return ready ? children : null
}

// Secondary routes are code-split so the home page bundle stays lean and never
// ships the service/blog/about page code (or their gsap/ogl dependencies).
const ServicePage = lazy(() => import('./components/ServicePage.jsx'))
const SubServicePage = lazy(() => import('./components/SubServicePage.jsx'))
const WaterHeaterPage = lazy(() => import('./components/WaterHeaterPage.jsx'))
const AreaPage = lazy(() => import('./components/AreaPage.jsx'))
const BlogPage = lazy(() => import('./components/BlogPage.jsx'))
const ArticlePage = lazy(() => import('./components/ArticlePage.jsx'))
const AboutPage = lazy(() => import('./components/AboutPage.jsx'))
const LandingPage = lazy(() => import('./components/LandingPage.jsx'))
const AccessibilityPage = lazy(() => import('./components/AccessibilityPage.jsx'))
const ThankYouPage = lazy(() => import('./components/ThankYouPage.jsx'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage.jsx'))


// Map URL paths to the service-page slugs that drive ServicePage.
const ROUTES = {
  '/plumbing': 'plumbing',
  '/hvac': 'hvac',
  '/ac': 'ac',
}

export default function App() {
  useLinkInterceptor()
  useAnalytics()
  const path = usePath()

  // Loading screen: shown on first load and on every route change, hidden once
  // the new page's images have actually finished loading so its duration
  // tracks real load speed (with a min so it doesn't flash, and a max so a slow
  // asset can never leave it stuck).
  useEffect(() => {
    setLoading(true)
    let cancelled = false

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(async () => {
        // Only gate the loader on eagerly-loaded (above-the-fold) images;
        // lazy images load on scroll and must not hold the loader open.
        const imgs = Array.from(
          document.querySelectorAll('#root img:not([loading="lazy"])')
        )
        const imagesReady = Promise.all(
          imgs.map((img) =>
            img.complete
              ? null
              : new Promise((res) => {
                  img.addEventListener('load', res, { once: true })
                  img.addEventListener('error', res, { once: true })
                })
          )
        )
        const minVisible = new Promise((r) => setTimeout(r, 350))
        const maxWait = new Promise((r) => setTimeout(r, 2500))

        await Promise.race([Promise.all([imagesReady, minVisible]), maxWait])
        if (!cancelled) setLoading(false)
      })
    )

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [path])

  // Normalize a single trailing slash once, up front, so every match below
  // (exact-string checks included) treats "/plumbing" and "/plumbing/" the
  // same way — a real page must never 404 just because of a trailing slash.
  // Root "/" is left alone since stripping it would produce an empty string.
  const normalizedPath = path !== '/' ? path.replace(/\/$/, '') : path

  const slug = ROUTES[normalizedPath]
  // Nested sub-service route, e.g. /plumbing/drain-cleaning
  const segments = normalizedPath.split('/').filter(Boolean)
  const subService =
    segments.length === 2 ? getSubService(segments[0], segments[1]) : null

  // Conversion landing pages, e.g. /plumbing-services, /hvac-services.
  const landingKey = normalizedPath.replace(/^\//, '')

  let page
  if (LANDING_PAGES[landingKey]) {
    page = <LandingPage slug={landingKey} data={LANDING_PAGES[landingKey]} />
  } else if (normalizedPath === '/water-heater-repair') {
    page = <WaterHeaterPage />
  } else if (normalizedPath.startsWith('/service-areas/')) {
    const citySlug = normalizedPath.slice('/service-areas/'.length)
    page = <AreaPage slug={citySlug} />
  } else if (normalizedPath === '/about-us') {
    page = <AboutPage />
  } else if (normalizedPath === '/accessibility') {
    page = <AccessibilityPage />
  } else if (normalizedPath === '/thank-you') {
    page = <ThankYouPage />
  } else if (normalizedPath === '/blog') {
    page = <BlogPage />
  } else if (normalizedPath.startsWith('/blog/')) {
    const postSlug = normalizedPath.slice('/blog/'.length)
    const post = BLOG_POSTS.find((p) => p.slug === postSlug)
    page = post ? <ArticlePage post={post} /> : <NotFoundPage />
  } else if (subService) {
    page = <SubServicePage parentSlug={segments[0]} childSlug={segments[1]} />
  } else if (slug && SERVICE_PAGES[slug]) {
    page = <ServicePage slug={slug} />
  } else if (normalizedPath === '/') {
    page = <Home />
  } else {
    page = <NotFoundPage />
  }

  return (
    <>
      {/* Everything visual lives inside #a11y-root so the accessibility widget
          can zoom/recolor the page without affecting its own controls. */}
      <div id="a11y-root">
        <Suspense fallback={null}>{page}</Suspense>
      </div>
      <DeferUntilIdle>
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      </DeferUntilIdle>
      <AccessibilityWidget />
      <Loader />
    </>
  )
}

function Home() {
  useSeo({
    title: 'Plumbing & HVAC in Layton, UT | Preventive Home Solutions',
    description:
      'Licensed plumbing, heating & cooling in Layton, UT and Northern Utah. Fast repairs, installs & maintenance, 7 days a week. Call (385) 453-9428.',
    path: '/',
    jsonLd: [localBusinessSchema(), faqSchema(HOME_FAQS)].filter(Boolean),
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>
      <Hero />
      <div className="relative z-10 lg:-mt-[147px]">
        <MarqueeBanner />
      </div>
      <Services />
      <WhyChoose />
      <BeforeAfter />

      {/* Shared band: CtaBanner + Process + About */}
      <div className="relative bg-phsSky">
        {/* Animated strands background fixed in the middle of the viewport while
            scrolling through the band, and only shown while the band is centered. */}
        <BandStrands
          colors={['#f97316', '#000000', '#3b82f6']}
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
          opacity={0.48}
          scale={2.6}
          glass={false}
        />

        <div className="relative z-10">
          <CtaBanner />
          <Process />
          <About />
        </div>
      </div>

      <AreasWeServe />
      <Faq />
      <Blog />
      <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
