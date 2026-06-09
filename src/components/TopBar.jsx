const DEAL_TEXT = "Check Out These Unbeatable Deals Before They're Gone!"

/**
 * Thin blue announcement bar with a continuously sliding (marquee) message.
 * The text track is duplicated so the loop appears seamless.
 */
export default function TopBar() {
  // Repeat the phrase several times so the track is wider than the viewport.
  const items = Array.from({ length: 6 })

  return (
    <div className="w-full overflow-hidden bg-phsBlue py-2.5 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {/* Two identical halves => seamless -50% loop */}
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((_, i) => (
              <span
                key={i}
                className="mx-10 text-sm font-bold tracking-wide sm:text-base"
              >
                {DEAL_TEXT}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
