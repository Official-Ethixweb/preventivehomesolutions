const quickLinks = ['Home', 'About Us', 'Blogs', 'Preventive Tips', 'Maintenance', 'Contact Us']
const services = ['Plumbing', 'Heating', 'Cooling', 'Water Heaters', 'AC Repair', 'Drain Cleaning']

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5 text-phsOrange">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-phsOrange">
      <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-phsOrange">
      <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.58 3.6 1 1 0 01-.24 1l-2.24 2.2z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-phsOrange">
      <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm8 7L4.5 6.2 4 6.7 12 12l8-5.3-.5-.5L12 11z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-phsOrange">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.4V6h-2v7.4l5 3 1-1.7-4-2.3z" />
    </svg>
  )
}

const contactInfo = [
  { Icon: PinIcon, text: 'Clinton 84015, United States' },
  { Icon: PhoneIcon, text: '(385) 453-9428' },
  { Icon: MailIcon, text: 'preventivehomesolutions @outlook.com' },
  { Icon: ClockIcon, text: 'Mon – Fri : 7AM – 8PM' },
  { Icon: ClockIcon, text: 'Saturday : 7AM – 7PM' },
  { Icon: ClockIcon, text: 'Sunday : 7AM – 6PM' },
]

function LinkColumn({ title, items }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-phsOrange">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="flex items-center gap-3 text-[15px] text-gray-200 hover:text-phsOrange">
              <Chevron />
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
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/black.png"
                alt="Preventive Home Solutions"
                className="h-20 w-auto"
              />
              <span className="text-2xl font-bold leading-tight text-phsOrange">
                Preventive
                <br />
                Home
                <br />
                Solutions
              </span>
            </div>
            <p className="mt-6 text-[15px] text-gray-300">Fix It. Prevent It. Protect It.</p>
          </div>

          <LinkColumn title="Quick Links" items={quickLinks} />
          <LinkColumn title="Our Services" items={services} />

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-phsOrange">Contact Info</h3>
            <ul className="mt-6 space-y-4">
              {contactInfo.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-[15px] text-gray-200">
                  <Icon />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accessibility note */}
        <p className="mt-12 text-center text-[15px] text-gray-200">
          Preventive Home Solutions is committed to keeping our site accessible to everyone. We
          welcome feedback on ways to improve this site's accessibility.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-6 text-[15px] text-gray-200 md:flex-row">
          <p>Copyright © 2025, Preventive Home Solutions. All Rights Reserved.</p>
          <nav className="flex items-center gap-8">
            <a href="#" className="hover:text-phsOrange">Privacy Policy</a>
            <a href="#" className="hover:text-phsOrange">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-phsOrange">Sitemap</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
