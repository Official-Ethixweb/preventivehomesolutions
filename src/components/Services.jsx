import Reveal from './Reveal.jsx'

const servicesList = [
  {
    title: 'Plumbing',
    description: 'Leak defense, repairs, repipes.',
    iconSrc: '/plumbing-removebg-preview.svg',
  },
  {
    title: 'HVAC',
    description: 'Furnaces, boilers, heat pumps.',
    iconSrc: '/hvac-removebg-preview.svg',
  },
  {
    title: 'AC Conditioning',
    description: 'AC install, tune-ups, repair.',
    iconSrc: '/ac_conditioning-removebg-preview.svg',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#FAF8F5] py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5 relative">
            <Reveal variant="left" className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] w-full rounded-[2rem] overflow-hidden border border-[#e6ded4] shadow-xl group">
              <img
                src="/d0484732fe6d7b7993abcea3ba29e28d.jpg"
                alt="Preventive Home Solutions Crew"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/90 via-phsNavy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 sm:p-10 text-white">
                <p className="font-mono text-xs font-bold tracking-[0.2em] text-phsOrange uppercase">
                  OUR CREW
                </p>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
                  Warrior-Grade<br />Reliability
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                  Defending your home from Northern Utah's hardest elements.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Content + List */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Header Block */}
            <Reveal className="mb-10">
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4">
                OUR SERVICES
              </p>
              <h2 className="font-display font-black text-phsNavy text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase">
                THREE DISCIPLINES.<br />ONE STANDARD.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-500 font-sans max-w-xl">
                Whatever the system, the same craftsmanship. Built to outlast Northern Utah's hardest seasons.
              </p>
            </Reveal>

            {/* Service Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {servicesList.map(({ title, description, iconSrc }, i) => (
                <Reveal key={title} delay={i * 100} variant="up">
                  <a
                    href="#contact"
                    className="group flex flex-col items-center text-center p-6 rounded-2xl border border-[#e6ded4] bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-phsCream/25 transition-all duration-300 hover:-translate-y-1 relative z-10"
                  >
                    {/* Extra large icon */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center rounded-2xl bg-[#faf6f0] border border-[#e6ded4]/60 p-4 mb-4 transition-colors duration-300 group-hover:bg-phsOrange/10 group-hover:border-phsOrange/20">
                      <img
                        src={iconSrc}
                        alt={title}
                        className="h-12 w-12 sm:h-14 sm:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Text block */}
                    <h3 className="font-display font-bold text-phsNavy text-base sm:text-lg uppercase tracking-wider">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      {description}
                    </p>
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
