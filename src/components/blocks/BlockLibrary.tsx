'use client'

import { useCallback } from 'react'
import { BlockCard } from './BlockCard'
import { BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import type { BlockType } from '@/types'

interface BlockLibraryProps {
  onAddToCanvas: (blockType: BlockType, position?: { x: number; y: number }) => void
}

const CATEGORY_ORDER = ['pipeline', 'data', 'analysis', 'output'] as const
const CATEGORY_LABELS: Record<string, string> = {
  pipeline: 'Pipeline',
  data:     'Data',
  analysis: 'Analysis',
  output:   'Output',
}

export function BlockLibrary({ onAddToCanvas }: BlockLibraryProps) {
  const handleAdd = useCallback(
    (blockType: BlockType) => {
      onAddToCanvas(blockType, { x: 200 + Math.random() * 200, y: 150 + Math.random() * 100 })
    },
    [onAddToCanvas]
  )

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    blocks: ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].category === cat),
  })).filter(g => g.blocks.length > 0)

  return (
    <aside
      aria-label="Block library"
      className="flex flex-col w-52 shrink-0 bg-surface-2 border-r border-border overflow-y-auto"
    >
      <div className="px-3 pt-4 pb-2">
        <h2 className="text-xs font-semibold text-fg-muted uppercase tracking-wide">
          Blocks
        </h2>
      </div>
      <div className="flex flex-col gap-4 px-1 pb-4">
        {grouped.map(group => (
          <div key={group.category}>
            <div className="px-2 pb-1">
              <span className="text-xs font-semibold text-fg-muted uppercase tracking-wide">
                {group.label}
              </span>
            </div>
            <div className="flex flex-col">
              {group.blocks.map(blockType => (
                <BlockCard
                  key={blockType}
                  blockType={blockType}
                  onAddToCanvas={handleAdd}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
