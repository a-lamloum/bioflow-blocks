'use client'

import { useCallback } from 'react'
import { BlockCard } from './BlockCard'
import { PACKS, ALL_BLOCK_TYPES, BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockType } from '@/types'

interface BlockLibraryProps {
  onAddToCanvas: (blockType: BlockType, position?: { x: number; y: number }) => void
}

const PHASE_LABELS: Record<number, string> = {
  0: 'Available now',
  1: 'Phase 1',
  2: 'Phase 2',
  3: 'Phase 3',
}

const PHASE_BADGE_COLORS: Record<number, string> = {
  0: 'oklch(52% 0.22 152)',
  1: 'oklch(58% 0.20 212)',
  2: 'oklch(52% 0.20 232)',
  3: 'oklch(52% 0.18 85)',
}

export function BlockLibrary({ onAddToCanvas }: BlockLibraryProps) {
  const handleAdd = useCallback(
    (blockType: BlockType) => {
      onAddToCanvas(blockType, { x: 180 + Math.random() * 160, y: 140 + Math.random() * 80 })
    },
    [onAddToCanvas]
  )

  return (
    <aside
      aria-label="Block library"
      className="flex flex-col w-56 shrink-0 bg-surface-2 border-r border-border overflow-y-auto"
    >
      <div className="px-3 pt-4 pb-2 shrink-0">
        <h2 className="text-xs font-bold text-fg-muted uppercase tracking-wider">
          Block Library
        </h2>
        <p className="text-xs text-fg-muted mt-0.5">
          {ALL_BLOCK_TYPES.length} blocks · {PACKS.length} packs
        </p>
      </div>

      <div className="flex flex-col pb-4">
        {PACKS.map(pack => {
          const packBlocks = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].pack === pack.id)
          if (packBlocks.length === 0) return null

          return (
            <div key={pack.id}>
              {/* Pack header */}
              <div
                className="flex items-center gap-2 px-3 py-2 border-t border-border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="text-sm">{pack.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-fg-primary truncate">{pack.name}</span>
                    <span
                      className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: PHASE_BADGE_COLORS[pack.phase] + '22',
                        color: PHASE_BADGE_COLORS[pack.phase],
                        fontSize: 10,
                      }}
                    >
                      {PHASE_LABELS[pack.phase]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blocks */}
              <div className="flex flex-col">
                {packBlocks.map(blockType => (
                  <BlockCard
                    key={blockType}
                    blockType={blockType}
                    onAddToCanvas={handleAdd}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
