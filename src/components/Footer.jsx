const quickLinks = ['Home', 'About Us', 'Blogs', 'Preventive Tips', 'Maintenance', 'Contact Us']
const services = ['AC Installation and Replacement', 'Furnace Installation and Replacement', 'Water Heater Installation and Replacement', 'Boiler Service and Maintenance', 'Drain Cleaning', 'Leak Detection & Repair']

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5 text-phsOrange transition-transform duration-300 group-hover/link:translate-x-1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-phsOrange shrink-0">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-phsOrange shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-phsOrange shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-phsOrange shrink-0">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

const contactInfo = [
  { Icon: PinIcon, text: 'Clinton 84015, United States' },
  { Icon: PhoneIcon, text: '(385) 453-9428', href: 'tel:3854539428' },
  { Icon: MailIcon, text: 'preventivehomesolutions@outlook.com', href: 'mailto:preventivehomesolutions@outlook.com' },
  { Icon: ClockIcon, text: 'Mon – Fri : 7AM – 8PM' },
  { Icon: ClockIcon, text: 'Saturday : 7AM – 7PM' },
  { Icon: ClockIcon, text: 'Sunday : 7AM – 6PM' },
]

function LinkColumn({ title, items }) {
  return (
    <div>
      <h3 className="font-display font-black text-sm uppercase tracking-[0.2em] text-phsOrange mb-6">
        {title}
      </h3>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li key={item}>
            <a 
              href="#" 
              className="group/link inline-flex items-center gap-2 text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ChevronRight />
              <span>{item}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer 
      className="bg-[#071626] text-white relative overflow-hidden pt-20"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 pb-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3.5">
              <img
                src="/preventive-home-solutions-logo-1-1-1536x772.jpg"
                alt="Preventive Home Solutions"
                className="h-14 w-auto rounded-xl shadow-lg border border-white/10"
              />
              <span className="font-display text-lg font-black tracking-[0.18em] leading-tight text-white uppercase">
                PREVENTIVE<br />
                HOME<br />
                SOLUTIONS
              </span>
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-gray-300 font-sans">
              Fix It. Prevent It. Protect It. Expert plumbing, heating, and cooling services built on trust and standard.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-6">
              <a 
                href="#" 
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-phsOrange hover:border-phsOrange hover:bg-phsOrange/10 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-phsOrange hover:border-phsOrange hover:bg-phsOrange/10 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Twitter/X"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-phsOrange hover:border-phsOrange hover:bg-phsOrange/10 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <LinkColumn title="Quick Links" items={quickLinks} />

          {/* Our Services Column */}
          <LinkColumn title="Our Services" items={services} />

          {/* Contact Info Column */}
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-[0.2em] text-phsOrange mb-6">
              Contact Info
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, i) => (
                <li key={i} className="flex items-start gap-3.5 text-[14px] text-gray-300">
                  <info.Icon />
                  {info.href ? (
                    <a href={info.href} className="hover:text-phsOrange transition-colors duration-200">
                      {info.text}
                    </a>
                  ) : (
                    <span>{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Accessibility Note */}
        <p className="mt-16 text-center text-[12px] text-gray-400 max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-8 font-sans">
          Preventive Home Solutions is committed to keeping our site accessible to everyone. We welcome feedback on ways to improve this site's accessibility.
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-6 text-[13px] text-gray-400 md:flex-row font-mono font-medium">
          <p className="text-center md:text-left">
            Copyright © {new Date().getFullYear()}, Preventive Home Solutions. All Rights Reserved.
          </p>
          <nav className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
          </nav>
        </div>
      </div>

    </footer>
  )
}
