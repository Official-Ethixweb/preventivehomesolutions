import Placeholder from './Placeholder.jsx'
import Reveal from './Reveal.jsx'

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z" />
      <path d="M10.5 13.2l-2-2-1.2 1.2 3.2 3.2 5-5L14.3 9.4z" fill="#fff" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 13.8L7.5 22l4.5-2.6L16.5 22 15 13.8z" />
      <path d="M12 5.2l1.2 2.4 2.6.4-1.9 1.8.4 2.6L12 11.2 9.7 12.4l.4-2.6-1.9-1.8 2.6-.4z" fill="#fff" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <circle cx="12" cy="7" r="2.6" />
      <circle cx="5.5" cy="9" r="2.2" />
      <circle cx="18.5" cy="9" r="2.2" />
      <path d="M12 11c-2.8 0-4.5 1.6-4.5 3.8V17h9v-2.2C16.5 12.6 14.8 11 12 11z" />
      <path d="M5.5 12c-2 0-3.5 1.2-3.5 3v1.5h3.4v-1.7c0-1.1.4-2 1.1-2.6A4.7 4.7 0 005.5 12zM18.5 12c-.4 0-.8 0-1.1.2.7.6 1.1 1.5 1.1 2.6V17H22v-2c0-1.8-1.5-3-3.5-3z" />
    </svg>
  )
}

const features = [
  {
    title: 'Proactive Maintenance Plans',
    Icon: ShieldIcon,
    text: 'Prevent costly repairs with customized maintenance services.',
  },
  {
    title: 'Certified Technicians',
    Icon: MedalIcon,
    text: 'Our Licensed Plumbers team consists of highly skilled professionals.',
  },
  {
    title: 'Emergency Services',
    Icon: PeopleIcon,
    text: "We're available after hours to same day emergency service ensure your home stays safe.",
  },
]

export default function WhyChoose() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Trust badges (third-party logos -> placeholders) */}
        <Reveal variant="scale" className="flex items-center justify-center gap-10">
          <Placeholder
            label="BBB Accredited"
            className="h-16 w-36 transition-transform duration-300 hover:scale-105"
            rounded="rounded-md"
          />
          <Placeholder
            label="Angi Award 2024"
            className="h-20 w-20 transition-transform duration-300 hover:scale-105"
            rounded="rounded-md"
          />
        </Reveal>

        {/* Heading block */}
        <Reveal
          as="p"
          className="mt-12 text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          Why Choose Preventive Home Solutions
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-3 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          Benefits of Having the Best Plumbing and HVAC Contractor
        </Reveal>
        <Reveal
          as="p"
          delay={200}
          className="mx-auto mt-4 max-w-3xl text-center text-[15px] leading-relaxed text-gray-600"
        >
          Choosing Preventive Home Solutions means you're partnering with a team dedicated to
          delivering exceptional service and lasting solutions for your home.
        </Reveal>

        {/* Feature list */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map(({ title, Icon, text }, i) => (
            <Reveal key={title} variant="up" delay={i * 120} className="group flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-phsOrange transition-all duration-300 group-hover:scale-110 group-hover:bg-phsOrange group-hover:text-white">
                <Icon />
              </div>
              <div>
                <h3 className="text-lg font-bold text-phsOrange">{title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
