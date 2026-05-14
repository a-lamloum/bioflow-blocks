/**
 * Contract: Pipeline Validator
 * Layer: src/lib/validator/validate.ts
 *
 * Pure function that checks a WorkflowIR for structural and semantic errors
 * before simulation is allowed. Returns a ValidationResult — never throws.
 *
 * Constitution guarantee: this module MUST never import from src/components/ or src/app/.
 */

import type { WorkflowIR, ValidationResult } from '../../../src/types'

/**
 * Validate a compiled WorkflowIR.
 *
 * Checks (in order):
 * 1. Exactly one 'start_pipeline' block exists            → MISSING_START / DUPLICATE_START
 * 2. At least one 'output_results' block exists           → MISSING_OUTPUT
 * 3. No isolated nodes (nodes with no edges)              → DISCONNECTED_BLOCK
 * 4. All edges respect the DataType compatibility matrix  → INVALID_CONNECTION
 * 5. No cycles in the block graph                         → CYCLE_DETECTED
 *
 * All error messages use beginner-friendly language.
 * All errors include a `fix` string explaining exactly how to resolve the issue.
 *
 * @param ir - WorkflowIR produced by compile()
 * @returns ValidationResult with valid flag, errors[], and warnings[]
 */
export declare function validate(ir: WorkflowIR): ValidationResult

/**
 * DataType compatibility matrix.
 * Maps each source DataType to the set of DataTypes it can connect to.
 * Exported for use in React Flow's isValidConnection callback.
 */
export declare const DATA_TYPE_COMPATIBILITY: Record<string, string[]>
