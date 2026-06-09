import Reveal from './Reveal.jsx'

const areas = [
  ['Ogden', 'West Point', 'Syracuse', 'Layton', 'Farmington'],
  ['Clinton', 'Roy', 'Clearfield', 'Riverdale', 'Brigham City'],
]

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-phsOrange">
      <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  )
}

export default function Areas() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2">
        {/* Left: copy + location list */}
        <Reveal variant="left">
          <p className="text-sm font-bold uppercase tracking-wide text-phsOrange">
            Get In Touch With Us
          </p>
          <h2 className="mt-2 text-3xl font-bold text-phsBlue sm:text-4xl">Areas We Support</h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-600">
            Choosing Preventive Home Solutions means you're partnering with a team dedicated to
            delivering exceptional service and lasting solutions for your home.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
            {areas.map((col, ci) => (
              <ul key={ci} className="space-y-5">
                {col.map((city) => (
                  <li
                    key={city}
                    className="group flex items-center gap-2.5 text-[15px] text-gray-700 transition-colors hover:text-phsBlue"
                  >
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-125">
                      <PinIcon />
                    </span>
                    <span>{city}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Reveal>

        {/* Right: service area image */}
        <Reveal variant="right" delay={150}>
          <img
            src="/get-in-touch.webp"
            alt="Areas we support"
            className="aspect-[16/11] w-full rounded-2xl object-cover shadow-lg transition-shadow duration-300 hover:shadow-xl"
          />
        </Reveal>
      </div>
    </section>
  )
}
