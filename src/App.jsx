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
import ChatBot from './components/ChatBot.jsx'
import { SERVICE_PAGES } from './data/services.js'
import { BLOG_POSTS } from './data/blog.js'
import { usePath, useLinkInterceptor } from './router.js'
import { setLoading } from './loading.js'
import { useEffect, lazy, Suspense } from 'react'

// Secondary routes are code-split so the home page bundle stays lean and never
// ships the service/blog/about page code (or their gsap/ogl dependencies).
const ServicePage = lazy(() => import('./components/ServicePage.jsx'))
const BlogPage = lazy(() => import('./components/BlogPage.jsx'))
const ArticlePage = lazy(() => import('./components/ArticlePage.jsx'))
const AboutPage = lazy(() => import('./components/AboutPage.jsx'))


// Map URL paths to the service-page slugs that drive ServicePage.
const ROUTES = {
  '/plumbing': 'plumbing',
  '/hvac': 'hvac',
  '/ac': 'ac',
}

export default function App() {
  useLinkInterceptor()
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

  const slug = ROUTES[path]
  let page
  if (path === '/about-us') {
    page = <AboutPage />
  } else if (path === '/blog') {
    page = <BlogPage />
  } else if (path.startsWith('/blog/')) {
    const postSlug = path.slice('/blog/'.length).replace(/\/$/, '')
    const post = BLOG_POSTS.find((p) => p.slug === postSlug)
    page = post ? <ArticlePage post={post} /> : <BlogPage />
  } else if (slug && SERVICE_PAGES[slug]) {
    page = <ServicePage slug={slug} />
  } else {
    page = <Home />
  }

  return (
    <>
      <Suspense fallback={null}>{page}</Suspense>
      <ChatBot />
      <Loader />
    </>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <Hero />
      <div className="relative z-10 lg:-mt-[230px]">
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
      <Footer />
    </div>
  )
}
