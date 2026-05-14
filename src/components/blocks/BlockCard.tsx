'use client'

import { KeyboardEvent } from 'react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockType } from '@/types'

interface BlockCardProps {
  blockType: BlockType
  onAddToCanvas: (blockType: BlockType) => void
}

const BLOCK_COLORS: Record<string, string> = {
  start_pipeline:   'oklch(68% 0.23 38)',
  samplesheet:      'oklch(50% 0.22 258)',
  input_fastq:      'oklch(58% 0.20 212)',
  qc_step:          'oklch(50% 0.25 302)',
  trim_reads:       'oklch(66% 0.22 24)',
  generate_report:  'oklch(52% 0.22 152)',
  output_results:   'oklch(52% 0.20 232)',
  run_profile:      'oklch(60% 0.18 85)',
  parameter_setting:'oklch(56% 0.18 85)',
  paired_validator: 'oklch(58% 0.20 212)',
  adapter_detector: 'oklch(58% 0.20 212)',
  read_length_checker: 'oklch(58% 0.20 212)',
}

const PACK_COLORS: Record<string, string> = {
  rnaseq_qc:      'oklch(52% 0.22 152)',
  fastq_basics:   'oklch(58% 0.20 212)',
  rnaseq_full:    'oklch(50% 0.25 302)',
  variant_calling:'oklch(52% 0.20 232)',
  metagenomics:   'oklch(50% 0.22 258)',
  single_cell:    'oklch(50% 0.25 15)',
  nfcore_tools:   'oklch(52% 0.18 85)',
}

const PHASE_LABELS: Record<string, string> = {
  phase1: 'Phase 1',
  phase2: 'Phase 2',
  phase3: 'Phase 3',
}

export function BlockCard({ blockType, onAddToCanvas }: BlockCardProps) {
  const def = BLOCK_DEFINITIONS[blockType]
  if (!def) return null

  const isAvailable = def.status === 'available'
  const chipColor = BLOCK_COLORS[blockType] ?? PACK_COLORS[def.pack] ?? 'oklch(52% 0.18 200)'

  const handleDragStart = (e: React.DragEvent) => {
    if (!isAvailable) { e.preventDefault(); return }
    e.dataTransfer.setData('blockType', blockType)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isAvailable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onAddToCanvas(blockType)
    }
  }

  return (
    <div
      draggable={isAvailable}
      role={isAvailable ? 'button' : 'listitem'}
      tabIndex={isAvailable ? 0 : -1}
      aria-label={isAvailable ? `Add ${def.displayName} block` : `${def.displayName} — coming soon`}
      aria-disabled={!isAvailable}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      onClick={() => isAvailable && onAddToCanvas(blockType)}
      className={[
        'flex items-center h-10 w-full select-none rounded-sm',
        isAvailable
          ? 'cursor-grab active:cursor-grabbing hover:bg-surface transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring'
          : 'cursor-not-allowed opacity-40',
      ].join(' ')}
    >
      {/* Color chip */}
      <div
        className="shrink-0 w-1 h-full rounded-l-sm"
        style={{ backgroundColor: chipColor }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-1.5 px-2 min-w-0 flex-1">
        <span className="text-sm leading-none shrink-0" aria-hidden="true">{def.icon}</span>
        <span className="text-xs font-semibold text-fg-primary truncate">{def.displayName}</span>
      </div>

      {/* Coming-soon phase badge */}
      {!isAvailable && (
        <span
          className="shrink-0 mr-2 text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{
            background: 'var(--color-surface-2)',
            color: 'var(--color-fg-muted)',
            fontSize: 9,
          }}
        >
          {PHASE_LABELS[def.status] ?? def.status}
        </span>
      )}
    </div>
  )
}
