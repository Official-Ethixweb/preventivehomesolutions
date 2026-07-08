import { useEffect, useState, useCallback } from 'react'

/**
 * Accessibility widget: a floating bottom-left button that opens a panel of
 * real, CSS-driven adjustments (no third-party overlay script). Every setting
 * is applied by toggling a class / CSS variable on <html> and is persisted to
 * localStorage so it survives reloads and route changes.
 *
 * The visual changes are scoped to the `#a11y-root` wrapper (see App.jsx) so
 * the widget's own controls are never zoomed, recolored, or re-fonted.
 */

const STORAGE_KEY = 'phs_a11y'

const DEFAULTS = {
  fontPct: 100, // 90–150 in steps of 10
  contrast: false,
  readable: false,
  links: false,
  cursor: false,
  motion: false,
}

const FONT_MIN = 90
const FONT_MAX = 150
const FONT_STEP = 10

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULTS }
}

/** Push the current settings onto <html> (classes + zoom variable). */
function applyState(s) {
  const root = document.documentElement
  root.style.setProperty('--a11y-zoom', String(s.fontPct / 100))
  root.classList.toggle('a11y-contrast', s.contrast)
  root.classList.toggle('a11y-readable', s.readable)
  root.classList.toggle('a11y-links', s.links)
  root.classList.toggle('a11y-cursor', s.cursor)
  root.classList.toggle('a11y-nomotion', s.motion)
}

/* --------------------------------- icons --------------------------------- */
const AccessibilityIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="3.8" r="2" />
    <path d="M21 8.5c0 .8-.6 1.4-1.4 1.5l-4.1.5v3l1.9 6.3a1.4 1.4 0 1 1-2.7.8L12 15.8l-2.7 4.8a1.4 1.4 0 1 1-2.7-.8l1.9-6.3v-3l-4.1-.5A1.45 1.45 0 0 1 4.6 7.6l4.9.9c1.7.3 3.3.3 5 0l4.9-.9c.8-.1 1.6.4 1.6 1.4z" />
  </svg>
)

/* ------------------------------- component ------------------------------- */
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState(DEFAULTS)

  // Hydrate from storage once, on mount.
  useEffect(() => {
    const s = loadState()
    setState(s)
    applyState(s)
  }, [])

  // Persist + apply on every change.
  const update = useCallback((patch) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      applyState(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const reset = useCallback(() => update(DEFAULTS), [update])

  const toggles = [
    { key: 'contrast', label: 'High contrast', desc: 'Boost color contrast' },
    { key: 'readable', label: 'Readable font', desc: 'Legible font & spacing' },
    { key: 'links', label: 'Highlight links', desc: 'Underline & outline links' },
    { key: 'cursor', label: 'Bigger cursor', desc: 'Enlarge the pointer' },
    { key: 'motion', label: 'Pause animations', desc: 'Stop on-page motion' },
  ]

  const anyOn =
    state.fontPct !== 100 || toggles.some((t) => state[t.key])

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Accessibility options"
          className="fixed bottom-24 left-4 z-[85] w-[calc(100vw-2rem)] max-w-[310px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl animate-sheet-up lg:bottom-6 lg:left-24"
        >
          {/* Header */}
          <div className="flex items-center gap-2 bg-phsNavy px-4 py-3">
            <AccessibilityIcon className="h-5 w-5 text-phsOrange" />
            <p className="flex-1 font-display text-sm font-bold text-white">Accessibility</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close accessibility options"
              className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
            {/* Text size */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-phsInk">Text size</span>
                <span className="font-mono text-xs font-bold text-phsOrangeDark">{state.fontPct}%</span>
              </div>
              <div className="flex items-stretch gap-2">
                <button
                  onClick={() => update({ fontPct: Math.max(FONT_MIN, state.fontPct - FONT_STEP) })}
                  disabled={state.fontPct <= FONT_MIN}
                  aria-label="Decrease text size"
                  className="flex h-11 flex-1 items-center justify-center rounded-lg border border-black/15 bg-phsCream/50 text-lg font-bold text-phsInk transition hover:border-phsOrange hover:text-phsOrange disabled:cursor-not-allowed disabled:opacity-40"
                >
                  A<span className="text-xs">−</span>
                </button>
                <button
                  onClick={() => update({ fontPct: Math.min(FONT_MAX, state.fontPct + FONT_STEP) })}
                  disabled={state.fontPct >= FONT_MAX}
                  aria-label="Increase text size"
                  className="flex h-11 flex-1 items-center justify-center rounded-lg border border-black/15 bg-phsCream/50 text-xl font-bold text-phsInk transition hover:border-phsOrange hover:text-phsOrange disabled:cursor-not-allowed disabled:opacity-40"
                >
                  A<span className="text-sm">+</span>
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              {toggles.map((t) => {
                const on = state[t.key]
                return (
                  <button
                    key={t.key}
                    onClick={() => update({ [t.key]: !on })}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                      on
                        ? 'border-phsOrange bg-phsOrange/10'
                        : 'border-black/10 bg-phsCream/40 hover:border-phsOrange/40'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-phsInk">{t.label}</span>
                      <span className="block text-xs text-phsInk/60">{t.desc}</span>
                    </span>
                    {/* Switch */}
                    <span
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        on ? 'bg-phsOrange' : 'bg-black/20'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                          on ? 'left-[1.375rem]' : 'left-0.5'
                        }`}
                      />
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              disabled={!anyOn}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/15 py-2.5 text-sm font-bold text-phsInk transition hover:border-phsOrange hover:text-phsOrange disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset all
            </button>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Accessibility options"
        aria-expanded={open}
        title="Accessibility"
        className="fixed bottom-24 left-4 z-[70] grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full bg-phsNavy text-white shadow-xl ring-2 ring-phsOrange transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:left-6"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <AccessibilityIcon className="h-8 w-8 text-white" />
        )}
      </button>
    </>
  )
}
