import Reveal from './Reveal.jsx'

const inputClass =
  'w-full rounded-md border border-gray-300 px-4 py-3 text-[15px] text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-phsBlue focus:ring-2 focus:ring-phsBlue/20'

export default function ContactForm() {
  return (
    <section id="scheduling" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        {/* Left: overlapping images */}
        <Reveal variant="left" className="relative mx-auto h-[460px] w-full max-w-[520px]">
          <img
            src="/Project-Image-1-1.webp"
            alt="Preventive Home Solutions project"
            className="absolute left-0 top-0 h-[340px] w-[280px] rounded-xl object-cover shadow-lg transition-transform duration-300 hover:-translate-y-1"
          />
          <img
            src="/About-Us-Image-1-1.webp"
            alt="Preventive Home Solutions team"
            className="absolute bottom-0 right-2 h-[300px] w-[250px] rounded-xl border-4 border-white object-cover shadow-xl transition-transform duration-300 hover:-translate-y-1"
          />
        </Reveal>

        {/* Right: form */}
        <Reveal variant="right" delay={150}>
          <p className="text-sm font-bold uppercase tracking-wide text-phsOrange">Contact Us</p>
          <h2 className="mt-2 text-3xl font-bold text-phsBlue sm:text-4xl">
            Request of Service Form
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Stay comfortable and protected in every season with expert{' '}
            <a href="#" className="font-medium text-phsBlue hover:underline">heating</a>,{' '}
            <a href="#" className="font-medium text-phsBlue hover:underline">cooling</a> and{' '}
            <a href="#" className="font-medium text-phsBlue hover:underline">plumbing</a> services
            from Preventive Home Solutions. Fill out the form below and one of our comfort advisors
            will give you a call to book an appointment with one of our certified trusted
            technicians.
          </p>

          <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input className={inputClass} type="text" placeholder="First Name" />
              <input className={inputClass} type="text" placeholder="Last Name" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input className={inputClass} type="tel" placeholder="Phone" />
              <input className={inputClass} type="email" placeholder="Email" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <select className={`${inputClass} appearance-none bg-white`} defaultValue="">
                <option value="" disabled>Choose A Service</option>
                <option>Plumbing</option>
                <option>Cooling</option>
                <option>Heating</option>
                <option>Water Heaters</option>
                <option>Drain Clearing</option>
                <option>Maintenance</option>
              </select>
              <select className={`${inputClass} appearance-none bg-white`} defaultValue="">
                <option value="" disabled>Choose Your Area</option>
                <option>Ogden</option>
                <option>West Point</option>
                <option>Syracuse</option>
                <option>Layton</option>
                <option>Farmington</option>
                <option>Clinton</option>
                <option>Roy</option>
                <option>Clearfield</option>
                <option>Riverdale</option>
                <option>Brigham City</option>
              </select>
            </div>
            <textarea className={`${inputClass} min-h-[120px] resize-y`} placeholder="Message" />
            <button
              type="submit"
              className="rounded-md bg-phsOrange px-7 py-3.5 text-base font-bold text-white shadow transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-lg active:translate-y-0 active:scale-95"
            >
              Send Message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
