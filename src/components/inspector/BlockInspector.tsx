'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { SamplesheetEditor } from '@/components/samplesheet/SamplesheetEditor'
import { DEMO_SAMPLES } from '@/data/demo-samplesheet'
import type { BlockType, SampleRow } from '@/types'

interface BlockInspectorProps {
  selectedBlockType: BlockType | null
  onClose: () => void
}

export function BlockInspector({ selectedBlockType, onClose }: BlockInspectorProps) {
  const panelRef = useRef<HTMLElement>(null)
  const [sampleRows, setSampleRows] = useState<SampleRow[]>([...DEMO_SAMPLES])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!selectedBlockType) return
    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedBlockType, handleKeyDown])

  if (!selectedBlockType) return null

  const def = BLOCK_DEFINITIONS[selectedBlockType]
  if (!def) return null

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-label="Block inspector"
      className="flex flex-col w-72 shrink-0 bg-surface border-l border-border overflow-y-auto motion-safe:animate-slide-in-right outline-none"
    >
      {/* Close button */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span
          className="text-xl font-bold"
          style={{ color: 'var(--color-teal-500)' }}
        >
          {def.displayName}
        </span>
        <button
          aria-label="Close inspector"
          onClick={onClose}
          className="text-fg-muted hover:text-fg-primary transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          ✕
        </button>
      </div>

      {/* nf-core concept — always visible, quiet */}
      <p className="px-4 pb-3 text-sm text-fg-muted">
        nf-core concept: <span className="font-mono">{def.technicalConcept}</span>
      </p>

      <div className="flex flex-col gap-4 px-4 pb-6">
        {/* Icon */}
        <div className="text-3xl" aria-hidden="true">{def.icon}</div>

        {/* Samplesheet editor — shown only for samplesheet block */}
        {selectedBlockType === 'samplesheet' && (
          <div>
            <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
              Edit your samplesheet
            </h3>
            <SamplesheetEditor rows={sampleRows} onChange={setSampleRows} />
          </div>
        )}

        {/* Beginner explanation */}
        <div>
          <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
            What this does
          </h3>
          <p className="prose text-base text-fg-primary">{def.description}</p>
        </div>

        {/* Technical detail */}
        <div>
          <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
            Technical detail
          </h3>
          <p className="text-sm text-fg-secondary">{def.technicalDetail}</p>
        </div>

        {/* Ports */}
        {(def.inputPorts.length > 0 || def.outputPorts.length > 0) && (
          <div>
            <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
              Connections
            </h3>
            <div className="flex flex-col gap-1.5">
              {def.inputPorts.map(port => (
                <div key={port.id} className="flex items-center gap-2 text-sm">
                  <span className="text-fg-muted">←</span>
                  <span className="text-fg-secondary">{port.label}</span>
                  <span className="text-xs font-mono text-fg-muted ml-auto">{port.dataType}</span>
                </div>
              ))}
              {def.outputPorts.map(port => (
                <div key={port.id} className="flex items-center gap-2 text-sm">
                  <span className="text-fg-muted">→</span>
                  <span className="text-fg-secondary">{port.label}</span>
                  <span className="text-xs font-mono text-fg-muted ml-auto">{port.dataType}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common mistake */}
        <div>
          <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
            Common mistake
          </h3>
          <div
            className="text-sm rounded-md px-3 py-2"
            style={{ background: 'oklch(68% 0.150 75 / 0.10)' }}
          >
            {def.commonMistake}
          </div>
        </div>

        {/* Example output */}
        <div>
          <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
            Example output
          </h3>
          <p className="text-sm text-fg-secondary">{def.exampleOutput}</p>
        </div>

        {/* Docs link */}
        {def.nfCoreDocsLink && (
          <a
            href={def.nfCoreDocsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-500 hover:text-teal-600 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
          >
            View nf-core docs ↗
          </a>
        )}
      </div>
    </aside>
  )
}
