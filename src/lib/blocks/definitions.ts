import type { BlockDefinition, BlockType, DataType, PackId } from '@/types'

// ─── DataType Compatibility Matrix ───────────────────────────────────────────
// Both ends of a valid connection carry the same DataType (identity mapping).

export const DATA_TYPE_COMPATIBILITY: Record<DataType, DataType[]> = {
  pipeline_context: ['pipeline_context'],
  sample_records:   ['sample_records'],
  fastq_reads:      ['fastq_reads'],
  qc_output:        ['qc_output'],
  trimmed_reads:    ['trimmed_reads'],
  report_data:      ['report_data'],
  final_output:     [],
}

// ─── Pack metadata ────────────────────────────────────────────────────────────

export interface PackMeta {
  id: PackId
  name: string
  description: string
  icon: string
  color: string
  phase: number
  available: boolean
  /** The nf-core pipeline this pack teaches */
  pipeline: string
  pipelineUrl: string
}

export const PACKS: PackMeta[] = [
  {
    id: 'rnaseq_qc',
    name: 'RNA-seq QC',
    description: 'Learn the QC and preprocessing steps of nf-core/rnaseq — samplesheets, FASTQC, trimming, and MultiQC reporting.',
    icon: '🧬',
    color: 'oklch(52% 0.22 152)',
    phase: 0,
    available: true,
    pipeline: 'nf-core/rnaseq',
    pipelineUrl: 'https://nf-co.re/rnaseq',
  },
  {
    id: 'fastq_basics',
    name: 'FASTQ Basics',
    description: 'Understand the raw sequencing data that flows through every nf-core pipeline — paired-end reads, adapter contamination, and nf-core input conventions.',
    icon: '📄',
    color: 'oklch(58% 0.20 212)',
    phase: 0,
    available: true,
    pipeline: 'nf-core (all pipelines)',
    pipelineUrl: 'https://nf-co.re/docs/running/run-pipelines',
  },
  {
    id: 'rnaseq_full',
    name: 'nf-core/rnaseq Full',
    description: 'The complete nf-core/rnaseq workflow: STAR alignment, featureCounts, and differential abundance with nf-core/differentialabundance.',
    icon: '🔬',
    color: 'oklch(50% 0.25 302)',
    phase: 1,
    available: false,
    pipeline: 'nf-core/rnaseq',
    pipelineUrl: 'https://nf-co.re/rnaseq',
  },
  {
    id: 'variant_calling',
    name: 'nf-core/sarek',
    description: 'Learn the nf-core/sarek germline variant calling workflow: BWAMEM2 alignment, GATK4 best-practices, and VEP annotation.',
    icon: '🧪',
    color: 'oklch(52% 0.20 232)',
    phase: 2,
    available: false,
    pipeline: 'nf-core/sarek',
    pipelineUrl: 'https://nf-co.re/sarek',
  },
  {
    id: 'metagenomics',
    name: 'nf-core/taxprofiler',
    description: 'Learn the nf-core/taxprofiler pipeline: host removal, Kraken2 + Bracken classification, MetaPhlAn profiling, and Krona visualisation.',
    icon: '🦠',
    color: 'oklch(50% 0.22 258)',
    phase: 2,
    available: false,
    pipeline: 'nf-core/taxprofiler',
    pipelineUrl: 'https://nf-co.re/taxprofiler',
  },
  {
    id: 'single_cell',
    name: 'nf-core/scrnaseq',
    description: 'Learn the nf-core/scrnaseq pipeline: Cell Ranger demultiplexing, Seurat QC, normalisation, UMAP, clustering, and marker genes.',
    icon: '🔴',
    color: 'oklch(50% 0.25 15)',
    phase: 2,
    available: false,
    pipeline: 'nf-core/scrnaseq',
    pipelineUrl: 'https://nf-co.re/scrnaseq',
  },
  {
    id: 'nfcore_tools',
    name: 'nf-core/tools',
    description: 'Learn the nf-core/tools CLI: create modules with `nf-core modules create`, lint pipelines with `nf-core lint`, and contribute to the nf-core community.',
    icon: '🛠️',
    color: 'oklch(52% 0.18 85)',
    phase: 3,
    available: false,
    pipeline: 'nf-core/tools',
    pipelineUrl: 'https://nf-co.re/docs/nf-core-tools',
  },
  // ─── Phase 8 packs ───────────────────────────────────────────────────────────
  {
    id: 'chipseq',
    name: 'nf-core/chipseq',
    description: 'ChIP-seq and ATAC-seq analysis — alignment, peak calling with MACS3, peak annotation with HOMER, and differential binding.',
    icon: '🧲',
    color: 'oklch(50% 0.22 20)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/chipseq',
    pipelineUrl: 'https://nf-co.re/chipseq',
  },
  {
    id: 'fetchngs',
    name: 'nf-core/fetchngs',
    description: 'Download raw sequencing data from SRA, ENA, DDBJ, or GEO using sample accessions — and automatically generate a ready-to-use nf-core samplesheet.',
    icon: '⬇️',
    color: 'oklch(55% 0.20 170)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/fetchngs',
    pipelineUrl: 'https://nf-co.re/fetchngs',
  },
  {
    id: 'ampliseq',
    name: 'nf-core/ampliseq',
    description: 'Amplicon sequencing analysis — 16S, 18S, ITS, and CO1 microbial community profiling with DADA2 ASV inference and QIIME2 taxonomic classification.',
    icon: '🔁',
    color: 'oklch(52% 0.20 140)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/ampliseq',
    pipelineUrl: 'https://nf-co.re/ampliseq',
  },
  {
    id: 'methylseq',
    name: 'nf-core/methylseq',
    description: 'Bisulfite sequencing methylation analysis — Bismark or bwa-meth alignment, methylation extraction, and differential methylation reporting.',
    icon: '🧬',
    color: 'oklch(50% 0.22 310)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/methylseq',
    pipelineUrl: 'https://nf-co.re/methylseq',
  },
  {
    id: 'differentialabundance',
    name: 'nf-core/differentialabundance',
    description: 'Standalone differential expression and abundance analysis — takes count matrices from nf-core/rnaseq and runs DESeq2, volcano plots, heatmaps, and pathway enrichment.',
    icon: '📈',
    color: 'oklch(52% 0.22 270)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/differentialabundance',
    pipelineUrl: 'https://nf-co.re/differentialabundance',
  },
  {
    id: 'spatialvi',
    name: 'nf-core/spatialvi',
    description: '10x Genomics Visium spatial transcriptomics — Space Ranger alignment, spatial QC, normalisation, clustering, and spatially variable gene detection.',
    icon: '🗺️',
    color: 'oklch(52% 0.20 195)',
    phase: 8,
    available: false,
    pipeline: 'nf-core/spatialvi',
    pipelineUrl: 'https://nf-co.re/spatialvi',
  },
]

// ─── Block Definitions ────────────────────────────────────────────────────────

const B = (def: BlockDefinition): BlockDefinition => def

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: RNA-seq QC  (Phase 0 — available)
  // ════════════════════════════════════════════════════════════════════════════

  start_pipeline: B({
    type: 'start_pipeline',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Start Pipeline',
    technicalConcept: '`workflow {}` entry point — nf-core/rnaseq main.nf',
    description: 'This is where your pipeline begins. Every nf-core pipeline has exactly one workflow entry point.',
    technicalDetail:
      'In Nextflow DSL2, the top-level `workflow {}` block in `main.nf` defines the pipeline entry point. ' +
      'nf-core/rnaseq\'s `main.nf` calls the RNASEQ workflow, which in turn calls subworkflows like ' +
      'FASTQ_FASTQC_UMITOOLS_TRIMGALORE and ALIGN_STAR.',
    category: 'pipeline', icon: '🚀',
    inputPorts: [],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake: 'Adding more than one Start Pipeline block. nf-core pipelines have a single workflow entry point.',
    exampleOutput: 'Pipeline context initialised — equivalent to `nextflow run nf-core/rnaseq` starting.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq',
    realToolExamples: ['nf-core/rnaseq main.nf'],
  }),

  samplesheet: B({
    type: 'samplesheet',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Samplesheet',
    technicalConcept: '`--input` samplesheet / `SAMPLESHEET_CHECK` subworkflow — nf-core/rnaseq',
    description: 'This CSV table tells nf-core/rnaseq which files belong to each sample. Every nf-core pipeline that accepts sequencing data uses a samplesheet.',
    technicalDetail:
      'nf-core/rnaseq reads the samplesheet via `Channel.fromSamplesheet(params.input)` using the `SAMPLESHEET_CHECK` subworkflow. ' +
      'Required columns: `sample`, `fastq_1`, `fastq_2`, `strandedness`. ' +
      'The schema is defined in `assets/schema_input.json` and validated at startup.',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Leaving `fastq_2` empty for paired-end data. nf-core/rnaseq will fail validation if `fastq_2` is missing for paired-end samples.',
    exampleOutput: 'Validated sample channel emitted to the FASTQ input step — equivalent to `SAMPLESHEET_CHECK` passing.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/docs/usage#samplesheet-input',
    realToolExamples: ['SAMPLESHEET_CHECK (nf-core subworkflow)', 'nf-validation plugin'],
  }),

  input_fastq: B({
    type: 'input_fastq',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Input FASTQ',
    technicalConcept: '`Channel.fromSamplesheet()` FASTQ channel — nf-core/rnaseq',
    description: 'These are the raw sequencing read files. nf-core/rnaseq loads them from the samplesheet as paired-end FASTQ tuples.',
    technicalDetail:
      'nf-core/rnaseq emits FASTQ files as `[meta, fastq_1, fastq_2]` tuples via `Channel.fromSamplesheet()`. ' +
      'The `meta` map carries sample metadata (id, single_end, strandedness) through all downstream processes. ' +
      'This is the standard nf-core channel convention used across modules.',
    category: 'data', icon: '🧬',
    inputPorts: [{ id: 'in-samples', label: 'Sample records', dataType: 'sample_records' }],
    outputPorts: [{ id: 'out-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    commonMistake: 'Connecting Input FASTQ before the Samplesheet block. The samplesheet validation must run first.',
    exampleOutput: 'FASTQ read tuples `[meta, reads_1, reads_2]` flowing into QC and alignment processes.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/docs/usage',
    realToolExamples: ['Channel.fromSamplesheet()', 'nf-validation'],
  }),

  qc_step: B({
    type: 'qc_step',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'QC Step',
    technicalConcept: '`FASTQC` nf-core module — nf-core/rnaseq QC subworkflow',
    description: 'Checks whether your sequencing reads look healthy. nf-core/rnaseq runs FASTQC on every sample before trimming.',
    technicalDetail:
      'nf-core/rnaseq calls the `FASTQC` module (from nf-core/modules) inside the ' +
      '`FASTQ_FASTQC_UMITOOLS_TRIMGALORE` subworkflow. ' +
      'FASTQC generates per-sample HTML reports covering per-base quality scores, GC content, ' +
      'sequence duplication, and adapter contamination. These are later aggregated by MULTIQC.',
    category: 'analysis', icon: '🔬',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-qc', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Skipping QC before alignment. nf-core/rnaseq always runs FASTQC before and after trimming.',
    exampleOutput: 'Per-sample FASTQC HTML reports and ZIP files — inputs to the MULTIQC step.',
    nfCoreDocsLink: 'https://nf-co.re/modules/fastqc',
    realToolExamples: ['FASTQC (nf-core/modules)', 'nf-core/rnaseq FASTQ_FASTQC_UMITOOLS_TRIMGALORE'],
  }),

  trim_reads: B({
    type: 'trim_reads',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Trim Reads',
    technicalConcept: '`TRIMGALORE` or `FASTP` nf-core module — nf-core/rnaseq preprocessing',
    description: 'Removes adapter sequences and low-quality bases before alignment. nf-core/rnaseq uses TrimGalore by default.',
    technicalDetail:
      'nf-core/rnaseq trims reads using the `TRIMGALORE` module (wrapping Trim Galore + Cutadapt). ' +
      'Alternatively, `--trimmer fastp` switches to the `FASTP` module. ' +
      'Both modules are in nf-core/modules and follow the standard `[meta, reads]` input convention. ' +
      'Trimming is optional but enabled by default via `params.skip_trimming = false`.',
    category: 'analysis', icon: '✂️',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-trimmed', label: 'Trimmed reads', dataType: 'trimmed_reads' }],
    commonMistake: 'Using `--skip_trimming` without understanding the consequences. Adapter contamination causes misaligned reads.',
    exampleOutput: 'Trimmed FASTQ files and a TrimGalore report — both fed into the MULTIQC module.',
    nfCoreDocsLink: 'https://nf-co.re/modules/trimgalore',
    realToolExamples: ['TRIMGALORE (nf-core/modules)', 'FASTP (nf-core/modules)'],
  }),

  generate_report: B({
    type: 'generate_report',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Generate Report',
    technicalConcept: '`MULTIQC` nf-core module — nf-core/rnaseq summary step',
    description: 'Collects QC outputs from all steps into one readable HTML report. nf-core/rnaseq always ends with a MultiQC report.',
    technicalDetail:
      'The `MULTIQC` module (nf-core/modules) aggregates outputs from FASTQC, TrimGalore, STAR, and other tools ' +
      'into a single interactive HTML report. nf-core/rnaseq passes all QC channels into MULTIQC via ' +
      'the `ch_multiqc_files` channel. The report is published to `results/multiqc/`.',
    category: 'output', icon: '📊',
    inputPorts: [
      { id: 'in-qc', label: 'QC output', dataType: 'qc_output' },
      { id: 'in-trimmed', label: 'Trimmed reads (optional)', dataType: 'trimmed_reads' },
    ],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not connecting any QC output. MULTIQC needs at least one report file to generate a summary.',
    exampleOutput: 'An interactive HTML report at `results/multiqc/multiqc_report.html` — the standard nf-core output.',
    nfCoreDocsLink: 'https://nf-co.re/modules/multiqc',
    realToolExamples: ['MULTIQC (nf-core/modules)'],
  }),

  output_results: B({
    type: 'output_results',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'simulated',
    displayName: 'Output Results',
    technicalConcept: '`publishDir` directive / `--outdir` parameter — nf-core/rnaseq',
    description: 'This is where all final results appear. nf-core pipelines use the `--outdir` parameter to control where results are saved.',
    technicalDetail:
      'Every nf-core module uses the `publishDir` directive to copy outputs to `params.outdir`. ' +
      'nf-core/rnaseq organises results into subdirectories: `results/fastqc/`, `results/trimgalore/`, ' +
      '`results/star_salmon/`, `results/multiqc/`. ' +
      'Pass `--outdir my_results` on the command line to change the destination.',
    category: 'output', icon: '📁',
    inputPorts: [{ id: 'in-report', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [],
    commonMistake: 'Forgetting `--outdir`. Without it, nf-core/rnaseq writes to `./results` by default.',
    exampleOutput: 'Published results in `results/` — equivalent to `nextflow run nf-core/rnaseq --outdir results` completing.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/docs/output',
    realToolExamples: ['publishDir (Nextflow directive)', 'nf-core/rnaseq --outdir'],
  }),

  run_profile: B({
    type: 'run_profile',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'command_generation',
    displayName: 'Run Profile',
    technicalConcept: '`-profile` flag — nf-core/rnaseq execution environment',
    description: "Selects where and how the pipeline runs. nf-core pipelines ship with `docker`, `singularity`, `conda`, and `test` profiles.",
    technicalDetail:
      'nf-core pipelines define profiles in `nextflow.config`. The `-profile docker` flag tells Nextflow to ' +
      'pull and use container images for every process. `-profile test` runs the pipeline with a tiny built-in ' +
      'test dataset to verify setup. Profiles can be combined: `-profile test,docker`. ' +
      'On HPC clusters, institutional profiles (e.g. `-profile uppmax`) configure SLURM/PBS settings.',
    category: 'pipeline', icon: '⚙️',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake: 'Running without a container profile on a system without local tool installations. Always use `-profile docker` or `-profile singularity` on nf-core pipelines.',
    exampleOutput: 'Profile appended to the generated `nextflow run nf-core/rnaseq -profile docker` command.',
    nfCoreDocsLink: 'https://nf-co.re/docs/running/configuration',
    realToolExamples: ['-profile docker', '-profile singularity', '-profile test', 'nf-core/configs'],
  }),

  parameter_setting: B({
    type: 'parameter_setting',
    pack: 'rnaseq_qc', status: 'available', executionMode: 'command_generation',
    displayName: 'Parameter Setting',
    technicalConcept: '`params` / `nextflow_schema.json` — nf-core/rnaseq parameters',
    description: "A setting that changes how nf-core/rnaseq behaves — like choosing a reference genome or turning off a step.",
    technicalDetail:
      'nf-core pipelines define all parameters in `nextflow_schema.json`, which drives both ' +
      'CLI validation and the nf-core launch GUI. Common nf-core/rnaseq params: ' +
      '`--genome GRCh38`, `--aligner star_salmon`, `--skip_trimming`, `--skip_multiqc`. ' +
      'Parameters are passed as `--param value` flags in the `nextflow run` command.',
    category: 'pipeline', icon: '🔧',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake: 'Confusing `--genome` (a param) with `-profile` (an execution environment). They are different flags.',
    exampleOutput: 'Parameter appended to the generated `nextflow run nf-core/rnaseq --genome GRCh38` command.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/parameters',
    realToolExamples: ['nextflow_schema.json', 'nf-core launch', 'nf-core/rnaseq --genome'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: FASTQ Basics  (Phase 0 stretch — available)
  // ════════════════════════════════════════════════════════════════════════════

  paired_validator: B({
    type: 'paired_validator',
    pack: 'fastq_basics', status: 'available', executionMode: 'simulated',
    displayName: 'Paired-end Validator',
    technicalConcept: '`SAMPLESHEET_CHECK` subworkflow / nf-validation — all nf-core pipelines',
    description: 'Checks that every sample in the nf-core samplesheet has matching R1 and R2 files before the pipeline starts.',
    technicalDetail:
      'Every nf-core pipeline that accepts FASTQ input validates its samplesheet using the `SAMPLESHEET_CHECK` subworkflow ' +
      'or the `nf-validation` plugin. It checks for required columns, valid file extensions, and consistent ' +
      'paired-end/single-end flags. Errors are reported before any compute resources are consumed.',
    category: 'data', icon: '🔗',
    inputPorts: [{ id: 'in-samples', label: 'Sample records', dataType: 'sample_records' }],
    outputPorts: [{ id: 'out-samples', label: 'Validated samples', dataType: 'sample_records' }],
    commonMistake: 'Mixing single-end and paired-end rows in the same samplesheet without the correct `single_end` column value.',
    exampleOutput: 'Validated sample channel — equivalent to `SAMPLESHEET_CHECK` passing with exit code 0.',
    nfCoreDocsLink: 'https://nf-co.re/docs/running/run-pipelines',
    realToolExamples: ['SAMPLESHEET_CHECK (nf-core subworkflow)', 'nf-validation plugin', '`nf-core schema validate`'],
  }),

  adapter_detector: B({
    type: 'adapter_detector',
    pack: 'fastq_basics', status: 'available', executionMode: 'simulated',
    displayName: 'Adapter Detector',
    technicalConcept: '`FASTQC` adapter report / `FASTP` auto-detection — nf-core/rnaseq',
    description: 'Detects sequencing adapter sequences in raw reads. nf-core/rnaseq uses FASTQC and TrimGalore for this.',
    technicalDetail:
      'The `FASTQC` module reports adapter contamination in its HTML output under the "Adapter Content" section. ' +
      'The `FASTP` and `TRIMGALORE` nf-core modules can auto-detect and remove adapters without requiring the ' +
      'adapter sequence to be specified manually. Detected adapters are summarised in the MULTIQC report.',
    category: 'analysis', icon: '🔎',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-reads', label: 'Flagged reads', dataType: 'fastq_reads' }],
    commonMistake: 'Skipping adapter removal. nf-core/rnaseq runs TrimGalore by default — do not disable it without a good reason.',
    exampleOutput: 'FASTQC adapter contamination report and auto-trimmed FASTQ files.',
    nfCoreDocsLink: 'https://nf-co.re/modules/fastqc',
    realToolExamples: ['FASTQC (nf-core/modules)', 'FASTP (nf-core/modules)', 'TRIMGALORE (nf-core/modules)'],
  }),

  read_length_checker: B({
    type: 'read_length_checker',
    pack: 'fastq_basics', status: 'available', executionMode: 'simulated',
    displayName: 'Read Length Checker',
    technicalConcept: '`FASTQC` sequence length distribution — nf-core module QC metric',
    description: 'Verifies that all reads have the expected length. The FASTQC nf-core module reports this automatically.',
    technicalDetail:
      'The `FASTQC` nf-core module generates a "Sequence Length Distribution" section in its report. ' +
      'nf-core/rnaseq aggregates this per-sample metric in the MULTIQC summary. ' +
      'Variable read lengths after trimming are normal; before trimming they may indicate a library prep problem.',
    category: 'analysis', icon: '📏',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-qc', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Treating variable post-trim lengths as an error. TrimGalore produces variable lengths by design.',
    exampleOutput: 'Read length histogram in the FASTQC HTML report — aggregated by MULTIQC.',
    nfCoreDocsLink: 'https://nf-co.re/modules/fastqc',
    realToolExamples: ['FASTQC (nf-core/modules)', 'MULTIQC (nf-core/modules)'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: RNA-seq Full Pipeline  (Phase 1 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/rnaseq Full  (Phase 1 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  genome_index: B({
    type: 'genome_index',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Genome Index',
    technicalConcept: '`STAR_GENOMEGENERATE` or `HISAT2_BUILD` nf-core module — nf-core/rnaseq',
    description: 'Builds a searchable index of the reference genome. nf-core/rnaseq runs this step automatically when you specify `--genome`.',
    technicalDetail:
      'nf-core/rnaseq calls `STAR_GENOMEGENERATE` (from nf-core/modules) or `HISAT2_BUILD` depending on `--aligner`. ' +
      'When using `--genome GRCh38`, nf-core/rnaseq downloads the FASTA and GTF from AWS iGenomes and builds the index automatically. ' +
      'The index is cached in `--igenomes_base` for reuse across runs.',
    category: 'data', icon: '📚',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-context', label: 'Indexed genome', dataType: 'pipeline_context' }],
    commonMistake: 'Building an index from a FASTA file that does not match the GTF annotation version.',
    exampleOutput: 'STAR genome directory or HISAT2 index files cached for downstream alignment.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/parameters#genome',
    realToolExamples: ['STAR_GENOMEGENERATE (nf-core/modules)', 'HISAT2_BUILD (nf-core/modules)', 'nf-core/rnaseq --genome GRCh38'],
  }),

  read_aligner: B({
    type: 'read_aligner',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Read Aligner',
    technicalConcept: '`STAR_ALIGN` or `HISAT2_ALIGN` nf-core module — nf-core/rnaseq',
    description: 'Maps trimmed reads to the reference genome. nf-core/rnaseq uses STAR + Salmon by default.',
    technicalDetail:
      'nf-core/rnaseq runs `STAR_ALIGN` (nf-core/modules) in alignment mode, then quantifies with `SALMON_QUANT`. ' +
      'Setting `--aligner hisat2` switches to `HISAT2_ALIGN`. ' +
      'The splice-aware aligner handles exon-exon junction reads produced by RNA splicing. ' +
      'Output BAMs are published to `results/star_salmon/` by default.',
    category: 'analysis', icon: '🎯',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    commonMistake: 'Using `--aligner star_salmon` (default) on a non-model organism without a Salmon decoy genome.',
    exampleOutput: 'Coordinate-sorted BAMs in `results/star_salmon/` and Salmon quant directories.',
    nfCoreDocsLink: 'https://nf-co.re/rnaseq/parameters#aligner',
    realToolExamples: ['STAR_ALIGN (nf-core/modules)', 'SALMON_QUANT (nf-core/modules)', 'HISAT2_ALIGN (nf-core/modules)'],
  }),

  bam_sorter: B({
    type: 'bam_sorter',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'BAM Sorter',
    technicalConcept: '`SAMTOOLS_SORT` nf-core module — BAM_SORT_STATS_SAMTOOLS subworkflow',
    description: 'Sorts aligned reads by genome position. nf-core/rnaseq does this inside its `BAM_SORT_STATS_SAMTOOLS` subworkflow.',
    technicalDetail:
      'nf-core/rnaseq calls the `BAM_SORT_STATS_SAMTOOLS` subworkflow after alignment, which runs ' +
      '`SAMTOOLS_SORT`, `SAMTOOLS_INDEX`, and `SAMTOOLS_STATS` in sequence. ' +
      'All three are nf-core/modules wrappers. The subworkflow is reused across multiple nf-core pipelines.',
    category: 'analysis', icon: '🗂️',
    inputPorts: [{ id: 'in-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-bam', label: 'Sorted BAM', dataType: 'qc_output' }],
    commonMistake: 'Running SAMTOOLS_INDEX before SAMTOOLS_SORT. Coordinate sorting must come first.',
    exampleOutput: 'Coordinate-sorted BAMs and flagstat reports published to `results/star_salmon/`.',
    nfCoreDocsLink: 'https://nf-co.re/modules/samtools/sort',
    realToolExamples: ['SAMTOOLS_SORT (nf-core/modules)', 'BAM_SORT_STATS_SAMTOOLS (nf-core subworkflow)'],
  }),

  bam_indexer: B({
    type: 'bam_indexer',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'BAM Indexer',
    technicalConcept: '`SAMTOOLS_INDEX` nf-core module — BAM_SORT_STATS_SAMTOOLS subworkflow',
    description: 'Creates a .bai index alongside the BAM so genome browsers and downstream tools can access it efficiently.',
    technicalDetail:
      'The `SAMTOOLS_INDEX` nf-core module generates a `.bai` index file for coordinate-sorted BAMs. ' +
      'It runs as part of the `BAM_SORT_STATS_SAMTOOLS` subworkflow in nf-core/rnaseq. ' +
      'The index enables random access by genomic region without scanning the entire file.',
    category: 'analysis', icon: '🏷️',
    inputPorts: [{ id: 'in-bam', label: 'Sorted BAM', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-bam', label: 'Indexed BAM', dataType: 'qc_output' }],
    commonMistake: 'Trying to index an unsorted BAM. SAMTOOLS_INDEX requires coordinate-sorted input.',
    exampleOutput: 'A `.bai` index file alongside each sorted BAM.',
    nfCoreDocsLink: 'https://nf-co.re/modules/samtools/index',
    realToolExamples: ['SAMTOOLS_INDEX (nf-core/modules)', 'BAM_SORT_STATS_SAMTOOLS (nf-core subworkflow)'],
  }),

  feature_counter: B({
    type: 'feature_counter',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Feature Counter',
    technicalConcept: '`SALMON_QUANT` or `SUBREAD_FEATURECOUNTS` nf-core module — nf-core/rnaseq',
    description: 'Counts how many reads came from each gene. nf-core/rnaseq does this with Salmon quantification.',
    technicalDetail:
      'nf-core/rnaseq uses `SALMON_QUANT` (nf-core/modules) to quantify gene expression from STAR alignments. ' +
      'When using `--aligner hisat2`, it uses `SUBREAD_FEATURECOUNTS` instead. ' +
      'Counts are collated by `TXIMETA_TXIMPORT` into a gene-level count matrix used by nf-core/differentialabundance.',
    category: 'analysis', icon: '🔢',
    inputPorts: [{ id: 'in-bam', label: 'Indexed BAM', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-counts', label: 'Count matrix', dataType: 'report_data' }],
    commonMistake: 'Choosing the wrong strandedness. nf-core/rnaseq auto-detects strandedness via `RSeQC` — do not override unless you are certain.',
    exampleOutput: 'Gene-level count matrices published to `results/star_salmon/` for downstream DE analysis.',
    nfCoreDocsLink: 'https://nf-co.re/modules/salmon/quant',
    realToolExamples: ['SALMON_QUANT (nf-core/modules)', 'SUBREAD_FEATURECOUNTS (nf-core/modules)', 'TXIMETA_TXIMPORT'],
  }),

  deseq2: B({
    type: 'deseq2',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'DESeq2 Analysis',
    technicalConcept: '`DESEQ2_DIFFERENTIAL` nf-core module — nf-core/differentialabundance',
    description: 'Identifies genes expressed differently between sample groups. nf-core/differentialabundance wraps DESeq2 as a reusable nf-core module.',
    technicalDetail:
      'The `DESEQ2_DIFFERENTIAL` module (nf-core/modules) runs DESeq2 on the count matrix produced by nf-core/rnaseq. ' +
      'It is used by the standalone nf-core/differentialabundance pipeline, which accepts count matrices from nf-core/rnaseq directly. ' +
      'Output includes normalised counts, fold-change tables, and PCA plots.',
    category: 'analysis', icon: '📈',
    inputPorts: [{ id: 'in-counts', label: 'Count matrix', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-de', label: 'DE results', dataType: 'report_data' }],
    commonMistake: 'Running nf-core/rnaseq and nf-core/differentialabundance with different genome versions.',
    exampleOutput: 'Fold-change tables and normalised count matrices in `results/deseq2_differential/`.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance',
    realToolExamples: ['DESEQ2_DIFFERENTIAL (nf-core/modules)', 'nf-core/differentialabundance'],
  }),

  volcano_plot: B({
    type: 'volcano_plot',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Volcano Plot',
    technicalConcept: '`CUSTOM_VOLCANOPLOT` nf-core module — nf-core/differentialabundance',
    description: 'Visualises differential expression results as a volcano plot. Part of the nf-core/differentialabundance output.',
    technicalDetail:
      'The `CUSTOM_VOLCANOPLOT` nf-core module generates an interactive volcano plot from DESeq2 results. ' +
      'It is part of the nf-core/differentialabundance pipeline\'s reporting step, alongside PCA plots and heatmaps. ' +
      'Output is published to `results/plots/` as PNG and interactive HTML.',
    category: 'output', icon: '🌋',
    inputPorts: [{ id: 'in-de', label: 'DE results', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-plot', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Interpreting the volcano plot before checking PCA — batch effects cause misleading volcano patterns.',
    exampleOutput: 'Interactive HTML volcano plot in `results/plots/` from nf-core/differentialabundance.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['CUSTOM_VOLCANOPLOT (nf-core/modules)', 'nf-core/differentialabundance'],
  }),

  pathway_analysis: B({
    type: 'pathway_analysis',
    pack: 'rnaseq_full', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Pathway Analysis',
    technicalConcept: '`GPROFILER2_GOST` nf-core module — nf-core/differentialabundance',
    description: 'Finds enriched biological pathways in DE gene lists. nf-core/differentialabundance includes g:Profiler enrichment.',
    technicalDetail:
      'The `GPROFILER2_GOST` nf-core module runs gene set enrichment using the g:Profiler2 R package. ' +
      'It is part of nf-core/differentialabundance\'s reporting workflow and tests against GO, KEGG, and Reactome databases. ' +
      'Results are combined with the DESeq2 output in the final MultiQC report.',
    category: 'output', icon: '🗺️',
    inputPorts: [{ id: 'in-de', label: 'DE results', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-pathways', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Running pathway analysis on a list with fewer than 10 genes. Results will be unreliable.',
    exampleOutput: 'Enrichment tables and dot plots from g:Profiler, published to `results/gprofiler2/`.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['GPROFILER2_GOST (nf-core/modules)', 'nf-core/differentialabundance'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/sarek  (Phase 2 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  reference_genome: B({
    type: 'reference_genome',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Reference Genome',
    technicalConcept: '`--genome` parameter / AWS iGenomes — nf-core/sarek',
    description: 'The reference FASTA that every read is compared against. nf-core/sarek downloads it from iGenomes when you pass `--genome GATK.GRCh38`.',
    technicalDetail:
      'nf-core/sarek uses `--genome GATK.GRCh38` (or GRCh37) to download and index the reference from the GATK resource bundle via AWS iGenomes. ' +
      'The reference is indexed automatically for BWA-MEM2, GATK, and other tools. ' +
      'All known variant VCFs (dbSNP, gnomAD) are also downloaded and passed to GATK modules.',
    category: 'data', icon: '🗺️',
    inputPorts: [],
    outputPorts: [{ id: 'out-ref', label: 'Reference data', dataType: 'pipeline_context' }],
    commonMistake: 'Mixing GRCh37 and GRCh38 resources. nf-core/sarek must use consistent reference versions across all GATK steps.',
    exampleOutput: 'Reference FASTA, BWA-MEM2 index, and known-sites VCFs downloaded and ready for nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/sarek/parameters#genome',
    realToolExamples: ['nf-core/sarek --genome GATK.GRCh38', 'AWS iGenomes', 'GATK resource bundle'],
  }),

  bwa_aligner: B({
    type: 'bwa_aligner',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'BWA-MEM2 Align',
    technicalConcept: '`BWAMEM2_MEM` nf-core module — nf-core/sarek alignment step',
    description: 'Aligns DNA reads to the reference genome. nf-core/sarek uses BWA-MEM2 by default for germline calling.',
    technicalDetail:
      'nf-core/sarek calls `BWAMEM2_MEM` (nf-core/modules) inside the `FASTQ_ALIGN_BWAMEM_MEM2_DRAGMAP_SENTIEON` subworkflow. ' +
      'BWA-MEM2 is an optimised version of BWA-MEM with 2× faster alignment on modern CPUs. ' +
      'Setting `--aligner dragmap` switches to the DRAGMap aligner for Illumina DRAGEN-compatible results.',
    category: 'analysis', icon: '🔍',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    commonMistake: 'Using STAR or HISAT2 for DNA variant calling. nf-core/sarek requires BWA-MEM2 or DRAGMap — not splice-aware aligners.',
    exampleOutput: 'Aligned BAMs in `results/preprocessing/` from nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/sarek/parameters#aligner',
    realToolExamples: ['BWAMEM2_MEM (nf-core/modules)', 'nf-core/sarek --aligner bwa-mem2'],
  }),

  mark_duplicates: B({
    type: 'mark_duplicates',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Mark Duplicates',
    technicalConcept: '`GATK4_MARKDUPLICATES` nf-core module — nf-core/sarek preprocessing',
    description: 'Flags PCR duplicate reads so GATK variant callers can ignore them. nf-core/sarek runs this step automatically.',
    technicalDetail:
      'nf-core/sarek calls `GATK4_MARKDUPLICATES` (nf-core/modules) in the `MARKDUPLICATES` subworkflow. ' +
      'Duplicates are flagged (not removed) by default. Metrics are collected and summarised in the MULTIQC report. ' +
      'nf-core/sarek then merges multi-lane BAMs before this step.',
    category: 'analysis', icon: '👥',
    inputPorts: [{ id: 'in-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-bam', label: 'Deduped BAM', dataType: 'qc_output' }],
    commonMistake: 'Skipping this step on amplicon panels. nf-core/sarek has `--skip_markduplicates` for targeted panels.',
    exampleOutput: 'Duplicate-marked BAMs and duplication metrics in `results/preprocessing/`.',
    nfCoreDocsLink: 'https://nf-co.re/modules/gatk4/markduplicates',
    realToolExamples: ['GATK4_MARKDUPLICATES (nf-core/modules)', 'nf-core/sarek preprocessing'],
  }),

  base_recalibrator: B({
    type: 'base_recalibrator',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Base Recalibrator',
    technicalConcept: '`GATK4_BASERECALIBRATOR` + `GATK4_APPLYBQSR` nf-core modules — nf-core/sarek BQSR',
    description: 'Corrects systematic base quality errors using known variant sites. A required GATK best-practices step in nf-core/sarek.',
    technicalDetail:
      'nf-core/sarek calls `GATK4_BASERECALIBRATOR` then `GATK4_APPLYBQSR` (both nf-core/modules) to implement GATK BQSR. ' +
      'Known variant sites (dbSNP, Mills indels) are provided automatically from the iGenomes reference bundle. ' +
      'The recalibrated BAMs are what gets passed to HaplotypeCaller.',
    category: 'analysis', icon: '🎚️',
    inputPorts: [{ id: 'in-bam', label: 'Deduped BAM', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-bam', label: 'Recalibrated BAM', dataType: 'qc_output' }],
    commonMistake: 'Using BQSR on a non-model organism without known variant databases. Use `--skip_bqsr` in that case.',
    exampleOutput: 'Recalibrated BAMs in `results/preprocessing/` ready for HaplotypeCaller.',
    nfCoreDocsLink: 'https://nf-co.re/modules/gatk4/baserecalibrator',
    realToolExamples: ['GATK4_BASERECALIBRATOR (nf-core/modules)', 'GATK4_APPLYBQSR (nf-core/modules)'],
  }),

  variant_caller: B({
    type: 'variant_caller',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Variant Caller',
    technicalConcept: '`GATK4_HAPLOTYPECALLER` nf-core module — nf-core/sarek variant calling',
    description: 'Identifies SNPs and INDELs in your sample. nf-core/sarek calls HaplotypeCaller in GVCF mode for joint genotyping.',
    technicalDetail:
      'nf-core/sarek calls `GATK4_HAPLOTYPECALLER` (nf-core/modules) in GVCF mode by default for germline calling. ' +
      'The tool can be switched to other callers (`--tools deepvariant`, `--tools strelka`) via the `--tools` parameter. ' +
      'For somatic calling, nf-core/sarek uses `GATK4_MUTECT2` with a matched normal sample.',
    category: 'analysis', icon: '🧫',
    inputPorts: [{ id: 'in-bam', label: 'Recalibrated BAM', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-vcf', label: 'Variant calls', dataType: 'report_data' }],
    commonMistake: 'Using `--tools haplotypecaller` for somatic tumour/normal calling. Use `--tools mutect2` instead.',
    exampleOutput: 'GVCFs in `results/variant_calling/haplotypecaller/` from nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/sarek/parameters#tools',
    realToolExamples: ['GATK4_HAPLOTYPECALLER (nf-core/modules)', 'nf-core/sarek --tools haplotypecaller'],
  }),

  genotype_gvcf: B({
    type: 'genotype_gvcf',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Genotype GVCFs',
    technicalConcept: '`GATK4_GENOTYPEGVCFS` nf-core module — nf-core/sarek joint genotyping',
    description: 'Merges per-sample GVCFs into a multi-sample VCF. nf-core/sarek does this automatically when multiple samples are provided.',
    technicalDetail:
      'nf-core/sarek calls `GATK4_GENOTYPEGVCFS` (nf-core/modules) after HaplotypeCaller to perform joint genotyping. ' +
      'For large cohorts, `GATK4_GENOMICSDBIMPORT` is used first to consolidate GVCFs before genotyping. ' +
      'Joint genotyping improves variant calling accuracy by using population-level information.',
    category: 'analysis', icon: '🔀',
    inputPorts: [{ id: 'in-gvcf', label: 'Variant calls', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-vcf', label: 'Joint VCF', dataType: 'report_data' }],
    commonMistake: 'Running per-sample VCF calling instead of joint genotyping for cohort studies.',
    exampleOutput: 'Multi-sample genotyped VCFs in `results/variant_calling/` from nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/modules/gatk4/genotypegvcfs',
    realToolExamples: ['GATK4_GENOTYPEGVCFS (nf-core/modules)', 'GATK4_GENOMICSDBIMPORT (nf-core/modules)'],
  }),

  variant_filter: B({
    type: 'variant_filter',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Variant Filter',
    technicalConcept: '`GATK4_VARIANTRECALIBRATOR` or `GATK4_VARIANTFILTRATION` — nf-core/sarek',
    description: 'Removes low-quality variant calls. nf-core/sarek applies VQSR for large datasets or hard filters for small ones.',
    technicalDetail:
      'nf-core/sarek automatically selects between `GATK4_VARIANTRECALIBRATOR` (VQSR, for WGS/large WES) ' +
      'and `GATK4_VARIANTFILTRATION` (hard filters, for targeted panels or small datasets). ' +
      'Both are nf-core/modules wrappers following the GATK best-practices variant filtering guidelines.',
    category: 'analysis', icon: '🪄',
    inputPorts: [{ id: 'in-vcf', label: 'Joint VCF', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-vcf', label: 'Filtered VCF', dataType: 'report_data' }],
    commonMistake: 'Applying VQSR on a targeted panel with too few variants — use hard filters via `--skip_vqsr` instead.',
    exampleOutput: 'PASS-flagged VCFs in `results/variant_calling/` from nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/modules/gatk4/variantrecalibrator',
    realToolExamples: ['GATK4_VARIANTRECALIBRATOR (nf-core/modules)', 'GATK4_VARIANTFILTRATION (nf-core/modules)'],
  }),

  vcf_annotator: B({
    type: 'vcf_annotator',
    pack: 'variant_calling', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'VCF Annotator',
    technicalConcept: '`ENSEMBLVEP_VEP` or `SNPEFF_SNPEFF` nf-core module — nf-core/sarek annotation',
    description: 'Adds gene names and predicted consequences to each variant. nf-core/sarek supports VEP and SnpEff via `--tools`.',
    technicalDetail:
      'nf-core/sarek calls `ENSEMBLVEP_VEP` or `SNPEFF_SNPEFF` (nf-core/modules) when `--tools vep` or `--tools snpeff` is set. ' +
      'VEP annotates each variant with Ensembl transcript consequences, population frequencies from gnomAD, ' +
      'and functional predictions (SIFT, PolyPhen-2, CADD). Results are merged into an annotated VCF.',
    category: 'output', icon: '🏷️',
    inputPorts: [{ id: 'in-vcf', label: 'Filtered VCF', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Running VEP with an outdated cache version. Always use the cache version that matches your Ensembl release.',
    exampleOutput: 'Annotated VCFs in `results/annotation/` from nf-core/sarek.',
    nfCoreDocsLink: 'https://nf-co.re/sarek/parameters#tools',
    realToolExamples: ['ENSEMBLVEP_VEP (nf-core/modules)', 'SNPEFF_SNPEFF (nf-core/modules)', 'nf-core/sarek --tools vep'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/taxprofiler  (Phase 2 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  host_removal: B({
    type: 'host_removal',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Host Removal',
    technicalConcept: '`BOWTIE2_ALIGN` nf-core module — nf-core/taxprofiler host decontamination',
    description: 'Removes host reads before taxonomic classification. nf-core/taxprofiler uses Bowtie2 for this step.',
    technicalDetail:
      'nf-core/taxprofiler calls `BOWTIE2_ALIGN` (nf-core/modules) to align reads to the host genome (e.g. GRCh38), ' +
      'then extracts unmapped reads as the microbial fraction. ' +
      'Controlled by `--perform_shortread_hostremoval` and `--hostremoval_reference` parameters.',
    category: 'analysis', icon: '🧹',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-reads', label: 'Filtered reads', dataType: 'fastq_reads' }],
    commonMistake: 'Skipping host removal in clinical samples. Human reads can exceed 90% of a clinical metagenomic sample.',
    exampleOutput: 'Host-depleted FASTQ files published to `results/hostremoval/` in nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/taxprofiler/parameters#hostremoval',
    realToolExamples: ['BOWTIE2_ALIGN (nf-core/modules)', 'nf-core/taxprofiler --perform_shortread_hostremoval'],
  }),

  kraken2: B({
    type: 'kraken2',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Kraken2 Classifier',
    technicalConcept: '`KRAKEN2_KRAKEN2` nf-core module — nf-core/taxprofiler classification',
    description: 'Classifies reads by organism. nf-core/taxprofiler runs Kraken2 as one of several supported classifiers.',
    technicalDetail:
      'nf-core/taxprofiler calls `KRAKEN2_KRAKEN2` (nf-core/modules) using a pre-built database specified via `--databases`. ' +
      'Multiple classifiers can run in parallel (Kraken2, MetaPhlAn, Bracken, DIAMOND). ' +
      'Results are aggregated by `TAXPASTA_MERGE` into a unified taxonomy table.',
    category: 'analysis', icon: '🧫',
    inputPorts: [{ id: 'in-reads', label: 'Filtered reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-taxonomy', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using a Kraken2 database that is too small. The Standard-8 database misses many environmental organisms.',
    exampleOutput: 'Kraken2 classification reports and kreports published to `results/kraken2/` by nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/modules/kraken2/kraken2',
    realToolExamples: ['KRAKEN2_KRAKEN2 (nf-core/modules)', 'nf-core/taxprofiler --databases'],
  }),

  bracken: B({
    type: 'bracken',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Bracken Abundance',
    technicalConcept: '`BRACKEN_BRACKEN` nf-core module — nf-core/taxprofiler abundance estimation',
    description: 'Re-estimates species abundance from Kraken2 output. nf-core/taxprofiler runs Bracken after Kraken2 automatically.',
    technicalDetail:
      'nf-core/taxprofiler calls `BRACKEN_BRACKEN` (nf-core/modules) after `KRAKEN2_KRAKEN2` to compute ' +
      'more accurate species-level abundances using a probabilistic model. ' +
      'Controlled by `--bracken_save_intermeds`. Bracken output feeds into `TAXPASTA_MERGE` for cross-sample comparison.',
    category: 'analysis', icon: '📉',
    inputPorts: [{ id: 'in-taxonomy', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-abundance', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using Bracken with a database not built with the correct read length. Database and `--bracken_readlength` must match.',
    exampleOutput: 'Bracken abundance reports merged into a multi-sample table by nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/modules/bracken/bracken',
    realToolExamples: ['BRACKEN_BRACKEN (nf-core/modules)', 'TAXPASTA_MERGE (nf-core/modules)'],
  }),

  krona_viz: B({
    type: 'krona_viz',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Krona Visualization',
    technicalConcept: '`KRONA_KTIMPORTTAXONOMY` nf-core module — nf-core/taxprofiler visualisation',
    description: 'Creates an interactive taxonomy sunburst chart. nf-core/taxprofiler generates Krona charts automatically.',
    technicalDetail:
      'nf-core/taxprofiler calls `KRONA_KTIMPORTTAXONOMY` (nf-core/modules) on classifier outputs to produce ' +
      'interactive HTML Krona charts. Enabled by default — disable with `--skip_krona`. ' +
      'Charts are published to `results/krona/` per classifier.',
    category: 'output', icon: '☀️',
    inputPorts: [{ id: 'in-abundance', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Using Krona for quantitative comparisons. It is a hierarchical visualisation tool, not a statistical test.',
    exampleOutput: 'Interactive HTML Krona charts in `results/krona/` from nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/modules/krona/ktimporttaxonomy',
    realToolExamples: ['KRONA_KTIMPORTTAXONOMY (nf-core/modules)', 'nf-core/taxprofiler --skip_krona'],
  }),

  metaphlan: B({
    type: 'metaphlan',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'MetaPhlAn Profiler',
    technicalConcept: '`METAPHLAN_METAPHLAN` nf-core module — nf-core/taxprofiler marker gene profiling',
    description: 'Profiles microbial communities using marker genes. nf-core/taxprofiler supports MetaPhlAn alongside Kraken2.',
    technicalDetail:
      'nf-core/taxprofiler calls `METAPHLAN_METAPHLAN` (nf-core/modules) as an alternative or complementary classifier to Kraken2. ' +
      'MetaPhlAn uses a database of ~5.1M clade-specific marker genes for high-specificity profiling. ' +
      'Output profiles are harmonised with other classifiers by `TAXPASTA_MERGE`.',
    category: 'analysis', icon: '🦠',
    inputPorts: [{ id: 'in-reads', label: 'Filtered reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-profile', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Mixing MetaPhlAn database versions across samples — always use the same `mpa_vJan21_CHOCOPhlAnSGB_202103` or newer.',
    exampleOutput: 'MetaPhlAn abundance tables in `results/metaphlan/` from nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/modules/metaphlan/metaphlan',
    realToolExamples: ['METAPHLAN_METAPHLAN (nf-core/modules)', 'nf-core/taxprofiler'],
  }),

  humann: B({
    type: 'humann',
    pack: 'metagenomics', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'HUMAnN Profiler',
    technicalConcept: '`HUMANN_HUMANN` nf-core module — functional profiling in nf-core/taxprofiler',
    description: 'Identifies active metabolic pathways in your microbial community using nf-core/taxprofiler\'s functional profiling step.',
    technicalDetail:
      'The `HUMANN_HUMANN` nf-core module runs HUMAnN3 functional profiling. ' +
      'It maps reads to reference pangenomes (ChocoPhlAn) then to metabolic pathways (UniRef90, MetaCyc). ' +
      'Output gene family and pathway tables can be merged across samples using `HUMANN_JOIN_TABLES`.',
    category: 'analysis', icon: '⚗️',
    inputPorts: [{ id: 'in-reads', label: 'Filtered reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-functions', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Running HUMAnN on amplicon (16S rRNA) data — it requires shotgun metagenomic reads.',
    exampleOutput: 'Gene family and pathway abundance tables in `results/humann/` from nf-core/taxprofiler.',
    nfCoreDocsLink: 'https://nf-co.re/modules/humann/humann',
    realToolExamples: ['HUMANN_HUMANN (nf-core/modules)', 'HUMANN_JOIN_TABLES (nf-core/modules)'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/scrnaseq  (Phase 2 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  cell_demux: B({
    type: 'cell_demux',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Cell Demultiplexer',
    technicalConcept: '`CELLRANGER_MKFASTQ` or `SIMPLEAF_QUANT` nf-core module — nf-core/scrnaseq input',
    description: 'Assigns reads to individual cells using barcodes. nf-core/scrnaseq handles this via STARsolo, Cell Ranger, or Alevin.',
    technicalDetail:
      'nf-core/scrnaseq supports multiple aligners: `CELLRANGER_COUNT`, `STARSOLO`, `ALEVIN` (via `SIMPLEAF_QUANT`), and `KALLISTO_BUSTOOLS`. ' +
      'Each demultiplexes cell barcodes and UMIs, producing a barcodes × genes count matrix. ' +
      'The aligner is selected with `--aligner` (default: `cellranger`).',
    category: 'data', icon: '🧩',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-cells', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using 10x v2 chemistry settings for v3 libraries. Always pass `--protocol 10XV3` in nf-core/scrnaseq for v3 data.',
    exampleOutput: 'Cell barcode × gene count matrices in `results/cellranger/count/` from nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq/parameters#aligner',
    realToolExamples: ['CELLRANGER_COUNT (nf-core/modules)', 'STARSOLO (nf-core/modules)', 'nf-core/scrnaseq --aligner'],
  }),

  cellranger: B({
    type: 'cellranger',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Cell Ranger Count',
    technicalConcept: '`CELLRANGER_COUNT` nf-core module — nf-core/scrnaseq default aligner',
    description: 'Aligns single-cell reads and produces a count matrix. nf-core/scrnaseq wraps Cell Ranger as an nf-core module.',
    technicalDetail:
      'The `CELLRANGER_COUNT` nf-core module runs 10x Genomics Cell Ranger count on FASTQ input. ' +
      'nf-core/scrnaseq selects this when `--aligner cellranger`. ' +
      'Output includes a filtered barcodes × genes MEX matrix, a web summary HTML, and molecule info HDF5 — all published to `results/cellranger/`.',
    category: 'analysis', icon: '🔬',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-matrix', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Forgetting to set `--genome` or `--fasta`/`--gtf`. Cell Ranger requires a reference transcriptome.',
    exampleOutput: 'Filtered count matrix and web_summary.html in `results/cellranger/count/`.',
    nfCoreDocsLink: 'https://nf-co.re/modules/cellranger/count',
    realToolExamples: ['CELLRANGER_COUNT (nf-core/modules)', 'nf-core/scrnaseq --aligner cellranger'],
  }),

  seurat_qc: B({
    type: 'seurat_qc',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Seurat QC',
    technicalConcept: '`SCQC` subworkflow — nf-core/scrnaseq quality control',
    description: 'Filters low-quality cells and empty droplets. nf-core/scrnaseq runs Seurat or scater QC automatically.',
    technicalDetail:
      'nf-core/scrnaseq calls the `SCQC` subworkflow, which uses `SEURAT_QC` or `SCATER_QC` (nf-core/modules) ' +
      'to filter cells by number of detected genes, UMI count, and mitochondrial gene percentage. ' +
      'Thresholds are configurable via `--min_genes`, `--max_mito_perc`. ' +
      'Filtered matrices are passed to the downstream analysis subworkflow.',
    category: 'analysis', icon: '🧹',
    inputPorts: [{ id: 'in-matrix', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-filtered', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using the default thresholds without inspecting the QC violin plots first. Always check the distribution.',
    exampleOutput: 'Filtered Seurat objects and QC plots in `results/scqc/` from nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq/parameters',
    realToolExamples: ['SEURAT_QC (nf-core/modules)', 'nf-core/scrnaseq SCQC subworkflow'],
  }),

  normalization: B({
    type: 'normalization',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Normalize Counts',
    technicalConcept: '`SEURAT_NORMALIZE` or `SCRAN_NORMALIZE` — nf-core/scrnaseq analysis subworkflow',
    description: 'Makes gene expression comparable across cells. nf-core/scrnaseq normalises counts inside its analysis subworkflow.',
    technicalDetail:
      'nf-core/scrnaseq normalises count matrices using `SEURAT_NORMALIZE` (log-normalization or SCTransform) ' +
      'within the `SCRNASEQ_ANALYSIS` subworkflow. ' +
      'Normalisation removes sequencing depth bias so cells can be compared. ' +
      'Controlled by `--normalize_seurat_vst` and `--vst_flavor` parameters.',
    category: 'analysis', icon: '⚖️',
    inputPorts: [{ id: 'in-filtered', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-norm', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Normalising before removing doublets. Doublet removal should come first in nf-core/scrnaseq.',
    exampleOutput: 'Normalized Seurat objects ready for dimensionality reduction in nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq',
    realToolExamples: ['SEURAT_NORMALIZE (nf-core/modules)', 'nf-core/scrnaseq SCRNASEQ_ANALYSIS'],
  }),

  dim_reduction: B({
    type: 'dim_reduction',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Dim Reduction',
    technicalConcept: '`SEURAT_DIM_REDUCTION` (PCA + UMAP) — nf-core/scrnaseq analysis subworkflow',
    description: 'Reduces gene dimensions to 2D for visualisation. nf-core/scrnaseq runs PCA and UMAP as part of its standard analysis.',
    technicalDetail:
      'nf-core/scrnaseq calls `SEURAT_DIM_REDUCTION` inside `SCRNASEQ_ANALYSIS` to run ' +
      'PCA (principal component analysis) followed by UMAP. ' +
      'The number of PCs used for UMAP is set by `--n_pcs` (default: 30). ' +
      'UMAP plots are published to `results/analysis/` per sample.',
    category: 'analysis', icon: '🗺️',
    inputPorts: [{ id: 'in-norm', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-embedding', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Interpreting UMAP geometry as meaningful distance. UMAP preserves local structure only.',
    exampleOutput: 'PCA and UMAP plots published to `results/analysis/` by nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq',
    realToolExamples: ['SEURAT_DIM_REDUCTION (nf-core/modules)', 'nf-core/scrnaseq --n_pcs'],
  }),

  clustering: B({
    type: 'clustering',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Cell Clustering',
    technicalConcept: '`SEURAT_CLUSTER` nf-core module — nf-core/scrnaseq Louvain/Leiden clustering',
    description: 'Groups cells into clusters. nf-core/scrnaseq runs graph-based clustering as part of its standard analysis.',
    technicalDetail:
      'nf-core/scrnaseq calls `SEURAT_CLUSTER` (nf-core/modules) using the Louvain or Leiden algorithm on the ' +
      'shared nearest-neighbour graph in PCA space. ' +
      'Resolution is set via `--cluster_resolution` (default: 0.8). ' +
      'Cluster assignments are overlaid on UMAP plots and published to `results/analysis/`.',
    category: 'analysis', icon: '🫧',
    inputPorts: [{ id: 'in-embedding', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-clusters', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using a single resolution. nf-core/scrnaseq supports multiple resolutions via `--cluster_resolution 0.5,1.0`.',
    exampleOutput: 'Cluster-labelled UMAP plots in `results/analysis/` from nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq/parameters#cluster_resolution',
    realToolExamples: ['SEURAT_CLUSTER (nf-core/modules)', 'nf-core/scrnaseq --cluster_resolution'],
  }),

  marker_genes: B({
    type: 'marker_genes',
    pack: 'single_cell', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Marker Genes',
    technicalConcept: '`SEURAT_MARKERS` nf-core module — nf-core/scrnaseq marker gene identification',
    description: 'Finds genes that define each cluster. nf-core/scrnaseq identifies marker genes automatically for each cluster.',
    technicalDetail:
      'nf-core/scrnaseq calls `SEURAT_MARKERS` (nf-core/modules) to run Wilcoxon rank-sum tests comparing each cluster ' +
      'against all others. Top marker genes are used to infer cell type identities. ' +
      'Results are published as CSV tables and dot plots to `results/analysis/`.',
    category: 'output', icon: '🎯',
    inputPorts: [{ id: 'in-clusters', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-markers', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Assigning a cell type based on one marker gene. Always verify with multiple canonical markers.',
    exampleOutput: 'Marker gene tables and feature plots in `results/analysis/` from nf-core/scrnaseq.',
    nfCoreDocsLink: 'https://nf-co.re/scrnaseq',
    realToolExamples: ['SEURAT_MARKERS (nf-core/modules)', 'nf-core/scrnaseq'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/tools  (Phase 1–3 — coming soon)
  // ════════════════════════════════════════════════════════════════════════════

  channel_creator: B({
    type: 'channel_creator',
    pack: 'nfcore_tools', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'Channel Creator',
    technicalConcept: '`Channel.fromSamplesheet()` / nf-validation — Nextflow DSL2 channel factory',
    description: 'Creates the data stream that moves files between nf-core pipeline steps. Every nf-core pipeline starts here.',
    technicalDetail:
      'nf-core pipelines use `Channel.fromSamplesheet(params.input)` (from the nf-validation plugin) to create ' +
      'typed channels from a CSV samplesheet. The channel emits `[meta, file]` or `[meta, file1, file2]` tuples ' +
      'that flow through all downstream processes. Channels are the core data-passing mechanism in Nextflow DSL2.',
    category: 'pipeline', icon: '🌊',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake: 'Trying to use a channel value after it has been consumed — Nextflow channels are single-use queues.',
    exampleOutput: 'A typed channel emitting `[meta, fastq_1, fastq_2]` tuples to downstream nf-core modules.',
    nfCoreDocsLink: 'https://nf-co.re/docs/specifications/components/overview',
    realToolExamples: ['Channel.fromSamplesheet() (nf-validation)', 'Nextflow DSL2', 'nf-core pipeline main.nf'],
  }),

  subworkflow_block: B({
    type: 'subworkflow_block',
    pack: 'nfcore_tools', status: 'phase1', executionMode: 'coming_soon',
    displayName: 'nf-core Subworkflow',
    technicalConcept: 'nf-core subworkflow — reusable group of nf-core modules',
    description: 'A named, reusable group of nf-core modules. Examples: `BAM_SORT_STATS_SAMTOOLS`, `FASTQ_FASTQC_UMITOOLS_TRIMGALORE`.',
    technicalDetail:
      'nf-core subworkflows bundle multiple nf-core modules into a single importable unit. ' +
      'They live in `subworkflows/nf-core/` and are shared across pipelines via `nf-core subworkflows install`. ' +
      'A subworkflow has clearly defined inputs and outputs and its own `meta.yml` and test data. ' +
      'Example: `BAM_SORT_STATS_SAMTOOLS` wraps SAMTOOLS_SORT → SAMTOOLS_INDEX → SAMTOOLS_STATS in one call.',
    category: 'pipeline', icon: '📦',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    commonMistake: 'Writing a subworkflow for a single process. Subworkflows should group 2+ tightly related steps.',
    exampleOutput: 'A reusable subworkflow installable via `nf-core subworkflows install <name>`.',
    nfCoreDocsLink: 'https://nf-co.re/docs/specifications/components/overview',
    realToolExamples: ['BAM_SORT_STATS_SAMTOOLS', 'FASTQ_FASTQC_UMITOOLS_TRIMGALORE', '`nf-core subworkflows install`'],
  }),

  module_creator: B({
    type: 'module_creator',
    pack: 'nfcore_tools', status: 'phase3', executionMode: 'coming_soon',
    displayName: 'Create Module',
    technicalConcept: '`nf-core modules create` — nf-core/tools CLI command',
    description: 'Scaffolds a new nf-core module wrapping a bioinformatics tool. Uses the nf-core/tools CLI.',
    technicalDetail:
      'Running `nf-core modules create <tool>/<subtool>` generates a standardised module directory with ' +
      '`main.nf` (Nextflow process), `meta.yml` (documentation), `environment.yml` (conda env), and `tests/`. ' +
      'The module follows the nf-core module specifications: `[meta, file]` input convention, ' +
      'Biocontainers Docker/Singularity images, and pytest-workflow tests.',
    category: 'pipeline', icon: '🔨',
    inputPorts: [],
    outputPorts: [],
    commonMistake: 'Not adding a `tests/main.nf.test` file. All nf-core modules must have nf-test tests before they can be submitted to nf-core/modules.',
    exampleOutput: 'A module directory at `modules/nf-core/<tool>/<subtool>/` with main.nf, meta.yml, and tests/.',
    nfCoreDocsLink: 'https://nf-co.re/docs/contributing/modules',
    realToolExamples: ['`nf-core modules create`', '`nf-core modules lint`', 'nf-core/modules repository'],
  }),

  pipeline_linter: B({
    type: 'pipeline_linter',
    pack: 'nfcore_tools', status: 'phase3', executionMode: 'coming_soon',
    displayName: 'nf-core Lint',
    technicalConcept: '`nf-core lint` — nf-core/tools pipeline validation command',
    description: 'Validates that your pipeline meets all nf-core standards. Run before submitting a PR to nf-core.',
    technicalDetail:
      'The `nf-core lint` command (from the nf-core/tools Python package) checks ~100 requirements: ' +
      '`nextflow_schema.json` completeness, `CITATIONS.md`, `CHANGELOG.md` format, required config files, ' +
      'module version pins, `meta.yml` presence for all modules, and more. ' +
      'Failing checks block nf-core community review. Warnings are advisory.',
    category: 'analysis', icon: '✅',
    inputPorts: [],
    outputPorts: [],
    commonMistake: 'Running lint only before submission. Run `nf-core lint` continuously during development to catch issues early.',
    exampleOutput: 'A lint report with pass/warn/fail counts — equivalent to what nf-core reviewers see on your PR.',
    nfCoreDocsLink: 'https://nf-co.re/docs/nf-core-tools/cli/pipelines/lint',
    realToolExamples: ['`nf-core lint`', '`nf-core modules lint`', 'nf-core/tools'],
  }),

  test_data_fetcher: B({
    type: 'test_data_fetcher',
    pack: 'nfcore_tools', status: 'phase3', executionMode: 'coming_soon',
    displayName: 'Test Data Fetcher',
    technicalConcept: '`nf-core/test-datasets` repository — nf-core CI test files',
    description: 'Provides tiny FASTQ, BAM, and VCF files used in nf-core module and pipeline CI tests.',
    technicalDetail:
      'The `nf-core/test-datasets` GitHub repository hosts curated tiny test files (<5 MB) for all nf-core modules. ' +
      'Files are referenced in `tests/` via GitHub raw URLs. ' +
      'nf-test uses these files to run module tests in GitHub Actions CI. ' +
      'When writing a new module, you either reuse an existing test file or add a new one to nf-core/test-datasets.',
    category: 'data', icon: '📦',
    inputPorts: [],
    outputPorts: [{ id: 'out-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    commonMistake: 'Adding large test files to nf-core/test-datasets. Files must be <5 MB — create minimal synthetic test data.',
    exampleOutput: 'Small FASTQ/BAM/VCF files from `github.com/nf-core/test-datasets` used in module nf-tests.',
    nfCoreDocsLink: 'https://nf-co.re/docs/nf-core-tools/cli/test-datasets/list',
    realToolExamples: ['nf-core/test-datasets GitHub repo', 'nf-test', '`nf-core modules test`'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/chipseq  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  chipseq_samplesheet: B({
    type: 'chipseq_samplesheet', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'ChIP-seq Samplesheet',
    technicalConcept: '`--input` samplesheet — nf-core/chipseq with antibody column',
    description: 'The nf-core/chipseq samplesheet links each IP sample to its input control using the `antibody` and `control` columns.',
    technicalDetail: 'nf-core/chipseq requires: sample, fastq_1, fastq_2 (optional), antibody, control. The antibody column is used for peak calling — each IP is paired with its matching input control for background subtraction.',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Not providing an input control sample. ChIP-seq peak calling requires matched input/IgG controls for each IP experiment.',
    exampleOutput: 'Validated sample + control pairs ready for alignment.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/docs/usage',
    realToolExamples: ['nf-core/chipseq --input samplesheet.csv'],
  }),

  chipseq_fastqc: B({
    type: 'chipseq_fastqc', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'ChIP-seq QC',
    technicalConcept: '`FASTQC` + `TRIMGALORE` nf-core modules — nf-core/chipseq preprocessing',
    description: 'Quality control and adapter trimming for ChIP-seq reads. Same FASTQC and TrimGalore modules as in nf-core/rnaseq.',
    technicalDetail: 'nf-core/chipseq runs `FASTQC` then `TRIMGALORE` (both nf-core/modules). For ChIP-seq, read length uniformity is especially important for peak calling accuracy.',
    category: 'analysis', icon: '🔬',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-qc', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using very short reads (<36 bp) for ChIP-seq. Short reads cause high multi-mapping rates and poor peak resolution.',
    exampleOutput: 'FastQC HTML reports and trimmed reads published to `results/fastqc/` and `results/trimgalore/`.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/docs/output',
    realToolExamples: ['FASTQC (nf-core/modules)', 'TRIMGALORE (nf-core/modules)'],
  }),

  chipseq_trim: B({
    type: 'chipseq_trim', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'ChIP-seq Align',
    technicalConcept: '`BWAMEM2_MEM` + `SAMTOOLS_SORT` — nf-core/chipseq alignment',
    description: 'Aligns ChIP-seq reads to the reference genome using BWA-MEM2. ChIP-seq uses DNA alignment (not splice-aware).',
    technicalDetail: 'nf-core/chipseq calls `BWAMEM2_MEM` (nf-core/modules) for alignment, then `SAMTOOLS_SORT` and `PICARD_MARKDUPLICATES` for BAM processing. Duplicate removal is critical for ChIP-seq to avoid PCR artefacts.',
    category: 'analysis', icon: '🎯',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    commonMistake: 'Using STAR or HISAT2 for ChIP-seq. These are splice-aware RNA-seq aligners — ChIP-seq requires DNA aligners like BWA-MEM2.',
    exampleOutput: 'Deduplicated, sorted BAMs in `results/bwa/mergedLibrary/` from nf-core/chipseq.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/docs/output',
    realToolExamples: ['BWAMEM2_MEM (nf-core/modules)', 'PICARD_MARKDUPLICATES (nf-core/modules)'],
  }),

  peak_calling: B({
    type: 'peak_calling', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Peak Calling',
    technicalConcept: '`MACS3_CALLPEAK` nf-core module — nf-core/chipseq peak identification',
    description: 'Identifies genomic regions enriched in ChIP-seq signal compared to the input control. nf-core/chipseq uses MACS3.',
    technicalDetail: 'nf-core/chipseq calls `MACS3_CALLPEAK` (nf-core/modules) comparing each IP BAM against its matched input control. Output includes narrowPeak (TF binding) or broadPeak (histone marks) files. The `--macs_gsize` parameter sets the effective genome size.',
    category: 'analysis', icon: '📊',
    inputPorts: [{ id: 'in-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-peaks', label: 'Peak calls', dataType: 'report_data' }],
    commonMistake: 'Using narrowPeak mode for broad histone marks like H3K27me3. Use `--broad` flag for diffuse chromatin marks; narrowPeak for sharp TF binding.',
    exampleOutput: 'BED/narrowPeak files in `results/bwa/mergedLibrary/macs3/` from nf-core/chipseq.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/parameters',
    realToolExamples: ['MACS3_CALLPEAK (nf-core/modules)', 'nf-core/chipseq --macs_gsize hs'],
  }),

  peak_annotation: B({
    type: 'peak_annotation', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Peak Annotation',
    technicalConcept: '`HOMER_ANNOTATEPEAKS` nf-core module — nf-core/chipseq peak annotation',
    description: 'Annotates each peak with the nearest gene, genomic feature (promoter/exon/intron), and distance to TSS.',
    technicalDetail: 'nf-core/chipseq calls `HOMER_ANNOTATEPEAKS` (nf-core/modules) to assign each peak a genomic context. Output includes the fraction of peaks at promoters, exons, introns, and intergenic regions — a key QC metric for ChIP-seq.',
    category: 'analysis', icon: '🏷️',
    inputPorts: [{ id: 'in-peaks', label: 'Peak calls', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-annotated', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Forgetting to filter peaks by fold enrichment before annotation. Use a minimum fold enrichment threshold (e.g. 4x) to reduce false positives.',
    exampleOutput: 'Annotated peak tables and genomic distribution plots from nf-core/chipseq.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/docs/output',
    realToolExamples: ['HOMER_ANNOTATEPEAKS (nf-core/modules)'],
  }),

  consensus_peaks: B({
    type: 'consensus_peaks', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Consensus Peaks',
    technicalConcept: '`BEDTOOLS_MERGE` + `FEATURECOUNTS` — nf-core/chipseq consensus peak matrix',
    description: 'Merges peaks across all samples to create a consensus peak set, then counts reads in each peak per sample for differential binding analysis.',
    technicalDetail: 'nf-core/chipseq uses `BEDTOOLS_MERGE` to create a consensus set of peaks found in at least 1 replicate, then `SUBREAD_FEATURECOUNTS` to count reads in each peak. The resulting count matrix is used for differential binding analysis with DESeq2.',
    category: 'analysis', icon: '🔀',
    inputPorts: [{ id: 'in-peaks', label: 'Peak calls', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-matrix', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not requiring peaks to be reproducible across replicates before creating the consensus. Use --min_reps_consensus to enforce reproducibility.',
    exampleOutput: 'Consensus peak BED file and read count matrix for all samples.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/parameters',
    realToolExamples: ['BEDTOOLS_MERGE (nf-core/modules)', 'SUBREAD_FEATURECOUNTS (nf-core/modules)'],
  }),

  chipseq_report: B({
    type: 'chipseq_report', pack: 'chipseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'ChIP-seq Report',
    technicalConcept: '`MULTIQC` + `PHANTOMPEAKQUALTOOLS` — nf-core/chipseq QC summary',
    description: 'Generates a MultiQC report including ChIP-seq-specific metrics: FRiP score, NSC, RSC, and peak count per sample.',
    technicalDetail: 'nf-core/chipseq runs `PHANTOMPEAKQUALTOOLS` for strand cross-correlation analysis (NSC/RSC metrics) and summarises all QC in `MULTIQC`. FRiP (Fraction of Reads in Peaks) > 0.01 is the minimum acceptable for TF ChIP-seq.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-matrix', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Ignoring low FRiP scores. FRiP < 0.01 indicates poor enrichment — the IP may have failed. Check antibody quality and input:IP ratio.',
    exampleOutput: 'MultiQC report with FRiP, NSC, RSC, and peak count metrics in `results/multiqc/`.',
    nfCoreDocsLink: 'https://nf-co.re/chipseq/docs/output',
    realToolExamples: ['MULTIQC (nf-core/modules)', 'PHANTOMPEAKQUALTOOLS'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/fetchngs  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  sra_ids_input: B({
    type: 'sra_ids_input', pack: 'fetchngs', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'SRA / GEO IDs',
    technicalConcept: '`--input` IDs file — nf-core/fetchngs accession list',
    description: 'A plain text file listing one SRA, ENA, DDBJ, or GEO accession per line. nf-core/fetchngs downloads all associated FASTQ files automatically.',
    technicalDetail: 'nf-core/fetchngs accepts SRR/ERR/DRR (run), SRX/ERX/DRX (experiment), SRS/ERS/DRS (sample), SRP/ERP/DRP (study), and GSE (GEO series) accessions. It queries the ENA and SRA APIs to resolve accessions to FASTQ download URLs.',
    category: 'data', icon: '🔑',
    inputPorts: [],
    outputPorts: [{ id: 'out-ids', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Providing a GEO accession (GSE12345) without checking if raw FASTQ files are deposited. Some GEO entries only have processed data — check the GEO page for SRA links.',
    exampleOutput: 'Resolved list of SRR accessions and their associated metadata.',
    nfCoreDocsLink: 'https://nf-co.re/fetchngs/docs/usage',
    realToolExamples: ['nf-core/fetchngs --input ids.csv', 'ENA browser', 'SRA toolkit'],
  }),

  download_reads: B({
    type: 'download_reads', pack: 'fetchngs', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Download Reads',
    technicalConcept: '`SRA_FASTQDUMP` or `WGET` + ENA API — nf-core/fetchngs download step',
    description: 'Downloads FASTQ files from SRA or ENA. nf-core/fetchngs tries ENA first (faster) then falls back to NCBI SRA.',
    technicalDetail: 'nf-core/fetchngs uses `SRATOOLS_FASTERQDUMP` (nf-core/modules) for SRA downloads and direct HTTPS downloads for ENA. The `--download_method` parameter controls which source to use. Downloads are parallelised across all accessions.',
    category: 'analysis', icon: '⬇️',
    inputPorts: [{ id: 'in-ids', label: 'Sample records', dataType: 'sample_records' }],
    outputPorts: [{ id: 'out-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    commonMistake: 'Not checking available disk space before downloading. A single SRA study can contain terabytes of data. Use `--nf_core_pipeline` to filter to just the files needed.',
    exampleOutput: 'Downloaded FASTQ files in `results/fastq/` and metadata in `results/metadata/`.',
    nfCoreDocsLink: 'https://nf-co.re/fetchngs/parameters',
    realToolExamples: ['SRATOOLS_FASTERQDUMP (nf-core/modules)', 'nf-core/fetchngs'],
  }),

  generate_samplesheet: B({
    type: 'generate_samplesheet', pack: 'fetchngs', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Generate Samplesheet',
    technicalConcept: '`SRA_TO_SAMPLESHEET` — nf-core/fetchngs automatic samplesheet creation',
    description: 'Automatically generates a ready-to-use nf-core samplesheet from downloaded FASTQ files — no manual CSV editing needed.',
    technicalDetail: 'nf-core/fetchngs calls `SRA_TO_SAMPLESHEET` (a local module) to create a samplesheet in the format required by any downstream nf-core pipeline (rnaseq, sarek, etc.). The `--nf_core_pipeline` parameter sets which pipeline format to use.',
    category: 'output', icon: '📋',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Forgetting to set --nf_core_pipeline. The default samplesheet may not match the format expected by the pipeline you want to run next.',
    exampleOutput: 'A samplesheet.csv ready to pass directly to `nextflow run nf-core/rnaseq --input samplesheet.csv`.',
    nfCoreDocsLink: 'https://nf-co.re/fetchngs/parameters#nf_core_pipeline',
    realToolExamples: ['nf-core/fetchngs --nf_core_pipeline rnaseq'],
  }),

  fetchngs_report: B({
    type: 'fetchngs_report', pack: 'fetchngs', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Download Report',
    technicalConcept: '`MULTIQC` + metadata summary — nf-core/fetchngs reporting',
    description: 'Summarises all downloaded files with metadata (organism, library strategy, instrument, read length) in a MultiQC report.',
    technicalDetail: 'nf-core/fetchngs generates a `samplesheet.csv` and a metadata TSV with all SRA/ENA fields for each sample. MultiQC summarises download success/failure and sample metadata.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-samples', label: 'Sample records', dataType: 'sample_records' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not reviewing the metadata report before proceeding. SRA records sometimes contain incorrect or inconsistent metadata (e.g. wrong strandedness, mislabelled conditions).',
    exampleOutput: 'MultiQC report and metadata TSV in `results/multiqc/` and `results/metadata/` from nf-core/fetchngs.',
    nfCoreDocsLink: 'https://nf-co.re/fetchngs/docs/output',
    realToolExamples: ['MULTIQC (nf-core/modules)', 'nf-core/fetchngs'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/ampliseq  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  ampliseq_samplesheet: B({
    type: 'ampliseq_samplesheet', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Ampliseq Samplesheet',
    technicalConcept: '`--input` samplesheet — nf-core/ampliseq sample table',
    description: 'nf-core/ampliseq accepts paired FASTQ files with sample metadata (forward/reverse primers, barcode, run).',
    technicalDetail: 'Required columns: sampleID, forwardPrimer, reversePrimer, dataFolder. nf-core/ampliseq also supports a manifest format for multiplexed samples. The FW and RV primers are used for CUTADAPT primer trimming.',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Not providing primer sequences. nf-core/ampliseq requires primers for CUTADAPT trimming — without them, primers will be retained in reads and cause spurious ASVs.',
    exampleOutput: 'Validated sample list with primer sequences for CUTADAPT.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/docs/usage',
    realToolExamples: ['nf-core/ampliseq --input samplesheet.tsv --FW_primer GTGYCAGCMGCCGCGGTAA'],
  }),

  primer_removal: B({
    type: 'primer_removal', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Primer Removal',
    technicalConcept: '`CUTADAPT` nf-core module — nf-core/ampliseq primer trimming',
    description: 'Removes PCR primers from amplicon reads. For 16S, this includes the forward and reverse primers flanking the variable region.',
    technicalDetail: 'nf-core/ampliseq uses `CUTADAPT` (nf-core/modules) to trim forward and reverse primers from paired reads. The `--retain_untrimmed` parameter controls whether reads with no primer are discarded (recommended for strict QC).',
    category: 'analysis', icon: '✂️',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-reads', label: 'Trimmed reads', dataType: 'trimmed_reads' }],
    commonMistake: 'Using the wrong primer sequences. Always verify primers against the original protocol — 515F/806R for V4 region, 341F/805R for V3-V4, etc.',
    exampleOutput: 'Primer-trimmed FASTQ files and CUTADAPT trimming stats in `results/cutadapt/`.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/parameters',
    realToolExamples: ['CUTADAPT (nf-core/modules)', 'nf-core/ampliseq'],
  }),

  asv_inference: B({
    type: 'asv_inference', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'ASV Inference',
    technicalConcept: '`DADA2_DENOISEFILTER` nf-core module — amplicon sequence variant calling',
    description: 'Denoises amplicon reads using DADA2 to produce exact Amplicon Sequence Variants (ASVs) — more precise than traditional OTU clustering.',
    technicalDetail: 'nf-core/ampliseq calls multiple `DADA2_*` modules to learn error models, denoise reads, merge paired ends, and remove chimeras. The output is an ASV table (feature table) and representative sequences. ASVs are 100% identical sequences within samples.',
    category: 'analysis', icon: '🧬',
    inputPorts: [{ id: 'in-reads', label: 'Trimmed reads', dataType: 'trimmed_reads' }],
    outputPorts: [{ id: 'out-asvs', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Not optimising truncation lengths (--trunclenf/--trunclenr). Poor quality bases at read ends cause chimera formation. Inspect FastQC quality plots to set appropriate truncation.',
    exampleOutput: 'ASV table and representative sequences in `results/dada2/` from nf-core/ampliseq.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/parameters',
    realToolExamples: ['DADA2_DENOISEFILTER (nf-core/modules)', 'nf-core/ampliseq'],
  }),

  taxonomy_classify: B({
    type: 'taxonomy_classify', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Taxonomy Classify',
    technicalConcept: '`DADA2_TAXONOMY` or `QIIME2_CLASSIFY` — nf-core/ampliseq taxonomic assignment',
    description: 'Assigns taxonomy to each ASV using DADA2 or QIIME2 classifiers trained on 16S reference databases (SILVA, GTDB, UNITE).',
    technicalDetail: 'nf-core/ampliseq supports multiple reference databases (SILVA 138, GTDB r214, UNITE for ITS). The classifier assigns taxonomy at genus or species level with confidence scores. Set `--classifier` to specify the trained classifier.',
    category: 'analysis', icon: '🦠',
    inputPorts: [{ id: 'in-asvs', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-taxonomy', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using a 16S classifier for ITS sequences (fungi). Always match the classifier to the amplicon target: SILVA/GTDB for 16S, UNITE for ITS.',
    exampleOutput: 'Taxonomy-annotated ASV table and bar charts in `results/taxonomy/` from nf-core/ampliseq.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/parameters#dada2_ref_taxonomy',
    realToolExamples: ['DADA2_TAXONOMY (nf-core/modules)', 'nf-core/ampliseq --dada2_ref_taxonomy silva=138'],
  }),

  diversity_analysis: B({
    type: 'diversity_analysis', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Diversity Analysis',
    technicalConcept: '`QIIME2_DIVERSITY_*` nf-core modules — alpha/beta diversity in nf-core/ampliseq',
    description: 'Calculates alpha diversity (richness within samples) and beta diversity (differences between samples) using QIIME2 metrics.',
    technicalDetail: 'nf-core/ampliseq calls QIIME2 diversity modules for Shannon entropy, Simpson index (alpha) and Bray-Curtis, Jaccard, UniFrac (beta) diversity. PCoA plots visualise beta diversity. Statistical tests (PERMANOVA) compare groups.',
    category: 'analysis', icon: '🌈',
    inputPorts: [{ id: 'in-taxonomy', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-diversity', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not rarefying before alpha diversity calculation. Rarefaction normalises sequencing depth across samples — without it, diversity differences reflect sequencing effort, not biology.',
    exampleOutput: 'Alpha diversity box plots and beta diversity PCoA plots in `results/qiime2/diversity/`.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/docs/output',
    realToolExamples: ['QIIME2 diversity (nf-core/modules)', 'nf-core/ampliseq'],
  }),

  ampliseq_report: B({
    type: 'ampliseq_report', pack: 'ampliseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Ampliseq Report',
    technicalConcept: '`MULTIQC` — nf-core/ampliseq QC summary',
    description: 'Generates a MultiQC report summarising read counts, primer trimming efficiency, DADA2 denoising stats, and ASV richness per sample.',
    technicalDetail: 'nf-core/ampliseq MultiQC includes: reads passing QC at each step, DADA2 denoising rates, chimera removal, and sample-level ASV counts. Low read retention (<70%) at any step indicates a pipeline configuration problem.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-diversity', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Ignoring samples where >50% of reads are lost at the DADA2 merge step. This usually means the amplicon is too long for the chosen read length — increase read length or target a shorter variable region.',
    exampleOutput: 'MultiQC report in `results/multiqc/` and ASV/taxonomy summary tables.',
    nfCoreDocsLink: 'https://nf-co.re/ampliseq/docs/output',
    realToolExamples: ['MULTIQC (nf-core/modules)', 'nf-core/ampliseq'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/methylseq  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  methylseq_samplesheet: B({
    type: 'methylseq_samplesheet', pack: 'methylseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Methylseq Samplesheet',
    technicalConcept: '`--input` samplesheet — nf-core/methylseq sample table',
    description: 'Standard nf-core samplesheet with sample, fastq_1, fastq_2, and strandedness — same format as nf-core/rnaseq.',
    technicalDetail: 'nf-core/methylseq accepts the same samplesheet format as other nf-core pipelines. For RRBS data, set `--rrbs` flag. For single-cell bisulfite data, use `--single_cell`.',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Mixing WGBS and RRBS samples in the same run without flagging RRBS samples. RRBS requires MspI adapter trimming before alignment.',
    exampleOutput: 'Validated sample list for Bismark alignment.',
    nfCoreDocsLink: 'https://nf-co.re/methylseq/docs/usage',
    realToolExamples: ['nf-core/methylseq --input samplesheet.csv'],
  }),

  bismark_align: B({
    type: 'bismark_align', pack: 'methylseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Bismark Align',
    technicalConcept: '`BISMARK_BISMARK` nf-core module — bisulfite-aware alignment',
    description: 'Aligns bisulfite-converted reads to a bisulfite-converted reference genome. Bismark converts all C→T in reads and genome, then aligns.',
    technicalDetail: 'nf-core/methylseq uses `BISMARK_BISMARK` (nf-core/modules). Bismark performs a 4-way alignment: reads are aligned to C→T and G→A converted genomes. The `--bowtie2` flag uses Bowtie2 instead of the default HISAT2-based alignment.',
    category: 'analysis', icon: '🎯',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    commonMistake: 'Using a non-bisulfite aligner (BWA, STAR) for WGBS data. Standard aligners cannot handle bisulfite conversion — use Bismark or bwa-meth.',
    exampleOutput: 'Bismark-aligned BAMs and alignment report in `results/bismark_alignments/`.',
    nfCoreDocsLink: 'https://nf-co.re/methylseq/docs/output',
    realToolExamples: ['BISMARK_BISMARK (nf-core/modules)', 'nf-core/methylseq'],
  }),

  methylation_extract: B({
    type: 'methylation_extract', pack: 'methylseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Methylation Extract',
    technicalConcept: '`BISMARK_METHYLATIONEXTRACTOR` nf-core module — CpG methylation calling',
    description: 'Extracts CpG, CHG, and CHH methylation calls from Bismark-aligned BAM files.',
    technicalDetail: 'nf-core/methylseq calls `BISMARK_METHYLATIONEXTRACTOR` to produce per-CpG methylation calls. Output includes bedGraph files (one per sample) and genome-wide methylation reports. `BISMARK_BISMARK2BEDGRAPH` and `BISMARK_COVERAGE2CYTOSINE` convert output for downstream analysis.',
    category: 'analysis', icon: '🧬',
    inputPorts: [{ id: 'in-bam', label: 'Aligned reads', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-methyl', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not filtering for coverage before differential methylation analysis. CpG sites with < 5x coverage have unreliable methylation estimates.',
    exampleOutput: 'Per-CpG methylation bedGraph and genome-wide cytosine report in `results/bismark_methylation_calls/`.',
    nfCoreDocsLink: 'https://nf-co.re/methylseq/docs/output',
    realToolExamples: ['BISMARK_METHYLATIONEXTRACTOR (nf-core/modules)'],
  }),

  methylation_report: B({
    type: 'methylation_report', pack: 'methylseq', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Methylation Report',
    technicalConcept: '`BISMARK_BISMARK2REPORT` + `MULTIQC` — nf-core/methylseq summary',
    description: 'Generates per-sample methylation summary reports and a MultiQC overview of bisulfite conversion efficiency and CpG coverage.',
    technicalDetail: 'nf-core/methylseq produces Bismark HTML reports (alignment rate, bisulfite conversion efficiency, M-bias plots) and a MultiQC summary. Bisulfite conversion efficiency should be >99% for reliable methylation calls.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-methyl', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Ignoring M-bias plots. M-bias shows artificial methylation enrichment at read ends (common in RRBS). Trim biased positions with --ignore / --ignore_3prime.',
    exampleOutput: 'Bismark HTML reports and MultiQC summary in `results/bismark_summary/` and `results/multiqc/`.',
    nfCoreDocsLink: 'https://nf-co.re/methylseq/docs/output',
    realToolExamples: ['BISMARK_BISMARK2REPORT', 'MULTIQC (nf-core/modules)'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/differentialabundance  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  count_matrix_input: B({
    type: 'count_matrix_input', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Count Matrix',
    technicalConcept: '`--matrix` — nf-core/differentialabundance count matrix input',
    description: 'The gene-level count matrix from nf-core/rnaseq (salmon.merged.gene_counts.tsv) passed directly to nf-core/differentialabundance.',
    technicalDetail: 'nf-core/differentialabundance accepts Salmon/STAR count matrices from nf-core/rnaseq, or any count matrix in TSV format. The `--matrix` parameter points to the counts file; `--transcript_length_matrix` provides length correction for TPM calculation.',
    category: 'data', icon: '📊',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-matrix', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Providing TPM or RPKM normalised values as input instead of raw counts. DESeq2 requires raw integer counts — use salmon.merged.gene_counts.tsv, not gene_tpm.tsv.',
    exampleOutput: 'Validated count matrix ready for DESeq2 analysis.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/usage',
    realToolExamples: ['nf-core/differentialabundance --matrix salmon.merged.gene_counts.tsv'],
  }),

  sample_sheet_de: B({
    type: 'sample_sheet_de', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Sample Sheet (DE)',
    technicalConcept: '`--samplesheet` — nf-core/differentialabundance condition metadata',
    description: 'A samplesheet mapping each sample to its experimental condition, batch, and other covariates for DESeq2 design formula.',
    technicalDetail: 'nf-core/differentialabundance uses a samplesheet with sample, condition, and optional batch columns. The `--contrast_variable`, `--reference_level`, and `--target_level` parameters define the comparison (e.g. treatment vs control).',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-meta', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Not accounting for batch effects in the design formula. If samples were processed in different batches, include batch as a covariate: `--blocking_variables batch`.',
    exampleOutput: 'Validated condition metadata for DESeq2 model design.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/parameters',
    realToolExamples: ['nf-core/differentialabundance --contrast_variable condition --reference_level control'],
  }),

  deseq2_de: B({
    type: 'deseq2_de', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'DESeq2 Analysis',
    technicalConcept: '`DESEQ2_DIFFERENTIAL` nf-core module — nf-core/differentialabundance',
    description: 'Runs DESeq2 differential expression analysis comparing conditions specified in the contrast parameters.',
    technicalDetail: 'nf-core/differentialabundance calls `DESEQ2_DIFFERENTIAL` (nf-core/modules) with the count matrix and sample metadata. Output includes normalised counts, shrunken log2 fold changes (apeglm), p-values, and adjusted p-values (Benjamini-Hochberg FDR).',
    category: 'analysis', icon: '📈',
    inputPorts: [{ id: 'in-matrix', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-de', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Running DE with < 3 replicates per group. DESeq2 can run but statistical power is very low. With n=2, results are unreliable.',
    exampleOutput: 'DE results table with shrunken log2FC, p-value, and padj in `results/deseq2_differential/`.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['DESEQ2_DIFFERENTIAL (nf-core/modules)', 'nf-core/differentialabundance'],
  }),

  volcano_de: B({
    type: 'volcano_de', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Volcano Plot',
    technicalConcept: '`CUSTOM_VOLCANOPLOT` nf-core module — nf-core/differentialabundance',
    description: 'Creates an interactive volcano plot from DESeq2 results highlighting significantly differentially expressed genes.',
    technicalDetail: 'nf-core/differentialabundance calls `CUSTOM_VOLCANOPLOT` (nf-core/modules). The plot shows -log10(padj) vs log2FC. Genes passing `--p_value_threshold` and `--fold_change_threshold` are highlighted. Output is interactive HTML + static PNG.',
    category: 'output', icon: '🌋',
    inputPorts: [{ id: 'in-de', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-plot', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not setting an appropriate fold-change threshold. Using padj < 0.05 alone often returns thousands of genes — combine with log2FC > 1 for biological significance.',
    exampleOutput: 'Interactive HTML volcano plot and PNG in `results/plots/` from nf-core/differentialabundance.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['CUSTOM_VOLCANOPLOT (nf-core/modules)'],
  }),

  heatmap_de: B({
    type: 'heatmap_de', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'DE Heatmap',
    technicalConcept: '`R_HEATMAP` — nf-core/differentialabundance hierarchical clustering heatmap',
    description: 'Hierarchical clustering heatmap showing expression patterns of DE genes across all samples.',
    technicalDetail: 'nf-core/differentialabundance generates a heatmap of the top DE genes using scaled, normalised counts. Row and column clustering reveals groups of co-expressed genes and sample relationships. PCA plots are also generated.',
    category: 'output', icon: '🌡️',
    inputPorts: [{ id: 'in-de', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-heatmap', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Using all DE genes in a heatmap with many samples. Limit to top 50-100 genes by padj for a readable heatmap.',
    exampleOutput: 'Clustered heatmap PNG and sample PCA plot in `results/plots/` from nf-core/differentialabundance.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['nf-core/differentialabundance plots'],
  }),

  pathway_de: B({
    type: 'pathway_de', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Pathway Enrichment',
    technicalConcept: '`GPROFILER2_GOST` nf-core module — nf-core/differentialabundance g:Profiler enrichment',
    description: 'Tests DE gene lists for enrichment in biological pathways (GO, KEGG, Reactome) using g:Profiler.',
    technicalDetail: 'nf-core/differentialabundance calls `GPROFILER2_GOST` (nf-core/modules) for over-representation analysis. Results include FDR-corrected enrichment scores for GO Biological Process, Molecular Function, Cellular Component, KEGG, and Reactome terms.',
    category: 'output', icon: '🗺️',
    inputPorts: [{ id: 'in-de', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-pathways', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Running pathway analysis on a list with < 10 genes. Results are statistically unreliable with very few input genes.',
    exampleOutput: 'Pathway enrichment dot plots and tables in `results/gprofiler2/` from nf-core/differentialabundance.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['GPROFILER2_GOST (nf-core/modules)', 'nf-core/differentialabundance'],
  }),

  de_report: B({
    type: 'de_report', pack: 'differentialabundance', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'DE Report',
    technicalConcept: '`MULTIQC` + Shinyngs report — nf-core/differentialabundance output',
    description: 'Generates a MultiQC summary and an interactive Shiny app (Shinyngs) for exploring DE results.',
    technicalDetail: 'nf-core/differentialabundance produces an interactive Shiny application (via Shinyngs) for exploring counts, DE results, and plots interactively. A static MultiQC report summarises sample relationships and DE statistics.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-pathways', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not deploying the Shiny app. The interactive report is the most useful output — run `shiny::runApp("shinyngs")` to explore results interactively.',
    exampleOutput: 'MultiQC report + interactive Shinyngs app in `results/` from nf-core/differentialabundance.',
    nfCoreDocsLink: 'https://nf-co.re/differentialabundance/docs/output',
    realToolExamples: ['MULTIQC (nf-core/modules)', 'Shinyngs', 'nf-core/differentialabundance'],
  }),

  // ════════════════════════════════════════════════════════════════════════════
  // PACK: nf-core/spatialvi  (Phase 8)
  // ════════════════════════════════════════════════════════════════════════════

  visium_samplesheet: B({
    type: 'visium_samplesheet', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Visium Samplesheet',
    technicalConcept: '`--input` samplesheet — nf-core/spatialvi Visium sample table',
    description: 'nf-core/spatialvi requires a samplesheet with sample ID, FASTQ paths, and the path to the matching histology image from the Visium slide.',
    technicalDetail: 'Required columns: sample, fastq_dir, image, slide, area. The `fastq_dir` points to the directory with Visium FASTQ files (from the 10x Genomics Visium protocol). The `image` column provides the brightfield histology image for spatial mapping.',
    category: 'data', icon: '📋',
    inputPorts: [{ id: 'in-context', label: 'Pipeline context', dataType: 'pipeline_context' }],
    outputPorts: [{ id: 'out-samples', label: 'Sample records', dataType: 'sample_records' }],
    commonMistake: 'Not providing the slide serial number and capture area. Space Ranger needs these to correctly align spots to tissue.',
    exampleOutput: 'Validated Visium sample list with spatial image paths.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/usage',
    realToolExamples: ['nf-core/spatialvi --input samplesheet.csv'],
  }),

  spaceranger_count: B({
    type: 'spaceranger_count', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Space Ranger Count',
    technicalConcept: '`SPACERANGER_COUNT` nf-core module — nf-core/spatialvi alignment',
    description: 'Aligns Visium reads to the reference transcriptome and maps gene expression to spatial barcodes on the tissue slide.',
    technicalDetail: 'nf-core/spatialvi calls `SPACERANGER_COUNT` (nf-core/modules) — the 10x Genomics Space Ranger pipeline. Output includes a tissue-mapped gene × barcode count matrix, tissue detection, and spot coordinates aligned to the histology image.',
    category: 'analysis', icon: '🗺️',
    inputPorts: [{ id: 'in-reads', label: 'FASTQ reads', dataType: 'fastq_reads' }],
    outputPorts: [{ id: 'out-spatial', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Using the wrong reference transcriptome version. Visium data requires a genome reference with gene annotations — use 10x Genomics pre-built references for best compatibility.',
    exampleOutput: 'Space Ranger output in `results/spaceranger/count/` with spatial barcode-gene matrix and tissue image.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['SPACERANGER_COUNT (nf-core/modules)', 'nf-core/spatialvi'],
  }),

  spatial_qc: B({
    type: 'spatial_qc', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Spatial QC',
    technicalConcept: '`SPATIALVI_QC` — nf-core/spatialvi spot-level quality control',
    description: 'Filters tissue spots by minimum gene count, UMI count, and mitochondrial gene percentage — spatial-aware QC.',
    technicalDetail: 'nf-core/spatialvi applies spot-level QC filters: minimum genes per spot, minimum UMIs, maximum mitochondrial gene percentage. Spots failing QC are removed before downstream analysis. The spatial context (tissue position) is retained throughout.',
    category: 'analysis', icon: '🧹',
    inputPorts: [{ id: 'in-spatial', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-filtered', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Applying the same QC thresholds as scRNA-seq. Spatial spots are not single cells — they contain multiple cells, so UMI and gene counts are typically higher.',
    exampleOutput: 'Filtered spatial object with tissue spots passing QC criteria.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['nf-core/spatialvi QC modules'],
  }),

  spatial_normalization: B({
    type: 'spatial_normalization', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Spatial Normalization',
    technicalConcept: 'SCTransform or library-size normalisation — nf-core/spatialvi',
    description: 'Normalises gene expression across spatial spots to remove technical variation while preserving spatial expression patterns.',
    technicalDetail: 'nf-core/spatialvi normalises spatial count data using SCTransform or log-normalisation. Unlike scRNA-seq, spatial normalisation must preserve the spatial relationships between spots — batch correction methods that destroy spatial structure should not be used.',
    category: 'analysis', icon: '⚖️',
    inputPorts: [{ id: 'in-filtered', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-norm', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Applying aggressive batch correction before spatial analysis. Methods like Harmony remove spatial variation that may be biologically meaningful.',
    exampleOutput: 'Normalised spatial expression data ready for clustering and SVG detection.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['nf-core/spatialvi normalisation'],
  }),

  spatial_clustering: B({
    type: 'spatial_clustering', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Spatial Clustering',
    technicalConcept: 'Graph-based clustering on spatial data — nf-core/spatialvi',
    description: 'Groups spots into clusters representing spatially distinct tissue regions — similar to scRNA-seq clustering but spatially resolved.',
    technicalDetail: 'nf-core/spatialvi performs PCA → neighbourhood graph → Leiden clustering on spatial spots. The resulting clusters can be visualised on the tissue histology image, revealing spatially defined tissue compartments (tumour core, stroma, immune infiltrate, etc.).',
    category: 'analysis', icon: '🫧',
    inputPorts: [{ id: 'in-norm', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-clusters', label: 'QC output', dataType: 'qc_output' }],
    commonMistake: 'Not visualising clusters on the tissue image. Unlike scRNA-seq, spatial clustering gains meaning when overlaid on histology — always check cluster boundaries against tissue anatomy.',
    exampleOutput: 'Cluster-annotated spots visualised on the histology image.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['nf-core/spatialvi clustering'],
  }),

  spatial_visualization: B({
    type: 'spatial_visualization', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Spatial Plots',
    technicalConcept: 'Spatially variable gene detection + tissue plots — nf-core/spatialvi',
    description: 'Identifies genes with spatially variable expression (SVGs) and generates expression plots overlaid on the tissue histology image.',
    technicalDetail: 'nf-core/spatialvi detects spatially variable genes (SVGs) using SpatialDE or Moran\'s I. Expression of individual genes and cluster labels are plotted as colour gradients on the tissue image, revealing spatial expression patterns.',
    category: 'analysis', icon: '🎨',
    inputPorts: [{ id: 'in-clusters', label: 'QC output', dataType: 'qc_output' }],
    outputPorts: [{ id: 'out-plots', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Only analysing the top SVGs by statistical significance. Biologically important genes may not be statistically significant with small sample sizes — also examine genes of known spatial importance for the tissue type.',
    exampleOutput: 'Tissue plots with cluster overlays and per-gene expression heatmaps on histology.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['SpatialDE', 'nf-core/spatialvi'],
  }),

  spatialvi_report: B({
    type: 'spatialvi_report', pack: 'spatialvi', status: 'phase2', executionMode: 'coming_soon',
    displayName: 'Spatial Report',
    technicalConcept: '`MULTIQC` — nf-core/spatialvi QC summary',
    description: 'MultiQC summary of Space Ranger alignment statistics, spot QC metrics, and cluster composition across all samples.',
    technicalDetail: 'nf-core/spatialvi generates MultiQC with Space Ranger mapping rates, median genes/spot, median UMIs/spot, and fraction of spots under tissue. Inter-sample comparisons reveal batch effects before downstream analysis.',
    category: 'output', icon: '📊',
    inputPorts: [{ id: 'in-plots', label: 'Report data', dataType: 'report_data' }],
    outputPorts: [{ id: 'out-report', label: 'Report data', dataType: 'report_data' }],
    commonMistake: 'Not checking median genes/spot across samples. Low median genes/spot (< 500) indicates poor RNA quality in the tissue section or incorrect slide handling.',
    exampleOutput: 'MultiQC report with Space Ranger statistics and QC metrics in `results/multiqc/` from nf-core/spatialvi.',
    nfCoreDocsLink: 'https://nf-co.re/spatialvi/docs/output',
    realToolExamples: ['MULTIQC (nf-core/modules)', 'nf-core/spatialvi'],
  }),
}

export const ALL_BLOCK_TYPES = Object.keys(BLOCK_DEFINITIONS) as BlockType[]

export const AVAILABLE_BLOCK_TYPES = ALL_BLOCK_TYPES.filter(
  t => BLOCK_DEFINITIONS[t].status === 'available'
)
