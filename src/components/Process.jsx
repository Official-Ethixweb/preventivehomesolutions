import Reveal from './Reveal.jsx'

function ClipboardCheckIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function SparklesIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
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
    <section className="relative py-[clamp(3rem,10vw,4rem)] lg:py-28 px-[clamp(16px,5vw,24px)] sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Heading block */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-0 md:-mt-[40px] md:-translate-y-[110px]">
          <Reveal as="p" className="text-[clamp(12px,3.5vw,14px)] sm:text-base font-mono tracking-[0.25em] font-bold text-white/60 mb-4">
            How We Work
          </Reveal>
          <Reveal as="h2" delay={100} className="font-display font-black text-white text-[clamp(1.5rem,7vw,2.25rem)] sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] ">
            Our Process
          </Reveal>
          <Reveal as="p" delay={200} className="mt-[6px] text-[clamp(14px,4vw,15px)] sm:text-base text-white/75 font-sans leading-relaxed">
            A hassle-free experience from start to finish.
          </Reveal>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 md:mt-24">
          {steps.map(({ number, title, text, Icon }, i) => {
            const isMiddle = i === 1
            return (
              <Reveal
                key={number}
                variant="up"
                delay={i * 100}
                className="h-full"
              >
                <div
                  className="group relative flex h-full flex-col p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl bg-[#FAF8F5] hover:bg-white border-2 border-[#e6ded4] hover:border-phsOrange/40"
                >
                  {/* Mascot peeking over the top edge of the highlighted card */}
                  {isMiddle && (
                    <img
                      src="/process-mascot.webp"
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none absolute left-1/2 -top-[46px] z-20 hidden md:block w-[222px] lg:w-[276px] h-auto -translate-x-1/2 -translate-y-[62%] drop-shadow-xl"
                    />
                  )}

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="font-display font-black text-phsNavy text-[clamp(2.25rem,10vw,3rem)] sm:text-5xl leading-none">
                      {number}
                    </div>
                    <Icon className="h-6 w-6 text-phsNavy/40 group-hover:text-phsOrange transition-colors duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-display font-bold text-phsNavy text-lg tracking-wide mb-3 group-hover:text-phsOrange transition-colors duration-300">
                    {title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-phsNavy/85 font-sans leading-relaxed">
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
