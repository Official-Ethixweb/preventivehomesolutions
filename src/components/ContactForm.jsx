import { useState, useRef } from 'react'
import Reveal from './Reveal.jsx'
import Recaptcha from './Recaptcha.jsx'
import { submitLead } from '../lib/submitForm.js'
import { recaptchaConfigured } from '../lib/recaptcha.js'

const inputClass =
  'w-full rounded-lg bg-gray-100 border border-gray-200 px-5 py-4 text-[15px] text-phsInk placeholder-gray-400 outline-none transition-all duration-200 focus:border-phsOrange focus:ring-2 focus:ring-phsOrange/20 focus:bg-white'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [service, setService] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // The service field is a custom dropdown backed by a readonly input, which
    // browsers skip during native validation, so enforce the choice here.
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
          name: formData.get('name'),
          phone: formData.get('phone'),
          service,
        },
        { section: 'Contact / Get a Free Quote', recaptchaToken }
      )
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      // v2 tokens are single-use — reset so a retry gets a fresh one.
      recaptchaRef.current?.reset()
    }
  }

  return (
    <section id="scheduling" className="relative z-50 scroll-mt-24 bg-phsCream py-[clamp(3rem,10vw,4rem)] lg:py-28 px-[clamp(16px,5vw,24px)] sm:px-6">
      {/* Anchor so "Contact" nav / CTAs that point to #contact land here too */}
      <span id="contact" aria-hidden="true" className="block scroll-mt-28" />
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Image */}
          <div className="lg:col-span-4 w-full flex justify-center lg:justify-start order-last lg:order-first mt-8 lg:mt-0">
            <Reveal variant="left" className="w-full">
              {/* Flip card: a real-feeling 3D shield. The two readable faces are
                  separated in Z, and a stack of darkened copies fills the gap
                  between them so the rotation reveals a solid extruded edge
                  (thickness) instead of looking like flat paper. */}
              <div className="group w-full max-w-[350px] lg:max-w-[450px] mx-auto lg:-ml-4 [perspective:1600px]">
                <div 
                  className="relative w-full [transform-style:preserve-3d]"
                  style={{ animation: 'phs-shield-flip 8s linear infinite' }}
                >
                  {/* Extruded body darkened slices stepped through the depth */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const z = -8 + i // -8px .. 7px
                    const shade = 0.4 + (i / 15) * 0.35 // darker at the back, lighter toward the front
                    return (
                      <img
                        key={i}
                        src="/Shield tagline.webp"
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-auto object-contain"
                        style={{ transform: `translateZ(${z}px)`, filter: `brightness(${shade}) saturate(0.55)` }}
                      />
                    )
                  })}
                  {/* Front face full brightness, in normal flow so it sizes the card */}
                  <img
                    src="/Shield tagline.webp"
                    alt="Ready to Book"
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-auto object-contain drop-shadow-2xl [backface-visibility:hidden]"
                    style={{ transform: 'translateZ(8px)' }}
                  />
                  {/* Back face same image, flipped so it reads correctly from behind */}
                  <img
                    src="/Shield tagline.webp"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-auto object-contain drop-shadow-2xl [backface-visibility:hidden]"
                    style={{ transform: 'translateZ(-8px) rotateY(180deg)' }}
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Middle Column: Copy + Phone + Details */}
          <div className="lg:col-span-4 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
            <Reveal variant="up" delay={100} className="w-full flex flex-col items-center lg:items-start">
              <span className="text-[clamp(11px,3vw,12px)] sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-4 block uppercase">
                Ready to Book?
              </span>
              <h2 className="font-display font-black text-phsInk text-[clamp(2.25rem,10vw,3rem)] sm:text-5xl tracking-tight leading-[1.0] mb-6 uppercase">
                Available <span className="text-phsOrange">7</span>
                <br />
                <span className="text-phsOrange lowercase">days</span> A WEEK.
              </h2>
              <p className="text-[clamp(14px,4vw,15px)] sm:text-base leading-relaxed text-gray-600 font-sans mb-8">
                Call us directly or fill out the form and we'll get back to you same day.
              </p>

              {/* Call Now Button */}
              <a
                href="tel:3854539428"
                className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-8 py-4 text-base font-bold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95 mb-8"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>(385) 453-9428</span>
              </a>

              {/* Details */}
              <div className="space-y-2 font-sans text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                <p>
                  <span className="font-bold text-phsInk">Areas:</span> <span className="text-phsOrange">Ogden, Syracuse, Layton, Clearfield, Farmington, Clinton &amp; more</span>
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Quote Form Card */}
          <div className="lg:col-span-4 w-full">
            <Reveal variant="right" delay={200} className="w-full max-lg:!transform-none max-lg:!opacity-100 max-lg:!transition-none">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e6ded4] shadow-[0_20px_50px_-25px_rgba(22,38,61,0.35)] w-full">

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-phsOrange/10 text-phsOrange mb-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-phsInk mb-2 ">Request Received!</h3>
                    <p className="text-[14px] text-gray-600 font-sans leading-relaxed">
                      Thank you. An expert technician or comfort advisor will contact you shortly to provide your free quote.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <h3 className="font-display font-black text-[clamp(16px,5vw,18px)] sm:text-[18px] text-phsInk tracking-wide mb-6">
                      Get a Free Quote
                    </h3>

                    {/* Name Input */}
                    <input
                      className={inputClass}
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                    />

                    {/* Phone Input */}
                    <input
                      className={inputClass}
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      required
                    />

                    {/* Service Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`${inputClass} flex items-center justify-between text-left`}
                      >
                        <span className={`block truncate ${service ? 'text-phsInk' : 'text-gray-400'}`}>
                          {service || 'Choose a service'}
                        </span>
                        <svg className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <input type="text" name="service" value={service} required className="absolute bottom-0 left-1/2 w-0 h-0 opacity-0 pointer-events-none" readOnly />

                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
                            {['Plumbing Services', 'Heating Services', 'Cooling Services', 'Water Heater Services', 'Drain Clearing & Cleaning', 'Maintenance'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => { setService(s); setDropdownOpen(false) }}
                                className="block w-full px-5 py-3.5 text-left text-[14.5px] font-medium text-phsInk hover:bg-phsOrange/10 hover:text-phsOrange focus:bg-phsOrange/10 focus:text-phsOrange outline-none transition-colors border-b border-gray-50 last:border-0"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <Recaptcha ref={recaptchaRef} onChange={setRecaptchaToken} className="flex justify-center" />

                    {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="cta-diag cta-diag-orange w-full rounded-xl bg-phsOrange text-white py-4 px-6 font-bold text-[15px] shadow-sm hover:shadow active:scale-98 tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending Request...' : 'Request Free Quote'}
                    </button>
                  </form>
                )}

              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
