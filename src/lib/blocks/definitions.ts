import type { BlockDefinition, BlockType, DataType } from '@/types'

// ─── DataType Compatibility Matrix ───────────────────────────────────────────
// Maps each source DataType to the target DataTypes it may connect to.
// Used by PipelineCanvas.isValidConnection and the validator.

// Each output port carries a DataType. A valid connection requires the target
// input port to declare the SAME DataType. The matrix maps each type to itself
// (identity) because both ends of a wire carry the same data.
//
// The only multi-entry rows are types that can flow into MULTIPLE input types —
// none exist here; all connections are 1-to-1 by type.
export const DATA_TYPE_COMPATIBILITY: Record<DataType, DataType[]> = {
  pipeline_context: ['pipeline_context'],
  sample_records:   ['sample_records'],
  fastq_reads:      ['fastq_reads'],
  qc_output:        ['qc_output'],
  trimmed_reads:    ['trimmed_reads'],
  report_data:      ['report_data'],
  final_output:     [],
}

// ─── Block Definitions ───────────────────────────────────────────────────────

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  start_pipeline: {
    type: 'start_pipeline',
    displayName: 'Start Pipeline',
    technicalConcept: 'Workflow entry point',
    description:
      'This is where your pipeline begins. Every pipeline needs exactly one starting block.',
    technicalDetail:
      'In Nextflow, a workflow block defines the entry point of the DSL2 pipeline. ' +
      'This block initialises the pipeline context and triggers downstream processes.',
    category: 'pipeline',
    icon: '🚀',
    inputPorts: [],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake:
      'Adding more than one Start Pipeline block. Only one is allowed per pipeline.',
    exampleOutput: 'Initialises the pipeline and passes context to the next block.',
    nfCoreDocsLink: 'https://nf-co.re/docs/specifications/pipelines/overview',
  },

  samplesheet: {
    type: 'samplesheet',
    displayName: 'Samplesheet',
    technicalConcept: 'Pipeline input samplesheet / params.input',
    description:
      'This table tells the pipeline which files belong to each sample. ' +
      'Each row is one biological sample with its sequencing files.',
    technicalDetail:
      'nf-core pipelines accept input via a CSV samplesheet referenced by --input. ' +
      'Required columns vary by pipeline; RNA-seq needs sample, fastq_1, fastq_2, strandedness.',
    category: 'data',
    icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake:
      'Leaving fastq_2 empty for paired-end data. Both R1 and R2 files are required.',
    exampleOutput: 'A validated list of sample records ready for processing.',
    nfCoreDocsLink: 'https://nf-co.re/docs/running/run-pipelines',
  },

  input_fastq: {
    type: 'input_fastq',
    displayName: 'Input FASTQ',
    technicalConcept: 'FASTQ input channel / paired-end reads',
    description:
      'These are raw sequencing read files from a sequencing machine. ' +
      'Each sample produces two files (R1 and R2) in paired-end mode.',
    technicalDetail:
      'Nextflow channels carry file paths between processes. FASTQ files are emitted as ' +
      'tuples of [meta, fastq_1, fastq_2] for paired-end libraries.',
    category: 'data',
    icon: '🧬',
    inputPorts: [{ id: 'in-samples', label: 'Sample records', dataType: 'sample_records' }],
    outputPorts: [{ id: 'out-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    commonMistake:
      'Connecting this block before the Samplesheet block. The samplesheet must come first.',
    exampleOutput: 'Paired-end FASTQ read files for each sample, ready for analysis.',
  },

  qc_step: {
    type: 'qc_step',
    displayName: 'QC Step',
    technicalConcept: 'Quality-control process / module concept (e.g. FastQC)',
    description:
      'This checks whether your sequencing reads look healthy. ' +
      'It measures read quality, length, and common sequencing issues.',
    technicalDetail:
      'nf-core modules wrap tools like FastQC into reusable process definitions. ' +
      'Quality metrics are emitted as report files consumed by MultiQC.',
    category: 'analysis',
    icon: '🔬',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-qc', label: 'QC output', dataType: 'qc_output' }],
    commonMistake:
      'Skipping this step. QC should always run before downstream analysis.',
    exampleOutput: 'A QC report showing read quality scores, length distribution, and GC content.',
    nfCoreDocsLink: 'https://nf-co.re/docs/specifications/components/overview',
  },

  trim_reads: {
    type: 'trim_reads',
    displayName: 'Trim Reads',
    technicalConcept: 'Read preprocessing process / module concept (e.g. Trimmomatic, fastp)',
    description:
      'This removes low-quality parts from reads before later analysis. ' +
      'Trimming improves the reliability of downstream results.',
    technicalDetail:
      'Preprocessing modules trim adapter sequences and low-quality bases. ' +
      'fastp and Trimmomatic are common nf-core module wrappers for this step.',
    category: 'analysis',
    icon: '✂️',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-trimmed', label: 'Trimmed reads', dataType: 'trimmed_reads' }],
    commonMistake:
      'Placing Trim Reads after QC Step. Trimming should happen before or alongside QC, not after.',
    exampleOutput: 'Cleaned FASTQ files with adapter sequences and low-quality bases removed.',
  },

  generate_report: {
    type: 'generate_report',
    displayName: 'Generate Report',
    technicalConcept: 'Report aggregation / MultiQC-like summary step',
    description:
      'This gathers results from earlier steps into a readable summary report. ' +
      'You can see quality metrics for all samples in one place.',
    technicalDetail:
      'MultiQC aggregates QC outputs from many tools into a single HTML report. ' +
      'In nf-core pipelines, a MULTIQC module is typically the final reporting step.',
    category: 'output',
    icon: '📊',
    inputPorts: [
      { id: 'in-qc', label: 'QC output', dataType: 'qc_output' },
      { id: 'in-trimmed', label: 'Trimmed reads (optional)', dataType: 'trimmed_reads' },
    ],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake:
      'Not connecting any input to Generate Report. It needs at least one QC or analysis output.',
    exampleOutput: 'An HTML summary report showing quality metrics for every sample.',
    nfCoreDocsLink: 'https://nf-co.re/docs/specifications/components/overview',
  },

  output_results: {
    type: 'output_results',
    displayName: 'Output Results',
    technicalConcept: 'Output directory / publishDir directive',
    description:
      'This is where your final results appear. ' +
      'All files saved here are the deliverables from your pipeline run.',
    technicalDetail:
      "Nextflow's publishDir directive copies or links process outputs to a final results folder. " +
      'nf-core pipelines use --outdir to set this path.',
    category: 'output',
    icon: '📁',
    inputPorts: [{ id: 'in-report', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [],
    commonMistake:
      'Forgetting to connect Generate Report before Output Results. The report block must come first.',
    exampleOutput: 'Final QC report and result files saved to the output directory.',
    nfCoreDocsLink: 'https://nf-co.re/docs/running/run-pipelines',
  },
}

export const ALL_BLOCK_TYPES: BlockType[] = Object.keys(BLOCK_DEFINITIONS) as BlockType[]
