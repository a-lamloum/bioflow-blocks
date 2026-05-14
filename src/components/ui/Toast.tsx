'use client'

import { useEffect, useState } from 'react'

export interface ToastItem {
  id: string
  message: string
  type?: 'warning' | 'error' | 'info' | 'success'
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
  durationMs?: number
}

const TYPE_STYLES: Record<NonNullable<ToastItem['type']>, string> = {
  warning: 'bg-warning text-block-text',
  error:   'bg-error   text-block-text',
  info:    'bg-info    text-block-text',
  success: 'bg-success text-block-text',
}

function Toast({ toast, onDismiss, durationMs = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation on next frame
    const enterTimer = requestAnimationFrame(() => setVisible(true))
    // Auto-dismiss
    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 250) // wait for exit animation
    }, durationMs)

    return () => {
      cancelAnimationFrame(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [toast.id, durationMs, onDismiss])

  const colorClass = TYPE_STYLES[toast.type ?? 'warning']

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm',
        'motion-safe:transition-all motion-safe:duration-normal motion-safe:ease-out-quart',
        colorClass,
        visible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8',
      ].join(' ')}
    >
      <p className="flex-1 text-sm font-semibold leading-snug">{toast.message}</p>
      <button
        aria-label="Dismiss"
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(toast.id), 250)
        }}
        className="shrink-0 text-block-text/70 hover:text-block-text transition-colors mt-0.5"
      >
        ✕
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  durationMs?: number
}

export function ToastContainer({ toasts, onDismiss, durationMs }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} durationMs={durationMs} />
        </div>
      ))}
    </div>
  )
}
