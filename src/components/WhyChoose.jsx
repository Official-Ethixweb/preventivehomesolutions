import Reveal from './Reveal.jsx'

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 11 2 2 4-4" />
    </svg>
  )
}

function BadgeCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function AlarmSirenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 2v2M5 22h14M19 12a7 7 0 0 0-14 0v6h14v-6zM9 22h6v-4H9v4zM4 12h1M19 12h1M6.3 6.3l.7.7M17 7l.7-.7" />
    </svg>
  )
}

const features = [
  {
    title: 'Proactive Maintenance Plans',
    Icon: ShieldCheckIcon,
    description: 'Prevent costly repairs with customized maintenance services.',
  },
  {
    title: 'Certified Technicians',
    Icon: BadgeCheckIcon,
    description: 'Our licensed plumbers team consists of highly skilled professionals.',
  },
  {
    title: 'Emergency Services',
    Icon: AlarmSirenIcon,
    description: "We're available after hours to same-day emergency service to keep your home safe.",
  },
]

export default function WhyChoose() {
  return (
    <section className="bg-[#FAF8F5] py-20 lg:py-28 relative border-t border-[#e6ded4]">
      <div className="mx-auto max-w-[1200px] px-6">
        
        {/* Trust Badges Row */}
        <Reveal variant="scale" className="flex items-center justify-center mb-16">
          <img
            src="/badges.png"
            alt="Trust Badges"
            className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </Reveal>

        {/* Heading Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal as="p" className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4">
            WHY CHOOSE PREVENTIVE HOME SOLUTIONS
          </Reveal>
          <Reveal as="h2" delay={100} className="font-display font-black text-phsNavy text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase">
            BENEFITS OF THE<br />BEST IN THE TRADE.
          </Reveal>
          <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500 font-sans">
            Choosing Preventive Home Solutions means partnering with a team dedicated to exceptional service and lasting solutions for your home.
          </Reveal>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map(({ title, Icon, description }, i) => (
            <Reveal key={title} variant="up" delay={i * 100}>
              <div className="group flex flex-col p-8 rounded-3xl border border-[#e6ded4] bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-phsCream/25 transition-all duration-300 hover:-translate-y-1 h-full relative z-10">
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-phsOrange/10 border border-phsOrange/20 text-phsOrange mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-phsOrange group-hover:text-white group-hover:border-transparent">
                  <Icon />
                </div>
                
                {/* Content */}
                <h3 className="font-display font-bold text-phsNavy text-lg uppercase tracking-wide">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 font-sans leading-relaxed">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
