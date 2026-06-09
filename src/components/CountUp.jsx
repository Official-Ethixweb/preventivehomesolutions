import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 up to `end` the first time it scrolls into view, using an
 * eased requestAnimationFrame loop. Respects `prefers-reduced-motion` by
 * jumping straight to the final value.
 *
 * Usage:
 *   <CountUp end={35} suffix="+" className="text-[10rem] font-extrabold" />
 */
export default function CountUp({ end, suffix = '', prefix = '', duration = 1800, className = '' }) {
  const ref = useRef(null)
  const started = useRef(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setValue(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
