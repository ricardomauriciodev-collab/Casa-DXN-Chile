import { useId } from 'react'

export default function Input({
  label,
  error,
  helper,
  hint,
  id,
  className = '',
  required,
  ...props
}) {
  const autoId = useId()
  const inputId = id || autoId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const hasError = Boolean(error)

  const describedBy = [error && errorId, helper && helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-accent ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        required={required}
        className={`w-full h-11 rounded-md border bg-surface px-3.5 text-sm text-foreground
          placeholder:text-subtle-foreground transition-colors
          ${hasError
            ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/30'
            : 'border-border-strong focus-visible:border-accent focus-visible:ring-accent/20'
          }
          focus-visible:outline-none focus-visible:ring-4
          disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {helper && !hasError && (
        <p id={helperId} className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger font-medium flex items-center gap-1">
          <svg className="size-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && !helper && (
        <p className="text-xs text-subtle-foreground">{hint}</p>
      )}
    </div>
  )
}
