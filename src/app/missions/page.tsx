'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MISSIONS, MISSION_BADGES, getMissionStatus, loadCompletedMissions } from '@/lib/mission/missions'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Mission } from '@/types'

type Status = 'locked' | 'available' | 'completed'

const STATUS_STYLES: Record<Status, { border: string; badge: string; badgeText: string }> = {
  completed: {
    border: 'var(--color-teal-500)',
    badge: 'var(--color-teal-500)',
    badgeText: 'Completed ✓',
  },
  available: {
    border: 'var(--color-border-strong)',
    badge: 'var(--color-fg-muted)',
    badgeText: 'Available',
  },
  locked: {
    border: 'var(--color-border)',
    badge: 'var(--color-border-strong)',
    badgeText: 'Locked 🔒',
  },
}

function MissionCard({ mission, status, idx }: { mission: Mission; status: Status; idx: number }) {
  const badge = MISSION_BADGES[mission.id]
  const s = STATUS_STYLES[status]
  const isLocked = status === 'locked'

  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all"
      style={{
        borderColor: s.border,
        background: 'var(--color-surface)',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">{badge?.emoji ?? '🧬'}</span>
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">
              Mission {idx + 1}
            </p>
            <h3 className="text-xl font-bold text-fg-primary">{mission.title}</h3>
          </div>
        </div>
        <span
          className="shrink-0 text-xs font-bold px-3 py-1 rounded-full text-block-text"
          style={{ background: s.badge }}
        >
          {s.badgeText}
        </span>
      </div>

      {/* Description */}
      <p className="text-base text-fg-secondary leading-relaxed">{mission.description}</p>

      {/* Steps count */}
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <span>📋</span>
        <span>{mission.steps.length} steps</span>
        <span>·</span>
        <span>🧩 {mission.requiredBlockTypes.length} blocks</span>
      </div>

      {/* CTA */}
      {isLocked ? (
        <div
          className="text-center py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-fg-muted)' }}
        >
          Complete previous mission to unlock
        </div>
      ) : (
        <Link
          href={`/builder?mission=${mission.id}`}
          className="block text-center py-3 rounded-xl text-base font-bold text-block-text transition-all"
          style={{
            background: status === 'completed' ? 'var(--color-teal-600)' : 'var(--color-teal-500)',
            boxShadow: '0 4px 0 var(--color-teal-700)',
          }}
        >
          {status === 'completed' ? 'Replay Mission →' : 'Start Mission →'}
        </Link>
      )}
    </div>
  )
}

export default function MissionsPage() {
  const [statuses, setStatuses] = useState<Status[]>([])
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    const done = loadCompletedMissions()
    setCompleted(done.size)
    setStatuses(MISSIONS.map(m => getMissionStatus(m.id)))
  }, [])

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface"
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Missions</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="light-surface" />
          <Link href="/builder"
            className="text-sm font-bold px-5 py-2 rounded-lg text-block-text"
            style={{ background: 'var(--color-teal-500)', boxShadow: '0 3px 0 var(--color-teal-700)' }}>
            Open Builder →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fg-primary mb-4">Mission Map</h1>
          <p className="text-xl text-fg-secondary max-w-xl mx-auto">
            Learn nf-core pipelines step by step. Each mission teaches a new concept — complete them in order.
          </p>
          {statuses.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'var(--color-teal-50)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-teal-700)' }}>
                {completed} / {MISSIONS.length} missions complete
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-12" style={{ background: 'var(--color-border)' }}>
          <div
            className="h-2 rounded-full transition-all duration-normal ease-out-quart"
            style={{
              width: `${MISSIONS.length ? (completed / MISSIONS.length) * 100 : 0}%`,
              background: 'var(--color-teal-500)',
            }}
          />
        </div>

        {/* Mission cards with connector lines */}
        <div className="flex flex-col gap-0">
          {MISSIONS.map((mission, idx) => (
            <div key={mission.id}>
              <MissionCard
                mission={mission}
                status={statuses[idx] ?? 'locked'}
                idx={idx}
              />
              {idx < MISSIONS.length - 1 && (
                <div className="flex justify-center py-3" aria-hidden="true">
                  <div className="w-px h-8" style={{ background: 'var(--color-border-strong)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* All done */}
        {completed === MISSIONS.length && MISSIONS.length > 0 && (
          <div
            className="mt-12 text-center p-8 rounded-2xl"
            style={{ background: 'var(--color-teal-50)', border: '2px solid var(--color-teal-500)' }}
          >
            <p className="text-4xl mb-3">🎉</p>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-teal-700)' }}>
              All missions complete!
            </h2>
            <p className="text-base text-fg-secondary">
              You now understand the nf-core/rnaseq workflow. More missions coming in Phase 3.
            </p>
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-12">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
