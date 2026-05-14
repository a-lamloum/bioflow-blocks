import { describe, it, expect } from 'vitest'
import { compile, topologicalSort } from '@/lib/compiler/compile'
import type { WorkflowIR, PipelineNodeData, PipelineEdgeData } from '@/types'
import type { Node, Edge } from '@xyflow/react'

function makeNode(id: string, blockType: PipelineNodeData['blockType']): Node<PipelineNodeData> {
  return {
    id,
    type: 'pipelineBlock',
    position: { x: 0, y: 0 },
    data: { blockType, config: {}, hasError: false },
  }
}

function makeEdge(id: string, source: string, target: string, dataType: PipelineEdgeData['dataType']): Edge<PipelineEdgeData> {
  return {
    id,
    source,
    target,
    data: { dataType, label: dataType },
  }
}

describe('compile', () => {
  it('produces correct IRBlocks and IREdges for a valid 6-block pipeline', () => {
    const nodes = [
      makeNode('n1', 'start_pipeline'),
      makeNode('n2', 'samplesheet'),
      makeNode('n3', 'input_fastq'),
      makeNode('n4', 'qc_step'),
      makeNode('n5', 'generate_report'),
      makeNode('n6', 'output_results'),
    ]
    const edges = [
      makeEdge('e1', 'n1', 'n2', 'pipeline_context'),
      makeEdge('e2', 'n2', 'n3', 'sample_records'),
      makeEdge('e3', 'n3', 'n4', 'fastq_reads'),
      makeEdge('e4', 'n4', 'n5', 'qc_output'),
      makeEdge('e5', 'n5', 'n6', 'report_data'),
    ]
    const ir = compile(nodes, edges)

    expect(ir.schema_version).toBe('0.1')
    expect(ir.execution_mode).toBe('simulated')
    expect(ir.blocks).toHaveLength(6)
    expect(ir.edges).toHaveLength(5)
    expect(ir.blocks[0]).toMatchObject({ id: 'n1', type: 'start_pipeline' })
    expect(ir.edges[0]).toMatchObject({ from: 'n1', to: 'n2', dataType: 'pipeline_context' })
  })

  it('includes isolated nodes in the IR', () => {
    const nodes = [makeNode('n1', 'start_pipeline'), makeNode('n2', 'qc_step')]
    const ir = compile(nodes, [])
    expect(ir.blocks).toHaveLength(2)
    expect(ir.edges).toHaveLength(0)
  })
})

describe('topologicalSort', () => {
  it('returns blocks in execution order for a linear pipeline', () => {
    const ir: WorkflowIR = {
      schema_version: '0.1',
      project_id: 'test',
      name: 'test',
      execution_mode: 'simulated',
      blocks: [
        { id: 'n1', type: 'start_pipeline', config: {} },
        { id: 'n2', type: 'samplesheet', config: {} },
        { id: 'n3', type: 'input_fastq', config: {} },
      ],
      edges: [
        { from: 'n1', to: 'n2', dataType: 'pipeline_context' },
        { from: 'n2', to: 'n3', dataType: 'sample_records' },
      ],
    }
    const sorted = topologicalSort(ir)
    expect(sorted).toEqual(['n1', 'n2', 'n3'])
  })

  it('throws CYCLE_DETECTED on a cyclic graph', () => {
    const ir: WorkflowIR = {
      schema_version: '0.1',
      project_id: 'test',
      name: 'test',
      execution_mode: 'simulated',
      blocks: [
        { id: 'n1', type: 'qc_step', config: {} },
        { id: 'n2', type: 'generate_report', config: {} },
      ],
      edges: [
        { from: 'n1', to: 'n2', dataType: 'qc_output' },
        { from: 'n2', to: 'n1', dataType: 'report_data' },
      ],
    }
    expect(() => topologicalSort(ir)).toThrow('CYCLE_DETECTED')
  })
})
