import { useEffect, useRef, useState, useCallback } from 'react'
import { navigate } from '../router.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../data/nav.js'

/**
 * Guided support chatbot with validated lead capture.
 *
 * For now this is a deterministic, rule-based assistant: it walks visitors to
 * the right service, and can collect their contact details (name, phone,
 * email, ZIP, service) with real validation before handing the "lead" off.
 * There is no backend yet, so a completed request is stored locally and logged
 * — the submitLead() function is the single seam where a real API / email /
 * AI backend gets wired in later. The whole guided menu lives in FLOW and the
 * intake questions live in LEAD_STEPS, so both are easy to extend.
 */

const AVATAR = '/chatbot-phs.jpg'

/* ------------------------------------------------------------------ */
/*  Served ZIP codes -> city. Derived from the SERVICE_AREAS listed on  */
/*  the site (Northern Utah: Weber / Davis / Box Elder counties).       */
/*  A ZIP outside this map is treated as "outside our service area".    */
/* ------------------------------------------------------------------ */
const SERVED_ZIPS = {
  '84401': 'Ogden',
  '84403': 'Ogden',
  '84404': 'Ogden',
  '84405': 'Ogden / Riverdale',
  '84408': 'Ogden',
  '84409': 'Ogden',
  '84414': 'North Ogden',
  '84015': 'Clinton / West Point',
  '84040': 'Layton',
  '84041': 'Layton',
  '84075': 'Syracuse',
  '84067': 'Roy',
  '84016': 'Clearfield',
  '84089': 'Clearfield',
  '84302': 'Brigham City',
  '84037': 'Kaysville',
}

// Services offered on the site (used for the intake "which service" step).
const SERVICE_CHOICES = [
  'Plumbing',
  'Heating',
  'Cooling / AC',
  'Water Heater',
  'Drain & Sewer',
  'Something else',
]

/* ------------------------------- validators ------------------------------- */

function validateName(raw) {
  const v = raw.trim().replace(/\s+/g, ' ')
  if (v.length < 3) return { ok: false, error: 'Please enter your full name (first and last).' }
  // Letters (incl. accented), spaces, hyphens, apostrophes, periods — and at
  // least two words, so we capture a real first and last name.
  if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'.-]*(?: [A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'.-]*)+$/.test(v))
    return { ok: false, error: 'Please enter a valid first and last name (letters only).' }
  const letters = v.replace(/[^A-Za-zÀ-ÿ]/g, '')
  if (!/[aeiouyAEIOUYÀ-ÿ]/.test(letters))
    return { ok: false, error: "That doesn't look like a name. Could you enter your real name?" }
  if (/(.)\1{3,}/.test(letters))
    return { ok: false, error: "That doesn't look like a name. Could you enter your real name?" }
  const low = v.toLowerCase()
  const blocked = ['asdf', 'qwer', 'zxcv', 'test test', 'john doe', 'jane doe', 'abcd', 'sdfg', 'fake name']
  if (blocked.some((b) => low.includes(b)))
    return { ok: false, error: 'Please enter your real name so our team can address you correctly.' }
  return { ok: true, value: v }
}

function validatePhone(raw) {
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && d[0] === '1') d = d.slice(1)
  if (d.length !== 10) return { ok: false, error: 'Please enter a 10-digit phone number.' }
  // Valid North American number: area code and exchange both start 2-9.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d))
    return { ok: false, error: "That number doesn't look valid. Please enter a real 10-digit phone number." }
  return { ok: true, value: `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` }
}

function validateEmail(raw) {
  const v = raw.trim()
  if (/\s/.test(v) || v.includes('..'))
    return { ok: false, error: 'That email doesn\'t look right. Please enter a valid email like you@example.com.' }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v))
    return { ok: false, error: 'That email doesn\'t look right. Please enter a valid email like you@example.com.' }
  const domain = v.split('@')[1].toLowerCase()
  const typos = {
    'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com', 'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com',
    'yahoo.con': 'yahoo.com', 'hotmail.con': 'hotmail.com', 'outlook.con': 'outlook.com',
  }
  if (typos[domain])
    return { ok: false, error: `Did you mean ${v.split('@')[0]}@${typos[domain]}? Please re-enter your email.` }
  return { ok: true, value: v.toLowerCase() }
}

function validateZip(raw) {
  const v = raw.trim()
  if (!/^\d{5}$/.test(v)) return { ok: false, error: 'Please enter a valid 5-digit ZIP code.' }
  const city = SERVED_ZIPS[v]
  if (!city) return { ok: false, error: 'unserved', value: v }
  return { ok: true, value: v, city }
}

// Intake questions asked in order. `service` is dropped when we already know it.
const LEAD_STEPS = [
  { key: 'name', type: 'text', inputMode: 'text', placeholder: 'Your first and last name', validate: validateName,
    prompt: "Great — let's get this set up. What's your full name?" },
  { key: 'phone', type: 'text', inputMode: 'tel', placeholder: '10-digit phone number', validate: validatePhone,
    prompt: 'Thanks{name}. What is the best phone number to reach you?' },
  { key: 'email', type: 'text', inputMode: 'email', placeholder: 'you@example.com', validate: validateEmail,
    prompt: 'And what email address should we use?' },
  { key: 'zip', type: 'text', inputMode: 'numeric', placeholder: '5-digit ZIP code', validate: validateZip,
    prompt: 'What is your ZIP code? We serve Northern Utah.' },
  { key: 'service', type: 'choice', options: SERVICE_CHOICES,
    prompt: 'Which service do you need help with?' },
]

/* ------------------------------ guided menu ------------------------------ */

const FLOW = {
  start: {
    messages: [
      "Hi, I'm the Preventive Home Solutions assistant. I can help you find the right service, book a visit, or have our team reach out to you.",
      'What would you like to do?',
    ],
    options: [
      { label: 'Find a service', next: 'services' },
      { label: 'Book an appointment', form: true },
      { label: 'I have an emergency', next: 'emergency' },
      { label: 'Talk to our team', next: 'contact' },
    ],
  },

  services: {
    messages: ['Which area do you need help with?'],
    options: [
      { label: 'Plumbing', next: 'plumbing' },
      { label: 'Heating', next: 'heating' },
      { label: 'Cooling / AC', next: 'cooling' },
      { label: 'Water Heater', next: 'waterheater' },
      { label: 'Drain & Sewer', next: 'drain' },
      { label: "I can't find what I need", next: 'somethingElse' },
      { label: 'Back', next: 'start' },
    ],
  },

  plumbing: {
    messages: [
      'Our licensed plumbers handle leaks, faucets, toilets, water lines, sewer work, and more, 7 days a week.',
      'What would you like to do next?',
    ],
    options: [
      { label: 'View plumbing services', href: '/plumbing' },
      { label: 'Book a plumber', form: true, service: 'Plumbing' },
      { label: 'Other services', next: 'services' },
    ],
  },

  heating: {
    messages: [
      'We service, repair, and install furnaces, boilers, heat pumps, and mini-splits to keep your home warm all winter.',
      'What would you like to do next?',
    ],
    options: [
      { label: 'View heating services', href: '/hvac' },
      { label: 'Book a technician', form: true, service: 'Heating' },
      { label: 'Other services', next: 'services' },
    ],
  },

  cooling: {
    messages: [
      'From AC tune-ups to full installs, our certified techs keep you cool through Utah summers, with same-day service available.',
      'What would you like to do next?',
    ],
    options: [
      { label: 'View cooling services', href: '/ac' },
      { label: 'Book a technician', form: true, service: 'Cooling / AC' },
      { label: 'Other services', next: 'services' },
    ],
  },

  waterheater: {
    messages: [
      'We repair, maintain, and install both tank and tankless water heaters so you never run out of hot water.',
      'Water heaters are handled by our plumbing team.',
    ],
    options: [
      { label: 'View water heater services', href: '/plumbing' },
      { label: 'Book a visit', form: true, service: 'Water Heater' },
      { label: 'Other services', next: 'services' },
    ],
  },

  drain: {
    messages: [
      'Clogged or slow drains, main line issues, sewer camera inspections, and sump pumps, we clear and clean it all.',
      'What would you like to do next?',
    ],
    options: [
      { label: 'View drain & sewer services', href: '/plumbing' },
      { label: 'Book a visit', form: true, service: 'Drain & Sewer' },
      { label: 'Other services', next: 'services' },
    ],
  },

  somethingElse: {
    messages: [
      'No problem. Even if it is not listed, our team can almost certainly help.',
      'Leave your details and the right person will reach out to you personally.',
    ],
    options: [
      { label: 'Request a callback', form: true, service: 'Something else' },
      { label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL },
      { label: 'Back to services', next: 'services' },
    ],
  },

  emergency: {
    messages: [
      'We offer fast, same-day emergency service, 7 days a week.',
      'The quickest way to get help right now is to call us directly.',
    ],
    options: [
      { label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL },
      { label: 'Request a callback instead', form: true, service: 'Emergency service' },
      { label: 'Back', next: 'start' },
    ],
  },

  contact: {
    messages: [
      "I'd be happy to connect you with our team.",
      'You can call us now, or leave your details and we will reach out to you.',
    ],
    options: [
      { label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL },
      { label: 'Leave my details', form: true },
      { label: 'Back', next: 'start' },
    ],
  },
}

let msgId = 0
const nextId = () => ++msgId
const firstNameOf = (n) => (n ? String(n).trim().split(/\s+/)[0] : '')
const interpolate = (tpl, d) => tpl.replace('{name}', d.name ? ` ${firstNameOf(d.name)}` : '')

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [messages, setMessages] = useState([])
  const [options, setOptions] = useState([])
  const [typing, setTyping] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [teaserClosed, setTeaserClosed] = useState(false)
  const [mode, setMode] = useState('menu') // 'menu' | 'form' | 'done'
  const [inputActive, setInputActive] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const timers = useRef([])
  const scrollEnd = useRef(null)
  const inputRef = useRef(null)
  const started = useRef(false) // guards the one-time opening greeting
  // Form controller state kept in refs so async callbacks never read stale copies.
  const formData = useRef({})
  const steps = useRef([])
  const stepIdx = useRef(0)

  const schedule = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
    return t
  }, [])
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const pushBot = (text) => setMessages((m) => [...m, { id: nextId(), from: 'bot', text }])
  const pushUser = (text) => setMessages((m) => [...m, { id: nextId(), from: 'user', text }])
  const focusInput = () => schedule(() => inputRef.current?.focus(), 60)

  // Reveal one or more bot messages in sequence, then run `after`.
  const revealSeq = useCallback((texts, after) => {
    const arr = Array.isArray(texts) ? texts : [texts]
    setTyping(true)
    let delay = 0
    arr.forEach((t, i) => {
      delay += 600
      schedule(() => {
        pushBot(t)
        if (i === arr.length - 1) {
          setTyping(false)
          after && after()
        }
      }, delay)
    })
  }, [schedule])

  /* ------------------------------ menu flow ------------------------------ */
  const showNode = useCallback((nodeId) => {
    const node = FLOW[nodeId]
    if (!node) return
    setMode('menu')
    setInputActive(false)
    setOptions([])
    revealSeq(node.messages, () => setOptions(node.options || []))
  }, [revealSeq])

  /* ------------------------------ intake form ---------------------------- */
  const askStep = useCallback((i) => {
    stepIdx.current = i
    const step = steps.current[i]
    setInputActive(false)
    setOptions([])
    revealSeq(interpolate(step.prompt, formData.current), () => {
      if (step.type === 'choice') {
        setOptions(step.options.map((l) => ({ label: l, formChoice: true })))
      } else {
        setInputActive(true)
        focusInput()
      }
    })
  }, [revealSeq]) // eslint-disable-line react-hooks/exhaustive-deps

  const reviewForm = useCallback(() => {
    const d = formData.current
    setInputActive(false)
    setOptions([])
    const summary =
      `Name: ${d.name}\n` +
      `Phone: ${d.phone}\n` +
      `Email: ${d.email}\n` +
      `ZIP: ${d.zip}${d.city ? ` (${d.city})` : ''}${d.outsideArea ? ' — outside standard area' : ''}\n` +
      `Service: ${d.service}`
    revealSeq(['Thanks. Please confirm your details:', summary, 'Should I send this to our team?'], () =>
      setOptions([
        { label: 'Yes, send it', submit: true },
        { label: 'Start over', restart: true },
      ])
    )
  }, [revealSeq])

  const advanceForm = useCallback(() => {
    const i = stepIdx.current + 1
    if (i >= steps.current.length) reviewForm()
    else askStep(i)
  }, [askStep, reviewForm])

  const startForm = useCallback((service) => {
    setMode('form')
    formData.current = service ? { service } : {}
    steps.current = LEAD_STEPS.filter((s) => !(s.key === 'service' && service))
    setInputActive(false)
    setOptions([])
    const intro = service
      ? `Perfect — I'll put together a request for ${service} and have our team follow up.`
      : "I'll grab a few quick details and our team will reach out to you."
    revealSeq(intro, () => askStep(0))
  }, [revealSeq, askStep])

  const submitLead = useCallback(() => {
    const lead = { ...formData.current, submittedAt: new Date().toISOString() }
    // No backend yet: persist locally + log. This is the seam for a future
    // API / email / AI integration.
    try {
      const key = 'phs_chat_leads'
      const arr = JSON.parse(localStorage.getItem(key) || '[]')
      arr.push(lead)
      localStorage.setItem(key, JSON.stringify(arr))
    } catch {
      /* ignore storage errors */
    }
    // eslint-disable-next-line no-console
    console.log('[PHS ChatBot] New lead captured:', lead)

    const first = firstNameOf(lead.name)
    setMode('done')
    setInputActive(false)
    setOptions([])
    revealSeq(
      [
        `Thank you${first ? `, ${first}` : ''}. Your request has been received.`,
        `Our team will reach out to you shortly at ${lead.phone}.`,
        `If it is urgent, you can call us now at ${PHONE_DISPLAY}.`,
      ],
      () =>
        setOptions([
          { label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL },
          { label: 'Start over', restart: true },
        ])
    )
  }, [revealSeq])

  const restart = useCallback(() => {
    clearTimers()
    setMessages([])
    setOptions([])
    setTyping(false)
    setInputActive(false)
    setInputValue('')
    formData.current = {}
    steps.current = []
    stepIdx.current = 0
    showNode('start')
  }, [showNode])

  /* --------------------------- input handlers ---------------------------- */
  const handleTextSubmit = () => {
    const val = inputValue.trim()
    if (!val) return
    const step = steps.current[stepIdx.current]
    pushUser(val)
    setInputValue('')
    const res = step.validate(val)

    if (!res.ok) {
      // ZIP outside the served area: offer a graceful path rather than a hard stop.
      if (step.key === 'zip' && res.error === 'unserved') {
        formData.current.zip = res.value
        setInputActive(false)
        revealSeq(
          `It looks like ${res.value} may be outside our current service area (we serve Northern Utah). We can still have our team reach out to confirm whether we can help.`,
          () =>
            setOptions([
              { label: 'Have the team contact me', zipAccept: true },
              { label: 'Try another ZIP', zipRetry: true },
            ])
        )
        return
      }
      revealSeq(res.error, () => {
        setInputActive(true)
        focusInput()
      })
      return
    }

    formData.current[step.key] = res.value
    if (res.city) formData.current.city = res.city
    advanceForm()
  }

  const handleOption = (opt) => {
    pushUser(opt.label)
    setOptions([])

    if (opt.tel) {
      window.location.href = `tel:${opt.tel}`
      return
    }
    if (opt.href) {
      schedule(() => {
        navigate(opt.href)
        setOpen(false)
      }, 280)
      return
    }
    if (opt.form) {
      schedule(() => startForm(opt.service || null), 300)
      return
    }
    if (opt.formChoice) {
      const step = steps.current[stepIdx.current]
      formData.current[step.key] = opt.label
      schedule(() => advanceForm(), 260)
      return
    }
    if (opt.zipAccept) {
      formData.current.outsideArea = true
      schedule(() => advanceForm(), 260)
      return
    }
    if (opt.zipRetry) {
      delete formData.current.zip
      schedule(() => askStep(stepIdx.current), 200)
      return
    }
    if (opt.submit) {
      schedule(() => submitLead(), 260)
      return
    }
    if (opt.restart) {
      schedule(() => restart(), 200)
      return
    }
    if (opt.next) {
      schedule(() => showNode(opt.next), 300)
    }
  }

  /* ------------------------------- effects ------------------------------- */
  // Fire the greeting once, the first time the panel opens. Reopening later
  // preserves the existing conversation; "Start over" handles its own reset.
  useEffect(() => {
    if (open && !started.current) {
      started.current = true
      setTeaser(false)
      showNode('start')
    }
  }, [open, showNode])

  useEffect(() => {
    if (open) setHasUnread(false)
  }, [open])

  useEffect(() => {
    if (open || teaserClosed) return
    const t = setTimeout(() => setTeaser(true), 4000)
    return () => clearTimeout(t)
  }, [open, teaserClosed])

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing, options, inputActive])

  useEffect(() => () => clearTimers(), [])

  const curStep = mode === 'form' && inputActive ? steps.current[stepIdx.current] : null

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-[80] flex w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 animate-sheet-up lg:bottom-24 lg:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-phsNavy px-4 py-3">
            <div className="relative">
              <img
                src={AVATAR}
                alt="Preventive Home Solutions assistant"
                className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-phsOrange"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-phsNavy bg-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold leading-tight text-white">PHS Assistant</p>
              <p className="text-xs leading-tight text-white/90">Online · replies instantly</p>
            </div>
            <button
              onClick={restart}
              aria-label="Start over"
              title="Start over"
              className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-phsCream/60 px-4 py-4" style={{ height: 'min(60vh, 440px)' }}>
            {messages.map((m) =>
              m.from === 'bot' ? (
                <div key={m.id} className="flex items-end gap-2">
                  <img src={AVATAR} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover object-top ring-1 ring-black/10" />
                  <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-phsInk shadow-sm">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-sm bg-phsOrange px-3.5 py-2.5 text-sm font-medium leading-relaxed text-white shadow-sm">
                    {m.text}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex items-end gap-2">
                <img src={AVATAR} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover object-top ring-1 ring-black/10" />
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-phsInk/40 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-phsInk/40 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-phsInk/40" />
                </div>
              </div>
            )}

            <div ref={scrollEnd} />
          </div>

          {/* Quick replies */}
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-black/5 bg-white px-4 py-3">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt)}
                  className="rounded-full border border-phsOrange/40 bg-phsOrange/5 px-3.5 py-2 text-sm font-semibold text-phsOrangeDark transition hover:bg-phsOrange hover:text-white active:scale-95"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Text input (intake steps) */}
          {curStep && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleTextSubmit()
              }}
              className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                inputMode={curStep.inputMode}
                placeholder={curStep.placeholder}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-black/15 bg-phsCream/50 px-4 py-2.5 text-sm text-phsInk outline-none placeholder:text-phsInk/40 focus:border-phsOrange focus:ring-2 focus:ring-phsOrange/30"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-phsOrange text-white transition hover:bg-phsOrangeDark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Teaser bubble — dismissible so it never blocks page content */}
      {!open && teaser && !teaserClosed && (
        <div className="fixed bottom-[11.5rem] right-4 z-[65] max-w-[220px] animate-fade-in lg:bottom-[7rem] lg:right-6">
          <button
            onClick={() => setOpen(true)}
            className="block w-full rounded-2xl rounded-br-sm bg-white py-3 pl-4 pr-6 text-left text-sm font-medium text-phsInk shadow-xl ring-1 ring-black/10"
          >
            Need help choosing a service? Tap to chat with us.
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setTeaser(false)
              setTeaserClosed(true)
            }}
            aria-label="Dismiss message"
            className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-phsNavy text-white shadow-md ring-2 ring-white transition hover:bg-black"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
        className={`fixed bottom-24 right-4 z-[70] h-[4.8rem] w-[4.8rem] rounded-full bg-phsNavy shadow-xl ring-2 ring-phsOrange transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6 ${
          open ? 'hidden lg:block' : 'block'
        }`}
      >
        {open ? (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-phsNavy text-white">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </span>
        ) : (
          <>
            <img src={AVATAR} alt="" className="h-full w-full rounded-full object-cover object-top" />
            {hasUnread && (
              <>
                <span className="absolute right-0 top-0 h-6 w-6 animate-ping rounded-full bg-red-500/60" />
                <span className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-red-500 text-[12px] font-bold leading-none text-white shadow-md">
                  1
                </span>
              </>
            )}
          </>
        )}
      </button>
    </>
  )
}
