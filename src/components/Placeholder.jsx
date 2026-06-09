/**
 * Reusable placeholder box for any asset (image, logo, icon) that will be
 * swapped in later. Renders a labeled grey box at whatever size you give it.
 *
 * Usage:
 *   <Placeholder label="Logo" className="h-28 w-28" />
 *   <Placeholder label="Hero background" className="absolute inset-0" />
 */
export default function Placeholder({ label = 'Image', className = '', rounded = '' }) {
  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-gray-400/70 bg-gray-200/80 text-center text-xs font-medium uppercase tracking-wide text-gray-500 ${rounded} ${className}`}
      aria-label={`${label} placeholder`}
    >
      <span className="px-2 py-1">{label}</span>
    </div>
  )
}
