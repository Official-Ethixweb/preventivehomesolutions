import { useEffect, useState } from 'react'

/**
 * Fixed scroll-progress strip pinned to the top of the viewport: a dark ink
 * track with an orange fill that grows from 0% to 100% as the user scrolls
 * down the page.
 */
export default function TopBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1.5 bg-phsInk">
      <div
        className="h-full bg-phsOrange transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
