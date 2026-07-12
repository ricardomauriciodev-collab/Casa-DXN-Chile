export default function Card({ children, className = '', variant = 'default', as: Tag = 'div', interactive = false, ...props }) {
  const base = 'rounded-lg overflow-hidden border'
  const variants = {
    default: 'bg-surface border-border shadow-xs',
    elevated: 'bg-surface-elevated border-border shadow-md',
    outline: 'bg-surface border border-border-strong',
    muted: 'bg-surface-muted border-border',
  }
  const interactiveCls = interactive
    ? 'transition-all duration-200 hover:shadow-md hover:border-border-strong active:scale-[0.99]'
    : ''
  return (
    <Tag
      className={`${base} ${variants[variant] || variants.default} ${interactiveCls} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
