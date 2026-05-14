'use client'

import { KeyboardEvent } from 'react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockType } from '@/types'

interface BlockCardProps {
  blockType: BlockType
  onAddToCanvas: (blockType: BlockType) => void
}

const BLOCK_COLORS: Record<string, string> = {
  start_pipeline:  'var(--color-block-start)',
  samplesheet:     'var(--color-block-data)',
  input_fastq:     'var(--color-block-data)',
  qc_step:         'var(--color-block-analysis)',
  trim_reads:      'var(--color-block-process)',
  generate_report: 'var(--color-block-report)',
  output_results:  'var(--color-block-output)',
}

export function BlockCard({ blockType, onAddToCanvas }: BlockCardProps) {
  const def = BLOCK_DEFINITIONS[blockType]
  if (!def) return null

  const chipColor = BLOCK_COLORS[blockType] ?? 'var(--color-block-data)'

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('blockType', blockType)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onAddToCanvas(blockType)
    }
  }

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Add ${def.displayName} block`}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      onClick={() => onAddToCanvas(blockType)}
      className={[
        'flex items-center h-12 w-full cursor-grab active:cursor-grabbing',
        'hover:bg-surface transition-colors duration-fast ease-out-quart',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
        'select-none rounded-sm',
      ].join(' ')}
    >
      {/* Color chip */}
      <div
        className="shrink-0 w-1.5 h-full rounded-l-sm"
        style={{ backgroundColor: chipColor }}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2 px-3 min-w-0">
        <span className="text-base leading-none shrink-0" aria-hidden="true">
          {def.icon}
        </span>
        <span className="text-sm font-semibold text-fg-primary truncate">
          {def.displayName}
        </span>
      </div>
    </div>
  )
}
