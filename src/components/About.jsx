import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'

export default function About() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Blue 80% transparent layer over the shared background image */}
      <div className="pointer-events-none absolute inset-0 bg-phsBlue/80" />

      {/* Content */}
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 px-4 py-16 sm:py-20 lg:grid-cols-2">
        {/* Left: years */}
        <Reveal variant="left" className="flex flex-col items-center justify-center text-white">
          <CountUp
            end={35}
            suffix="+"
            className="text-[7rem] font-extrabold leading-none sm:text-[10rem]"
          />
          <span className="mt-2 text-2xl font-bold tracking-[0.3em]">YEARS</span>
        </Reveal>

        {/* Right: copy */}
        <Reveal variant="right" delay={150} className="text-white">
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
            Affordable, Professional Plumbing, Airconditioning &amp; Heating Services
          </h2>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-blue-50/90">
            <p>
              We are your go-to partner for reliable and high-quality plumbing, heating, and cooling
              services in Northern Utah. With a focus on preventing problems before they arise, we
              specialize in offering expert maintenance, repair, and installation services for your
              home's essential systems. Founded on the principles of integrity, professionalism, and
              proactive care, we aim to provide peace of mind through our dedicated service. Whether
              it's a minor plumbing issue or a complex HVAC installation, our team is here to ensure
              that your home runs smoothly and efficiently, no matter the season.
            </p>
            <p>
              Why should you call Preventive Home Solutions? We offer solutions to fix your plumbing
              problems, AC not working, and furnace not heating issues. We repair plumbing and
              heating issues first without high replacement costs. Call now to get your home back to
              comfort today!
            </p>
            <p>
              When you choose us, you're not just getting a service – you're gaining a partner who
              genuinely cares about your home's long-term wellbeing
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
