import { useState } from 'react'
import Reveal from './Reveal.jsx'

const faqs = [
  {
    q: 'Do you charge for estimates?',
    a: "No. On-site estimates for plumbing, heating, and cooling work are free. You'll get upfront, fixed pricing before any work begins.",
  },
  {
    q: 'What areas do you cover?',
    a: 'We service all of Northern Utah, including Ogden, Syracuse, Layton, Clearfield, Farmington, Clinton, West Point, Roy, Riverdale, and Brigham City.',
  },
  {
    q: 'How fast can you get here for emergencies?',
    a: 'We offer rapid response for plumbing and HVAC emergencies, typically arriving within a few hours to resolve issues fast.',
  },
  {
    q: 'How do I schedule an appointment?',
    a: 'You can easily schedule an appointment by calling our office or booking online through our scheduling portal.',
  },
  {
    q: 'Are your technicians certified?',
    a: "Yes. Our team consists of licensed, certified, background-checked, and highly trained professionals who prioritize your home's safety and comfort.",
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="relative overflow-hidden bg-[#fbf7f0] py-12 lg:py-28 px-6">
      {/* Watermark the header logo, enlarged and faded */}
      <img
        src="/main logo.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{ opacity: 0.12 }}
      />
      <div className="relative mx-auto max-w-[850px]">
        {/* Heading block */}
        <div className="text-center mb-8 lg:mb-12">
          <Reveal
            as="p"
            className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-4"
          >
            Faqs
          </Reveal>
          <Reveal
            as="h2"
            delay={100}
            className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.1]"
          >
            Frequently Asked Questions.
          </Reveal>
          <Reveal
            as="p"
            delay={200}
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600 font-sans"
          >
            Straight answers before you book. If something isn't here, call us and we'll tell you in plain English.
          </Reveal>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <Reveal key={item.q} delay={i * 80}>
                <div
                  className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
                    open 
                      ? 'border-phsOrange bg-white shadow-md' 
                      : 'border-transparent bg-white/70 hover:bg-white hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Header Button */}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left outline-none"
                    aria-expanded={open}
                  >
                    <span className="font-sans text-[15px] sm:text-base font-extrabold text-phsInk">
                      {item.q}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      {/* Chevron icon */}
                      <svg
                        className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                          open ? 'rotate-180 text-phsOrange' : 'rotate-0 text-gray-400 group-hover:text-gray-600'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {/* Animated Answer Section */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 pt-0 text-[14px] sm:text-[15px] leading-relaxed text-gray-600 font-sans">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
