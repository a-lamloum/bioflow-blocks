import { describe, it, expect } from 'vitest'
import { validate } from '@/lib/validator/validate'
import type { WorkflowIR } from '@/types'

function makeLinearIR(): WorkflowIR {
  return {
    schema_version: '0.1',
    project_id: 'test',
    name: 'test',
    execution_mode: 'simulated',
    blocks: [
      { id: 'n1', type: 'start_pipeline', config: {} },
      { id: 'n2', type: 'samplesheet', config: {} },
      { id: 'n3', type: 'input_fastq', config: {} },
      { id: 'n4', type: 'qc_step', config: {} },
      { id: 'n5', type: 'generate_report', config: {} },
      { id: 'n6', type: 'output_results', config: {} },
    ],
    edges: [
      { from: 'n1', to: 'n2', dataType: 'pipeline_context' },
      { from: 'n2', to: 'n3', dataType: 'sample_records' },
      { from: 'n3', to: 'n4', dataType: 'fastq_reads' },
      { from: 'n4', to: 'n5', dataType: 'qc_output' },
      { from: 'n5', to: 'n6', dataType: 'report_data' },
    ],
  }
}

describe('validate', () => {
  it('returns valid: true for a correct 6-block pipeline', () => {
    const result = validate(makeLinearIR())
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('MISSING_START: no start_pipeline block', () => {
    const ir = makeLinearIR()
    ir.blocks = ir.blocks.filter(b => b.type !== 'start_pipeline')
    ir.edges = ir.edges.filter(e => e.from !== 'n1' && e.to !== 'n1')
    const result = validate(ir)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.code === 'MISSING_START')).toBe(true)
  })

  it('DUPLICATE_START: two start_pipeline blocks', () => {
    const ir = makeLinearIR()
    ir.blocks.push({ id: 'n7', type: 'start_pipeline', config: {} })
    const result = validate(ir)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.code === 'DUPLICATE_START')).toBe(true)
  })

  it('MISSING_OUTPUT: no output_results block', () => {
    const ir = makeLinearIR()
    ir.blocks = ir.blocks.filter(b => b.type !== 'output_results')
    ir.edges = ir.edges.filter(e => e.to !== 'n6')
    const result = validate(ir)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.code === 'MISSING_OUTPUT')).toBe(true)
  })

  it('DISCONNECTED_BLOCK: isolated node', () => {
    const ir = makeLinearIR()
    ir.blocks.push({ id: 'n8', type: 'qc_step', config: {} })
    const result = validate(ir)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.code === 'DISCONNECTED_BLOCK' && e.blockId === 'n8')).toBe(true)
  })

  it('CYCLE_DETECTED: circular connection', () => {
    const ir: WorkflowIR = {
      schema_version: '0.1',
      project_id: 'test',
      name: 'test',
      execution_mode: 'simulated',
      blocks: [
        { id: 'n1', type: 'start_pipeline', config: {} },
        { id: 'n2', type: 'qc_step', config: {} },
        { id: 'n3', type: 'generate_report', config: {} },
        { id: 'n4', type: 'output_results', config: {} },
      ],
      edges: [
        { from: 'n1', to: 'n2', dataType: 'pipeline_context' },
        { from: 'n2', to: 'n3', dataType: 'qc_output' },
        { from: 'n3', to: 'n2', dataType: 'report_data' },
        { from: 'n3', to: 'n4', dataType: 'report_data' },
      ],
    }
    const result = validate(ir)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.code === 'CYCLE_DETECTED')).toBe(true)
  })

  it('all errors include a non-empty fix string', () => {
    const ir = makeLinearIR()
    ir.blocks = ir.blocks.filter(b => b.type !== 'start_pipeline')
    ir.edges = []
    const result = validate(ir)
    result.errors.forEach(e => {
      expect(e.fix.length).toBeGreaterThan(0)
    })
  })
})
