'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TraceList } from './TraceList'
import { ReportCard } from './ReportCard'
import { CommandBridge, buildCommandParts, type CommandContext } from '@/components/command/CommandBridge'
import { ProfileSelector } from '@/components/command/ProfileSelector'
import { ParamsPreview } from '@/components/command/ParamsPreview'
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
  const [activeTab, setActiveTab] = useState<'trace' | 'command' | 'params'>('trace')
  const [profile, setProfile] = useState('docker')

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

          {/* ── Tab bar ── */}
          <div className="flex items-center gap-1 px-4 pt-2 pb-0 border-b border-border shrink-0">
            {(['trace', 'command', 'params'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors',
                  activeTab === tab
                    ? 'bg-surface border border-b-0 border-border text-teal-600'
                    : 'text-fg-muted hover:text-fg-secondary',
                ].join(' ')}
                style={{ marginBottom: -1 }}
              >
                {tab === 'trace' && '📋 Trace'}
                {tab === 'command' && '⌨️ Command'}
                {tab === 'params' && '⚙️ Params'}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          {activeTab === 'trace' && (
            <div className="flex flex-col flex-1 overflow-y-auto">
              {displayResult.reportCard && <ReportCard report={displayResult.reportCard} />}
              <TraceList entries={displayResult.trace} />

              {/* JSON toggle */}
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
            </div>
          )}

          {activeTab === 'command' && (
            <div className="flex flex-col gap-4 px-4 py-4 overflow-y-auto">
              {/* Profile selector */}
              <ProfileSelector selected={profile} onChange={setProfile} />
              <div className="border-t border-border" />
              {/* Command bridge */}
              <CommandBridge
                ctx={{
                  pipelineName: 'nf-core/rnaseq',
                  pipelineUrl: 'https://nf-co.re/rnaseq',
                  profile,
                  genome: 'GRCh38',
                  hasParameterBlock: false,
                  hasProfileBlock: false,
                }}
              />
            </div>
          )}

          {activeTab === 'params' && (
            <div className="flex flex-col gap-4 px-4 py-4 overflow-y-auto">
              <ParamsPreview
                pipelineName="nf-core/rnaseq"
                profile={profile}
                genome="GRCh38"
              />
            </div>
          )}

          <div className="px-4 py-2 border-t border-border shrink-0" />

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
