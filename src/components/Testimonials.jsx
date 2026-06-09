import Reveal from './Reveal.jsx'

/** Faint concentric-arc decoration reused on both sides. */
function Arcs({ className = '' }) {
  return (
    <svg
      className={`pointer-events-none absolute text-gray-200 ${className}`}
      width="380"
      height="380"
      viewBox="0 0 380 380"
      fill="none"
      aria-hidden="true"
    >
      {[60, 105, 150, 195, 240].map((r) => (
        <circle key={r} cx="190" cy="190" r={r} stroke="currentColor" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20">
      <Arcs className="-left-32 top-0 animate-spin-slow" />
      <Arcs className="-right-28 bottom-0 animate-spin-slow [animation-direction:reverse]" />

      <div className="relative mx-auto max-w-[1100px] px-4">
        {/* Heading block */}
        <Reveal
          as="p"
          className="text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          Testimonials
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-2 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          What Our Customers Are Saying About Us
        </Reveal>
        <Reveal
          as="p"
          delay={200}
          className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-gray-600"
        >
          Read firsthand experiences from homeowners who trust us for their plumbing and HVAC needs.
        </Reveal>

        {/* Testimonial cards added when the next design image arrives */}
      </div>
    </section>
  )
}
