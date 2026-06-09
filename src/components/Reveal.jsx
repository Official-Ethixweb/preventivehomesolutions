import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal wrapper. Fades + slides its children into view the first time
 * they enter the viewport, using a single IntersectionObserver per instance.
 *
 * Respects `prefers-reduced-motion`: motion-averse users see content
 * immediately with no transition.
 *
 * Usage:
 *   <Reveal>...</Reveal>                         // fade up (default)
 *   <Reveal variant="left" delay={150}>...</Reveal>
 *   <Reveal as="article" className="...">...</Reveal>
 *
 * Props:
 *   as       - element/tag to render (default 'div')
 *   variant  - 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
 *   delay    - stagger delay in ms
 *   once     - animate only the first time (default true)
 */
const HIDDEN = {
  up: 'opacity-0 translate-y-8',
  down: 'opacity-0 -translate-y-8',
  left: 'opacity-0 translate-x-10',
  right: 'opacity-0 -translate-x-10',
  fade: 'opacity-0',
  scale: 'opacity-0 scale-95',
}

const SHOWN = 'opacity-100 translate-x-0 translate-y-0 scale-100'

export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  variant = 'up',
  delay = 0,
  once = true,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip animation entirely for users who prefer reduced motion.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? SHOWN : HIDDEN[variant] ?? HIDDEN.up
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
