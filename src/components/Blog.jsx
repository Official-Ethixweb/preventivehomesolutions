import Reveal from './Reveal.jsx'

const posts = [
  {
    title: 'Emergency Plumbing Steps: What to Do Before the Technician Arrives',
    excerpt: 'Water on the floor can turn a normal evening into a fast-moving problem. The good',
    date: 'January 17, 2026',
    image:
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=70',
  },
  {
    title: 'Utah Inversions and Indoor Air Quality: Solutions That Actually Work',
    excerpt: 'Winter along the Wasatch Front can feel a little upside down. You look toward the',
    date: 'January 16, 2026',
    image:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=70',
  },
  {
    title: 'SEER2 and 2025 HVAC Efficiency Standards Explained for Utah Homeowners',
    excerpt: 'Heating and cooling efficiency got a little harder to read in the last couple of',
    date: 'December 29, 2025',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=70',
  },
]

export default function Blog() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1150px] px-4">
        {/* Heading block */}
        <Reveal
          as="p"
          className="text-center text-sm font-bold uppercase tracking-wide text-phsOrange"
        >
          Our Blog
        </Reveal>
        <Reveal
          as="h2"
          delay={100}
          className="mt-2 text-center text-3xl font-bold text-phsBlue sm:text-4xl"
        >
          Latest Blogs &amp; Articles
        </Reveal>

        {/* Blog cards */}
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal
              key={post.title}
              as="article"
              variant="up"
              delay={i * 130}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Featured image */}
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug text-phsOrange">{post.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{post.excerpt}</p>
                <a
                  href="#"
                  className="group/link mt-4 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-phsOrange hover:underline"
                >
                  Read More
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                    »
                  </span>
                </a>

                <div className="mt-5 border-t border-gray-200 pt-3 text-sm text-gray-500">
                  {post.date}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
