import type { Mission, MissionStep, PipelineNode, SimulationResult, BlockType } from '@/types'

const PROGRESS_KEY = 'bioflow_mission_progress'

// ─── Mission 1: Build Your First QC Pipeline ─────────────────────────────────

const M1_STEPS: MissionStep[] = [
  { id: 'm1-s1', instruction: 'Drag a "Start Pipeline" block onto the canvas.', hint: 'Find it in the Pipeline section of the block library on the left.' },
  { id: 'm1-s2', instruction: 'Add a "Samplesheet" block and connect it to Start Pipeline.', hint: 'Connect the right bump of Start Pipeline to the left notch of Samplesheet.' },
  { id: 'm1-s3', instruction: 'Add an "Input FASTQ" block and connect it to Samplesheet.', hint: 'Input FASTQ takes sample records from Samplesheet and emits FASTQ read pairs.' },
  { id: 'm1-s4', instruction: 'Add a "QC Step" block and connect it to Input FASTQ.', hint: 'QC Step checks whether your sequencing reads look healthy (maps to nf-core FASTQC module).' },
  { id: 'm1-s5', instruction: 'Add a "Generate Report" block and connect it to QC Step.', hint: 'Generate Report collects QC results into one summary (maps to nf-core MULTIQC module).' },
  { id: 'm1-s6', instruction: 'Add "Output Results" and connect it to Generate Report. Then click Simulate!', hint: 'Output Results = publishDir in nf-core. Hit Simulate when all blocks are connected.' },
]

export const MISSION_1: Mission = {
  id: 'mission_first_qc_pipeline',
  title: 'Build Your First QC Pipeline',
  description: 'Connect 6 blocks to build the nf-core/rnaseq QC workflow — samplesheet, FASTQ input, FASTQC, MultiQC, and output.',
  steps: M1_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 2: Add Trimming After QC ────────────────────────────────────────

const M2_STEPS: MissionStep[] = [
  { id: 'm2-s1', instruction: 'Build the base QC pipeline: Start → Samplesheet → Input FASTQ → QC Step.', hint: 'This is the same start as Mission 1. You can do it faster this time!' },
  { id: 'm2-s2', instruction: 'Add a "Trim Reads" block and connect it to Input FASTQ (alongside QC Step).', hint: 'Trim Reads and QC Step both accept FASTQ reads — you can connect both to Input FASTQ.' },
  { id: 'm2-s3', instruction: 'Connect Trim Reads to Generate Report.', hint: 'Generate Report accepts both QC output and trimmed reads — connect from the Trim Reads output.' },
  { id: 'm2-s4', instruction: 'Connect QC Step to Generate Report as well.', hint: 'Generate Report has two input ports — one for QC output, one for trimmed reads.' },
  { id: 'm2-s5', instruction: 'Add Output Results and connect it to Generate Report. Then click Simulate!', hint: 'This teaches the TRIMGALORE → MULTIQC flow in nf-core/rnaseq.' },
]

export const MISSION_2: Mission = {
  id: 'mission_add_trimming',
  title: 'Add Trimming After QC',
  description: 'Learn why nf-core/rnaseq trims reads before alignment — add TrimGalore to your pipeline and see it in the report.',
  steps: M2_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'trim_reads', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 3: Generate the nf-core Command ─────────────────────────────────

const M3_STEPS: MissionStep[] = [
  { id: 'm3-s1', instruction: 'Build the full QC pipeline with trimming (all 7 core blocks).', hint: 'Repeat Mission 2 — Start → Samplesheet → Input FASTQ → QC + Trim → Report → Output.' },
  { id: 'm3-s2', instruction: 'Add a "Run Profile" block and connect it before Samplesheet.', hint: 'Run Profile teaches the -profile flag in nf-core — docker, singularity, conda, or test.' },
  { id: 'm3-s3', instruction: 'Add a "Parameter Setting" block and connect it before Samplesheet.', hint: 'Parameter Setting teaches --genome GRCh38 and other nf-core/rnaseq parameters.' },
  { id: 'm3-s4', instruction: 'Simulate the pipeline and look at the generated nextflow run command.', hint: 'Check the Run panel — the command shows: nextflow run nf-core/rnaseq --input ... --genome ... -profile docker.' },
]

export const MISSION_3: Mission = {
  id: 'mission_generate_command',
  title: 'Generate the nf-core Command',
  description: 'Learn how visual blocks map to a real nextflow run nf-core/rnaseq command — profiles, parameters, and outdir.',
  steps: M3_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'trim_reads', 'generate_report', 'output_results', 'run_profile', 'parameter_setting'],
  completionCondition: 'simulation_success',
}

// ─── All missions ──────────────────────────────────────────────────────────────

// ─── Mission 4: Run with Test Data ───────────────────────────────────────────

const M4_STEPS: MissionStep[] = [
  { id: 'm4-s1', instruction: 'Go to the Test Run page and read the dataset description.', hint: 'Click "Test Run" in the navigation. The dataset is GSE110004 — real yeast RNA-seq from nf-core/test-datasets.' },
  { id: 'm4-s2', instruction: 'Click "Simulate Test Run" and watch the progress bar.', hint: 'The progress bar simulates the actual nf-core/rnaseq processing steps: index building → QC → alignment → quantification → report.' },
  { id: 'm4-s3', instruction: 'Open the Trace tab and find the STAR_ALIGN process. How long did it take?', hint: 'Look for NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN in the trace. The time column shows wall-clock time per sample.' },
  { id: 'm4-s4', instruction: 'Open the QC Stats tab. Which sample has the highest alignment rate?', hint: 'Look at the %mapped column. Values above 90% are excellent for yeast RNA-seq.' },
  { id: 'm4-s5', instruction: 'Open the Outputs tab and find multiqc_report.html. What directory is it in?', hint: 'The MultiQC report is always in results/multiqc/. It aggregates QC from every step into one interactive HTML file.' },
]

export const MISSION_4: Mission = {
  id: 'mission_test_data',
  title: 'Run with Test Data',
  description: 'Learn how nf-core/rnaseq uses its official test dataset (GSE110004) — explore the real trace, QC stats, and output file structure.',
  steps: M4_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

export const MISSIONS: Mission[] = [MISSION_1, MISSION_2, MISSION_3, MISSION_4]

// ─── Badges ───────────────────────────────────────────────────────────────────

export const MISSION_BADGES: Record<string, { emoji: string; label: string; reflection: string; testRunUrl?: string }> = {
  mission_first_qc_pipeline: {
    emoji: '🔬',
    label: 'Pipeline Builder',
    reflection: 'Why does the pipeline need a samplesheet before it can find your FASTQ files?',
  },
  mission_add_trimming: {
    emoji: '✂️',
    label: 'Trim Master',
    reflection: 'Why does nf-core/rnaseq trim reads before alignment rather than after?',
  },
  mission_generate_command: {
    emoji: '⌨️',
    label: 'Command Crafter',
    reflection: 'What does -profile docker tell Nextflow to do differently?',
  },
  mission_test_data: {
    emoji: '🧪',
    label: 'Test Data Explorer',
    reflection: 'Why does nf-core/rnaseq use a tiny yeast dataset (S. cerevisiae chr I) for its test profile rather than a human sample?',
    testRunUrl: '/test-run',
  },
}

// ─── Persistence ─────────────────────────────────────────────────────────────

export function loadCompletedMissions(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function saveMissionComplete(missionId: string): void {
  if (typeof window === 'undefined') return
  try {
    const current = loadCompletedMissions()
    current.add(missionId)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...current]))
  } catch { /* ignore */ }
}

export function getMissionStatus(missionId: string): 'locked' | 'available' | 'completed' {
  const completed = loadCompletedMissions()
  if (completed.has(missionId)) return 'completed'
  const idx = MISSIONS.findIndex(m => m.id === missionId)
  if (idx === 0) return 'available'
  // A mission is available if the previous mission is completed
  const prev = MISSIONS[idx - 1]
  return prev && completed.has(prev.id) ? 'available' : 'locked'
}

// ─── Completion check helpers ─────────────────────────────────────────────────

export function checkMissionCompletion(
  mission: Mission,
  nodes: PipelineNode[],
  result: SimulationResult | null
): boolean {
  if (!result || result.status !== 'completed') return false
  const presentTypes = new Set(nodes.map(n => n.data.blockType))
  return mission.requiredBlockTypes.every(t => presentTypes.has(t as BlockType))
}

/** @deprecated Use checkMissionCompletion with explicit mission */
export function checkCompletion(nodes: PipelineNode[], result: SimulationResult | null): boolean {
  return checkMissionCompletion(MISSION_1, nodes, result)
}

export function getCurrentStepIndex(nodes: PipelineNode[], mission: Mission = MISSION_1): number {
  const presentTypes = new Set(nodes.map(n => n.data.blockType))
  const ordered = mission.requiredBlockTypes
  for (let i = ordered.length - 1; i >= 0; i--) {
    if (presentTypes.has(ordered[i] as BlockType)) {
      return Math.min(i + 1, mission.steps.length - 1)
    }
  }
  return 0
}

// Keep backward compat alias
export const FIRST_QC_MISSION = MISSION_1
