import { useEffect, useRef, useCallback, useMemo } from 'react'
import Reveal from './Reveal.jsx'
import './BeforeAfter.css'

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
}

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max)
const round = (v, precision = 3) => parseFloat(v.toFixed(precision))
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin))

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-phsOrange"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 11 2 2 4-4" />
    </svg>
  )
}

export default function BeforeAfter() {
  const wrapRef = useRef(null)
  const shellRef = useRef(null)
  const enterTimerRef = useRef(null)
  const leaveRafRef = useRef(null)

  const tiltEngine = useMemo(() => {
    let rafId = null
    let running = false
    let lastTs = 0

    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const DEFAULT_TAU = 0.14
    const INITIAL_TAU = 0.6
    let initialUntil = 0

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current
      const wrap = wrapRef.current
      if (!shell || !wrap) return

      const width = shell.clientWidth || 1
      const height = shell.clientHeight || 1

      const percentX = clamp((100 / width) * x)
      const percentY = clamp((100 / height) * y)

      const centerX = percentX - 50
      const centerY = percentY - 50

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      }

      for (const [k, v] of Object.entries(properties)) {
        wrap.style.setProperty(k, v)
      }
    }

    const step = (ts) => {
      if (!running) return
      if (lastTs === 0) lastTs = ts
      const dt = (ts - lastTs) / 1000
      lastTs = ts

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU
      const k = 1 - Math.exp(-dt / tau)

      currentX += (targetX - currentX) * k
      currentY += (targetY - currentY) * k

      setVarsFromXY(currentX, currentY)

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step)
      } else {
        running = false
        lastTs = 0
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }
    }

    const start = () => {
      if (running) return
      running = true
      lastTs = 0
      rafId = requestAnimationFrame(step)
    }

    return {
      setImmediate(x, y) {
        currentX = x
        currentY = y
        setVarsFromXY(currentX, currentY)
      },
      setTarget(x, y) {
        targetX = x
        targetY = y
        start()
      },
      toCenter() {
        const shell = shellRef.current
        if (!shell) return
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2)
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs
        start()
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY }
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
        running = false
        lastTs = 0
      }
    }
  }, [])

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect()
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top }
  }

  const handlePointerMove = useCallback(
    (event) => {
      const shell = shellRef.current
      if (!shell || !tiltEngine) return
      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine]
  )

  const handlePointerEnter = useCallback(
    (event) => {
      const shell = shellRef.current
      if (!shell || !tiltEngine) return

      shell.classList.add('active')
      shell.classList.add('entering')
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering')
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS)

      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine]
  )

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current
    if (!shell || !tiltEngine) return

    tiltEngine.toCenter()

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent()
      const settled = Math.hypot(tx - x, ty - y) < 0.6
      if (settled) {
        shell.classList.remove('active')
        leaveRafRef.current = null
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle)
      }
    }
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current)
    leaveRafRef.current = requestAnimationFrame(checkSettle)
  }, [tiltEngine])

  useEffect(() => {
    if (!tiltEngine) return

    const shell = shellRef.current
    if (!shell) return

    const pointerMoveHandler = handlePointerMove
    const pointerEnterHandler = handlePointerEnter
    const pointerLeaveHandler = handlePointerLeave

    // Attach local handlers for direct hover interactions
    shell.addEventListener('pointerenter', pointerEnterHandler)
    shell.addEventListener('pointermove', pointerMoveHandler)
    shell.addEventListener('pointerleave', pointerLeaveHandler)

    // Also attach a global pointermove while the card is visible in the viewport
    // so it responds to the mouse even when not hovered directly. Use
    // IntersectionObserver to enable global tracking only when the element is
    // onscreen and disable it when scrolled away to save resources.
    let globalAttached = false
    const onVisibility = (entries) => {
      const e = entries[0]
      if (e && e.isIntersecting) {
        if (!globalAttached) {
          document.addEventListener('pointermove', pointerMoveHandler)
          globalAttached = true
        }
      } else {
        if (globalAttached) {
          document.removeEventListener('pointermove', pointerMoveHandler)
          globalAttached = false
          // Smoothly return the card to center when it leaves view
          handlePointerLeave()
        }
      }
    }

    const observer = new IntersectionObserver(onVisibility, {
      root: null,
      threshold: 0.05
    })
    // Observe the outer wrapper if available, fallback to shell
    const observed = wrapRef.current || shell
    observer.observe(observed)

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET
    tiltEngine.setImmediate(initialX, initialY)
    tiltEngine.toCenter()
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION)

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler)
      shell.removeEventListener('pointermove', pointerMoveHandler)
      shell.removeEventListener('pointerleave', pointerLeaveHandler)
      if (globalAttached) document.removeEventListener('pointermove', pointerMoveHandler)
      observer.disconnect()
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current)
      tiltEngine.cancel()
      shell.classList.remove('entering')
    }
  }, [tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave])

  return (
    <section className="relative z-10 bg-[#FAF8F5] py-16 lg:py-24 px-6 border-t border-[#e6ded4]">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Main Section Header */}
        <Reveal className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-3">
            Real Results
          </p>
          <h2 className="font-display font-black text-phsNavy text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] ">
            BEFORE &amp; AFTER.
          </h2>
        </Reveal>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive 3D Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <Reveal variant="scale" delay={150} className="w-full max-w-[480px]">
              <div ref={wrapRef} className="pc-card-wrapper">
                <div className="pc-behind" />
                <div ref={shellRef} className="pc-card-shell">
                  <section className="pc-card ba-card">
                    <div className="pc-inside">
                      <div className="pc-shine" />
                      <div className="pc-glare" />
                      
                      {/* Image content layer */}
                      <div className="pc-image-container">
                        <img
                          src="/beforeandafterwaterheater.webp"
                          alt="Water heater replacement before and after"
                          width="940"
                          height="788"
                          loading="lazy"
                          decoding="async"
                          className="absolute top-0 left-0 w-full h-[115%] object-cover object-top"
                        />
                        {/* Static Label Overlay inside card */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-phsInk/90 via-phsInk/40 to-transparent p-5 z-10">
                          <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-white">
                            Water Heater Replacement
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Case Study Info */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <Reveal variant="right" delay={200}>
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-phsOrange">
                CASE STUDY
              </span>
              <h3 className="font-display font-black text-phsNavy text-2xl sm:text-3xl mt-2 leading-[1.1]">
                Emergency Plumbing Defense
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-500 font-sans">
                An Ogden homeowner woke up to a leaking, heavily corroded utility room. 
                Our team bypassed the failure within the hour and replaced the failing tank with a premium, energy-efficient system before noon.
              </p>
            </Reveal>

            {/* List of actions/upgrades */}
            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'Emergency Dispatch',
                  desc: 'Technician on-site and water line shut off in under 45 minutes.'
                },
                {
                  title: 'Premium Equipment Upgrade',
                  desc: 'Installed a durable, high-efficiency Rheem Professional gas water heater.'
                },
                {
                  title: 'Safety & Code Upgrades',
                  desc: 'Replaced gas lines, shut-offs, and added a thermal expansion tank to secure full code compliance.'
                },
                {
                  title: 'Guaranteed Protection',
                  desc: 'Backed by a 6-year manufacturer warranty and a 1-year leak-free guarantee.'
                }
              ].map((item, idx) => (
                <Reveal key={item.title} variant="right" delay={250 + idx * 70} className="flex gap-3.5 items-start">
                  <ShieldCheckIcon />
                  <div>
                    <h4 className="font-sans font-bold text-base sm:text-lg text-phsNavy leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-[15px] text-gray-500 mt-1 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bottom CTA */}
            <Reveal variant="right" delay={550} className="mt-8 pt-6 border-t border-[#e6ded4] flex items-center justify-center">
              <a
                href="#scheduling"
                className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-6 py-3.5 font-sans text-xs font-bold tracking-widest text-white shadow-md hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                REQUEST DISPATCH
              </a>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  )
}
