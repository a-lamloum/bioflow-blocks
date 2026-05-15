/**
 * Nextflow DSL2 code generator.
 * Given a WorkflowIR (compiled from the visual canvas), generates
 * the real Nextflow DSL2 main.nf skeleton that a learner would write.
 *
 * The output is educational — it matches nf-core conventions exactly
 * but is annotated with comments explaining each line.
 */

import type { WorkflowIR, IRBlock, BlockType } from '@/types'

// ─── Per-block code snippets ─────────────────────────────────────────────────

export interface CodeLine {
  code: string
  comment?: string
  indent?: number
  blank?: boolean
  type?: 'include' | 'channel' | 'process-call' | 'output' | 'keyword' | 'comment-only' | 'meta'
}

const BLOCK_INCLUDES: Partial<Record<BlockType, string>> = {
  qc_step:        "include { FASTQC } from 'nf-core/modules/nf-core/fastqc/main'",
  trim_reads:     "include { TRIMGALORE } from 'nf-core/modules/nf-core/trimgalore/main'",
  generate_report:"include { MULTIQC } from 'nf-core/modules/nf-core/multiqc/main'",
  bwa_aligner:    "include { BWAMEM2_MEM } from 'nf-core/modules/nf-core/bwamem2/mem/main'",
  mark_duplicates:"include { GATK4_MARKDUPLICATES } from 'nf-core/modules/nf-core/gatk4/markduplicates/main'",
  variant_caller: "include { GATK4_HAPLOTYPECALLER } from 'nf-core/modules/nf-core/gatk4/haplotypecaller/main'",
  kraken2:        "include { KRAKEN2_KRAKEN2 } from 'nf-core/modules/nf-core/kraken2/kraken2/main'",
  cellranger:     "include { CELLRANGER_COUNT } from 'nf-core/modules/nf-core/cellranger/count/main'",
  paired_validator:"include { SAMPLESHEET_CHECK } from 'nf-core/modules/local/samplesheet_check/main'",
}

function blockToProcessCall(block: IRBlock, prevBlock: IRBlock | null): CodeLine[] {
  const lines: CodeLine[] = []
  switch (block.type) {
    case 'start_pipeline':
      break

    case 'samplesheet':
      lines.push({ blank: true, code: '' })
      lines.push({ code: '    //━━━━━ INPUT ━━━━━', type: 'comment-only', indent: 0 })
      lines.push({
        code: '    ch_samplesheet = Channel.fromSamplesheet(params.input)',
        comment: 'Creates a typed channel from your CSV samplesheet (nf-validation plugin)',
        type: 'channel', indent: 1,
      })
      lines.push({
        code: '    // ch_samplesheet emits: [ meta, fastq_1, fastq_2 ]',
        comment: 'meta = { id: "SAMPLE1", single_end: false, strandedness: "auto" }',
        type: 'meta', indent: 1,
      })
      break

    case 'input_fastq':
      lines.push({
        code: '    ch_reads = ch_samplesheet',
        comment: 'FASTQ reads channel is the validated samplesheet output',
        type: 'channel', indent: 1,
      })
      break

    case 'qc_step':
      lines.push({ blank: true, code: '' })
      lines.push({ code: '    //━━━━━ QC ━━━━━', type: 'comment-only', indent: 0 })
      lines.push({
        code: '    FASTQC(ch_reads)',
        comment: 'FASTQC module — wraps FastQC, produces HTML + ZIP per sample',
        type: 'process-call', indent: 1,
      })
      lines.push({
        code: '    ch_multiqc_files = FASTQC.out.zip.collect()',
        comment: '.out.zip accesses the ZIP output channel; .collect() gathers all samples',
        type: 'channel', indent: 1,
      })
      break

    case 'trim_reads':
      lines.push({ blank: true, code: '' })
      lines.push({ code: '    //━━━━━ TRIMMING ━━━━━', type: 'comment-only', indent: 0 })
      lines.push({
        code: '    TRIMGALORE(ch_reads)',
        comment: 'TRIMGALORE module — auto-detects adapters, trims with Cutadapt',
        type: 'process-call', indent: 1,
      })
      lines.push({
        code: '    ch_reads_trimmed = TRIMGALORE.out.reads',
        comment: 'Trimmed reads channel flows to downstream alignment',
        type: 'channel', indent: 1,
      })
      lines.push({
        code: '    ch_multiqc_files = ch_multiqc_files.mix(TRIMGALORE.out.log.collect())',
        comment: '.mix() merges two channels; trimming reports added to MultiQC inputs',
        type: 'channel', indent: 1,
      })
      break

    case 'generate_report':
      lines.push({ blank: true, code: '' })
      lines.push({ code: '    //━━━━━ REPORT ━━━━━', type: 'comment-only', indent: 0 })
      lines.push({
        code: '    MULTIQC(',
        comment: 'MULTIQC module — aggregates all QC reports into one HTML',
        type: 'process-call', indent: 1,
      })
      lines.push({ code: '        ch_multiqc_files,', indent: 2, type: 'process-call' })
      lines.push({ code: '        [],  // multiqc_config', indent: 2, type: 'process-call' })
      lines.push({ code: '        [],  // extra_multiqc_config', indent: 2, type: 'process-call' })
      lines.push({ code: '        []   // multiqc_logo', indent: 2, type: 'process-call' })
      lines.push({ code: '    )', indent: 1, type: 'process-call' })
      break

    case 'output_results':
      lines.push({ blank: true, code: '' })
      lines.push({ code: '    //━━━━━ OUTPUT ━━━━━', type: 'comment-only', indent: 0 })
      lines.push({
        code: '    // Results published via publishDir in each module\'s main.nf',
        type: 'comment-only', indent: 1,
      })
      lines.push({
        code: '    // → results/fastqc/   results/trimgalore/   results/multiqc/',
        type: 'comment-only', indent: 1,
      })
      lines.push({
        code: '    // Set --outdir to choose the destination directory.',
        type: 'comment-only', indent: 1,
      })
      break

    case 'run_profile':
      // Shown in config section, not in workflow body
      break

    case 'parameter_setting':
      // Shown in config section, not in workflow body
      break

    default:
      lines.push({
        code: `    // ${block.type.replace(/_/g, ' ').toUpperCase()} (module coming soon)`,
        type: 'comment-only', indent: 1,
      })
  }
  return lines
}

// ─── Main code generator ──────────────────────────────────────────────────────

export interface GeneratedCode {
  mainNf: CodeLine[]
  nextflowConfig: CodeLine[]
  samplesheetCsv: string
  runCommand: string
}

export function generateDSL2(ir: WorkflowIR): GeneratedCode {
  const blocks = ir.blocks

  // Determine which blocks are present
  const hasQC      = blocks.some(b => b.type === 'qc_step')
  const hasTrim    = blocks.some(b => b.type === 'trim_reads')
  const hasReport  = blocks.some(b => b.type === 'generate_report')
  const hasProfile = blocks.some(b => b.type === 'run_profile')
  const hasParam   = blocks.some(b => b.type === 'parameter_setting')

  // ── Collect includes ──────────────────────────────────────────────────────
  const includeLines: CodeLine[] = [
    { code: '#!/usr/bin/env nextflow', type: 'keyword' },
    { blank: true, code: '' },
    { code: '/*', type: 'comment-only' },
    { code: ' * BioFlow Blocks — generated Nextflow DSL2 skeleton', type: 'comment-only' },
    { code: ' * Pipeline: nf-core/rnaseq (educational representation)', type: 'comment-only' },
    { code: ' * Docs: https://nf-co.re/rnaseq', type: 'comment-only' },
    { code: ' */', type: 'comment-only' },
    { blank: true, code: '' },
    { code: 'nextflow.enable.dsl = 2', comment: 'Required for DSL2 syntax (Nextflow ≥ 22.10)', type: 'keyword' },
    { blank: true, code: '' },
    { code: '// ── Module imports ──────────────────────────────────────', type: 'comment-only' },
    { code: '// Each include {} statement imports one nf-core module from the modules repository.', type: 'comment-only' },
    { code: '// Format: include { MODULE_NAME } from \'path/to/main\'', type: 'comment-only' },
    { blank: true, code: '' },
  ]

  for (const block of blocks) {
    const inc = BLOCK_INCLUDES[block.type]
    if (inc) {
      includeLines.push({
        code: inc,
        comment: `↑ nf-core module: ${block.type.replace(/_/g, ' ')}`,
        type: 'include',
      })
    }
  }

  // ── Workflow body ─────────────────────────────────────────────────────────
  const workflowLines: CodeLine[] = [
    { blank: true, code: '' },
    { code: '// ── Workflow definition ─────────────────────────────────', type: 'comment-only' },
    {
      code: 'workflow RNASEQ {',
      comment: 'The top-level workflow block — called by the entry workflow in main.nf',
      type: 'keyword',
    },
    {
      code: '    take:',
      comment: '"take:" declares what this workflow receives as input',
      type: 'keyword',
      indent: 1,
    },
    {
      code: '        ch_samplesheet  // channel: [ meta, fastq_1, fastq_2 ]',
      type: 'channel', indent: 2,
    },
    { blank: true, code: '' },
    {
      code: '    main:',
      comment: '"main:" contains all the process calls and channel transformations',
      type: 'keyword', indent: 1,
    },
  ]

  let prevBlock: IRBlock | null = null
  for (const block of blocks) {
    const lines = blockToProcessCall(block, prevBlock)
    workflowLines.push(...lines)
    prevBlock = block
  }

  workflowLines.push({ blank: true, code: '' })
  workflowLines.push({
    code: '    emit:',
    comment: '"emit:" names the outputs this workflow exposes to callers',
    type: 'keyword', indent: 1,
  })
  if (hasQC) {
    workflowLines.push({ code: '        fastqc_html = FASTQC.out.html  // FastQC HTML reports', type: 'output', indent: 2 })
  }
  if (hasReport) {
    workflowLines.push({ code: '        multiqc_report = MULTIQC.out.report  // MultiQC HTML', type: 'output', indent: 2 })
  }
  workflowLines.push({ code: '}', type: 'keyword' })

  // ── nextflow.config ────────────────────────────────────────────────────
  const configLines: CodeLine[] = [
    { code: '// nextflow.config — pipeline configuration', type: 'comment-only' },
    { blank: true, code: '' },
    { code: 'params {', type: 'keyword' },
    { code: "    input       = 'samplesheet.csv'  // --input flag", type: 'channel', indent: 1 },
    { code: "    genome      = 'GRCh38'           // --genome flag (iGenomes)", type: 'channel', indent: 1 },
    { code: "    outdir      = 'results'           // --outdir flag", type: 'channel', indent: 1 },
    { code: "    aligner     = 'star_salmon'       // --aligner flag", type: 'channel', indent: 1 },
    { code: '}', type: 'keyword' },
    { blank: true, code: '' },
    { code: 'process {', comment: 'Default resource requirements for all processes', type: 'keyword' },
    { code: '    cpus   = 4', indent: 1, type: 'channel' },
    { code: "    memory = '16 GB'", indent: 1, type: 'channel' },
    { code: "    time   = '2 h'", indent: 1, type: 'channel' },
    { blank: true, code: '' },
    { code: "    withLabel: 'process_high' {", indent: 1, comment: 'Labelled resources override defaults', type: 'keyword' },
    { code: '        cpus   = 16', indent: 2, type: 'channel' },
    { code: "        memory = '64 GB'", indent: 2, type: 'channel' },
    { code: '    }', indent: 1, type: 'keyword' },
    { code: '}', type: 'keyword' },
    { blank: true, code: '' },
    { code: 'profiles {', comment: 'Switch between environments with -profile <name>', type: 'keyword' },
    { code: '    docker {', indent: 1, type: 'keyword' },
    { code: '        docker.enabled = true', indent: 2, type: 'channel' },
    { code: '    }', indent: 1, type: 'keyword' },
    { code: '    singularity {', indent: 1, type: 'keyword' },
    { code: '        singularity.enabled = true', indent: 2, type: 'channel' },
    { code: '        singularity.autoMounts = true', indent: 2, type: 'channel' },
    { code: '    }', indent: 1, type: 'keyword' },
    { code: "    test { includeConfig 'conf/test.config' }", indent: 1, comment: 'Uses tiny test dataset', type: 'keyword' },
    { code: '}', type: 'keyword' },
  ]

  // ── Samplesheet CSV ────────────────────────────────────────────────────
  const samplesheetCsv = [
    'sample,fastq_1,fastq_2,strandedness',
    'SAMPLE1,SAMPLE1_R1.fastq.gz,SAMPLE1_R2.fastq.gz,auto',
    'SAMPLE2,SAMPLE2_R1.fastq.gz,SAMPLE2_R2.fastq.gz,auto',
  ].join('\n')

  // ── Run command ────────────────────────────────────────────────────────
  const profile = hasProfile ? 'docker' : 'docker'
  const runCommand = [
    'nextflow run nf-core/rnaseq \\',
    `  -profile ${profile} \\`,
    '  --input samplesheet.csv \\',
    '  --genome GRCh38 \\',
    '  --outdir results',
  ].join('\n')

  return {
    mainNf: [...includeLines, ...workflowLines],
    nextflowConfig: configLines,
    samplesheetCsv,
    runCommand,
  }
}

// ─── Utility: render CodeLine[] to a plain string ────────────────────────────

export function renderCode(lines: CodeLine[]): string {
  return lines.map(l => {
    if (l.blank) return ''
    const indent = '    '.repeat(l.indent ?? 0)
    return `${indent}${l.code}`
  }).join('\n')
}
