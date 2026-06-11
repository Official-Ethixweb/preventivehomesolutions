import { useState } from 'react'
import Reveal from './Reveal.jsx'

const citiesList = [
  { name: 'Ogden', highlighted: false },
  { name: 'West Point', highlighted: false },
  { name: 'Syracuse', highlighted: false },
  { name: 'Layton', highlighted: false },
  { name: 'Farmington', highlighted: false },
  { name: 'Clinton', highlighted: true },
  { name: 'Roy', highlighted: false },
  { name: 'Clearfield', highlighted: false },
  { name: 'Riverdale', highlighted: false },
  { name: 'Brigham City', highlighted: false },
]

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f3741b" strokeWidth="1.75" className="h-4 w-4 text-phsOrange flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function AreasWeServe() {
  const [activeCity, setActiveCity] = useState(null)

  return (
    <section 
      id="areas-we-serve"
      className="relative w-full overflow-hidden bg-white pb-16 sm:pb-20 px-6"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Copy + Cities Grid */}
          <div className="lg:col-span-6 pt-16 sm:pt-20 lg:pt-24">
            <Reveal variant="left">
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4">
                TERRITORY UNDER GUARD
              </p>
              <h2 className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase mb-4">
                AREAS WE SERVE
              </h2>
              <p className="text-[15px] sm:text-base text-gray-600 font-sans leading-relaxed mb-8">
                Choosing Preventive Home Solutions means partnering with a team dedicated to lasting service across Northern Utah. Click on a city below to zoom and locate it on the map.
              </p>

              {/* Cities Grid */}
              <div className="grid grid-cols-2 gap-3">
                {citiesList.map((city) => {
                  const isActive = activeCity?.name === city.name
                  return (
                    <div
                      key={city.name}
                      onClick={() => setActiveCity(isActive ? null : city)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer select-none ${
                        isActive 
                          ? 'border-phsOrange bg-phsOrange/5 shadow-sm ring-1 ring-phsOrange/20' 
                          : city.highlighted 
                          ? 'border-phsOrange/40 bg-gray-50 shadow-sm' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className={`transition-transform duration-300 ${isActive ? 'scale-120 -translate-y-0.5' : ''}`}>
                        <PinIcon />
                      </span>
                      <span className={`font-mono text-xs sm:text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? 'text-phsOrange' : 'text-phsInk'}`}>
                        {city.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Styled Shield Map Card (Google Maps Iframe inside) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end pt-0">
            <Reveal 
              variant="right" 
              delay={150} 
              className="relative w-full max-w-[480px] aspect-[3/4] overflow-hidden bg-phsNavy flex flex-col items-center pt-8 pb-16 px-6 text-center shadow-2xl group cursor-default"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 82%, 50% 100%, 0% 82%)' }}
            >
              {/* SVG White Shield Border Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline 
                  points="100,0 100,82 50,100 0,82 0,0" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="0.8" 
                  className="stroke-white/20 group-hover:stroke-white/40 transition-colors duration-500" 
                />
              </svg>

              {/* Embedded Google Maps frame */}
              <div className="w-full h-[65%] relative overflow-hidden mb-6 rounded-t-[2.2rem] border-b border-white/5">
                <iframe
                  key={activeCity ? activeCity.name : 'default'}
                  title="Northern Utah Service Map"
                  src={activeCity ? `https://www.google.com/maps?q=${activeCity.name},+UT&z=13&output=embed` : `https://www.google.com/maps?q=Clearfield,+UT&z=9&output=embed`}
                  className="absolute inset-0 w-full h-full border-0 animate-map-zoom"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* Title Section (Lower part of card) */}
              <div className="z-10 relative">
                {/* Checkmark shield */}
                <svg viewBox="0 0 24 24" fill="none" stroke="#f3741b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-phsOrange mx-auto mb-3">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>

                {/* Heading */}
                <h3 className="font-display font-black text-white text-2xl sm:text-3xl tracking-tight leading-none text-center uppercase">
                  NORTHERN UTAH
                </h3>

                {/* Subheading */}
                <p className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-3">
                  10 CITIES · ONE STANDARD
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
