import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { navigate } from '../router.js'
import { areaHref } from '../data/nav.js'

const citiesList = [
  'Ogden',
  'West Point',
  'Syracuse',
  'Layton',
  'Farmington',
  'Clinton',
  'Roy',
  'Clearfield',
  'Riverdale',
  'Brigham City',
]

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4 flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function AreasWeServe() {
  const [activeCity, setActiveCity] = useState('')

  return (
    <section 
      id="areas-we-serve"
      className="relative z-10 w-full overflow-hidden bg-white pb-16 sm:pb-20 px-6"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Copy + Cities Grid */}
          <div className="lg:col-span-6 pt-16 sm:pt-20 lg:pt-24">
            <Reveal variant="left">
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-4">
                Territory Under Guard
              </p>
              <h2 className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] mb-4">
                Areas We Serve
              </h2>
              <p className="text-[15px] sm:text-base text-gray-600 font-sans leading-relaxed mb-8">
                Choosing Preventive Home Solutions means partnering with a team dedicated to lasting service across Northern Utah. Click on a city below to zoom and locate it on the map.
              </p>

              {/* Cities Grid */}
              <div className="grid grid-cols-2 gap-3">
                {citiesList.map((city) => {
                  const isActive = activeCity === city
                  return (
                    <div
                      key={city}
                      onClick={() => {
                        // On mobile the map sits below the grid where a zoom
                        // update goes unseen, so tapping a city opens that
                        // city's dedicated service-area page instead.
                        if (window.matchMedia('(max-width: 1023px)').matches) {
                          navigate(areaHref(city))
                          return
                        }
                        setActiveCity(isActive ? '' : city)
                      }}
                      className={`group flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none shadow-md shadow-phsNavy/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:border-phsOrange hover:bg-phsOrange hover:shadow-lg hover:shadow-phsOrange/40 ${
                        isActive
                          ? 'border-phsOrange bg-phsOrange/5 shadow-sm ring-1 ring-phsOrange/20'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className={`text-phsOrange transition-all duration-300 ease-out group-hover:text-white group-hover:scale-110 ${isActive ? 'scale-120 -translate-y-0.5' : ''}`}>
                        <PinIcon />
                      </span>
                      <span className={`font-mono text-xs sm:text-[11px] font-bold tracking-[0.15em] transition-colors duration-300 group-hover:text-white ${isActive ? 'text-phsOrange' : 'text-phsInk'}`}>
                        {city}
                      </span>
                      {isActive && (
                        <a
                          href={areaHref(city)}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto font-mono text-[10px] font-bold tracking-[0.1em] text-phsOrange transition-colors group-hover:text-white hover:underline"
                        >
                          VIEW →
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Styled Shield Map Card (Google Maps Iframe inside) */}
          <div id="areas-map" className="lg:col-span-6 relative flex justify-center lg:justify-end scroll-mt-24 pt-0">
            <Reveal 
              variant="right" 
              delay={150} 
              className="relative w-full max-w-[480px] aspect-[3/4] overflow-hidden bg-phsSky flex flex-col items-center pt-8 pb-16 px-6 text-center shadow-2xl group cursor-default"
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
              <div className="w-full h-[65%] relative overflow-hidden mb-6 rounded-t-[2.2rem] border-4 border-phsSky/80">
                <iframe
                  key={activeCity || 'default'}
                  title="Northern Utah Service Map"
                  src={
                    activeCity
                      ? `https://www.google.com/maps?q=${encodeURIComponent(activeCity)},+UT&z=13&output=embed`
                      : `https://www.google.com/maps?q=Clearfield,+UT&z=9&output=embed`
                  }
                  className="absolute inset-0 w-full h-full border-0 animate-map-zoom"
                  style={{ filter: 'grayscale(0.15) contrast(1.02) brightness(1.05) saturate(0.95)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {/* Theme tint overlays keep map readable while matching site palette */}
                <div className="pointer-events-none absolute inset-0 bg-phsSky/10 mix-blend-multiply" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-phsSky/20" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-phsOrange/20" />
              </div>

              {/* Title Section (Lower part of card) */}
              <div className="z-10 relative">
                {/* Checkmark shield */}
                <svg viewBox="0 0 24 24" fill="none" stroke="#f3741b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-phsOrange mx-auto mb-3">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>

                {/* Heading */}
                <h3 className="font-display font-black text-white text-2xl sm:text-3xl tracking-tight leading-none text-center ">
                  Northern Utah
                </h3>

                {/* Subheading */}
                <p className="font-mono text-sm sm:text-base font-bold tracking-[0.2em] text-white mt-3">
                  10 Cities · One Standard
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
