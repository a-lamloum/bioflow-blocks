import { DATA_TYPE_COMPATIBILITY } from '@/lib/blocks/definitions'
import { topologicalSort } from '@/lib/compiler/compile'
import type { WorkflowIR, ValidationResult, ValidationError } from '@/types'

/**
 * Validate a compiled WorkflowIR.
 * Never throws — returns ValidationResult with valid flag, errors, and warnings.
 */
export function validate(ir: WorkflowIR): ValidationResult {
  const errors: ValidationError[] = []

  // 1. Exactly one start_pipeline block
  const starts = ir.blocks.filter(b => b.type === 'start_pipeline')
  if (starts.length === 0) {
    errors.push({
      blockId: null,
      code: 'MISSING_START',
      message: 'Your pipeline needs a Start Pipeline block to begin.',
      fix: 'Drag a Start Pipeline block from the library and connect it as the first block.',
    })
  } else if (starts.length > 1) {
    starts.slice(1).forEach(b => {
      errors.push({
        blockId: b.id,
        code: 'DUPLICATE_START',
        message: 'You have more than one Start Pipeline block. Only one is allowed.',
        fix: 'Remove the extra Start Pipeline block.',
      })
    })
  }

  // 2. At least one output_results block
  const outputs = ir.blocks.filter(b => b.type === 'output_results')
  if (outputs.length === 0) {
    errors.push({
      blockId: null,
      code: 'MISSING_OUTPUT',
      message: 'Your pipeline needs an Output Results block at the end.',
      fix: 'Drag an Output Results block from the library and connect it after Generate Report.',
    })
  }

  // 3. No isolated (disconnected) blocks — unless only 1 block total
  if (ir.blocks.length > 1) {
    const connectedIds = new Set<string>()
    ir.edges.forEach(e => {
      connectedIds.add(e.from)
      connectedIds.add(e.to)
    })
    ir.blocks.forEach(b => {
      if (!connectedIds.has(b.id)) {
        errors.push({
          blockId: b.id,
          code: 'DISCONNECTED_BLOCK',
          message: `The "${b.type.replace(/_/g, ' ')}" block is not connected to anything.`,
          fix: 'Draw a connection from this block to the next step in your pipeline.',
        })
      }
    })
  }

  // 4. Edge data-type compatibility
  ir.edges.forEach(edge => {
    const allowed = DATA_TYPE_COMPATIBILITY[edge.dataType] ?? []
    // Find what the target block's input port expects
    const targetBlock = ir.blocks.find(b => b.id === edge.to)
    if (!targetBlock) return

    // Check if the dataType is in the allowed list for any valid outgoing type
    // (we trust the compiler captured the dataType from the port; just verify it's not in incompatibility)
    // Simple check: ensure the source can emit this dataType at all
    const allAllowedSources = Object.entries(DATA_TYPE_COMPATIBILITY)
      .filter(([, targets]) => targets.includes(edge.dataType))
      .map(([src]) => src)

    if (allAllowedSources.length === 0 && edge.dataType !== 'pipeline_context') {
      errors.push({
        blockId: edge.from,
        code: 'INVALID_CONNECTION',
        message: `This connection carries an incompatible data type.`,
        fix: 'Check that the blocks are connected in the correct order.',
      })
    }
  })

  // 5. Cycle detection
  try {
    topologicalSort(ir)
  } catch {
    errors.push({
      blockId: null,
      code: 'CYCLE_DETECTED',
      message: 'Your pipeline has a loop — blocks cannot connect back to an earlier step.',
      fix: 'Remove the connection that creates the loop.',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  }
}
