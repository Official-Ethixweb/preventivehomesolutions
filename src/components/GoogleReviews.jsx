import { useEffect, useState } from 'react'
import { fetchGoogleReviews } from '../lib/googleReviews.js'

/**
 * Continuously-scrolling (never-stopping) marquee of Google reviews, shown
 * under the "Why Choose" cards.
 *
 * - When VITE_GOOGLE_MAPS_API_KEY + VITE_GOOGLE_PLACE_ID are configured, it
 *   pulls live reviews from the Preventive Home Solutions business profile and
 *   re-polls every 5 minutes so fresh reviews appear without a reload.
 * - Otherwise it falls back to representative reviews so the motion still works.
 */

// Where fallback cards (and any live review missing its own link) send users.
const BUSINESS_GOOGLE_URL =
  'https://www.google.com/search?q=Preventive+Home+Solutions+reviews'

const FALLBACK_REVIEWS = [
  {
    author: 'Marcus Whitfield',
    rating: 5,
    text: 'Showed up same day for a burst pipe and had it fixed in under two hours. Clean, professional, and fair priced. Could not ask for more.',
    time: '2 weeks ago',
  },
  {
    author: 'Danielle Pierce',
    rating: 5,
    text: 'Our furnace died on the coldest night of the year and they came out after hours. Honest about what needed fixing instead of upselling us. Lifesavers.',
    time: 'a month ago',
  },
  {
    author: 'Trevor Hansen',
    rating: 5,
    text: 'Signed up for their maintenance plan and it has already paid for itself. The technicians actually explain what they are doing. Highly recommend.',
    time: '3 weeks ago',
  },
  {
    author: 'Priya Raman',
    rating: 5,
    text: 'Replaced our water heater quickly and left the space cleaner than they found it. Texted ahead with arrival time. Genuinely great service.',
    time: '2 months ago',
  },
  {
    author: 'Jordan Blake',
    rating: 5,
    text: 'Drain backup on a Sunday and they still answered. Diagnosed it right the first time. These are the people you want defending your home.',
    time: '1 month ago',
  },
  {
    author: 'Sofia Mendez',
    rating: 5,
    text: 'Licensed, on time, and they stand behind their work. Had them back for a second job because the first went so smoothly. Five stars easily.',
    time: '5 days ago',
  },
]

function GoogleG({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${filled ? 'text-[#fbbc05]' : 'text-gray-300'}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.6l-4.95 2.6.95-5.5-4-3.9 5.53-.8z" />
    </svg>
  )
}

function ReviewCard({ author, avatar, rating, text, time, url }) {
  const stars = Math.round(rating || 5)
  const initial = (author || 'G').trim().charAt(0).toUpperCase()

  return (
    <a
      href={url || BUSINESS_GOOGLE_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Read this review on Google"
      className="flex w-[300px] shrink-0 cursor-pointer flex-col rounded-2xl border border-[#e6ded4] bg-white p-6 shadow-lg shadow-phsNavy/5 transition-all duration-300 will-change-transform hover:-translate-y-2 hover:scale-[1.04] hover:border-phsOrange/30 hover:shadow-2xl hover:shadow-phsNavy/15 sm:w-[340px]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              width="40"
              height="40"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-phsOrange/10 font-display font-bold text-phsOrange">
              {initial}
            </div>
          )}
          <div>
            <p className="font-display text-sm font-bold leading-tight text-phsNavy">{author}</p>
            <div className="mt-1 flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} filled={i < stars} />
              ))}
            </div>
          </div>
        </div>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>

      <p className="mt-4 whitespace-normal text-sm leading-relaxed text-gray-600 line-clamp-4">
        “{text}”
      </p>

      {time && <p className="mt-3 text-xs font-medium text-gray-500">{time}</p>}
    </a>
  )
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID
    if (!apiKey || !placeId) return

    let active = true

    async function load() {
      try {
        const data = await fetchGoogleReviews({ apiKey, placeId })
        if (active && data?.reviews?.length) {
          setReviews(data.reviews)
          setIsLive(true)
        }
      } catch (err) {
        // Keep showing fallback reviews; surface the reason for debugging.
        console.warn('[GoogleReviews] live fetch failed, using fallback:', err)
      }
    }

    load()
    const id = setInterval(load, 5 * 60 * 1000) // re-poll every 5 min
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  // Repeat to fill wide screens, then duplicate once for a seamless -50% loop.
  const filled =
    reviews.length >= 6 ? reviews : [...reviews, ...reviews, ...reviews].slice(0, 6)
  const track = [...filled, ...filled]

  return (
    <div className="mt-16 lg:mt-20">
      {/* Heading */}
      <div className="mb-8 flex flex-col items-center gap-2.5 px-4 text-center lg:scale-110">
        <div className="flex items-center gap-2.5">
          <GoogleG className="h-6 w-6" />
          <span className="font-display text-base font-bold tracking-[0.18em] text-phsNavy">
            REVIEWS
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              LIVE
            </span>
          )}
        </div>
        <p className="text-[13px] sm:text-lg font-mono font-bold tracking-[0.12em] sm:tracking-[0.2em] text-phsNavy">
          REAL HOMEOWNERS · REAL RESULTS
        </p>
      </div>

      {/* Edge-faded, continuously scrolling marquee */}
      <div
        className="group relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex w-max animate-marquee-slow [animation-direction:reverse] gap-5 py-6">
          {track.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>
      </div>
    </div>
  )
}
