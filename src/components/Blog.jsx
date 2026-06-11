import Reveal from './Reveal.jsx'

const posts = [
  {
    category: 'PLUMBING',
    title: 'Emergency Plumbing Steps: What To Do Before The Technician Arrives',
    excerpt: 'Water on the floor can turn a normal evening into a fast-moving problem. The good news — a few quick moves protect your home.',
    date: 'JANUARY 17, 2026',
  },
  {
    category: 'AIR QUALITY',
    title: 'Utah Inversions And Indoor Air Quality: Solutions That Actually Work',
    excerpt: 'Winter along the Wasatch Front can feel a little upside down. You look toward the mountains and lose them in haze.',
    date: 'JANUARY 10, 2026',
  },
  {
    category: 'HVAC',
    title: 'SEER2 And 2026 HVAC Efficiency Standards Explained For Utah Homeowners',
    excerpt: "Heating and cooling efficiency got a little harder to read in the last couple of years — here's the plain-English version.",
    date: 'DECEMBER 29, 2025',
  },
]

export default function Blog() {
  return (
    <section className="bg-[#fbf7f0] py-20 lg:py-28 px-6">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Heading Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <Reveal
              as="p"
              className="text-xs sm:text-sm font-mono tracking-[0.25em] font-bold text-phsOrange uppercase mb-4"
            >
              FIELD NOTES
            </Reveal>
            <Reveal
              as="h2"
              delay={100}
              className="font-display font-black text-phsInk text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.0] uppercase"
            >
              LATEST FROM<br />THE GUARD.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={200}
            className="max-w-md text-[15px] sm:text-base leading-relaxed text-gray-600 font-sans md:pt-4"
          >
            Tactical advice from the techs who service Northern Utah homes every day.
          </Reveal>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal
              key={post.title}
              as="article"
              variant="up"
              delay={i * 130}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
            >
              {/* Top Card Graphic Section */}
              <div 
                className="relative aspect-[16/10] w-full bg-phsNavy flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                {/* Category Badge */}
                <span className="absolute top-4 left-4 rounded bg-phsOrange px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-white uppercase z-10">
                  {post.category}
                </span>

                {/* Shield Icon in center */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-transform duration-500 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f3741b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-phsOrange">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>
              </div>

              {/* Bottom Card Content Section */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display font-bold text-[16px] sm:text-[17px] leading-snug text-phsInk mb-3 group-hover:text-phsOrange transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-gray-500 mb-6 font-sans flex-1">
                  {post.excerpt}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    {post.date}
                  </span>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-phsOrange hover:text-phsOrangeDark transition-colors duration-300 group/link"
                  >
                    READ 
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
