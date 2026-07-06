import Reveal from './Reveal.jsx'

export default function CtaBanner() {
  return (
    <section className="relative w-full py-12 lg:py-24">

      <div className="relative z-10 mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center">

        {/* Tag */}
        <Reveal as="p" className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-white/90 mb-4">
          Get in Touch
        </Reveal>

        {/* Heading */}
        <Reveal
          as="h2"
          delay={100}
          className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.0] mb-4"
        >
          Certified Pros.<br />Homes Built to Last.
        </Reveal>

        {/* Paragraph */}
        <Reveal
          delay={200}
          className="text-[15px] sm:text-base text-white/90 font-sans max-w-xl mx-auto leading-relaxed mb-8"
        >
          Let our warrior-grade specialists enhance your home's efficiency and comfort.
        </Reveal>

        {/* CTA Button */}
        <Reveal delay={300}>
          <a
            href="#contact"
            className="cta-diag cta-diag-orange group inline-flex items-center justify-center gap-2 rounded-md bg-phsOrange px-7 py-4 font-sans text-sm font-bold tracking-[0.12em] text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 relative z-10"
          >
            <span>Get Your Free Quote</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
