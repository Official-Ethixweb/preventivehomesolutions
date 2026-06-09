import Reveal from './Reveal.jsx'

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 015.3 5.3l-9 9-3 .7.7-3 9-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l4-4M5 5l4 4-2 2-4-4a2.8 2.8 0 012-2z" />
    </svg>
  )
}

function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
      <path strokeLinecap="round" d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l-2-2 2-2 2 2-2 2zM12 19l-2 2 2 2 2-2-2-2zM5 12l-2 2-2-2 2-2 2 2zM19 12l2-2 2 2-2 2-2-2z" opacity=".6" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
      <path d="M12 2c0 4-4 5-4 9a4 4 0 008 0c0-1.5-.7-2.6-1.5-3.5.3 1.2-.2 2.2-1 2.5.5-2-1.5-3.5-1.5-6 0-1.5 0-3 0-4z" />
      <path d="M12 22a6 6 0 006-6c0-4-3-6-4-9 .5 5-3 6-3 9a2 2 0 11-3 1.7A6 6 0 0012 22z" opacity=".55" />
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
      <path d="M12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9H3l9-8z" />
    </svg>
  )
}

const services = [
  {
    title: 'Plumbing',
    Icon: WrenchIcon,
    text: 'Click for more on plumbing services we offer. From Water heaters to pipe repairs and emergency repairs',
  },
  {
    title: 'Cooling',
    Icon: SnowflakeIcon,
    text: 'Keep your home cool and comfortable with our professional air conditioning repair and cooling services. Click for more cooling services.',
  },
  {
    title: 'Heating',
    Icon: FlameIcon,
    text: 'Keep your home warm and comfortable with our professional heating services. From tune ups to repairs. Click to learn more',
  },
  {
    title: 'Maintenance',
    Icon: HouseIcon,
    text: 'Enhance your home with our professional air conditioning, furnace and plumbing preventive maintenance plans. Click for more information.',
  },
]

const cities = ['Clinton', 'Ogden', 'Layton', 'Brigham City']

/** Faint concentric-arc decoration used on both sides of the section. */
function Arcs({ className = '' }) {
  return (
    <svg
      className={`pointer-events-none absolute text-gray-200 ${className}`}
      width="420"
      height="420"
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
    >
      {[60, 110, 160, 210, 260, 310].map((r) => (
        <circle key={r} cx="210" cy="210" r={r} stroke="currentColor" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function Services() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      {/* Decorative background arcs (slowly rotating) */}
      <Arcs className="-left-40 top-0 animate-spin-slow" />
      <Arcs className="-right-32 top-10 animate-spin-slow [animation-direction:reverse]" />

      <div className="relative mx-auto max-w-[1200px] px-4">
        {/* Heading block */}
        <Reveal
          as="p"
          className="text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          Our Services
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-2 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          Explore Our Home Services
        </Reveal>
        <Reveal
          as="p"
          delay={200}
          className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-gray-600"
        >
          35+ Years Experience in Top-Tier Plumbing, Heating &amp; Cooling Solutions in{' '}
          {cities.map((city, i) => (
            <span key={city}>
              <a href="#" className="font-medium text-phsBlue hover:underline">
                {city}
              </a>
              {i < cities.length - 1 ? ', ' : ' '}
            </span>
          ))}
          and surrounding areas
        </Reveal>

        {/* Service cards */}
        <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {services.map(({ title, Icon, text }, i) => (
            <Reveal
              key={title}
              variant="up"
              delay={i * 120}
              className="group flex cursor-default flex-col items-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-phsOrange text-white shadow-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-phsBlue group-hover:shadow-lg group-hover:shadow-phsBlue/40">
                <Icon />
              </div>
              <h3 className="mt-5 text-xl font-bold text-phsOrange transition-colors group-hover:text-phsBlue">
                {title}
              </h3>
              <p className="mt-3 max-w-[16rem] text-[15px] leading-relaxed text-gray-600">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
