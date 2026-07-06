import { useEffect, useRef, useState, lazy, Suspense } from 'react'

// ogl (WebGL) is heavy and the effect is purely decorative, so it is split into
// its own chunk and only loaded once the band actually reaches the viewport.
const Strands = lazy(() => import('./Strands.jsx'))

/**
 * Renders the Strands effect as a viewport-fixed background that stays locked
 * in the middle of the screen while you scroll through its parent band.
 *
 * It is only shown while the parent band crosses the vertical center of the
 * viewport (via an IntersectionObserver with a center-line root margin), so the
 * glow never bleeds onto the sections above or below the band.
 *
 * Must be placed as a direct child of the band element it should track.
 */
export default function BandStrands(props) {
  const anchorRef = useRef(null)
  const [active, setActive] = useState(false)
  // Once the band has been reached once, keep the chunk mounted so re-entering
  // doesn't re-initialize WebGL; visibility is handled purely via opacity.
  const [everActive, setEverActive] = useState(false)

  useEffect(() => {
    const band = anchorRef.current?.parentElement
    if (!band) return

    // The WebGL glow is decorative and costs a continuous main-thread render
    // loop (plus the ogl + Strands chunk download). Skip it entirely on small
    // screens and for reduced-motion users, where that cost hurts most and the
    // effect is least visible.
    const skip =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) setEverActive(true)
      },
      // 0-height root line at the vertical center of the viewport: active only
      // while the band is the thing occupying the middle of the screen.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    io.observe(band)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={anchorRef} aria-hidden="true">
      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {everActive && (
          <Suspense fallback={null}>
            <Strands {...props} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
