import type { Node, Edge } from '@xyflow/react'

// ─── Block and Port Types ────────────────────────────────────────────────────

export type PackId =
  | 'rnaseq_qc'
  | 'rnaseq_full'
  | 'variant_calling'
  | 'metagenomics'
  | 'single_cell'
  | 'fastq_basics'
  | 'nfcore_tools'
  // Phase 8 packs
  | 'chipseq'
  | 'fetchngs'
  | 'ampliseq'
  | 'methylseq'
  | 'differentialabundance'
  | 'spatialvi'

export type BlockStatus = 'available' | 'phase1' | 'phase2' | 'phase3'
export type ExecutionMode = 'simulated' | 'mock' | 'command_generation' | 'coming_soon'

export type BlockType =
  // ─ RNA-seq QC (Phase 0) ─
  | 'start_pipeline'
  | 'samplesheet'
  | 'input_fastq'
  | 'qc_step'
  | 'trim_reads'
  | 'generate_report'
  | 'output_results'
  | 'run_profile'
  | 'parameter_setting'
  // ─ FASTQ Basics (Phase 0 stretch) ─
  | 'paired_validator'
  | 'adapter_detector'
  | 'read_length_checker'
  // ─ RNA-seq Full Pipeline (Phase 1) ─
  | 'genome_index'
  | 'read_aligner'
  | 'bam_sorter'
  | 'bam_indexer'
  | 'feature_counter'
  | 'deseq2'
  | 'volcano_plot'
  | 'pathway_analysis'
  // ─ Variant Calling (Phase 2) ─
  | 'reference_genome'
  | 'bwa_aligner'
  | 'mark_duplicates'
  | 'base_recalibrator'
  | 'variant_caller'
  | 'genotype_gvcf'
  | 'variant_filter'
  | 'vcf_annotator'
  // ─ Metagenomics (Phase 2) ─
  | 'host_removal'
  | 'kraken2'
  | 'bracken'
  | 'krona_viz'
  | 'metaphlan'
  | 'humann'
  // ─ Single Cell (Phase 2) ─
  | 'cell_demux'
  | 'cellranger'
  | 'seurat_qc'
  | 'normalization'
  | 'dim_reduction'
  | 'clustering'
  | 'marker_genes'
  // ─ nf-core Tools (Phase 1–3) ─
  | 'channel_creator'
  | 'subworkflow_block'
  | 'module_creator'
  | 'pipeline_linter'
  | 'test_data_fetcher'
  // ─ ChIP-seq / nf-core/chipseq (Phase 8) ─
  | 'chipseq_samplesheet'
  | 'chipseq_fastqc'
  | 'chipseq_trim'
  | 'peak_calling'
  | 'peak_annotation'
  | 'consensus_peaks'
  | 'chipseq_report'
  // ─ Data Download / nf-core/fetchngs (Phase 8) ─
  | 'sra_ids_input'
  | 'download_reads'
  | 'generate_samplesheet'
  | 'fetchngs_report'
  // ─ Amplicon / nf-core/ampliseq (Phase 8) ─
  | 'ampliseq_samplesheet'
  | 'primer_removal'
  | 'asv_inference'
  | 'taxonomy_classify'
  | 'diversity_analysis'
  | 'ampliseq_report'
  // ─ Methylation / nf-core/methylseq (Phase 8) ─
  | 'methylseq_samplesheet'
  | 'bismark_align'
  | 'methylation_extract'
  | 'methylation_report'
  // ─ Differential Abundance / nf-core/differentialabundance (Phase 8) ─
  | 'count_matrix_input'
  | 'sample_sheet_de'
  | 'deseq2_de'
  | 'volcano_de'
  | 'heatmap_de'
  | 'pathway_de'
  | 'de_report'
  // ─ Spatial Transcriptomics / nf-core/spatialvi (Phase 8) ─
  | 'visium_samplesheet'
  | 'spaceranger_count'
  | 'spatial_qc'
  | 'spatial_normalization'
  | 'spatial_clustering'
  | 'spatial_visualization'
  | 'spatialvi_report'

export type DataType =
  | 'pipeline_context'
  | 'sample_records'
  | 'fastq_reads'
  | 'qc_output'
  | 'trimmed_reads'
  | 'report_data'
  | 'final_output'

export interface Port {
  id: string
  label: string
  dataType: DataType
}

export interface BlockDefinition {
  type: BlockType
  displayName: string
  technicalConcept: string
  description: string
  technicalDetail: string
  category: 'pipeline' | 'data' | 'analysis' | 'output'
  icon: string
  inputPorts: Port[]
  outputPorts: Port[]
  commonMistake: string
  exampleOutput: string
  nfCoreDocsLink?: string
  // Pack metadata
  pack: PackId
  status: BlockStatus
  executionMode: ExecutionMode
  realToolExamples?: string[]
}

// ─── Canvas Node / Edge ──────────────────────────────────────────────────────

export interface PipelineNodeData extends Record<string, unknown> {
  blockType: BlockType
  config: Record<string, unknown>
  hasError: boolean
  errorMessage?: string
}

export type PipelineNode = Node<PipelineNodeData>

export interface PipelineEdgeData extends Record<string, unknown> {
  dataType: DataType
  label: string
}

export type PipelineEdge = Edge<PipelineEdgeData>

// ─── Workflow IR ─────────────────────────────────────────────────────────────

export interface IRBlock {
  id: string
  type: BlockType
  config: Record<string, unknown>
}

export interface IREdge {
  from: string
  to: string
  dataType: DataType
}

export interface WorkflowIR {
  schema_version: '0.1'
  project_id: string
  name: string
  execution_mode: 'simulated'
  blocks: IRBlock[]
  edges: IREdge[]
}

// ─── Validation ──────────────────────────────────────────────────────────────

export type ValidationErrorCode =
  | 'MISSING_START'
  | 'DUPLICATE_START'
  | 'MISSING_OUTPUT'
  | 'DISCONNECTED_BLOCK'
  | 'INVALID_CONNECTION'
  | 'CYCLE_DETECTED'

export interface ValidationError {
  blockId: string | null
  code: ValidationErrorCode
  message: string
  fix: string
}

export interface ValidationWarning {
  blockId: string | null
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export interface TraceEntry {
  step: number
  blockId: string
  blockType: BlockType
  message: string
  status: 'success' | 'warning' | 'error'
  details?: string
}

export interface SampleResult {
  name: string
  readCount: number
  qualityStatus: 'pass' | 'warn'
  message: string
}

export interface ReportCard {
  title: string
  status: 'pass' | 'warn' | 'fail'
  summary: string
  samples: SampleResult[]
  generatedAt: string
}

export interface SimulationResult {
  status: 'completed' | 'failed' | 'blocked'
  trace: TraceEntry[]
  reportCard: ReportCard | null
  generatedCommand: string | null
}

// ─── Mission ─────────────────────────────────────────────────────────────────

export interface MissionStep {
  id: string
  instruction: string
  hint: string
}

export interface Mission {
  id: string
  title: string
  description: string
  steps: MissionStep[]
  requiredBlockTypes: BlockType[]
  completionCondition: 'simulation_success'
}

export interface MissionState {
  currentStepIndex: number
  completedStepIds: string[]
  completed: boolean
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

export interface SampleRow {
  sample: string
  fastq_1: string
  fastq_2: string
  strandedness: 'auto' | 'forward' | 'reverse' | 'unstranded'
}
