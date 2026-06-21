import { useEffect, useState } from 'react'
import { setLoading } from './loading.js'

// Minimal dependency-free client-side router built on the History API.
// The app is a static Vite SPA, so we keep routing tiny: a path subscription
// hook plus a navigate() helper. Internal <a href="/..."> clicks are
// intercepted globally in App so existing markup keeps using plain anchors.

const NAV_EVENT = 'phs:navigate'

/** Programmatically navigate to an internal path (optionally with #hash). */
export function navigate(to) {
  const [pathname, hash] = String(to).split('#')
  const target = pathname || '/'

  if (target !== window.location.pathname) {
    // Show the loading screen immediately, from the moment of the click, so it
    // covers the transition. App turns it off once the new page is ready.
    setLoading(true)
    window.history.pushState({}, '', target + (hash ? `#${hash}` : ''))
    window.dispatchEvent(new Event(NAV_EVENT))
  }

  if (hash) {
    // The destination page may still be rendering (and its images loading)
    // when we arrive from another route, so poll briefly for the anchor before
    // scrolling instead of assuming it already exists.
    let tries = 0
    const tryScroll = () => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else if (tries++ < 40) {
        setTimeout(tryScroll, 50)
      }
    }
    setTimeout(tryScroll, 60)
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }
}

/** Subscribe to the current pathname; re-renders on navigation + back/forward. */
export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    window.addEventListener(NAV_EVENT, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(NAV_EVENT, sync)
    }
  }, [])

  return path
}

/**
 * Global click interceptor. Turns internal pathname links (href starting with
 * "/", e.g. "/plumbing" or "/#about") into SPA navigations. Hash-only links
 * (#contact), external links, tel:, and modified clicks are left untouched.
 */
export function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = e.target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      e.preventDefault()
      navigate(href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
