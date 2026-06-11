import Reveal from './Reveal.jsx'

export default function About() {
  return (
    <section 
      className="relative w-full overflow-hidden bg-[#0B1B30] pb-24 lg:pb-32 px-6"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 35+ Years Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal variant="left" className="relative w-full max-w-[400px] aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-[#0e223f]/50 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-center shadow-lg group hover:bg-[#0e223f]/75 transition-all duration-300">
              {/* Checkmark shield */}
              <svg viewBox="0 0 24 24" fill="none" stroke="#f3741b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 mb-6 transition-transform duration-300 group-hover:scale-110">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 11 2 2 4-4" />
              </svg>
              
              {/* Massive years number */}
              <h2 className="font-display font-black text-white text-7xl sm:text-8xl tracking-tighter leading-none mb-3">
                35+
              </h2>
              
              {/* Years tag */}
              <p className="font-mono text-xs font-bold tracking-[0.25em] text-gray-400 uppercase mb-8">
                YEARS OF SERVICE
              </p>
              
              {/* Divider line */}
              <div className="w-16 h-px bg-white/10 mb-8" />
              
              {/* Bottom text */}
              <p className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                AEGIS STANDARD - SINCE 1989
              </p>
            </Reveal>
          </div>

          {/* Right Column: Copywriting list */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal variant="right" delay={100}>
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4">
                ABOUT PREVENTIVE
              </p>
              <h2 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase mb-6">
                AFFORDABLE, PROFESSIONAL<br />PROTECTION.
              </h2>
            </Reveal>
            
            <Reveal variant="right" delay={200} className="space-y-6 text-[15px] leading-relaxed text-gray-300 font-sans">
              <p>
                We are your go-to garrison for reliable plumbing, heating, and cooling defense in Northern Utah. We specialize in stopping failures before they breach — expert maintenance, repair, and installation for the systems your home depends on.
              </p>
              <p>
                Built on integrity, professionalism, and proactive care, our craft protects every home we touch — from a minor leak to a full HVAC overhaul — through every season.
              </p>
              <p>
                When you choose Preventive, you're not just hiring a service. You're enlisting a guard committed to your home's long-term endurance.
              </p>
            </Reveal>
            
            <Reveal variant="right" delay={300}>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-lg active:translate-y-0 mt-6 relative z-10"
              >
                <span>Enlist Our Guard</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
