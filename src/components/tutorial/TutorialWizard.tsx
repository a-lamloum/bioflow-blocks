'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'bioflow_tutorial_v1'

const STEPS = [
  {
    icon: '👋',
    title: 'Welcome to BioFlow Blocks',
    description:
      'This builder lets you assemble bioinformatics pipelines visually — no terminal needed. ' +
      'Each colourful block represents a real nf-core concept. Let\'s take a quick tour.',
    highlight: null,
    tip: null,
  },
  {
    icon: '🧩',
    title: 'Block Library (left panel)',
    description:
      'The left panel holds all available blocks, organised by pack. ' +
      'Drag any block onto the canvas — or click it to add it to the centre.',
    highlight: 'left',
    tip: 'Blocks with a Phase badge are coming soon and can\'t be dragged yet.',
  },
  {
    icon: '🎯',
    title: 'Canvas (centre)',
    description:
      'The canvas is your workspace. ' +
      'Connect blocks by dragging from the rounded bump on the right of one block ' +
      'to the notch on the left of the next. Incompatible connections are gently rejected.',
    highlight: 'center',
    tip: 'Select a block and press Delete or Backspace to remove it.',
  },
  {
    icon: '🔍',
    title: 'Block Inspector (right)',
    description:
      'Click any block to open its inspector. You\'ll see the beginner explanation, ' +
      'the real nf-core concept it maps to, real tool examples, and common mistakes — ' +
      'always visible, no toggle needed.',
    highlight: 'right',
    tip: 'Every block links to the official nf-core documentation page.',
  },
  {
    icon: '📋',
    title: 'Mission Guide (top strip)',
    description:
      'The mission strip at the top of the canvas walks you through building ' +
      'your first RNA-seq QC pipeline step by step. Click the chevron to expand it.',
    highlight: 'top',
    tip: 'Complete missions to unlock concepts in the right order.',
  },
  {
    icon: '▶️',
    title: 'Run Panel (bottom)',
    description:
      'Once all blocks are connected, click Simulate. ' +
      'You\'ll see a step-by-step trace, a mock QC report card, and an illustrative ' +
      'nextflow run command — all generated instantly in your browser.',
    highlight: 'bottom',
    tip: 'A demo run is shown below so you know what to expect.',
  },
]

// ─── Highlight overlay positions ─────────────────────────────────────────────

const HIGHLIGHT_STYLES: Record<string, React.CSSProperties> = {
  left:   { left: 0,    top: 48, width: 224, bottom: 96, borderRadius: 8 },
  center: { left: 224,  top: 48, right: 288, bottom: 96, borderRadius: 8 },
  right:  { right: 0,   top: 48, width: 288, bottom: 96, borderRadius: 8 },
  top:    { left: 224,  top: 48, right: 288, height: 48, borderRadius: 8 },
  bottom: { left: 0,    bottom: 0, right: 0, height: 96, borderRadius: 8 },
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function Dots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-fast"
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            background: i === current
              ? 'var(--color-teal-500)'
              : 'var(--color-border-strong)',
          }}
        />
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TutorialWizard() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if tutorial hasn't been completed
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else dismiss()
  }

  const prev = () => setStep(s => Math.max(0, s - 1))

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ background: 'oklch(0% 0 0 / 0.55)' }}
        aria-hidden="true"
      />

      {/* Highlight cutout — uses box-shadow to "cut" a transparent hole */}
      {current.highlight && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            ...HIGHLIGHT_STYLES[current.highlight],
            boxShadow: '0 0 0 9999px oklch(0% 0 0 / 0.55)',
            border: '2px solid var(--color-teal-500)',
            position: 'fixed',
          }}
          aria-hidden="true"
        />
      )}

      {/* Tutorial card — centred */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tutorial"
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto flex flex-col gap-5 w-full max-w-md rounded-2xl p-7 shadow-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {/* Step icon + title */}
          <div className="flex items-center gap-3">
            <span
              className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: 'var(--color-teal-50)' }}
            >
              {current.icon}
            </span>
            <div>
              <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-0.5">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-xl font-bold text-fg-primary leading-tight">
                {current.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-fg-secondary leading-relaxed">
            {current.description}
          </p>

          {/* Tip */}
          {current.tip && (
            <div
              className="flex gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-teal-50)', color: 'var(--color-teal-700)' }}
            >
              <span>💡</span>
              <span>{current.tip}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <Dots current={step} total={STEPS.length} />

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-fg-secondary hover:text-fg-primary transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-fg-muted hover:text-fg-secondary transition-colors"
              >
                Skip
              </button>
              <button
                onClick={next}
                className="px-5 py-2 rounded-lg text-sm font-bold text-block-text transition-all"
                style={{
                  background: 'var(--color-teal-500)',
                  boxShadow: '0 3px 0 var(--color-teal-700)',
                }}
              >
                {isLast ? 'Start building →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
