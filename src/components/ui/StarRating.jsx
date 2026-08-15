import { STAR_MAX } from '../../utils/stars'

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
    </svg>
  )
}

export default function StarRating({ value = 0, size = 'size-4', className = '' }) {
  const clamped = Math.min(Math.max(Number(value) || 0, 0), STAR_MAX)
  const pct = (clamped / STAR_MAX) * 100

  return (
    <span className={`relative inline-flex ${className}`} aria-label={`${clamped} de ${STAR_MAX} estrellas`}>
      <span className="flex gap-0.5 text-white">
        {Array.from({ length: STAR_MAX }).map((_, i) => (
          <StarIcon key={i} className={`${size} shrink-0`} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden flex gap-0.5 text-[#FFC107]"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {Array.from({ length: STAR_MAX }).map((_, i) => (
          <StarIcon key={i} className={`${size} shrink-0`} />
        ))}
      </span>
    </span>
  )
}