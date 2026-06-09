import { useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'

const HERO_IMAGES = [
  '/d0484732fe6d7b7993abcea3ba29e28d.jpg',
  '/ms.jpg',
  '/896c33fe-d6b8-456f-88c4-a002594afb20.jpg',
]

/** Auto-advancing background slideshow with a horizontal sliding motion. */
function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      5000
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-1000 ease-in-out"
        style={{
          width: `${HERO_IMAGES.length * 100}%`,
          transform: `translateX(-${index * (100 / HERO_IMAGES.length)}%)`,
        }}
      >
        {HERO_IMAGES.map((src) => (
          <div
            key={src}
            className="h-full bg-cover bg-center"
            style={{ width: `${100 / HERO_IMAGES.length}%`, backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </div>
  )
}

/** Official Google wordmark logo. */
function GoogleLogo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 272 92"
      className={className}
      role="img"
      aria-label="Google"
    >
      <path
        fill="#EA4335"
        d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#FBBC05"
        d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#4285F4"
        d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
      />
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
      <path
        fill="#EA4335"
        d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.13l-.01.07zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
      />
      <path
        fill="#4285F4"
        d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
      />
    </svg>
  )
}

function GoogleStars() {
  return (
    <div className="flex items-center gap-3">
      <GoogleLogo className="h-8 w-auto drop-shadow" />
      <div className="flex text-2xl text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="origin-center transition-transform duration-300 hover:scale-125"
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-lg font-semibold text-white drop-shadow">Highly Rated</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      {/* Sliding background slideshow of the crew */}
      <HeroCarousel />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative mx-auto max-w-[1500px] px-4 py-20 sm:py-28 lg:px-10 lg:py-32">
        <Reveal
          as="p"
          delay={100}
          className="mb-4 text-lg font-semibold text-white drop-shadow sm:text-xl"
        >
          Welcome To Preventive Home Solutions
        </Reveal>

        <Reveal
          as="h1"
          delay={250}
          className="max-w-4xl text-4xl font-extrabold leading-[1.1] text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Expert Plumbing &amp; HVAC Solutions - In Northern Utah
        </Reveal>

        <Reveal delay={450} className="mt-8">
          <GoogleStars />
        </Reveal>

        <Reveal delay={600} className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="#"
            className="rounded-full bg-phsOrange px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-phsOrangeDark hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            Get Your Free Quote
          </a>
          <a
            href="tel:3854539428"
            className="rounded-full bg-phsOrange px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-phsOrangeDark hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            Call 385-453-9428
          </a>
        </Reveal>

        <Reveal delay={750} className="mt-8">
          <a
            href="#scheduling"
            className="inline-block rounded-full bg-phsBlue px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            Scroll To Online Scheduling
          </a>
        </Reveal>
      </div>
    </section>
  )
}
