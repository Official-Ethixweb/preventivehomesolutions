import Reveal from './Reveal.jsx'

const servicesList = [
  {
    title: 'Plumbing',
    description: 'Leak defense, repairs, repipes.',
    iconSrc: '/plumbing-removebg-preview.svg',
    photo: '/Pot Filler Faucet Install in Ogden.jpeg',
    photoAlt: 'Pot filler faucet installation — real job photo',
  },
  {
    title: 'HVAC',
    description: 'Furnaces, boilers, heat pumps.',
    iconSrc: '/hvac-removebg-preview.svg',
    photo: '/Heating furnace.jpg',
    photoAlt: 'Furnace system installation',
  },
  {
    title: 'AC Conditioning',
    description: 'AC install, tune-ups, repair.',
    iconSrc: '/ac_conditioning-removebg-preview.svg',
    photo: '/AC installed 01.jpg',
    photoAlt: 'AC unit installation — real job photo',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#FAF8F5] py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Team + Van Photo */}
          <div className="lg:col-span-5 relative">
            <Reveal variant="left" className="relative w-full">
              {/* White frame with orange corner accents */}
              <div className="relative bg-white p-3 shadow-2xl">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-phsOrange z-10" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-phsOrange z-10" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-phsOrange z-10" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-phsOrange z-10" />
                <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] w-full overflow-hidden group">
                  <img
                    src="/Coverphoto.png"
                    alt="Preventive Home Solutions team and van"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient only — no text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-phsNavy/70 via-phsNavy/20 to-transparent" />
                </div>
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
              {servicesList.map(({ title, description, iconSrc, photo, photoAlt }, i) => (
                <Reveal key={title} delay={i * 100} variant="up">
                  <a
                    href="#contact"
                    className="group flex flex-col items-center text-center p-6 rounded-2xl border border-[#e6ded4] bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-phsCream/25 transition-all duration-300 hover:-translate-y-1 relative z-10"
                  >
                    {/* Icon */}
                    <img
                      src={iconSrc}
                      alt={title}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain mb-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Text block */}
                    <h3 className="font-display font-bold text-phsNavy text-base sm:text-lg uppercase tracking-wider">
                      {title}
                    </h3>

                    {/* Real work photo with frame (only for plumbing + HVAC) */}
                    {photo && (
                      <div className="relative bg-white p-1.5 shadow-md mt-5 w-full border border-[#e6ded4]">
                        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-phsOrange z-10" />
                        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-phsOrange z-10" />
                        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-phsOrange z-10" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-phsOrange z-10" />
                        <img
                          src={photo}
                          alt={photoAlt}
                          className="w-full aspect-video object-cover rounded-sm"
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

