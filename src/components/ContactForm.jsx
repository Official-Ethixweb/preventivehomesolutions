import { useState } from 'react'
import Reveal from './Reveal.jsx'

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-[15px] text-phsInk placeholder-gray-400 outline-none transition-all duration-200 focus:border-phsOrange focus:ring-2 focus:ring-phsOrange/10'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="scheduling" className="scroll-mt-24 bg-white py-20 lg:py-28 px-6">
      <div className="mx-auto max-w-[1150px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Option A Info Block */}
          <div className="lg:col-span-6 w-full">
            <Reveal variant="left" className="w-full">
              <span className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4 block">
                READY TO BOOK?
              </span>
              <h2 className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.65rem] tracking-tight leading-[1.1] uppercase mb-6">
                WE'RE AVAILABLE<br />7 DAYS A WEEK.
              </h2>
              <p className="text-[15px] sm:text-base leading-relaxed text-gray-600 font-sans mb-8">
                Call us directly or fill out the form — we'll get back to you same day.
              </p>

              {/* Call Now Button */}
              <div className="mb-8">
                <a
                  href="tel:3854539428"
                  className="inline-flex items-center justify-center gap-3.5 rounded-xl bg-phsOrange px-8 py-4.5 text-base font-bold text-white shadow-md hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-lg active:translate-y-0 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>CALL NOW: (385) 453-9428</span>
                </a>
              </div>

              {/* Small details */}
              <div className="space-y-3 border-t border-gray-100 pt-6 font-sans text-xs text-gray-500 leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-phsInk">Hours:</span>
                  Mon – Fri: 7AM – 8PM | Sat: 7AM – 7PM | Sun: 7AM – 6PM
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-phsInk shrink-0">Service Area:</span>
                  <span>Serving Ogden, Syracuse, Layton, Clearfield, Farmington, Clinton, West Point, Roy, and surrounding Northern Utah areas.</span>
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Option B Stripped Form */}
          <div className="lg:col-span-6 w-full">
            <Reveal variant="right" delay={150} className="w-full">
              <div className="bg-[#fbf7f0]/60 p-6 sm:p-8 rounded-2xl border border-[#e0e0e0] shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full">
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-phsOrange/10 text-phsOrange mb-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-phsInk mb-2 uppercase">Request Received!</h3>
                    <p className="text-[14px] text-gray-600 font-sans leading-relaxed">
                      Thank you. An expert technician or comfort advisor will contact you shortly to provide your free quote.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <h3 className="font-display font-black text-[18px] text-phsInk uppercase tracking-wide mb-6">
                      GET A FREE QUOTE
                    </h3>

                    {/* Name Input */}
                    <div>
                      <input 
                        className={inputClass} 
                        type="text" 
                        placeholder="Your Name" 
                        required 
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <input 
                        className={inputClass} 
                        type="tel" 
                        placeholder="Phone Number" 
                        required 
                      />
                    </div>

                    {/* Service Dropdown */}
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none bg-white`} 
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>Choose A Service</option>
                        <option>Plumbing Services</option>
                        <option>Heating Services</option>
                        <option>Cooling Services</option>
                        <option>Water Heater Services</option>
                        <option>Drain Clearing & Cleaning</option>
                        <option>Maintenance</option>
                      </select>
                      {/* Custom select arrow indicator */}
                      <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-gray-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-phsOrange hover:bg-phsOrangeDark text-white py-4.5 px-6 font-bold text-[15px] shadow-sm hover:shadow active:scale-98 transition-all duration-300 uppercase tracking-wider"
                    >
                      Request Free Quote
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
