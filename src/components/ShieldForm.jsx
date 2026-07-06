import { useState, useEffect, useRef } from 'react'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'
import { PHONE_DISPLAY } from '../data/nav.js'

/**
 * "Get a Free Quote" form rendered on the shield graphic (shield.svg +
 * shield-border overlay + a uniformly-scaled inner form) — the same treatment
 * as the mobile hero form. Shared by the service-page and service-area
 * templates.
 *
 * @param {string} [serviceNoun] Pre-selects the "Service Needed" dropdown.
 * @param {string} [section]     Label describing where the lead came from.
 */
const FORM_DESIGN_WIDTH = 300

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
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ShieldForm({ serviceNoun, section }) {
  const boxRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [service, setService] = useState(serviceNoun || '')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (el.clientWidth) setScale(el.clientWidth / FORM_DESIGN_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const SERVICE_OPTIONS = ['Plumbing', 'Heating', 'Cooling', 'Water Heater', 'Drain & Sewer', 'Other']

  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!service) {
      setError('Please choose a service.')
      return
    }
    if (recaptchaConfigured && !recaptchaToken) {
      setError('Please confirm you’re not a robot.')
      return
    }
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.target)
    try {
      await submitLead(
        {
          firstName: formData.get('first_name'),
          lastName: formData.get('last_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service,
        },
        { section: section || `Service Page — ${serviceNoun || 'Service'}`, recaptchaToken }
      )
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      recaptchaRef.current?.reset()
    }
  }

  const fieldClass =
    'w-full rounded-md border border-phsSky/15 bg-white/80 px-3.5 py-2.5 text-center text-sm text-phsInk placeholder:text-phsInk/40 outline-none transition-colors focus:border-phsSky focus:bg-white'
  const labelClass =
    'mb-1 block text-center font-mono text-[10.5px] font-bold tracking-[0.16em] text-phsInk'

  return (
    <div className="relative mx-auto w-full max-w-[300px] drop-shadow-2xl lg:mt-8">
      {/* Shield background + border overlay (same assets as the hero shield form) */}
      <img src="/shield.svg" alt="" aria-hidden="true" className="relative z-0 h-auto w-full" />
      <img
        src="/shield border.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[127.7%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />

      {/* Form content positioned inside the shield bounds, scaled to fit width */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start px-[8%] pt-[18%]">
        <div ref={boxRef} className="flex w-full justify-center">
          <div className="origin-top" style={{ width: `${FORM_DESIGN_WIDTH}px`, transform: `scale(${scale})` }}>
            {submitted ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-phsOrange/15 text-phsOrange [&_svg]:h-7 [&_svg]:w-7">
                  <CheckIcon />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-phsInk">Request Received</h3>
                <p className="mt-2 max-w-[240px] text-sm text-phsInk/60">
                  Our team will reach out shortly. For urgent needs, call {PHONE_DISPLAY}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-center font-mono text-[9.5px] font-bold tracking-[0.24em] text-phsOrange">Request Service</p>
                <h2 className="mt-1.5 text-center font-sans text-[22px] font-extrabold leading-tight tracking-tight text-phsInk">
                  Get a Free Quote
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="sf-first" className={labelClass}>First Name</label>
                      <input id="sf-first" name="first_name" type="text" required placeholder="Jane" className={fieldClass} />
                    </div>
                    <div>
                      <label htmlFor="sf-last" className={labelClass}>Last Name</label>
                      <input id="sf-last" name="last_name" type="text" required placeholder="Doe" className={fieldClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sf-email" className={labelClass}>Email</label>
                    <input id="sf-email" name="email" type="email" required placeholder="jane@email.com" className={fieldClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="sf-phone" className={labelClass}>Phone</label>
                      <input id="sf-phone" name="phone" type="tel" required placeholder="(385) 000-0000" className={fieldClass} />
                    </div>
                    <div className="relative">
                      <label htmlFor="sf-service" className={labelClass}>Service Needed</label>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className={`${fieldClass} flex items-center justify-between !px-3`}
                      >
                        <span className={`block truncate ${service ? 'text-phsInk' : 'text-phsInk/40'}`}>{service || 'Select…'}</span>
                        <svg className={`h-4 w-4 shrink-0 text-phsInk/40 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <input type="text" name="service_field" value={service} required readOnly aria-label="Service" aria-hidden="true" tabIndex={-1} className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 opacity-0" />
                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-phsSky/15 bg-white shadow-xl">
                            {SERVICE_OPTIONS.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => { setService(s); setDropdownOpen(false) }}
                                className="block w-full border-b border-gray-50 px-3 py-2.5 text-center text-[13px] font-bold text-phsInk outline-none transition-colors last:border-0 hover:bg-phsOrange/10 hover:text-phsOrange"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SMS consent */}
                  <label className="flex items-start gap-2 px-1 text-left">
                    <input type="checkbox" name="sms_consent" required className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-phsOrange" />
                    <span className="text-[10.5px] leading-snug text-phsInk/70">
                      I agree to receive text messages from Preventive Home Solutions about my request. Msg &amp; data rates may apply.
                    </span>
                  </label>

                  <Recaptcha
                    ref={recaptchaRef}
                    onChange={setRecaptchaToken}
                    className="flex origin-top justify-center [transform:scale(0.96)]"
                  />

                  {error && <p className="text-center text-[13px] font-bold text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="cta-diag cta-diag-orange group mx-auto mt-1 flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md bg-phsOrange px-8 py-3 font-sans text-[15px] font-bold tracking-[0.12em] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? 'Sending…' : 'Book Now'}
                    {!submitting && <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
