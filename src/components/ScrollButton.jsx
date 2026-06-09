import { useEffect, useState } from 'react'

/** Fixed floating button pinned to the bottom-left of the viewport.
 *  Only appears once the user has scrolled past the hero section. */
export default function ScrollButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href="#scheduling"
      className={`fixed bottom-5 left-5 z-50 animate-float rounded-full bg-phsBlue px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-xl active:scale-95 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      Scroll To Online Scheduling
    </a>
  )
}
