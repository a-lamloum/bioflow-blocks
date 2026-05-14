'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-teal-500 text-block-text hover:bg-teal-600 active:bg-teal-700 ' +
    'font-semibold shadow-sm',
  secondary:
    'bg-surface-2 text-fg-primary border border-border hover:bg-surface ' +
    'active:bg-canvas font-semibold',
  ghost:
    'bg-transparent text-teal-500 hover:bg-teal-50 active:bg-teal-100 font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-sm px-4 py-2 text-sm',
        'transition-colors duration-fast ease-out-quart',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
