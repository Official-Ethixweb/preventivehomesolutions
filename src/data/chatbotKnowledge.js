// Chatbot free-text knowledge base — no LLM, no API key. A deterministic
// keyword/intent matcher scored against real site content, assembled from
// the same data files that already drive the actual pages (services.js,
// serviceAreas.js, coupons.js, homeFaqs.js, business.js, nav.js) so answers
// can never drift out of sync with what the site actually says.
//
// Each knowledge entry uses the exact same "option" shape ChatBot.jsx's
// FLOW already understands ({ label, next } / { label, href } /
// { label, form, service } / { label, tel }), so a free-text match is
// rendered through the same revealSeq()/setOptions() call a button click
// already uses — no new UI, no new option-handling code.

import { SERVICE_PAGES, subServiceHref } from './services.js'
import { AREA_PAGES } from './serviceAreas.js'
import { COUPONS } from './coupons.js'
import { HOME_FAQS } from './homeFaqs.js'
import { BUSINESS, FULL_ADDRESS } from './business.js'
import { LICENSE_NUMBER, PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS, areaHref } from './nav.js'

const STOPWORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'of', 'for', 'to', 'in', 'on', 'with', '&',
  'do', 'you', 'your', 'is', 'are', 'what', 'how', 'can', 'does', 'my', 'i',
])

// Words that show up in several different service titles ("Water Heater" AND
// "Water Line Replacement" AND "Water Quality Filters", "Air Handlers" AND
// "Indoor Air Quality", etc.) — too generic on their own to identify ONE
// specific service, and prone to false-positive matches against ordinary
// phrases ("no cold air" matching "Air Handlers" on the word "air"). The full
// title phrase is kept as its own (higher-scoring) keyword regardless; this
// blocklist only trims the auto-derived single-word keywords.
const GENERIC_WORDS = new Set([
  'water', 'repair', 'replacement', 'service', 'services', 'installation',
  'install', 'air', 'heat', 'heating', 'cleaning', 'system', 'systems',
  'unit', 'units', 'maintenance', 'indoor', 'quality',
])

/** Lowercased whole phrase + individual significant words, for keyword scoring. */
function titleKeywords(title) {
  const clean = title.toLowerCase()
  const words = clean.replace(/[^\w\s]/g, ' ').split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w) && !GENERIC_WORDS.has(w))
  return [clean, ...words]
}

/* -------------------- Top-level trades: route into FLOW -------------------- */
// Broad trade words ("plumbing", "AC") reuse the existing FLOW node copy
// instead of duplicating it — same content whether clicked or typed. Keyword
// lists lean heavily on how real homeowners describe a problem (symptoms),
// not just official service names — "no cold air" matters more than "AC
// repair" here, since almost nobody types the second one.
export const TRADE_ROUTES = [
  {
    next: 'plumbing', serviceNoun: 'Plumbing',
    keywords: [
      'plumbing', 'plumber', 'pipe', 'pipes', 'faucet', 'tap', 'sink', 'leak',
      'water leak', 'leaking', 'dripping', 'low water pressure', 'low pressure',
      'running toilet', 'toilet clogged', 'garbage disposal',
    ],
  },
  {
    next: 'heating', serviceNoun: 'Heating',
    keywords: [
      'heating', 'heater', 'furnace', 'boiler', 'heat pump', 'no heat',
      'not heating', 'cold house', 'thermostat', 'furnace not working',
      'heater not working', 'no warm air',
    ],
  },
  {
    next: 'cooling', serviceNoun: 'Cooling / AC',
    keywords: [
      'cooling', 'ac', 'a c', 'air conditioning', 'air conditioner', 'ac unit',
      'not cooling', 'no cold air', 'ac not working', 'ac broken', 'hot house',
      'blowing warm air',
    ],
  },
  {
    next: 'waterheater', serviceNoun: 'Water Heater',
    keywords: [
      'water heater', 'hot water', 'tankless', 'no hot water', 'cold shower',
      'cold water only', 'water heater leaking', 'water heater broken',
    ],
  },
  {
    next: 'drain', serviceNoun: 'Drain & Sewer',
    keywords: [
      'drain', 'sewer', 'clog', 'clogged', 'sump pump', 'backed up',
      'backing up', 'not draining', 'slow drain', 'sewage smell', 'toilet not flushing',
    ],
  },
]

/** Words that fast-track straight to the emergency FLOW node, ahead of any
 * informational reply — urgency matters more than accuracy of topic match. */
// "No heat" stays on this list (a real risk in a Utah winter); "no hot
// water" doesn't — that's an inconvenience, not urgent enough to skip the
// informational water-heater reply and its own "Book Now" option.
export const EMERGENCY_KEYWORDS = [
  'emergency', 'urgent', 'asap', 'right now', 'flooding', 'flooded', 'flood',
  'burst pipe', 'burst', 'no heat', 'gas smell', 'smell gas',
  'gas leak', 'sewage backup', 'water everywhere', 'basement flooding',
]

/** Casual conversation openers/closers — not a real question, but a bot that
 * treats "hi" as unrecognized reads as broken. `shortOnly: true` keeps them
 * from firing on a longer message that just happens to start with "hi" —
 * "hi, do you fix furnaces" is a furnace question, not small talk, even
 * though "hi" is a keyword hit; bestMatch() below skips shortOnly entries
 * once the message runs past a few words, so the real topic wins instead. */
const smallTalkEntries = [
  {
    id: 'greeting',
    shortOnly: true,
    keywords: ['hi', 'hello', 'hey', 'hiya', 'howdy', 'yo', 'good morning', 'good afternoon', 'good evening'],
    reply: "Hi there! I can help you find a service, check pricing or coverage in your area, or connect you with our team. What's going on?",
    quickReplies: [
      { label: 'Find a Service', next: 'services' },
      { label: 'Book an Appointment', form: true },
      { label: 'I Have an Emergency', next: 'emergency' },
    ],
  },
  {
    id: 'thanks',
    shortOnly: true,
    keywords: ['thanks', 'thank you', 'thx', 'appreciate it', 'appreciate you'],
    reply: "You're welcome! Let me know if there's anything else I can help with.",
    quickReplies: [
      { label: 'Ask Something Else', next: 'services' },
      { label: 'Get a Free Quote', form: true },
    ],
  },
  {
    id: 'goodbye',
    shortOnly: true,
    keywords: ['bye', 'goodbye', 'see you', 'gotta go', 'talk later'],
    reply: `Thanks for stopping by! Call ${PHONE_DISPLAY} any time you need us.`,
    quickReplies: [{ label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL }],
  },
]

/** Words that mean "I want to book this," routing into the existing intake
 * flow (startForm) instead of an informational reply. Deliberately excludes
 * "quote"/"estimate" — those show up in plain pricing questions ("do you
 * offer free estimates?") that should get the informational answer, not an
 * unprompted jump into the lead form.
 *
 * The "call me" phrases were a real, high-value miss found in a live audit:
 * "Can someone call me?" is about as clear a purchase-intent signal as a
 * visitor can send, and it was falling straight into the generic fallback. */
export const BOOKING_KEYWORDS = [
  'book', 'schedule', 'appointment', 'come out', 'send someone', 'set up a visit',
  'call me', 'call back', 'callback', 'have someone call', 'give me a call', 'someone call',
]

/* ------------------------------ Sub-services ------------------------------ */
// One entry per real sub-service (~30), generated from services.js so this
// list can never fall out of sync with the actual service pages.
const subServiceEntries = []
for (const trade of Object.values(SERVICE_PAGES)) {
  for (const svc of trade.services) {
    subServiceEntries.push({
      id: `svc-${trade.slug}-${svc.slug}`,
      keywords: titleKeywords(svc.title),
      serviceNoun: trade.name,
      reply: svc.description,
      quickReplies: [
        { label: 'Learn More', href: svc.slug ? subServiceHref(trade.slug, svc.slug) : `/${trade.slug}` },
        { label: 'Book Now', form: true, service: trade.name },
        { label: 'Ask Something Else', next: 'services' },
      ],
    })
  }
}

/* --------------------------------- Areas ----------------------------------- */
// One entry per real service-area city, generated from serviceAreas.js.
const areaEntries = Object.values(AREA_PAGES).map((area) => ({
  id: `area-${area.slug}`,
  keywords: [area.city.toLowerCase(), ...area.city.toLowerCase().split(' ')],
  reply: `Yes — ${area.city} (${area.county}) is one of our regular service areas.`,
  quickReplies: [
    { label: `${area.city} Info`, href: areaHref(area.city) },
    { label: 'Get a Free Quote', form: true },
    { label: 'Ask Something Else', next: 'services' },
  ],
}))

/* --------------------------------- Coupons ---------------------------------- */
const couponEntry = {
  id: 'coupons',
  // "offer"/"offers" deliberately excluded — too generic, and collides with
  // ordinary phrasing like "do you offer free estimates" (found live, in an
  // audit) that has nothing to do with coupons.
  keywords: ['coupon', 'coupons', 'discount', 'discounts', 'deal', 'deals', 'special', 'specials', 'promo', 'promotion', 'savings'],
  reply: `We've got a few offers running right now: ${COUPONS.slice(0, 4).map((c) => `${c.title} (${c.badge})`).join(', ')}. See the full list and claim one on our coupons page.`,
  quickReplies: [
    { label: 'View All Coupons', href: '/coupons' },
    { label: 'Get a Free Quote', form: true },
  ],
}

/* --------------------------- Site FAQ (verbatim) ---------------------------- */
// Reuses the exact, already-approved Q&A shown in the home page accordion and
// baked into its FAQPage schema — never separate/duplicate copy.
const faqEntries = HOME_FAQS.map((f, i) => ({
  id: `faq-${i}`,
  keywords: titleKeywords(f.q),
  reply: f.a,
  quickReplies: [
    { label: 'Get a Free Quote', form: true },
    { label: 'Ask Something Else', next: 'services' },
  ],
}))

/* ------------------------------- Meta topics -------------------------------- */
const metaEntries = [
  {
    id: 'license',
    keywords: ['license', 'licensed', 'insurance', 'insured', 'bonded', 'certified', 'certification', 'credentials'],
    reply: `Yes — every technician is fully licensed and insured. Our Utah contractor license number is ${LICENSE_NUMBER}, and every job is backed by a written warranty.`,
    quickReplies: [{ label: 'Get a Free Quote', form: true }],
  },
  {
    id: 'pricing',
    // "how much" was a real miss: "How much is a plumber?" has no other
    // pricing word in it, so without this phrase it fell through to a
    // generic plumbing description instead of the actual pricing answer.
    keywords: ['price', 'pricing', 'cost', 'costs', 'expensive', 'cheap', 'rate', 'rates', 'fee', 'fees', 'how much'],
    reply: "We don't guess over the phone — every job gets a free, upfront, fixed quote before any work begins, so there are no hourly surprises.",
    quickReplies: [
      { label: 'Get a Free Quote', form: true },
      { label: 'View Coupons', href: '/coupons' },
    ],
  },
  {
    id: 'coverage',
    // A real miss: "Do you service my area?" (no city named) matched none
    // of the area entries (city-specific) or the "what areas do you cover"
    // FAQ (its derived keywords are "areas"/"cover" — this phrasing uses
    // neither: singular "area" and the word "service" instead of "cover").
    keywords: ['my area', 'your area', 'service my area', 'cover my area', 'you cover', 'you service', 'area covered', 'covered area', 'service area', 'which areas', 'which cities'],
    reply: `We service all of Northern Utah, including ${SERVICE_AREAS.slice(0, -1).join(', ')}, and ${SERVICE_AREAS[SERVICE_AREAS.length - 1]}. Tell me your city and I can confirm.`,
    quickReplies: [
      { label: 'Get a Free Quote', form: true },
      { label: 'Ask Something Else', next: 'services' },
    ],
  },
  {
    id: 'hours',
    keywords: ['hours', 'open', 'closed', 'available', 'availability', 'weekend', 'sunday', 'saturday', 'late night'],
    reply: `We're available 7 days a week, with 24/7 response for real emergencies. Call ${PHONE_DISPLAY} any time.`,
    quickReplies: [
      { label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL },
      { label: 'I Have an Emergency', next: 'emergency' },
    ],
  },
  {
    id: 'contact',
    keywords: ['phone number', 'contact', 'email', 'address', 'located', 'location', 'where are you'],
    reply: `You can call or text us at ${PHONE_DISPLAY}, email ${BUSINESS.email}, or find us at ${FULL_ADDRESS}.`,
    quickReplies: [{ label: `Call ${PHONE_DISPLAY}`, tel: PHONE_TEL }],
  },
  {
    id: 'warranty',
    keywords: ['warranty', 'guarantee', 'guaranteed'],
    reply: 'Every job we complete is backed by a written warranty, so you know the work will last.',
    quickReplies: [{ label: 'Get a Free Quote', form: true }],
  },
]

// Order matters for tie-breaks: more specific/curated entries first so a
// generic sub-service description never outranks a precise meta answer.
export const CHATBOT_KNOWLEDGE = [
  ...smallTalkEntries,
  ...metaEntries,
  couponEntry,
  ...faqEntries,
  ...areaEntries,
  ...subServiceEntries,
]

function normalize(s) {
  return s.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// One RegExp per distinct keyword, reused across every match() call instead
// of rebuilt each time — the knowledge base is static after module load, so
// this only ever runs once per keyword for the life of the page.
const keywordPatternCache = new Map()
function keywordPattern(kw) {
  let re = keywordPatternCache.get(kw)
  if (!re) {
    // Multi-word phrases: exact substring, word-bounded on both ends.
    // Single words: allow a trailing "s" (furnace/furnaces, coupon/coupons)
    // — real English pluralization coverage is out of scope, but this one
    // rule catches the overwhelming majority of home-services vocabulary.
    re = kw.includes(' ')
      ? new RegExp(`\\b${escapeRegExp(kw)}\\b`)
      : new RegExp(`\\b${escapeRegExp(kw)}s?\\b`)
    keywordPatternCache.set(kw, re)
  }
  return re
}

/** Score one entry's keywords against an already-normalized message.
 * Multi-word phrases count for more — a much stronger signal than any
 * single word. */
function scoreKeywords(norm, keywords) {
  let score = 0
  for (const kw of keywords) {
    if (keywordPattern(kw).test(norm)) score += kw.includes(' ') ? 3 : 1
  }
  return score
}

const SHORT_MESSAGE_WORD_LIMIT = 4

/** Highest-scoring entry in `entries` (each needs a `.keywords` array), or
 * null if nothing scored. Ties go to whichever entry appears first. Entries
 * flagged `shortOnly` (small talk) are skipped once the message runs past a
 * few words — a real question shouldn't lose to "hi" just because it opens
 * with one. */
function bestMatch(text, entries) {
  const norm = normalize(text)
  const isShortMessage = norm.split(' ').length <= SHORT_MESSAGE_WORD_LIMIT
  let best = null
  let bestScore = 0
  for (const entry of entries) {
    if (entry.shortOnly && !isShortMessage) continue
    const score = scoreKeywords(norm, entry.keywords)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return best
}

export function matchIntent(text, knowledgeBase = CHATBOT_KNOWLEDGE) {
  return bestMatch(text, knowledgeBase)
}

export function matchTradeRoute(text) {
  return bestMatch(text, TRADE_ROUTES)
}

/** Same word-boundary/pluralization rule as the scorers above, for the flat
 * EMERGENCY_KEYWORDS / BOOKING_KEYWORDS string arrays. */
export function textIncludesAny(text, phrases) {
  const norm = normalize(text)
  return phrases.some((p) => keywordPattern(p).test(norm))
}
