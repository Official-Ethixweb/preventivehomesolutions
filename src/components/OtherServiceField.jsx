// Reveal field for every "Service Needed" dropdown's "Other" option. Shared
// so the 4 forms that each hand-roll their own dropdown (ContactForm, Hero,
// ShieldForm, LandingPage) stay visually and behaviorally consistent instead
// of drifting — the dropdown markup itself isn't shared (each form's styling
// differs too much to unify safely here), just this one reveal field.
export const OTHER_SERVICE_MAX_LENGTH = 300

/**
 * Always mounted; `open` toggles a smooth height/opacity transition rather
 * than the field appearing/disappearing instantly — the same grid-rows
 * technique the FAQ accordions on this site already use, so the motion
 * matches instead of introducing a second reveal pattern.
 *
 * @param {boolean} open
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {string} [labelClassName]  Match the host form's own label styling.
 * @param {string} [fieldClassName]  Match the host form's own input styling.
 * @param {boolean} [compact]  Shield-graphic forms have a fixed-height silhouette
 *   with very little vertical slack (the reCAPTCHA widget already has to be
 *   scaled down to fit it) — this drops to a single row and a screen-reader-only
 *   label so the extra field doesn't push content past the shield's artwork.
 */
export default function OtherServiceField({
  open,
  value,
  onChange,
  labelClassName = '',
  fieldClassName = '',
  id = 'other-service-details',
  compact = false,
}) {
  return (
    <div
      aria-hidden={!open}
      className={`grid overflow-hidden transition-all duration-300 ease-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="min-h-0">
        <label htmlFor={id} className={compact ? 'sr-only' : labelClassName}>
          Tell us what you need
        </label>
        <textarea
          id={id}
          name="service_details"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={OTHER_SERVICE_MAX_LENGTH}
          rows={compact ? 1 : 2}
          tabIndex={open ? 0 : -1}
          placeholder="Please describe the service or issue you need help with..."
          className={`${fieldClassName} resize-none`}
        />
      </div>
    </div>
  )
}
