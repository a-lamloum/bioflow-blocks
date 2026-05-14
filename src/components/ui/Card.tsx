import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ padded = true, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-surface border border-border rounded-md',
        padded ? 'p-4' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
