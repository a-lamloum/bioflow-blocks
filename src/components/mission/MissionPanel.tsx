'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { FIRST_QC_MISSION } from '@/lib/mission/missions'
import type { MissionState } from '@/types'

interface MissionPanelProps {
  missionState: MissionState
}

export function MissionPanel({ missionState }: MissionPanelProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const steps = FIRST_QC_MISSION.steps
  const currentStep = steps[missionState.currentStepIndex]

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutsideClick)
    else document.removeEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open, handleOutsideClick])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div ref={panelRef} className="relative">
      {/* 48px strip */}
      <div
        className={[
          'flex items-center h-12 px-4 border-b border-border',
          'transition-colors duration-normal ease-out-quart',
          missionState.completed
            ? 'bg-mission-complete/10'
            : 'bg-surface-2',
        ].join(' ')}
        aria-label="Mission guide"
      >
        {/* Step counter pill */}
        {missionState.completed ? (
          <Badge variant="success">Mission complete!</Badge>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-teal-500 text-block-text shrink-0">
            Step {missionState.currentStepIndex + 1} of {steps.length}
          </span>
        )}

        {/* Current instruction */}
        {!missionState.completed && currentStep && (
          <span className="ml-3 text-sm text-fg-primary truncate flex-1">
            {currentStep.instruction}
          </span>
        )}

        {missionState.completed && (
          <span className="ml-3 text-sm text-fg-secondary flex-1">
            Great work — you built your first QC pipeline!
          </span>
        )}

        {/* Expand toggle */}
        <button
          aria-expanded={open}
          aria-label={open ? 'Collapse mission guide' : 'Expand mission guide'}
          onClick={() => setOpen(v => !v)}
          className="shrink-0 ml-2 w-11 h-11 flex items-center justify-center text-fg-muted hover:text-fg-primary transition-colors rounded focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <span className="text-xs">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Floating card */}
      {open && (
        <div className="absolute top-12 left-0 z-50 w-72 bg-surface rounded-xl shadow-lg border border-border">
          <div className="px-4 pt-3 pb-1">
            <h3 className="text-xl font-bold text-fg-primary">{FIRST_QC_MISSION.title}</h3>
            <p className="text-sm text-fg-secondary mt-1">{FIRST_QC_MISSION.description}</p>
          </div>
          <ul className="flex flex-col px-4 py-3 gap-3">
            {steps.map((step, i) => {
              const done = missionState.completedStepIds.includes(step.id)
              const active = !missionState.completed && i === missionState.currentStepIndex
              return (
                <li key={step.id} className="flex gap-3 items-start">
                  <span
                    className={[
                      'shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5',
                      done
                        ? 'bg-success text-block-text'
                        : active
                        ? 'bg-teal-500 text-block-text'
                        : 'bg-surface-2 text-fg-muted border border-border',
                    ].join(' ')}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={[
                        'text-sm',
                        done ? 'line-through text-fg-muted' : active ? 'font-semibold text-fg-primary' : 'text-fg-secondary',
                      ].join(' ')}
                    >
                      {step.instruction}
                    </span>
                    {active && (
                      <span className="text-xs italic text-fg-muted mt-0.5">
                        Hint: {step.hint}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
