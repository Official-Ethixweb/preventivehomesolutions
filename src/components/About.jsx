import { useState, useEffect } from 'react'
import Reveal from './Reveal.jsx'

// Crew photos for the About slideshow.
const CREW_SLIDES = [
  '/IMG_6217.webp',
  '/IMG_6272.webp',
  '/IMG_6276.webp',
]

export default function About() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % CREW_SLIDES.length), 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="about" className="scroll-mt-24 relative w-full pt-0 pb-[clamp(3rem,10vw,6rem)] lg:pb-32 px-[clamp(16px,5vw,24px)] sm:px-6">
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Team Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal variant="left" className="relative w-full max-w-[440px]">
              {/* White frame with orange corner accents */}
              <div className="relative bg-white p-3 shadow-2xl w-2/3 mx-auto sm:w-1/2 lg:w-full lg:mx-0 lg:p-4">
                {/* Orange corner top left */}
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-phsOrange z-10" />
                {/* Orange corner top right */}
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-phsOrange z-10" />
                {/* Orange corner bottom left */}
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-phsOrange z-10" />
                {/* Orange corner bottom right */}
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-phsOrange z-10" />
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  {CREW_SLIDES.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt="Preventive Home Solutions crew"
                      width="800"
                      height="1000"
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
                        i === slide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Copywriting list */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal variant="right" delay={100}>
              <p className="text-[clamp(11px,3.5vw,12px)] sm:text-sm font-mono tracking-[0.25em] font-bold text-white/90 mb-4">
                About Preventive
              </p>
              <h2 className="font-display font-black text-white text-[clamp(1.75rem,7vw,2.25rem)] sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] mb-6">
                Affordable, Professional<br />Protection.
              </h2>
            </Reveal>
            
            <Reveal variant="right" delay={200} className="space-y-4 sm:space-y-6 text-[clamp(14px,4vw,15px)] sm:text-base leading-relaxed text-white/90 font-sans">
              <p>
                We are your go-to garrison for reliable plumbing, heating, and cooling defense in Northern Utah. We specialize in stopping failures before they breach. Expert maintenance, repair, and installation for the systems your home depends on.
              </p>
              <p>
                Built on integrity, professionalism, and proactive care, our craft protects every home we touch, from a minor leak to a full HVAC overhaul, through every season.
              </p>
              <p>
                When you choose Preventive, you're not just hiring a service. You're enlisting a guard committed to your home's long-term endurance.
              </p>
            </Reveal>
            
            <Reveal variant="right" delay={300}>
              <a
                href="#contact"
                className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mt-6 relative z-10"
              >
                <span>Contact Us</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
