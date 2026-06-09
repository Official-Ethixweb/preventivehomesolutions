import { useState } from 'react'
import Reveal from './Reveal.jsx'

const LOGO_SRC = '/preventive-home-solutions-logo-1-1-1536x772.jpg'

const faqs = [
  {
    q: 'What Services Do You Offer?',
    a: 'We offer expert plumbing, heating, and cooling services, including installations, repairs, and preventive maintenance.',
  },
  {
    q: 'How Do I Schedule An Appointment?',
    a: 'You can schedule an appointment by calling us or booking online for a free consultation.',
  },
  {
    q: 'How Quickly Can You Respond To Service Calls?',
    a: 'We offer same-day and after-hours emergency service to get your home back to comfort fast.',
  },
  {
    q: 'Are Your Technicians Certified?',
    a: 'Yes. Our team consists of licensed, certified, and highly skilled professionals.',
  },
  {
    q: 'How Much Would It Cost To Get A Plumber Out?',
    a: 'Costs vary by job. Contact us for a free quote tailored to your specific needs.',
  },
  {
    q: 'How To Tell If A Technician Or Plumber Is Ripping You Off?',
    a: 'We provide transparent pricing and repair issues first without pushing high replacement costs.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20">
      {/* Faint logo watermark */}
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-[34rem] w-auto -translate-x-1/2 select-none opacity-[0.06]"
      />

      <div className="relative mx-auto max-w-[1000px] px-4">
        {/* Heading block */}
        <Reveal
          as="p"
          className="text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          FAQs
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-2 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          Frequently Asked Question
        </Reveal>
        <Reveal
          as="p"
          delay={200}
          className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-gray-600"
        >
          Have questions? Check out our frequently asked questions to learn more about our services
          and how we can help you!
        </Reveal>

        {/* Accordion */}
        <div className="mt-10 space-y-4">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <Reveal key={item.q} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-phsOrange/50"
                  aria-expanded={open}
                >
                  <span
                    className={`text-[15px] font-bold transition-colors ${
                      open ? 'text-phsBlue' : 'text-phsOrange'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`ml-4 text-2xl font-light leading-none transition-all duration-300 ${
                      open ? 'rotate-45 text-phsBlue' : 'rotate-0 text-phsOrange'
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Smoothly animated height via grid-rows trick */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-[15px] leading-relaxed text-gray-600 shadow-sm">
                      {item.a}
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
