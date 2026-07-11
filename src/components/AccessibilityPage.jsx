import TopBar from './TopBar.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Reveal from './Reveal.jsx'
import Strands from './Strands.jsx'
import { useSeo } from '../lib/seo.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'
import { BUSINESS } from '../data/business.js'

/* ------------------------------- Icons --------------------------------- */
const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
const ICONS = {
  text: <svg {...iconBase}><path d="M4 7V5h16v2M9 19h6M12 5v14" /></svg>,
  contrast: <svg {...iconBase}><circle cx="12" cy="12" r="9" /><path d="M12 3v18" fill="currentColor" /></svg>,
  readable: <svg {...iconBase}><path d="M4 6h16M4 12h10M4 18h16" /></svg>,
  link: <svg {...iconBase}><path d="M10 14 21 3M15 3h6v6M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>,
  cursor: <svg {...iconBase}><path d="m5 3 6 15 2.5-6.5L20 9 5 3Z" /></svg>,
  motion: <svg {...iconBase}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>,
  reset: <svg {...iconBase}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
  keyboard: <svg {...iconBase}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></svg>,
  eye: <svg {...iconBase}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
  hand: <svg {...iconBase}><path d="M8 13V5a2 2 0 0 1 4 0v6M12 11V4a2 2 0 0 1 4 0v8M16 10a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-5.3-3.2L4 13.5a2 2 0 0 1 3.4-2L8 12.5" /></svg>,
  brain: <svg {...iconBase}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V19a2 2 0 0 0 4 0V6a2 2 0 0 0-2-2 2 2 0 0 0-2 0zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8" /></svg>,
  users: <svg {...iconBase}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
  shield: <svg {...iconBase}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>,
}

const AccessibilityIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="3.8" r="2" />
    <path d="M21 8.5c0 .8-.6 1.4-1.4 1.5l-4.1.5v3l1.9 6.3a1.4 1.4 0 1 1-2.7.8L12 15.8l-2.7 4.8a1.4 1.4 0 1 1-2.7-.8l1.9-6.3v-3l-4.1-.5A1.45 1.45 0 0 1 4.6 7.6l4.9.9c1.7.3 3.3.3 5 0l4.9-.9c.8-.1 1.6.4 1.6 1.4z" />
  </svg>
)
function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3.5 9 4l1 4-2 1.5a12 12 0 0 0 5 5L14 12l4 1 .5 2.5a2 2 0 0 1-2 2.4A14 14 0 0 1 4.1 5.5a2 2 0 0 1 2.4-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/* Toolbar features — each with the customer benefit, not just the label. */
const FEATURES = [
  { icon: 'text', title: 'Bigger Text', desc: 'Scale every word on the page up to 150% — easier reading with no squinting or zooming.' },
  { icon: 'contrast', title: 'High Contrast', desc: 'Boost color contrast so text stands out clearly in bright light or for low-vision visitors.' },
  { icon: 'readable', title: 'Readable Font', desc: 'Switch to a highly legible typeface with extra spacing that’s simpler to follow.' },
  { icon: 'link', title: 'Highlight Links', desc: 'Underline and outline every link so what’s clickable is obvious at a glance.' },
  { icon: 'cursor', title: 'Bigger Cursor', desc: 'Enlarge the mouse pointer so it’s easy to see and track across the screen.' },
  { icon: 'motion', title: 'Pause Animations', desc: 'Stop on-page motion for anyone who finds movement distracting or uncomfortable.' },
]

/* Who it helps — the customer-benefit angle. */
const BENEFITS = [
  { icon: 'eye', title: 'Vision differences', desc: 'Larger text, stronger contrast, and clearer links help customers with low vision or color blindness read every detail.' },
  { icon: 'hand', title: 'Dexterity & motor needs', desc: 'A bigger cursor and clear, easy-to-hit links make the site simpler to use for anyone with limited fine motor control.' },
  { icon: 'brain', title: 'Focus & sensitivity', desc: 'Pausing animation and using a calmer, readable layout helps customers who are sensitive to motion or easily distracted.' },
  { icon: 'users', title: 'Every age & device', desc: 'From older homeowners to anyone on a small phone screen, the controls let each visitor set the site up the way that works for them.' },
]

export default function AccessibilityPage() {
  useSeo({
    title: 'Accessibility | Preventive Home Solutions',
    description:
      'Our website includes a built-in accessibility toolbar and meets the WCAG 2.1 AA standard, so every customer can adjust text size, contrast, motion and more to suit their needs.',
    path: '/accessibility',
  })

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <main>

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden bg-phsSky text-white">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Strands
            colors={['#f97316', '#ffffff', '#3b82f6']}
            count={3} speed={0.5} amplitude={1} waviness={1} thickness={0.6}
            glow={2.6} taper={3} spread={1} hueShift={0} intensity={0.6}
            saturation={1.95} opacity={0.5} scale={2.6}
          />
        </div>
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1000px] px-6 py-16 text-center lg:py-24">
          <Reveal className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 ring-2 ring-white/30 backdrop-blur-sm">
            <AccessibilityIcon className="h-9 w-9 text-white" />
          </Reveal>
          <Reveal as="p" delay={100} className="mb-4 font-mono text-xs font-bold tracking-[0.28em] text-white drop-shadow">
            ACCESSIBILITY
          </Reveal>
          <Reveal as="h1" delay={150} className="font-display text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
            A Website Everyone Can Use
          </Reveal>
          <Reveal as="p" delay={250} className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-lg">
            We built our site so every customer — however they see, move, or read — can find help fast. That includes a simple accessibility toolbar you can use to adjust the page to suit you.
          </Reveal>
        </div>
      </section>

      {/* --------------------- How to open the toolbar -------------------- */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 lg:grid-cols-[auto_1fr] lg:gap-14">
          <Reveal variant="scale" className="mx-auto">
            {/* Mirrors the real launcher: a square navy button with the icon */}
            <div className="grid h-24 w-24 place-items-center rounded-xl bg-phsNavy text-white shadow-xl ring-2 ring-phsOrange">
              <AccessibilityIcon className="h-12 w-12" />
            </div>
            <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Bottom-left of every page</p>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-phsOrange">How To Use It</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-phsNavy sm:text-4xl">
              One tap to make the site fit you
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-base">
              Look for the square accessibility button in the bottom-left corner of any page. Tap it to open the toolbar, choose the adjustments you want, and the site updates instantly. Your choices are <span className="font-bold text-phsNavy">remembered</span> as you browse and when you come back — no need to set them again.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------- Toolbar features ----------------------- */}
      <section className="bg-[#FAF8F5] py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">What You Can Adjust</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              Six Ways to Tailor the Page
            </Reveal>
            <Reveal as="p" delay={200} className="mt-4 text-[15px] leading-relaxed text-gray-500">
              Every option is built right into our site — no downloads, no add-ons, and it never slows the page down.
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} variant="up" delay={(i % 3) * 100} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border border-[#e6ded4] bg-white p-7 shadow-[0_18px_40px_-12px_rgba(10,37,64,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-phsOrange/40 hover:shadow-[0_28px_55px_-12px_rgba(10,37,64,0.28)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-phsOrange/20 bg-phsOrange/10 text-phsOrange transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-phsOrange group-hover:text-white [&_svg]:h-7 [&_svg]:w-7">
                    {ICONS[f.icon]}
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy transition-colors group-hover:text-phsOrange">{f.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150} className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-[#e6ded4] bg-white px-5 py-4 text-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-phsOrange/10 text-phsOrange [&_svg]:h-5 [&_svg]:w-5">{ICONS.reset}</span>
            <p className="text-sm text-gray-600">Changed your mind? A single <span className="font-bold text-phsNavy">Reset all</span> button clears every adjustment at once.</p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- Who it helps ------------------------- */}
      <section className="bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Reveal as="p" className="mb-4 font-mono text-xs font-bold tracking-[0.25em] text-phsOrange sm:text-sm">Why It Helps You</Reveal>
            <Reveal as="h2" delay={100} className="font-display text-3xl font-black leading-[1.05] tracking-tight text-phsNavy sm:text-4xl lg:text-[2.75rem]">
              Built Around Real Customers
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} variant="up" delay={(i % 2) * 100} className="h-full">
                <div className="flex h-full items-start gap-5 rounded-2xl border border-[#e6ded4] bg-[#FAF8F5] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-phsOrange/40 hover:bg-white hover:shadow-lg">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-phsOrange/10 text-phsOrange [&_svg]:h-6 [&_svg]:w-6">{ICONS[b.icon]}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-wide text-phsNavy">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Commitment / WCAG statement ---------------- */}
      <section className="bg-[#FAF8F5] py-14 lg:py-20">
        <div className="mx-auto max-w-[850px] px-6">
          <Reveal className="rounded-2xl border border-[#e6ded4] bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-phsOrange/10 text-phsOrange [&_svg]:h-7 [&_svg]:w-7">{ICONS.shield}</span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight text-phsNavy sm:text-3xl">Our Accessibility Commitment</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
                  Beyond the toolbar, we’ve built {BUSINESS.name}’s website to meet the recognized <span className="font-bold text-phsNavy">WCAG&nbsp;2.1&nbsp;Level&nbsp;AA</span> standard. That means real improvements in the site itself — clear labels on every form, strong text contrast, descriptions on images for screen readers, full keyboard navigation, and a reduced-motion mode — not a bolt-on overlay.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
                  Accessibility is an ongoing effort. If anything on our site is hard for you to use, we want to know so we can fix it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- CTA ------------------------------ */}
      <section className="relative overflow-hidden bg-phsNavy py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-phsOrange/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center">
          <Reveal as="h2" className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Need a hand, or have feedback?
          </Reveal>
          <Reveal as="p" delay={100} className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base">
            Prefer to talk to a person? Call us any time — we’re happy to help with your plumbing, heating, or cooling needs directly. And if you have a suggestion to make our site easier to use, please let us know.
          </Reveal>
          <Reveal delay={200} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`tel:${PHONE_TEL}`} className="cta-diag cta-diag-orange inline-flex items-center justify-center gap-3 rounded-md bg-phsOrange px-7 py-4 font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg">
              <PhoneIcon className="h-5 w-5" /> Call {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${BUSINESS.email}?subject=Website%20accessibility%20feedback`} className="inline-flex items-center justify-center gap-3 rounded-md border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20">
              Send Accessibility Feedback
            </a>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}
