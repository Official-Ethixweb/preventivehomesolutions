import { useEffect } from 'react'

// Microsoft Clarity — heatmaps + session recordings.
//
// Answers the question GA4 can't: *where* people click, how far they scroll,
// and where they give up. Clarity records the DOM (not video), so recordings
// replay as real pages and heatmaps are computed per URL.
//
// Same contract as analytics.js: the Project ID is read from
// VITE_CLARITY_PROJECT_ID (public — it ships in the bundle either way), and
// when it isn't set every function here is a no-op, so local dev and Vercel
// previews never record a session.
//
// Loading is deferred to browser idle: the tag is ~50 KB and nothing about it
// is needed for first paint, so it must not compete with the LCP image or the
// main bundle. Clarity buffers from the moment it boots, and idle fires well
// inside a normal visit — no meaningful data is lost.

export const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || ''
export const clarityConfigured = Boolean(CLARITY_PROJECT_ID)

/** Inject the Clarity tag once. */
export function initClarity() {
  if (!clarityConfigured || typeof window === 'undefined') return
  if (window.__phsClarityInit) return
  window.__phsClarityInit = true

  // Clarity's own bootstrap shim: queues calls made before the script lands.
  window.clarity = window.clarity || function clarity() {
    ;(window.clarity.q = window.clarity.q || []).push(arguments)
  }

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
  document.head.appendChild(s)
}

/**
 * Tag the current session so recordings can be filtered in the Clarity UI —
 * e.g. clarityTag('lead', 'form') to jump straight to sessions that converted.
 * Safe to call whether or not Clarity is configured.
 */
export function clarityTag(key, value) {
  if (typeof window === 'undefined' || typeof window.clarity !== 'function') return
  window.clarity('set', key, String(value))
}

/**
 * App-level hook. Boots Clarity once the browser is idle.
 *
 * SPA route changes need no wiring: Clarity patches the History API itself and
 * starts a fresh page for each pushState, so /plumbing and /leak-detection get
 * their own heatmaps even though the app never reloads.
 */
export function useClarity() {
  useEffect(() => {
    if (!clarityConfigured) return
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500))
    const cic = window.cancelIdleCallback || clearTimeout
    const id = ric(() => initClarity(), { timeout: 3000 })
    return () => cic(id)
  }, [])
}
