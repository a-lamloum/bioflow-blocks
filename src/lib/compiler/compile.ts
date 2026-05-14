import { v4 as uuidv4 } from 'uuid'
import type { Node, Edge } from '@xyflow/react'
import type { PipelineNodeData, WorkflowIR, IRBlock, IREdge, PipelineEdgeData } from '@/types'

/**
 * Compile canvas state into a WorkflowIR.
 * Does NOT validate — call validate(ir) separately before simulate(ir).
 */
export function compile(
  nodes: Node<PipelineNodeData>[],
  edges: Edge<PipelineEdgeData>[]
): WorkflowIR {
  const connectedNodeIds = new Set<string>()
  edges.forEach(e => {
    connectedNodeIds.add(e.source)
    connectedNodeIds.add(e.target)
  })

  // Include all nodes (connected and isolated) so validator can flag disconnected ones
  const blocks: IRBlock[] = nodes.map(n => ({
    id: n.id,
    type: n.data.blockType,
    config: n.data.config ?? {},
  }))

  const irEdges: IREdge[] = edges.map(e => ({
    from: e.source,
    to: e.target,
    dataType: (e.data as PipelineEdgeData | undefined)?.dataType ?? 'pipeline_context',
  }))

  return {
    schema_version: '0.1',
    project_id: uuidv4(),
    name: 'My Pipeline',
    execution_mode: 'simulated',
    blocks,
    edges: irEdges,
  }
}

/**
 * Topologically sort block IDs by their edge dependencies (Kahn's algorithm).
 * Returns IDs in execution order (sources first).
 * Throws Error('CYCLE_DETECTED') if a cycle exists.
 */
export function topologicalSort(ir: WorkflowIR): string[] {
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const block of ir.blocks) {
    inDegree.set(block.id, 0)
    adjacency.set(block.id, [])
  }

  for (const edge of ir.edges) {
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1)
    const adj = adjacency.get(edge.from) ?? []
    adj.push(edge.to)
    adjacency.set(edge.from, adj)
  }

  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  const sorted: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(current)
    for (const neighbour of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbour) ?? 0) - 1
      inDegree.set(neighbour, newDeg)
      if (newDeg === 0) queue.push(neighbour)
    }
  }

  if (sorted.length !== ir.blocks.length) {
    throw new Error('CYCLE_DETECTED')
  }

  return sorted
}
