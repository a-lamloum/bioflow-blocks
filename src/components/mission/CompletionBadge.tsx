'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MISSION_BADGES, MISSIONS } from '@/lib/mission/missions'

interface CompletionBadgeProps {
  missionId: string
  onDismiss: () => void
}

export function CompletionBadge({ missionId, onDismiss }: CompletionBadgeProps) {
  const [visible, setVisible] = useState(false)
  const badge = MISSION_BADGES[missionId]
  const currentIdx = MISSIONS.findIndex(m => m.id === missionId)
  const nextMission = MISSIONS[currentIdx + 1]

  useEffect(() => {
    // Animate in after mount
    requestAnimationFrame(() => setVisible(true))
    // Close on Escape
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismiss() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  if (!badge) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: 'oklch(0% 0 0 / 0.65)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 300ms ease',
          opacity: visible ? 1 : 0,
        }}
        onClick={handleDismiss}
      >
        {/* Card */}
        <div
          className="relative flex flex-col items-center gap-6 rounded-2xl p-10 max-w-md w-full shadow-2xl text-center"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            transition: 'transform 300ms var(--ease-out-quint), opacity 300ms ease',
            transform: visible ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(24px)',
            opacity: visible ? 1 : 0,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            aria-label="Close"
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-fg-muted hover:text-fg-primary transition-colors text-lg"
          >
            ✕
          </button>

          {/* Badge */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="text-7xl motion-safe:animate-bounce-once"
              style={{ lineHeight: 1, filter: 'drop-shadow(0 8px 24px oklch(60% 0.145 195 / 0.4))' }}
              aria-hidden="true"
            >
              {badge.emoji}
            </div>
            <div
              className="px-4 py-1.5 rounded-full text-sm font-bold text-block-text"
              style={{ background: 'var(--color-teal-500)' }}
            >
              {badge.label} — Earned!
            </div>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">Mission complete</p>
            <h2 className="text-2xl font-bold text-fg-primary">
              {MISSIONS[currentIdx]?.title}
            </h2>
          </div>

          {/* Reflection */}
          <div
            className="w-full rounded-xl px-5 py-4 text-left"
            style={{ background: 'var(--color-teal-50)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--color-teal-600)' }}>
              💭 Reflection question
            </p>
            <p className="text-base text-fg-primary leading-relaxed">
              {badge.reflection}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full">
            {nextMission && (
              <Link
                href={`/builder?mission=${nextMission.id}`}
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl text-base font-bold text-block-text text-center transition-all"
                style={{
                  background: 'var(--color-teal-500)',
                  boxShadow: '0 4px 0 var(--color-teal-700)',
                }}
              >
                Next Mission: {nextMission.title} →
              </Link>
            )}
            <Link
              href="/missions"
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl text-base font-semibold text-center transition-colors"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-fg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              View all missions
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
