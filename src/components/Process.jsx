import Reveal from './Reveal.jsx'

const steps = [
  {
    number: '01',
    title: 'Schedule an Appointment',
    text: 'Call or book online for a free consultation and service.',
  },
  {
    number: '02',
    title: 'Get an Assessment',
    text: 'Our experts will evaluate your system and provide tailored solutions.',
  },
  {
    number: '03',
    title: 'Enjoy Worry-Free Comfort',
    text: "With our reliable services, your home's systems will run smoothly year-round.",
  },
]

export default function Process() {
  return (
    <section className="relative bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Heading block */}
        <Reveal
          as="p"
          className="text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          How We Work
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-2 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          Our Process
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 text-center text-[15px] text-gray-600">
          Our process ensures a hassle-free experience from start to finish
        </Reveal>

        {/* Step cards */}
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map(({ number, title, text }, i) => (
            <Reveal
              key={number}
              variant="up"
              delay={i * 150}
              className="group rounded-2xl bg-phsBlue px-6 py-10 text-center text-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-phsBlue/30"
            >
              <div className="text-4xl font-extrabold transition-transform duration-300 group-hover:scale-110">
                {number}
              </div>
              <h3 className="mt-4 text-xl font-bold text-phsOrange">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-blue-50">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
