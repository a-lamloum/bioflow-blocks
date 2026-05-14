'use client'

import type { TraceEntry } from '@/types'

interface TraceListProps {
  entries: TraceEntry[]
}

const STATUS_COLORS: Record<TraceEntry['status'], string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error:   'var(--color-error)',
}

const STATUS_ICONS: Record<TraceEntry['status'], string> = {
  success: '✓',
  warning: '⚠',
  error:   '✕',
}

export function TraceList({ entries }: TraceListProps) {
  if (entries.length === 0) return null

  return (
    <ol className="flex flex-col" aria-label="Simulation trace">
      {entries.map((entry, i) => (
        <li
          key={`${entry.blockId}-${entry.step}`}
          className="flex gap-3 px-4 py-2.5 border-b border-border last:border-0 motion-safe:animate-fade-in"
          style={
            { '--stagger-delay': `${i * 60}ms`, animationDelay: `var(--stagger-delay)` } as React.CSSProperties
          }
        >
          {/* Step number */}
          <span className="shrink-0 w-6 text-xs text-fg-muted font-mono pt-0.5 text-right">
            {entry.step}
          </span>

          {/* Status indicator */}
          <span
            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
            style={{
              backgroundColor: STATUS_COLORS[entry.status],
              color: 'var(--color-block-text)',
            }}
            aria-label={entry.status}
          >
            {STATUS_ICONS[entry.status]}
          </span>

          {/* Message */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold text-fg-primary">{entry.message}</span>
            {entry.details && (
              <span className="text-sm text-fg-secondary">{entry.details}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
