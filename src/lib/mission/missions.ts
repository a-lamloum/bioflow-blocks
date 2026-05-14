import type { Mission, MissionStep, PipelineNode, SimulationResult } from '@/types'

const STEPS: MissionStep[] = [
  {
    id: 'step-1',
    instruction: 'Drag a "Start Pipeline" block onto the canvas.',
    hint: 'Look in the Pipeline section of the block library on the left.',
  },
  {
    id: 'step-2',
    instruction: 'Drag a "Samplesheet" block and connect it to Start Pipeline.',
    hint: 'Connect the right port of Start Pipeline to the left port of Samplesheet.',
  },
  {
    id: 'step-3',
    instruction: 'Add an "Input FASTQ" block and connect it to Samplesheet.',
    hint: 'Input FASTQ takes sample records from Samplesheet and provides FASTQ reads.',
  },
  {
    id: 'step-4',
    instruction: 'Add a "QC Step" block and connect it to Input FASTQ.',
    hint: 'QC Step checks whether your sequencing reads look healthy.',
  },
  {
    id: 'step-5',
    instruction: 'Add a "Generate Report" block and connect it to QC Step.',
    hint: 'Generate Report collects QC results into a readable summary.',
  },
  {
    id: 'step-6',
    instruction: 'Add an "Output Results" block and connect it to Generate Report. Then click Simulate!',
    hint: 'Output Results is where your final files appear. Hit Simulate when everything is connected.',
  },
]

export const FIRST_QC_MISSION: Mission = {
  id: 'mission_first_qc_pipeline',
  title: 'Build Your First QC Pipeline',
  description: 'Connect 6 blocks to build a simple RNA-seq quality control workflow, then simulate it.',
  steps: STEPS,
  requiredBlockTypes: [
    'start_pipeline',
    'samplesheet',
    'input_fastq',
    'qc_step',
    'generate_report',
    'output_results',
  ],
  completionCondition: 'simulation_success',
}

export const MISSIONS = [FIRST_QC_MISSION]

/** Returns true if all required block types are present AND the simulation completed. */
export function checkCompletion(
  nodes: PipelineNode[],
  result: SimulationResult | null
): boolean {
  if (!result || result.status !== 'completed') return false
  const presentTypes = new Set(nodes.map(n => n.data.blockType))
  return FIRST_QC_MISSION.requiredBlockTypes.every(t => presentTypes.has(t))
}

/** Returns the index (0-based) of the current mission step based on which block types are on canvas. */
export function getCurrentStepIndex(nodes: PipelineNode[]): number {
  const presentTypes = new Set(nodes.map(n => n.data.blockType))
  const ordered = FIRST_QC_MISSION.requiredBlockTypes

  for (let i = ordered.length - 1; i >= 0; i--) {
    if (presentTypes.has(ordered[i])) {
      return Math.min(i + 1, STEPS.length - 1)
    }
  }
  return 0
}
