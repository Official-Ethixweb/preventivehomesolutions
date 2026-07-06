// Google reCAPTCHA v2 ("I'm not a robot" checkbox + challenge) loader.
//
// We load Google's API in explicit-render mode once, then the <Recaptcha />
// component renders a widget per form. The user must tick the checkbox (and
// solve an image challenge if prompted); that produces a token which is
// verified server-side in /api/contact.
//
// If VITE_RECAPTCHA_SITE_KEY isn't configured, the widget renders nothing and
// the server treats the submission as un-verified — keeps local dev usable.

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
export const recaptchaConfigured = Boolean(RECAPTCHA_SITE_KEY)

let readyPromise = null

/** Resolves with window.grecaptcha once its explicit-render API is ready. */
export function loadRecaptcha() {
  if (!RECAPTCHA_SITE_KEY) return Promise.resolve(null)
  if (readyPromise) return readyPromise

  readyPromise = new Promise((resolve, reject) => {
    const isReady = () =>
      typeof window !== 'undefined' &&
      window.grecaptcha &&
      typeof window.grecaptcha.render === 'function'

    if (isReady()) {
      resolve(window.grecaptcha)
      return
    }

    if (!document.querySelector('script[data-recaptcha-v2]')) {
      const s = document.createElement('script')
      s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      s.async = true
      s.defer = true
      s.setAttribute('data-recaptcha-v2', 'true')
      s.onerror = () => {
        readyPromise = null
        reject(new Error('Failed to load reCAPTCHA'))
      }
      document.head.appendChild(s)
    }

    const start = Date.now()
    const poll = () => {
      if (isReady()) {
        resolve(window.grecaptcha)
      } else if (Date.now() - start > 15000) {
        reject(new Error('reCAPTCHA load timeout'))
      } else {
        setTimeout(poll, 100)
      }
    }
    poll()
  })

  return readyPromise
}
