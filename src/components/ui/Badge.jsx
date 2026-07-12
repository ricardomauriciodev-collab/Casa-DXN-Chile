export default function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const variants = {
    neutral: 'bg-surface-muted text-muted-foreground border-border',
    success: 'bg-success-soft text-success border-success/20',
    warning: 'bg-warning-soft text-warning border-warning/20',
    danger: 'bg-danger-soft text-danger border-danger/20',
    accent: 'bg-accent-soft text-accent border-accent/20',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${variants[variant] || variants.neutral} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
