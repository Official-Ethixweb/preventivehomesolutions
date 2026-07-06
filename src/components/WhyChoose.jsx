import Reveal from './Reveal.jsx'
import GoogleReviews from './GoogleReviews.jsx'

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
    title: 'Family-Owned & Local',
    Icon: ShieldCheckIcon,
    description: "Not a national chain. We're a Northern Utah family-run company that treats your home like our own.",
  },
  {
    title: 'Fast & Reliable Response',
    Icon: AlarmSirenIcon,
    description: "When comfort can't wait, our team provides prompt service to get your home back up and running.",
  },
  {
    title: 'Preventive Home Protection',
    Icon: BadgeCheckIcon,
    description: 'We help prevent breakdowns before they happen through inspections, maintenance plans, and proactive system care.',
  },
]

export default function WhyChoose() {
  return (
    <section className="bg-white py-12 lg:py-28 relative">
      <div className="mx-auto max-w-[1200px] px-6">
        
        {/* Trust Badges Row Angi · 35+ Years (center, larger) · BBB.
            Breaks out wider than the 1200px column (capped at the viewport)
            so the three badges can grow and spread across the space. */}
        <div className="relative left-1/2 mb-6 lg:mb-16 w-[min(100vw,1500px)] -translate-x-1/2 -translate-y-[25px]">
          <Reveal
            variant="scale"
            className="flex items-end justify-center gap-[36px] sm:gap-[68px] lg:gap-[84px] px-6 lg:px-10 flex-wrap sm:flex-nowrap"
          >
            <img
              src="/Group 12.webp"
              alt="Angi Super Service Award 2024"
              loading="lazy"
              decoding="async"
              className="h-[clamp(100px,35vw,208px)] sm:h-[320px] lg:h-[440px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5"
            />
            <img
              src="/Group 13.webp"
              alt="35+ Years of Experience"
              loading="lazy"
              decoding="async"
              className="h-[clamp(120px,42vw,250px)] sm:h-[384px] lg:h-[528px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5"
            />
            <img
              src="/Group 14.webp"
              alt="BBB Accredited Business"
              loading="lazy"
              decoding="async"
              className="h-[clamp(100px,35vw,208px)] sm:h-[320px] lg:h-[440px] w-auto object-contain transition-transform duration-300 hover:-translate-y-1.5"
            />
          </Reveal>
        </div>

        {/* Two-column: heading on the left, full-width benefit rows on the
            right fills the space instead of leaving it empty. */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Heading Block */}
          <div className="lg:sticky lg:top-28">
            <Reveal as="p" className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange mb-4">
              Why Choose Preventive Home Solutions
            </Reveal>
            <Reveal as="h2" delay={100} className="font-display font-black text-phsNavy text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] ">
              Benefits of the<br />Best in the Trade.
            </Reveal>
            <Reveal as="p" delay={200} className="mt-5 max-w-md text-[15px] leading-relaxed text-gray-500 font-sans">
              Choosing Preventive Home Solutions means partnering with a team dedicated to exceptional service and lasting solutions for your home.
            </Reveal>
          </div>

          {/* Feature Rows full-width horizontal rows: icon left, title +
              description stacked on the right. */}
          <div className="flex flex-col">
            {features.map(({ title, Icon, description }, i) => (
              <Reveal key={title} variant="up" delay={i * 100}>
                <div
                  className={`group flex w-full items-start gap-6 py-7 sm:gap-8 ${
                    i === 0 ? 'pt-0 lg:pt-1' : ''
                  } ${i !== features.length - 1 ? 'border-b border-[#e6ded4]' : ''}`}
                >
                  {/* Icon Container */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-phsOrange/10 border border-phsOrange/20 text-phsOrange transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-phsOrange group-hover:text-white group-hover:border-transparent">
                    <Icon />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-sans font-bold text-phsNavy text-lg sm:text-xl tracking-wide transition-colors duration-300 group-hover:text-phsOrange">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm sm:text-[15px] text-gray-500 font-sans leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Live, continuously-scrolling Google reviews */}
        <GoogleReviews />

      </div>
    </section>
  )
}
