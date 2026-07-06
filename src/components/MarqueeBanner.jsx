import React from 'react'

const FlameIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c0 0-4 3.5-4 8a4 4 0 0 0 8 0c0-4.5-4-8-4-8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-1.5 0-2.5 1-2.5 2.5S10.5 17 12 17s2.5-1 2.5-2.5S13.5 12 12 12z" />
  </svg>
)

const SnowflakeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m6-16-12 12m12 0L6 6m6-4-2 4m2-4 2 4m-8 6h-4m20 0h-4M6 18l2-4m10 4-2-4m-2 4v4m0 0-2-4m2 4 2-4" />
  </svg>
)

const DropletIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
)

const PipeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M3 9v-4c0-1.1.9-2 2-2h14a2 2 0 0 0 2-2v4M12 9v6" />
  </svg>
)

const ThermometerIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
)

const services = [
  { name: 'Heating', Icon: FlameIcon },
  { name: 'Cooling', Icon: SnowflakeIcon },
  { name: 'Plumbing', Icon: DropletIcon },
  { name: 'Drain & Sewer', Icon: PipeIcon },
  { name: 'Water Heaters', Icon: ThermometerIcon },
]

export default function MarqueeBanner() {
  const repeatedServices = [...services, ...services, ...services, ...services, ...services, ...services, ...services, ...services]

  return (
    <div className="flex w-full overflow-hidden bg-phsOrange py-4 text-white border-y border-phsOrangeDark shadow-sm">
      <div className="flex w-max min-w-full animate-marquee items-center gap-16 whitespace-nowrap pl-16">
        {repeatedServices.map((service, i) => (
          <div key={i} className="flex items-center gap-3">
            <service.Icon className="h-6 w-6 opacity-80" />
            {/* 20px bold clears the WCAG "large text" threshold (≥18.66px bold),
                so white-on-orange passes at the 3:1 ratio. */}
            <span className="font-display text-xl font-bold tracking-widest">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
