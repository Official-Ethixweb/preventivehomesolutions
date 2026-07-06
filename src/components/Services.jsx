import { useState, useEffect } from 'react'
import Reveal from './Reveal.jsx'

const servicesList = [
  {
    title: 'Plumbing',
    description: 'Leak defense, repairs, repipes.',
    iconSrc: '/Group 8.svg',
    photo: '/Pot Filler Faucet Install in Ogden.webp',
    photoAlt: 'Pot filler faucet installation, real job photo',
    href: '/plumbing',
  },
  {
    title: 'HVAC',
    description: 'Furnaces, boilers, heat pumps.',
    iconSrc: '/Group 9.svg',
    photo: '/Heating furnace.webp',
    photoAlt: 'Furnace system installation',
    href: '/hvac',
  },
  {
    title: 'AC Conditioning',
    description: 'AC install, tune-ups, repair.',
    iconSrc: '/Group 10.svg',
    photo: '/AC installed 01.webp',
    photoAlt: 'AC unit installation, real job photo',
    href: '/ac',
  },
]

// Slideshow cycles the same photos shown on the three cards, with the back of van first.
// The active slide highlights its matching card (shifted by 1 due to the van photo).
const SLIDES = [
  '/back van.webp',
  ...servicesList.map((s) => s.photo),
]

export default function Services() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="services" className="relative overflow-hidden bg-[#FAF8F5] py-12 lg:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Image card moved to the right on desktop. Slideshow of the
              three service-card photos. */}
          <div className="lg:col-span-5 relative lg:order-last">
            <Reveal variant="right" className="relative w-full">
              {/* White frame with orange corner accents */}
              <div className="relative bg-white p-3 shadow-2xl mx-auto w-2/3 sm:w-3/5 lg:w-full">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-phsOrange z-10" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-phsOrange z-10" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-phsOrange z-10" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-phsOrange z-10" />
                <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] w-full overflow-hidden group">
                  {SLIDES.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt="Preventive Home Solutions work"
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
                        i === slide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  {/* Lighter gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-phsSky/30 via-phsSky/5 to-transparent" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Content + List */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Header Block */}
            <Reveal className="mb-10">
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-4">
                Our Services
              </p>
              <h2 className="font-display font-black text-phsNavy text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] ">
                Three Disciplines.<br />One Standard.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-500 font-sans max-w-xl">
                Whatever the system, the same craftsmanship. Built to outlast Northern Utah's hardest seasons.
              </p>
            </Reveal>

            {/* Service Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {servicesList.map(({ title, description, iconSrc, photo, photoAlt, href }, i) => (
                <Reveal key={title} delay={i * 100} variant="up" className="h-full">
                  <a
                    href={href}
                    className={`group relative z-10 flex h-full flex-col items-center justify-center overflow-hidden text-center p-2 sm:p-6 rounded-2xl border bg-white/50 transition-all duration-300 ease-out hover:bg-white hover:border-phsOrange/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-phsOrange/10 ${
                      i === slide - 1
                        ? 'border-phsOrange bg-white -translate-y-2 scale-[1.02] shadow-2xl shadow-phsOrange/10'
                        : 'border-[#e6ded4]'
                    }`}
                  >
                    {/* Light-glare sweep on hover */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-phsOrange/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />

                    {/* Icon */}
                    <img
                      src={iconSrc}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-10 sm:h-20 sm:w-20 object-contain mb-2 sm:mb-4 transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-translate-y-1"
                    />

                    {/* Text block */}
                    <h3 className="font-display font-bold text-phsNavy text-[11px] sm:text-lg tracking-wider leading-tight transition-colors duration-300 group-hover:text-phsOrange">
                      {title}
                    </h3>

                    {/* Grey one-liner - hidden on mobile */}
                    <p className="hidden sm:block mt-2 text-sm leading-relaxed text-gray-500">
                      {description}
                    </p>

                    {/* Real work photo with frame - hidden on mobile */}
                    {photo && (
                      <div className="hidden sm:block relative overflow-hidden bg-white p-1.5 shadow-md mt-auto pt-1.5 w-full border border-[#e6ded4]">
                        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-phsOrange z-10" />
                        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-phsOrange z-10" />
                        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-phsOrange z-10" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-phsOrange z-10" />
                        <img
                          src={photo}
                          alt={photoAlt}
                          loading="lazy"
                          decoding="async"
                          className="w-full aspect-video object-cover rounded-sm transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      </div>
                    )}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

