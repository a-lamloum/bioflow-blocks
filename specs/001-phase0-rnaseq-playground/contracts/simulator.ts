/**
 * Contract: Simulation Engine
 * Layer: src/lib/simulator/simulate.ts
 *
 * This module is a pure function layer — no React imports, no side effects, no async.
 * It receives a validated WorkflowIR and returns a deterministic SimulationResult.
 *
 * Constitution guarantee: this module MUST never import from src/components/ or src/app/.
 */

import type { WorkflowIR, SimulationResult } from '../../../src/types'

/**
 * Simulate a validated pipeline workflow.
 *
 * Algorithm:
 * 1. Topologically sort IR blocks by edge dependencies
 * 2. Walk blocks in order, invoking the handler for each BlockType
 * 3. Each handler accumulates context and emits a TraceEntry
 * 4. After all blocks, assemble SimulationResult
 *
 * Invariants:
 * - Same input always produces same output (deterministic)
 * - Never throws — returns status:'failed' on unexpected input
 * - No I/O, no randomness, no async
 *
 * @param ir - A WorkflowIR produced by compile(). Caller is responsible for
 *             validating the IR before passing it here.
 * @returns SimulationResult with status, trace, reportCard, and generatedCommand
 */
export declare function simulate(ir: WorkflowIR): SimulationResult

/**
 * Internal run context accumulated as blocks are processed.
 * Not exported — internal to the simulator module.
 */
interface RunContext {
  samples: Array<{ name: string; fastq1: string; fastq2: string }>
  fastqLoaded: boolean
  qcCompleted: boolean
  trimCompleted: boolean
  reportGenerated: boolean
  warnings: string[]
}

/**
 * Block handler signature. Each BlockType has exactly one handler.
 * Handlers are pure: given context + block config, return updated context + trace message.
 */
export type BlockHandler = (
  context: RunContext,
  blockId: string,
  config: Record<string, unknown>
) => { context: RunContext; message: string; status: 'success' | 'warning' | 'error' }
