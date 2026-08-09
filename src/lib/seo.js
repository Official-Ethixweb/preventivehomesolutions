import { useEffect } from 'react'

// Lightweight SEO helper for this client-rendered SPA. It keeps the document
// title, meta description, canonical URL, Open Graph / Twitter tags and an
// optional JSON-LD structured-data block in sync with the current page so
// crawlers and link unfurlers see meaningful, per-page metadata.

const SITE_NAME = 'Preventive Home Solutions'
const ORIGIN =
  typeof window !== 'undefined' ? window.location.origin : 'https://www.preventivehomesolutions.com'

function upsertMeta(selector, attr, name, content) {
  if (content == null) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * @param {object} opts
 * @param {string} opts.title    Full <title> text.
 * @param {string} opts.description  Meta description (~150-160 chars).
 * @param {string} [opts.path]   Pathname for the canonical URL (defaults to current).
 * @param {string} [opts.image]  Absolute or root-relative OG image.
 * @param {object|object[]} [opts.jsonLd]  Structured data injected as <script type="application/ld+json">.
 * @param {boolean} [opts.noindex]  When true, tells crawlers not to index this page
 *   (still crawls its links). Use for post-conversion/utility pages that should
 *   never be a search-landing target, e.g. /thank-you.
 */
export function useSeo({ title, description, path, image = '/og-image.png', jsonLd, noindex = false } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    const canonical = ORIGIN + (path || window.location.pathname)
    const ogImage = image.startsWith('http') ? image : ORIGIN + image

    upsertMeta('meta[name="description"]', 'name', 'description', description)
    upsertLink('canonical', canonical)
    upsertMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,follow' : 'index,follow')

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

    // JSON-LD structured data removed on unmount so each page owns its own.
    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seo = 'page'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.title = prevTitle
      if (script) script.remove()
    }
  }, [title, description, path, image, noindex, JSON.stringify(jsonLd)])
}

export { ORIGIN, SITE_NAME }
