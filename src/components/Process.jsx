import Reveal from './Reveal.jsx'

function ClipboardCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 text-white/30">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 text-white/30">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 text-white/30">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

const steps = [
  {
    number: '01',
    title: 'Schedule an Appointment',
    text: 'Call or book online for a free consultation and service.',
    Icon: ClipboardCheckIcon,
  },
  {
    number: '02',
    title: 'Get an Assessment',
    text: 'Our experts evaluate your system and provide tailored solutions.',
    Icon: SearchIcon,
  },
  {
    number: '03',
    title: 'Enjoy Worry-Free Comfort',
    text: "With our reliable service, your home's systems run smoothly year-round.",
    Icon: SparklesIcon,
  },
]

export default function Process() {
  return (
    <section 
      className="relative bg-[#0B1B30] py-20 lg:py-28 px-6 border-t border-white/5"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        
        {/* Heading block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal as="p" className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4">
            HOW WE WORK
          </Reveal>
          <Reveal as="h2" delay={100} className="font-display font-black text-white text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase">
            OUR PROCESS
          </Reveal>
          <Reveal as="p" delay={200} className="mt-4 text-[15px] sm:text-base text-gray-300 font-sans leading-relaxed">
            A hassle-free experience from start to finish.
          </Reveal>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map(({ number, title, text, Icon }, i) => {
            const isMiddle = i === 1
            return (
              <Reveal
                key={number}
                variant="up"
                delay={i * 100}
              >
                <div
                  className={`group flex flex-col p-8 rounded-3xl bg-[#0e223f]/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-[#0e223f]/75 border ${
                    isMiddle ? 'border-phsOrange/50' : 'border-white/10'
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="font-display font-black text-phsOrange text-4xl sm:text-5xl leading-none">
                      {number}
                    </div>
                    <Icon />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mb-3">
                    {title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-400 font-sans leading-relaxed">
                    {text}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
