/**
 * Contract: Workflow Compiler
 * Layer: src/lib/compiler/compile.ts
 *
 * Pure function that converts the React Flow canvas state (nodes + edges)
 * into a structured WorkflowIR for validation and simulation.
 *
 * Constitution guarantee: this module MUST never import from src/components/ or src/app/.
 * React Flow types may be imported from '@xyflow/react' as they are data-only.
 */

import type { Node, Edge } from '@xyflow/react'
import type { WorkflowIR, PipelineNodeData } from '../../../src/types'

/**
 * Compile canvas state into a WorkflowIR.
 *
 * The compiler:
 * 1. Filters out nodes with no connections (isolated nodes are NOT included)
 * 2. Builds IRBlock list from nodes
 * 3. Builds IREdge list from edges, carrying dataType from edge.data
 * 4. Does NOT validate — call validate(ir) after compile()
 *
 * @param nodes - Current React Flow nodes from useNodesState
 * @param edges - Current React Flow edges from useEdgesState
 * @returns WorkflowIR ready for validate() and simulate()
 */
export declare function compile(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[]
): WorkflowIR

/**
 * Topologically sort blocks by their edge dependencies.
 * Returns block IDs in execution order (sources first).
 * Used by the simulator; also exported for testing.
 *
 * @param ir - A WorkflowIR
 * @returns Ordered array of block IDs, or throws if a cycle is detected
 */
export declare function topologicalSort(ir: WorkflowIR): string[]
