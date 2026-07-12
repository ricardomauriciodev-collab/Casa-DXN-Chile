export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
    'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset'
  const variants = {
    primary: 'bg-accent text-accent-foreground hover:bg-dxn-red-dark shadow-xs',
    secondary: 'bg-surface-muted text-foreground border border-border hover:bg-border/60',
    danger: 'bg-danger text-danger-foreground hover:bg-danger/90 shadow-xs',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground',
    whatsapp: 'bg-success text-success-foreground hover:bg-success/90 shadow-xs',
    ghost: 'text-foreground hover:bg-surface-muted',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-lg',
    icon: 'size-10 rounded-md p-0',
    iconSm: 'size-9 rounded-md p-0',
  }
  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin size-4 -ml-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
