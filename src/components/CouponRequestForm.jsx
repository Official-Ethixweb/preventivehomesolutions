import { useEffect, useRef, useState } from 'react'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { trackEvent } from '../lib/analytics.js'

/**
 * Quote-request form for the /coupons page. Always the plain "card" layout
 * (never the shield graphic, at any breakpoint) so it reads cleanly on a
 * phone. "Service Needed" is a grid of icon buttons instead of a dropdown:
 * every option (including "Other") stays visible, multiple can be selected
 * at once, and choosing "Other" reveals a free-text field for anything that
 * doesn't fit a category.
 *
 * @param {object} [selectedCoupon]  Coupon the visitor clicked "Claim This
 *   Offer" on (see coupons.js), pre-selects its service chip and shows a
 *   small "Applying" note. Pass null for none.
 * @param {() => void} [onClearCoupon]
 */

const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  droplet: <svg {...iconBase}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>,
  flame: <svg {...iconBase}><path d="M12 2s-4 3.5-4 8a4 4 0 0 0 8 0c0-4.5-4-8-4-8z" /><path d="M12 12c-1.5 0-2.5 1-2.5 2.5S10.5 17 12 17s2.5-1 2.5-2.5S13.5 12 12 12z" /></svg>,
  snowflake: <svg {...iconBase}><path d="M12 2v20m6-16-12 12m12 0L6 6m6-4-2 4m2-4 2 4m-8 6H4m16 0h-4M6 18l2-4m10 4-2-4" /></svg>,
  thermometer: <svg {...iconBase}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>,
  pipe: <svg {...iconBase}><path d="M3 15v3a2 2 0 0 0 2 2h3M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M21 15v3a2 2 0 0 1-2 2h-3M9 12h6" /></svg>,
  wrench: <svg {...iconBase}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-2.2z" /></svg>,
  dots: <svg {...iconBase}><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" /></svg>,
}

function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18 18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const SERVICE_OPTIONS = [
  { key: 'plumbing', label: 'Plumbing', icon: 'droplet' },
  { key: 'heating', label: 'Heating', icon: 'flame' },
  { key: 'cooling', label: 'Cooling', icon: 'snowflake' },
  { key: 'water-heater', label: 'Water Heater', icon: 'thermometer' },
  { key: 'drain-sewer', label: 'Drain & Sewer', icon: 'pipe' },
  { key: 'maintenance', label: 'Maintenance', icon: 'wrench' },
  { key: 'other', label: 'Other', icon: 'dots' },
]

const fieldClass =
  'w-full rounded-md border border-phsInk/20 bg-white/80 px-3.5 py-3 text-left text-[16px] text-phsInk placeholder:text-phsInk/60 outline-none transition-colors focus:border-phsOrange focus:bg-white focus:ring-2 focus:ring-phsOrange/25'
const labelClass = 'mb-1.5 block text-left font-mono text-[11px] font-bold tracking-[0.14em] text-phsInk'
const req = <span className="text-phsOrange" aria-hidden="true"> *</span>

export default function CouponRequestForm({ selectedCoupon, onClearCoupon }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [otherText, setOtherText] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  // Claiming a coupon pre-selects its service chip without clearing choices
  // the visitor already made.
  useEffect(() => {
    if (!selectedCoupon || selectedCoupon.serviceKey === 'all') return
    setSelected((prev) => new Set(prev).add(selectedCoupon.serviceKey))
  }, [selectedCoupon])

  function toggleService(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const sectionLabel = 'Coupons Page - Request Form'

    if (selected.size === 0) {
      setError('Please choose at least one service.')
      trackEvent('form_validation_error', { form_section: sectionLabel, field: 'service' })
      return
    }
    if (selected.has('other') && !otherText.trim()) {
      setError('Please tell us a bit about what you need.')
      trackEvent('form_validation_error', { form_section: sectionLabel, field: 'service_other' })
      return
    }
    if (recaptchaConfigured && !recaptchaToken) {
      setError('Please confirm you’re not a robot.')
      trackEvent('form_validation_error', { form_section: sectionLabel, field: 'recaptcha' })
      return
    }
    setSubmitting(true)
    setError(null)

    const serviceLabels = SERVICE_OPTIONS.filter((o) => o.key !== 'other' && selected.has(o.key)).map((o) => o.label)
    if (selected.has('other') && otherText.trim()) serviceLabels.push(`Other: ${otherText.trim()}`)

    const formData = new FormData(e.target)
    try {
      await submitLead(
        {
          firstName: formData.get('first_name'),
          lastName: formData.get('last_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service: serviceLabels.join(', '),
          message: selectedCoupon ? `Interested in coupon: ${selectedCoupon.title} (${selectedCoupon.badge})` : undefined,
        },
        { section: sectionLabel, recaptchaToken }
      )
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      recaptchaRef.current?.reset()
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-[520px] rounded-2xl border-2 border-phsOrange bg-white p-6 shadow-xl sm:p-8">
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-phsOrange/15 text-phsOrange [&_svg]:h-7 [&_svg]:w-7">
            <CheckIcon />
          </div>
          <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-phsInk">Request Received</h3>
          <p className="mt-2 max-w-[280px] text-sm text-phsInk/70">
            Our team will reach out shortly to confirm your discount. For urgent needs, call {PHONE_DISPLAY}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[520px] rounded-2xl border-2 border-phsOrange bg-white p-5 shadow-xl sm:p-7">
      {/* Darker than the brand phsOrange used on cta-diag buttons elsewhere:
          white text needs the extra contrast here since this is a plain flat
          band (no gradient), not a button, so it can't lean on font weight
          the way the CTAs get away with. */}
      <div className="-mx-5 -mt-5 mb-5 bg-phsOrangeDark px-5 py-4 sm:-mx-7 sm:-mt-7 sm:px-7">
        <p className="font-mono text-[11px] font-bold tracking-[0.22em] text-white/90">CLAIM YOUR DISCOUNT</p>
        <h2 className="mt-1 font-sans text-[22px] font-extrabold leading-tight tracking-tight text-white">Get a Free Quote</h2>
        <p className="mt-2 text-[13px] leading-snug text-white">
          Tell us what's going on and which service you need, and we'll follow up with your discount applied.
        </p>
      </div>

      <div className="space-y-4">
        {selectedCoupon && (
          <div className="flex items-center justify-between gap-2 rounded-md border border-phsOrange/40 bg-phsOrange/10 px-3.5 py-2.5">
            <span className="text-[13px] font-bold text-phsOrangeDark">
              Applying: {selectedCoupon.title} ({selectedCoupon.badge})
            </span>
            <button
              type="button"
              onClick={onClearCoupon}
              aria-label="Remove selected coupon"
              className="shrink-0 text-phsOrangeDark/70 hover:text-phsOrangeDark [&_svg]:h-4 [&_svg]:w-4"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cf-first" className={labelClass}>First Name{req}</label>
            <input id="cf-first" name="first_name" type="text" required placeholder="Jane" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="cf-last" className={labelClass}>Last Name{req}</label>
            <input id="cf-last" name="last_name" type="text" required placeholder="Doe" className={fieldClass} />
          </div>
        </div>

        <div>
          <label htmlFor="cf-email" className={labelClass}>Email{req}</label>
          <input id="cf-email" name="email" type="email" required placeholder="jane@email.com" className={fieldClass} />
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelClass}>Phone{req}</label>
          <input id="cf-phone" name="phone" type="tel" required placeholder="(385) 000-0000" className={fieldClass} />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className={labelClass}>What do you need help with?{req}</span>
            <span className="font-sans text-[11px] font-semibold text-phsInk/70">Select all that apply</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SERVICE_OPTIONS.map((opt) => {
              const active = selected.has(opt.key)
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleService(opt.key)}
                  aria-pressed={active}
                  className={`relative flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-center transition-colors ${
                    active
                      ? 'border-phsOrange bg-phsOrange/10 text-phsOrangeDark'
                      : 'border-phsInk/15 bg-white text-phsInk/70 hover:border-phsOrange/40 hover:text-phsInk'
                  }`}
                >
                  {active && (
                    <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-phsOrange text-white [&_svg]:h-2 [&_svg]:w-2">
                      <CheckIcon />
                    </span>
                  )}
                  <span className="[&_svg]:h-5 [&_svg]:w-5">{ICONS[opt.icon]}</span>
                  <span className="font-sans text-[11.5px] font-bold leading-tight">{opt.label}</span>
                </button>
              )
            })}
          </div>

          {selected.has('other') && (
            <div className="mt-2.5">
              <label htmlFor="cf-other" className="sr-only">Tell us more</label>
              <textarea
                id="cf-other"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                rows={2}
                placeholder="Tell us more about what you need…"
                className={`${fieldClass} resize-none`}
              />
            </div>
          )}
        </div>

        <label className="flex items-start gap-2 px-1 text-left">
          <input type="checkbox" name="sms_consent" required className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-phsOrange" />
          <span className="text-[12px] leading-snug text-phsInk/70">
            I agree to receive text messages from Preventive Home Solutions about my request. Msg &amp; data rates may apply.
          </span>
        </label>

        <Recaptcha ref={recaptchaRef} onChange={setRecaptchaToken} className="flex origin-top justify-center [transform:scale(0.95)]" />

        {error && <p className="text-center text-[13px] font-bold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="cta-diag cta-diag-orange group mt-1 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-phsOrange px-6 py-4 font-sans text-[15px] font-bold tracking-[0.12em] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Sending…' : 'Send My Request'}
          {!submitting && <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />}
        </button>

        <p className="pt-1 text-center text-[12px] leading-snug text-phsInk/70">
          Prefer to talk?{' '}
          <a href={`tel:${PHONE_TEL}`} className="font-bold text-phsOrangeDark underline underline-offset-2">
            Call {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </form>
  )
}
