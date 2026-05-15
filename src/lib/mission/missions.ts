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

// ─── Mission 5: Explore nf-core/sarek (Variant Calling) ──────────────────────

const M5_STEPS: MissionStep[] = [
  { id: 'm5-s1', instruction: 'Go to Packs and open the "nf-core/sarek" pack page.', hint: 'Click "Packs" in the navigation, then find the Variant Calling (nf-core/sarek) card.' },
  { id: 'm5-s2', instruction: 'Read what nf-core/sarek does and who uses it.', hint: 'Sarek is a GATK best-practices germline variant calling pipeline. It identifies SNPs and INDELs in DNA sequencing data.' },
  { id: 'm5-s3', instruction: 'Find the BWAMEM2_MEM module. What does it do and why is it different from STAR_ALIGN?', hint: 'BWA-MEM2 aligns DNA reads. It does NOT need to be splice-aware unlike STAR — DNA has no introns.' },
  { id: 'm5-s4', instruction: 'In the Builder, connect: Start → Samplesheet → Input FASTQ → QC Step → Generate Report → Output Results. Simulate to see what the pre-variant-calling QC would look like.', hint: 'The QC step teaches the FASTQC module — the same quality check used before alignment in nf-core/sarek.' },
  { id: 'm5-s5', instruction: 'Open the Module Registry and filter by "nf-core/sarek". Find GATK4_HAPLOTYPECALLER and read its technical detail.', hint: 'HaplotypeCaller is the variant calling step. It uses local de novo assembly to call SNPs and INDELs and outputs a GVCF file.' },
]

export const MISSION_5: Mission = {
  id: 'mission_sarek_explorer',
  title: 'Explore nf-core/sarek',
  description: 'Learn the GATK best-practices germline variant calling pipeline — from BWA-MEM2 alignment to GATK HaplotypeCaller and VEP annotation.',
  steps: M5_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 6: Explore nf-core/taxprofiler (Metagenomics) ───────────────────

const M6_STEPS: MissionStep[] = [
  { id: 'm6-s1', instruction: 'Go to Packs and open the "nf-core/taxprofiler" pack page.', hint: 'Click "Packs" in the navigation. taxprofiler classifies microbial communities from shotgun metagenomics data.' },
  { id: 'm6-s2', instruction: 'Read about nf-core/taxprofiler. What is the difference between Kraken2 and MetaPhlAn?', hint: 'Kraken2 uses k-mer matching (fast, sensitive to database). MetaPhlAn uses marker genes (species-specific, database-independent).' },
  { id: 'm6-s3', instruction: 'Open the Module Registry and filter by "nf-core/taxprofiler". Find KRAKEN2_KRAKEN2 and BOWTIE2_ALIGN. What does BOWTIE2_ALIGN do in the taxprofiler context?', hint: 'In taxprofiler, BOWTIE2_ALIGN is used for HOST REMOVAL — aligning reads to the human genome and discarding human reads before classification.' },
  { id: 'm6-s4', instruction: 'In the Builder, simulate the full QC pipeline (6 blocks). The QC step maps to FastQC — explain why QC comes before host removal in a real metagenomic run.', hint: 'You need to check raw read quality FIRST so you know the baseline before host removal changes the read composition.' },
  { id: 'm6-s5', instruction: 'Read about the KRONA_KTIMPORTTAXONOMY module. What type of output does it produce and where would you find it in the results directory?', hint: 'Krona makes an interactive HTML sunburst chart. In nf-core/taxprofiler it is in results/krona/ per classifier.' },
]

export const MISSION_6: Mission = {
  id: 'mission_taxprofiler_explorer',
  title: 'Explore nf-core/taxprofiler',
  description: 'Learn the microbial community profiling pipeline — host removal, Kraken2 classification, Bracken abundance, and Krona visualisation.',
  steps: M6_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 7: Read Your First Nextflow Script ───────────────────────────────

const M7_STEPS: MissionStep[] = [
  { id: 'm7-s1', instruction: 'Go to the DSL2 Code Bridge page.', hint: 'Click "DSL2" in the navigation. The page shows the real Nextflow code behind your visual pipeline.' },
  { id: 'm7-s2', instruction: 'Open the main.nf tab. Click the line that says "nextflow.enable.dsl = 2". What does it do?', hint: 'This activates DSL2 syntax. Without it, Nextflow falls back to DSL1 (older format). All nf-core pipelines require DSL2.' },
  { id: 'm7-s3', instruction: 'Find the "include { FASTQC }" line. What does it import and from where?', hint: 'It imports the FASTQC module from the nf-core/modules GitHub repository. This is how nf-core reuses community-built process definitions.' },
  { id: 'm7-s4', instruction: 'Find "Channel.fromSamplesheet(params.input)". What does this line create?', hint: 'It reads your samplesheet CSV and creates a typed data stream (channel) emitting [meta, fastq_1, fastq_2] tuples — one per row in the CSV.' },
  { id: 'm7-s5', instruction: 'Open the Meta Maps tab. What three fields does the "meta" map carry through the pipeline?', hint: 'meta contains: id (sample name), single_end (true/false for library type), and strandedness (auto/forward/reverse).' },
  { id: 'm7-s6', instruction: 'Go back to the Builder and simulate the pipeline. Then compare the trace to the main.nf code — can you match each trace entry to a process call?', hint: 'Each "FASTQC(ch_reads)" call in main.nf = one trace entry. "MULTIQC(ch_multiqc_files)" = the last trace entry before output.' },
]

export const MISSION_7: Mission = {
  id: 'mission_read_dsl2_script',
  title: 'Read Your First Nextflow Script',
  description: 'Explore the real Nextflow DSL2 code generated from your visual pipeline — includes, channel creation, process calls, and the meta map convention.',
  steps: M7_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 8: Understand the Work Directory ─────────────────────────────────

const M8_STEPS: MissionStep[] = [
  { id: 'm8-s1', instruction: 'Go to the DSL2 Code Bridge and open the "Work Directory" tab.', hint: 'Click "DSL2" in the nav, then the "Work Directory" tab. It shows what Nextflow creates for every process execution.' },
  { id: 'm8-s2', instruction: 'Click ".command.sh". What does this file contain and why is it useful for debugging?', hint: '.command.sh contains the exact shell command Nextflow ran. When a process fails, copy this and run it manually to reproduce the error.' },
  { id: 'm8-s3', instruction: 'Click ".exitcode". What does exit code 0 mean? What would exit code 137 mean?', hint: '0 = success. 137 = the process was killed by the OS, usually because it ran out of memory. Increase the memory directive in nextflow.config.' },
  { id: 'm8-s4', instruction: 'Read the Resume Simulator section. If only sample SAMPLE1 FASTQ changed, which steps re-run and which are cached?', hint: 'FASTQC for SAMPLE1 re-runs (input changed). FASTQC for SAMPLE2 is cached. All downstream steps from SAMPLE1 (TRIMGALORE → STAR → ...) also re-run.' },
  { id: 'm8-s5', instruction: 'Look at the run command in the main.nf tab. Add -resume to it. What does this flag tell Nextflow to do?', hint: '-resume tells Nextflow to check the work directory hash for each process. If inputs match a previous run, use the cached output instead of re-running.' },
]

export const MISSION_8: Mission = {
  id: 'mission_work_directory',
  title: 'Understand the Work Directory',
  description: 'Learn what Nextflow writes inside work/ab/cd12ef.../ for every process — and how -resume uses this to cache completed steps.',
  steps: M8_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 9: Troubleshoot a Broken Pipeline ───────────────────────────────

const M9_STEPS: MissionStep[] = [
  { id: 'm9-s1', instruction: 'Go to the Troubleshoot page and open the Error Decoder tab.', hint: 'Click "Troubleshoot" in the navigation. The error decoder has 10 common nf-core errors with plain-language fixes.' },
  { id: 'm9-s2', instruction: 'Find the "Out of memory (OOM kill)" error. What exit code does it produce and why?', hint: 'Exit code 137 = 128 + 9. In Linux, 128 + N means the process was killed by signal N. Signal 9 (SIGKILL) is the OOM killer.' },
  { id: 'm9-s3', instruction: 'Find the "Input file not found" error. Why should samplesheet paths be absolute rather than relative?', hint: 'Nextflow processes run in isolated work directories, not your current directory. Relative paths would resolve relative to the work dir, not where you launched nextflow.' },
  { id: 'm9-s4', instruction: 'Open the nextflow log tab. Click the FAILED row (STAR_ALIGN RAP1_IAA_30M_REP1). Where would you look first to find the error message?', hint: 'Check .command.err and .exitcode in the work directory for that process. Use nextflow log <run_name> to find the work directory path.' },
  { id: 'm9-s5', instruction: 'Open the Pipeline Versioning tab. Add -r 3.14.0 to the generated command. Why is this important for publications?', hint: 'Without pinning the version, running the same command in 6 months may use different tool versions and produce different results. Pin the version in your Methods section.' },
]

export const MISSION_9: Mission = {
  id: 'mission_troubleshoot',
  title: 'Troubleshoot a Broken Pipeline',
  description: 'Learn to diagnose and fix the most common nf-core errors — exit code 137, file not found, Docker permissions — and pin pipeline versions for reproducibility.',
  steps: M9_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 10: Download Public Data with nf-core/fetchngs ──────────────────

const M10_STEPS: MissionStep[] = [
  { id: 'm10-s1', instruction: 'Go to Packs and open the nf-core/fetchngs pack page.', hint: 'Click "Packs" in the nav. fetchngs is the tool that downloads sequencing data from SRA/GEO — a critical first step for reproducing published analyses.' },
  { id: 'm10-s2', instruction: 'Read what nf-core/fetchngs does. What types of accession IDs does it accept?', hint: 'fetchngs accepts SRR (run), SRX (experiment), SRS (sample), SRP (study), and GSE (GEO series) accessions — all in a single IDs file, one per line.' },
  { id: 'm10-s3', instruction: 'Find the "Generate Samplesheet" block in the Module Registry. What does the --nf_core_pipeline parameter do?', hint: '--nf_core_pipeline sets which pipeline format the generated samplesheet uses. Set it to "rnaseq" to get a samplesheet ready for nextflow run nf-core/rnaseq.' },
  { id: 'm10-s4', instruction: 'In the Builder, build the QC pipeline and simulate it. Now imagine the FASTQ files came from nf-core/fetchngs. What command would you run BEFORE the QC pipeline?', hint: 'Run: nextflow run nf-core/fetchngs --input ids.csv --nf_core_pipeline rnaseq --outdir fetchngs_results. Then use the generated samplesheet.csv as --input for nf-core/rnaseq.' },
]

export const MISSION_10: Mission = {
  id: 'mission_fetchngs',
  title: 'Download Public Data with nf-core/fetchngs',
  description: 'Learn how to download sequencing data from SRA/ENA/GEO using nf-core/fetchngs and auto-generate a samplesheet for downstream nf-core pipelines.',
  steps: M10_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

// ─── Mission 11: Explore nf-core/chipseq ─────────────────────────────────────

const M11_STEPS: MissionStep[] = [
  { id: 'm11-s1', instruction: 'Go to Packs and open the nf-core/chipseq pack page.', hint: 'Click "Packs" in the nav. chipseq is one of the most popular nf-core pipelines with 600+ citations.' },
  { id: 'm11-s2', instruction: 'Read what nf-core/chipseq does. Why does ChIP-seq need a samplesheet with an "antibody" column?', hint: 'The antibody column links each IP sample to its input control. MACS3 peak calling needs the matched input to identify real enrichment vs background noise.' },
  { id: 'm11-s3', instruction: 'Find the "Peak Calling" block in the Module Registry. What metric should you check first to assess ChIP-seq quality?', hint: 'FRiP (Fraction of Reads in Peaks). A value > 0.01 is the minimum for TF ChIP-seq. Low FRiP means poor antibody enrichment or failed IP.' },
  { id: 'm11-s4', instruction: 'What is the difference between --broad and --narrowPeak mode in MACS3? Which would you use for H3K4me3?', hint: 'H3K4me3 is an active promoter mark with sharp, narrow peaks — use narrowPeak (default). H3K27me3 (repression) has broad, diffuse peaks — use --broad.' },
  { id: 'm11-s5', instruction: 'Simulate the QC pipeline in the Builder. How would the analysis differ if you were processing ATAC-seq instead of ChIP-seq?', hint: 'ATAC-seq has no antibody/control — peaks represent open chromatin, not protein binding. You would skip the control sample pairing, but still use MACS3 for peak calling.' },
]

export const MISSION_11: Mission = {
  id: 'mission_chipseq_explorer',
  title: 'Explore nf-core/chipseq',
  description: 'Learn ChIP-seq peak calling with MACS3, FRiP quality metrics, and how ChIP-seq differs from ATAC-seq and RNA-seq in the nf-core ecosystem.',
  steps: M11_STEPS,
  requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results'],
  completionCondition: 'simulation_success',
}

export const MISSIONS: Mission[] = [MISSION_1, MISSION_2, MISSION_3, MISSION_4, MISSION_5, MISSION_6, MISSION_7, MISSION_8, MISSION_9, MISSION_10, MISSION_11]

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
  mission_sarek_explorer: {
    emoji: '🧬',
    label: 'Variant Caller',
    reflection: 'Why does nf-core/sarek use BWAMEM2_MEM (not STAR_ALIGN) for DNA alignment? What makes BWA-MEM2 suitable for germline variant calling?',
  },
  mission_taxprofiler_explorer: {
    emoji: '🦠',
    label: 'Microbiome Analyst',
    reflection: 'A clinical metagenomic sample from a patient gut contains 80% human reads. Why is the host removal step critical before running Kraken2?',
  },
  mission_read_dsl2_script: {
    emoji: '📄',
    label: 'DSL2 Reader',
    reflection: 'Every nf-core module receives a [meta, file] tuple. Why does meta travel unchanged through every step instead of just passing raw file paths?',
  },
  mission_work_directory: {
    emoji: '📁',
    label: 'Work Dir Explorer',
    reflection: 'If you run the same pipeline twice without -resume and with -resume, what is the practical difference for a 100-sample whole-genome sequencing dataset?',
  },
  mission_troubleshoot: {
    emoji: '🔧',
    label: 'Pipeline Debugger',
    reflection: 'A colleague shares a paper using nf-core/rnaseq but didn\'t pin the version with -r. Why might their results be impossible to reproduce exactly 2 years later?',
  },
  mission_fetchngs: {
    emoji: '⬇️',
    label: 'Data Downloader',
    reflection: 'A GEO series (GSE12345) has 50 samples. What does nf-core/fetchngs save you compared to manually downloading each file from the SRA website?',
  },
  mission_chipseq_explorer: {
    emoji: '🧲',
    label: 'Peak Caller',
    reflection: 'Why does ChIP-seq peak calling require a matched input control sample while RNA-seq does not?',
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
