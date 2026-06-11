import Reveal from './Reveal.jsx'

export default function BeforeAfter() {
  return (
    <section className="bg-[#FAF8F5] py-16 lg:py-20 px-6 border-t border-[#e6ded4]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="text-center mb-10">
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-3">
            REAL RESULTS
          </p>
          <h2 className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase">
            BEFORE &amp; AFTER.
          </h2>
        </Reveal>

        <Reveal variant="up" delay={150} className="flex justify-center">
          {/* White frame with orange corner accents */}
          <div className="relative bg-white p-4 shadow-2xl w-full max-w-[900px]">
            {/* Orange corner — top left */}
            <span className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-phsOrange z-10" />
            {/* Orange corner — top right */}
            <span className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-phsOrange z-10" />
            {/* Orange corner — bottom left */}
            <span className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-phsOrange z-10" />
            {/* Orange corner — bottom right */}
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-phsOrange z-10" />

            <div className="relative">
              <img
                src="/beforeandafterwaterheater.PNG"
                alt="Water heater replacement — before and after by Preventive Home Solutions"
                className="w-full object-cover"
              />
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-phsInk/80 to-transparent p-6 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-phsOrange uppercase mb-1">
                    WATER HEATER REPLACEMENT
                  </p>
                  <p className="font-display font-black text-white text-lg uppercase tracking-wide">
                    Same-Day Install · Northern Utah
                  </p>
                </div>
                <a
                  href="#scheduling"
                  className="shrink-0 inline-flex items-center gap-2 rounded-md bg-phsOrange px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-phsOrangeDark transition-colors duration-300"
                >
                  Get A Quote →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
