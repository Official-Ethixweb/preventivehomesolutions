import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { loadRecaptcha, whenUserEngaged, RECAPTCHA_SITE_KEY } from '../lib/recaptcha.js'

/**
 * reCAPTCHA v2 checkbox widget.
 *
 * Renders the "I'm not a robot" box for one form. Reports the solved token via
 * `onChange(token)` (and `onChange('')` when it expires or errors). Parents call
 * the imperative `reset()` after a submit, because v2 tokens are single-use.
 *
 * Renders nothing when no site key is configured (local dev without keys).
 */
const Recaptcha = forwardRef(function Recaptcha(
  { onChange, theme = 'light', size, className = '' },
  ref
) {
  const containerRef = useRef(null)
  const widgetId = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    let cancelled = false
    // Defer the ~380 KB reCAPTCHA download until the visitor actually engages
    // with the page, keeping it off the initial-load critical path.
    whenUserEngaged()
      .then(() => (cancelled ? null : loadRecaptcha()))
      .then((grecaptcha) => {
        if (cancelled || !grecaptcha || !containerRef.current) return
        if (widgetId.current !== null) return
        try {
          widgetId.current = grecaptcha.render(containerRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            theme,
            ...(size ? { size } : {}),
            callback: (token) => onChangeRef.current?.(token),
            'expired-callback': () => onChangeRef.current?.(''),
            'error-callback': () => onChangeRef.current?.(''),
          })
        } catch {
          /* already rendered (React StrictMode double-invoke) — ignore */
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    reset() {
      if (window.grecaptcha && widgetId.current !== null) {
        try {
          window.grecaptcha.reset(widgetId.current)
          onChangeRef.current?.('')
        } catch {
          /* ignore */
        }
      }
    },
  }))

  if (!RECAPTCHA_SITE_KEY) return null
  return <div ref={containerRef} className={className} />
})

export default Recaptcha
