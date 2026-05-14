import { describe, it, expect } from 'vitest'
import { simulate } from '@/lib/simulator/simulate'
import type { WorkflowIR } from '@/types'

function makeFullIR(): WorkflowIR {
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

describe('simulate', () => {
  it('returns status completed for a valid 6-block pipeline', () => {
    const result = simulate(makeFullIR())
    expect(result.status).toBe('completed')
  })

  it('produces 6 trace entries for a 6-block pipeline', () => {
    const result = simulate(makeFullIR())
    expect(result.trace).toHaveLength(6)
  })

  it('returns a non-null reportCard when generate_report is present', () => {
    const result = simulate(makeFullIR())
    expect(result.reportCard).not.toBeNull()
    expect(result.reportCard?.status).toMatch(/^(pass|warn|fail)$/)
    expect(result.reportCard?.summary.length).toBeGreaterThan(0)
  })

  it('returns null reportCard when generate_report is missing', () => {
    const ir = makeFullIR()
    // Remove generate_report and rewire to skip it
    ir.blocks = ir.blocks.filter(b => b.type !== 'generate_report')
    ir.edges = ir.edges.filter(e => e.from !== 'n4' || e.to !== 'n5')
    ir.edges = ir.edges.filter(e => e.from !== 'n5')
    ir.edges.push({ from: 'n4', to: 'n6', dataType: 'qc_output' })
    const result = simulate(ir)
    expect(result.reportCard).toBeNull()
  })

  it('returns status blocked for an empty IR', () => {
    const ir: WorkflowIR = {
      schema_version: '0.1',
      project_id: 'test',
      name: 'test',
      execution_mode: 'simulated',
      blocks: [],
      edges: [],
    }
    const result = simulate(ir)
    expect(result.status).toBe('blocked')
  })

  it('all trace entries have non-empty messages', () => {
    const result = simulate(makeFullIR())
    result.trace.forEach(t => {
      expect(t.message.length).toBeGreaterThan(0)
    })
  })

  it('includes an educational generated command', () => {
    const result = simulate(makeFullIR())
    expect(result.generatedCommand).toContain('nextflow run')
  })
})
