import Reveal from './Reveal.jsx'

export default function MapSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[340px] w-full sm:h-[460px]">
        {/* Live Google map centered on the Northern Utah service area */}
        <iframe
          title="Preventive Home Solutions service area"
          src="https://www.google.com/maps?q=Clearfield,+UT&z=8&output=embed"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        {/* Branded control buttons (top-right) — matched to the site button system */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 sm:right-5 sm:top-5">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Clearfield,+UT"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-phsOrange px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsOrangeDark hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.7 11.3l-9-9a1 1 0 00-1.4 0l-9 9a1 1 0 000 1.4l9 9a1 1 0 001.4 0l9-9a1 1 0 000-1.4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13v-2.5A1.5 1.5 0 0110.5 9H15m0 0l-2-2m2 2l-2 2" />
            </svg>
            Directions
          </a>
          <a
            href="https://www.google.com/maps?q=Clearfield,+UT"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-phsBlue shadow-lg ring-1 ring-phsBlue/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-phsBlue hover:text-white hover:shadow-xl active:translate-y-0 active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
            </svg>
            <span className="hidden sm:inline">View Larger Map</span>
            <span className="sm:hidden">Map</span>
          </a>
        </div>
      </div>

      {/* Business info card overlay */}
      <Reveal
        variant="left"
        className="absolute bottom-[224px] left-[2px] z-10 w-[230px] rounded-lg bg-white p-3 shadow-lg sm:bottom-[232px] sm:left-[10px]"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-[15px] font-semibold text-gray-800">Preventive Home Solutions</h3>
          <a
            href="https://www.google.com/maps?q=Clearfield,+UT"
            target="_blank"
            rel="noreferrer"
            aria-label="Open in Google Maps"
            className="ml-2 text-gray-500 transition-colors hover:text-phsBlue"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
            </svg>
          </a>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <span className="font-semibold text-gray-800">4.9</span>
          <span className="text-yellow-400">★</span>
          <a href="#" className="text-phsLink hover:underline">(54)</a>
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-3.5 w-3.5 text-gray-400">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
      </Reveal>
    </section>
  )
}
