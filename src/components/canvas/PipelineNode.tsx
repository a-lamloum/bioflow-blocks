'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { DEMO_SAMPLES } from '@/data/demo-samplesheet'
import type { PipelineNodeData } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  pipeline: 'var(--color-block-start)',
  data:     'var(--color-block-data)',
  analysis: 'var(--color-block-analysis)',
  output:   'var(--color-block-output)',
}

// Override specific block types that share a category but have distinct colors
const BLOCK_COLORS: Record<string, string> = {
  start_pipeline:  'var(--color-block-start)',
  samplesheet:     'var(--color-block-data)',
  input_fastq:     'var(--color-block-data)',
  qc_step:         'var(--color-block-analysis)',
  trim_reads:      'var(--color-block-process)',
  generate_report: 'var(--color-block-report)',
  output_results:  'var(--color-block-output)',
}

export const PipelineNode = memo(function PipelineNode({
  id: _id,
  data: rawData,
  selected,
}: NodeProps) {
  const data = rawData as unknown as PipelineNodeData
  const def = BLOCK_DEFINITIONS[data.blockType]
  if (!def) return null

  const bgColor = BLOCK_COLORS[data.blockType] ?? CATEGORY_COLORS[def.category] ?? 'var(--color-block-data)'

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${def.displayName} block`}
      className={[
        'relative flex flex-col min-w-40 min-h-18 rounded-lg',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring',
        'transition-shadow duration-fast ease-out-quart',
        selected ? 'ring-2 ring-teal-500 ring-offset-1' : '',
        data.hasError ? 'ring-2 ring-error' : '',
      ].join(' ')}
      style={{
        backgroundColor: bgColor,
        color: 'var(--color-block-text)',
        boxShadow: selected
          ? '0 4px 16px oklch(0% 0 0 / 0.18)'
          : '0 2px 8px oklch(0% 0 0 / 0.10)',
      }}
    >
      {/* Input port handles */}
      {(def.inputPorts as typeof def.inputPorts).map((port, i) => (
        <div
          key={port.id}
          className="absolute -left-2 top-1/2 -translate-y-1/2"
          style={{ top: def.inputPorts.length > 1 ? `${30 + i * 20}%` : '50%' }}
        >
          {/* 32px touch area around 12px visual dot */}
          <div className="flex items-center justify-center w-8 h-8 -m-2">
            <Handle
              type="target"
              position={Position.Left}
              id={port.id}
              style={{
                width: 12,
                height: 12,
                background: bgColor,
                border: '2px solid var(--color-block-text)',
                borderRadius: '50%',
                position: 'relative',
                transform: 'none',
                top: 'auto',
                left: 'auto',
              }}
            />
          </div>
        </div>
      ))}

      {/* Block body */}
      <div className="flex flex-col gap-1 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{def.icon}</span>
          <span className="text-sm font-semibold leading-tight">{def.displayName}</span>
          {data.hasError && (
            <span className="ml-auto text-xs">⚠️</span>
          )}
        </div>

        {/* Samplesheet block: show demo table inline */}
        {data.blockType === 'samplesheet' && (
          <div className="mt-1 rounded overflow-hidden text-xs font-mono border border-white/20">
            <div
              className="grid gap-0"
              style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
            >
              {/* Header row */}
              {['sample', 'fastq_1', 'fastq_2'].map(col => (
                <div
                  key={col}
                  className="px-1 py-0.5 font-semibold truncate"
                  style={{ background: 'oklch(0% 0 0 / 0.20)' }}
                >
                  {col}
                </div>
              ))}
              {/* First data row only */}
              {['sample', 'fastq_1', 'fastq_2'].map(col => (
                <div
                  key={col}
                  className="px-1 py-0.5 truncate"
                  style={{ background: 'oklch(0% 0 0 / 0.10)' }}
                >
                  {String(DEMO_SAMPLES[0][col as keyof typeof DEMO_SAMPLES[0]])}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output port handles */}
      {(def.outputPorts as typeof def.outputPorts).map((port, i) => (
        <div
          key={port.id}
          className="absolute -right-2"
          style={{ top: def.outputPorts.length > 1 ? `${30 + i * 20}%` : '50%', transform: 'translateY(-50%)' }}
        >
          <div className="flex items-center justify-center w-8 h-8 -m-2">
            <Handle
              type="source"
              position={Position.Right}
              id={port.id}
              style={{
                width: 12,
                height: 12,
                background: bgColor,
                border: '2px solid var(--color-block-text)',
                borderRadius: '50%',
                position: 'relative',
                transform: 'none',
                top: 'auto',
                right: 'auto',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
})
