import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlockInspector } from '@/components/inspector/BlockInspector'
import { BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import type { BlockType } from '@/types'

describe('BlockInspector', () => {
  it('renders nothing when selectedBlockType is null', () => {
    const { container } = render(
      <BlockInspector selectedBlockType={null} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  ALL_BLOCK_TYPES.forEach((blockType: BlockType) => {
    const def = BLOCK_DEFINITIONS[blockType]

    it(`renders complete content for "${blockType}"`, () => {
      render(<BlockInspector selectedBlockType={blockType} onClose={() => {}} />)

      // Display name is visible
      expect(screen.getByText(def.displayName)).toBeInTheDocument()

      // Technical concept line is present
      expect(screen.getByText(/nf-core concept:/)).toBeInTheDocument()

      // Beginner description contains some words from the definition
      const firstWords = def.description.split(' ').slice(0, 3).join(' ')
      expect(screen.getByText(new RegExp(firstWords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument()

      // Common mistake is present
      const mistakeWords = def.commonMistake.split(' ').slice(0, 4).join(' ')
      expect(screen.getByText(new RegExp(mistakeWords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument()
    })

    it(`has aria-label "Block inspector" for "${blockType}"`, () => {
      render(<BlockInspector selectedBlockType={blockType} onClose={() => {}} />)
      expect(screen.getByRole('complementary', { name: 'Block inspector' })).toBeInTheDocument()
    })
  })
})
