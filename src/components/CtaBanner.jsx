import Reveal from './Reveal.jsx'

export default function CtaBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Dark overlay for legibility over the shared background image */}
      <div className="pointer-events-none absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-4 py-16 text-center sm:py-20">
        <Reveal as="p" className="text-sm font-bold uppercase tracking-wide text-phsOrange">
          Get In Touch With Us
        </Reveal>
        <Reveal
          as="h2"
          delay={120}
          className="mt-4 text-3xl font-bold leading-snug text-white sm:text-4xl"
        >
          Let Our Certified Professionals Enhance your Home's Efficiency and Comfort
        </Reveal>
        <Reveal delay={260}>
          <a
            href="#"
            className="mt-8 inline-block rounded-full bg-phsOrange px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-phsOrangeDark hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            Get Your Free Quote
          </a>
        </Reveal>
      </div>
    </section>
  )
}
