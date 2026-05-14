'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TraceList } from './TraceList'
import { ReportCard } from './ReportCard'
import type { SimulationResult, ValidationResult, WorkflowIR } from '@/types'

interface RunPanelProps {
  simulationResult: SimulationResult | null
  validationResult: ValidationResult | null
  currentIR: WorkflowIR | null
  demoResult?: SimulationResult | null
  onSimulate: () => void
}

export function RunPanel({
  simulationResult,
  validationResult,
  currentIR,
  demoResult,
  onSimulate,
}: RunPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const [showJson, setShowJson] = useState(false)

  const hasErrors = validationResult && !validationResult.valid && validationResult.errors.length > 0

  // Show demo when no real simulation has run yet
  const displayResult = simulationResult ?? (demoResult ?? null)
  const isDemo = !simulationResult && !!demoResult

  return (
    <section
      aria-label="Run panel"
      className={[
        'flex flex-col border-t border-border bg-surface transition-all duration-normal ease-out-quart',
        expanded ? 'h-96' : 'h-24',
      ].join(' ')}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <span className="text-sm font-semibold text-fg-primary">Run</span>
        <button
          aria-label={expanded ? 'Collapse run panel' : 'Expand run panel'}
          aria-expanded={expanded}
          onClick={() => setExpanded(e => !e)}
          className="text-fg-muted hover:text-fg-primary transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <span className="text-xs">{expanded ? '▼' : '▲'}</span>
        </button>
      </div>

      {/* Idle state — no simulation and no demo */}
      {!displayResult && !hasErrors && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4">
          <Button onClick={onSimulate} variant="primary" className="min-w-32">
            ▶ Simulate
          </Button>
          <p className="text-xs text-fg-muted">Connect blocks and click Simulate to run</p>
        </div>
      )}

      {/* Validation errors */}
      {hasErrors && !simulationResult && (
        <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-error">Fix these issues before simulating:</p>
            <Button onClick={onSimulate} variant="secondary" className="text-xs h-8">
              Try again
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {validationResult!.errors.map((err, i) => (
              <li key={i} className="text-sm text-fg-secondary">
                <span className="font-semibold text-error">{err.message}</span>
                {' → '}
                <span>{err.fix}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Result — real or demo */}
      {displayResult && !hasErrors && (
        <div className="flex flex-col overflow-y-auto flex-1">
          {/* Demo banner */}
          {isDemo && (
            <div
              className="flex items-center justify-between px-4 py-2 shrink-0"
              style={{ background: 'var(--color-teal-50)', borderBottom: '1px solid var(--color-teal-100)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">👀</span>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-teal-700)' }}>
                  Demo preview — this is what a completed run looks like
                </p>
              </div>
              <Button onClick={onSimulate} variant="primary" className="text-xs h-7 px-3">
                ▶ Run yours
              </Button>
            </div>
          )}

          {displayResult.reportCard && (
            <ReportCard report={displayResult.reportCard} />
          )}

          <TraceList entries={displayResult.trace} />

          {displayResult.generatedCommand && (
            <div className="px-4 py-3 border-t border-border bg-surface-2">
              <p className="text-xs text-fg-muted mb-1">
                Illustrative command (educational only — not executed):
              </p>
              <code className="text-xs font-mono text-fg-secondary break-all">
                {displayResult.generatedCommand}
              </code>
            </div>
          )}

          <div className="px-4 py-2 border-t border-border">
            <button
              aria-expanded={showJson}
              onClick={() => setShowJson(v => !v)}
              className="text-sm text-teal-500 hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
            >
              {showJson ? 'Hide workflow JSON ↑' : 'View workflow JSON ↓'}
            </button>
            {showJson && currentIR && (
              <div className="mt-2">
                <p className="text-xs text-fg-muted mb-1">
                  Educational pipeline representation — not a real Nextflow workflow file.
                </p>
                <pre className="text-xs font-mono bg-surface-2 rounded-md p-3 overflow-x-auto border border-border max-h-48">
                  {JSON.stringify(currentIR, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {!isDemo && (
          <div className="px-4 py-2 border-t border-border flex justify-end">
            <Button onClick={onSimulate} variant="secondary" className="text-xs h-8">
              ▶ Run again
            </Button>
          </div>
          )}
        </div>
      )}

      {/* Simulator disclaimer */}
      <div className="shrink-0 px-4 py-1.5 border-t border-border">
        <p className="text-xs text-fg-muted">
          This is a learning simulator. No real Nextflow pipelines are executed.
        </p>
      </div>
    </section>
  )
}
