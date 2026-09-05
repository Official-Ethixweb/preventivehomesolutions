import { useState, useEffect } from 'react'

/**
 * Subscribes to a CSS media query and re-renders when it flips.
 *
 * Use this only when the two states need genuinely different markup — the
 * shield-vs-card form, say, where rendering both and hiding one with `lg:hidden`
 * would put two copies of the same fields (and two reCAPTCHA widgets) in the
 * DOM. For anything that is purely visual, prefer Tailwind's own breakpoints.
 *
 * The app is client-rendered, so reading matchMedia during the first render is
 * safe; there is no server pass to disagree with.
 *
 *   const isDesktop = useMediaQuery('(min-width: 1024px)')  // Tailwind `lg`
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const sync = () => setMatches(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [query])

  return matches
}
