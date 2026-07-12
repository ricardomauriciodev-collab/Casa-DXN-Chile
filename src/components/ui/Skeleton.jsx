export default function Skeleton({ className = '', rounded = 'md', count = 1 }) {
  const radius = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded]

  if (count === 1) {
    return <div className={`skeleton-shimmer ${radius} ${className}`} aria-hidden="true" />
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton-shimmer ${radius} ${className}`} aria-hidden="true" />
      ))}
    </>
  )
}
