import { HTMLAttributes } from 'react'

type Variant = 'success' | 'warning' | 'error' | 'info' | 'teal' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-success text-block-text',
  warning: 'bg-warning text-block-text',
  error:   'bg-error text-block-text',
  info:    'bg-info text-block-text',
  teal:    'bg-teal-500 text-block-text',
  default: 'bg-surface-2 text-fg-secondary border border-border',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5',
        'rounded-sm text-xs font-semibold',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
