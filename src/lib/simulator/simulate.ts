import { topologicalSort } from '@/lib/compiler/compile'
import { DEMO_SAMPLES } from '@/data/demo-samplesheet'
import type {
  WorkflowIR,
  IRBlock,
  SimulationResult,
  TraceEntry,
  ReportCard,
  SampleResult,
  BlockType,
} from '@/types'

// ─── Internal run context ────────────────────────────────────────────────────

interface RunContext {
  samples: typeof DEMO_SAMPLES
  fastqLoaded: boolean
  qcCompleted: boolean
  trimCompleted: boolean
  reportGenerated: boolean
  warnings: string[]
}

function freshContext(): RunContext {
  return {
    samples: DEMO_SAMPLES,
    fastqLoaded: false,
    qcCompleted: false,
    trimCompleted: false,
    reportGenerated: false,
    warnings: [],
  }
}

// ─── Block handlers ──────────────────────────────────────────────────────────

type HandlerResult = {
  context: RunContext
  message: string
  status: TraceEntry['status']
  details?: string
}

type BlockHandler = (context: RunContext, block: IRBlock) => HandlerResult

const handlers: Partial<Record<BlockType, BlockHandler>> = {
  start_pipeline: (ctx, _block) => ({
    context: ctx,
    message: 'Pipeline started.',
    status: 'success',
    details: 'The pipeline context was initialised.',
  }),

  samplesheet: (ctx, _block) => ({
    context: ctx,
    message: `Your sample list was checked. ${ctx.samples.length} sample${ctx.samples.length !== 1 ? 's' : ''} found.`,
    status: 'success',
    details: `Samples: ${ctx.samples.map(s => s.sample).join(', ')}. All required columns (sample, fastq_1, fastq_2) are present.`,
  }),

  input_fastq: (ctx, _block) => ({
    context: { ...ctx, fastqLoaded: true },
    message: `FASTQ files loaded for ${ctx.samples.length} paired-end sample${ctx.samples.length !== 1 ? 's' : ''}.`,
    status: 'success',
    details: `${ctx.samples.length * 2} files ready: R1 and R2 for each sample.`,
  }),

  qc_step: (ctx, _block) => {
    if (!ctx.fastqLoaded) {
      return {
        context: ctx,
        message: 'QC Step could not run — no FASTQ files were loaded.',
        status: 'error',
        details: 'Make sure Input FASTQ is connected and placed before QC Step.',
      }
    }
    return {
      context: { ...ctx, qcCompleted: true },
      message: 'Quality control completed. Your reads look healthy.',
      status: 'success',
      details: 'All samples passed read quality checks. Mean Phred score ≥ 28. No adapter contamination detected.',
    }
  },

  trim_reads: (ctx, _block) => ({
    context: { ...ctx, trimCompleted: true },
    message: 'Reads trimmed. Low-quality bases and adapters removed.',
    status: 'success',
    details: 'Average trimming removed 1.2% of bases. Cleaned reads are ready for downstream analysis.',
  }),

  generate_report: (ctx, _block) => {
    if (!ctx.qcCompleted) {
      return {
        context: ctx,
        message: 'Report could not be generated — QC has not run yet.',
        status: 'warning',
        details: 'Connect a QC Step block before Generate Report.',
      }
    }
    return {
      context: { ...ctx, reportGenerated: true },
      message: 'QC summary report generated. All samples are included.',
      status: 'success',
      details: 'Report includes per-sample quality metrics, GC content, and read-length distribution.',
    }
  },

  output_results: (ctx, _block) => ({
    context: ctx,
    message: 'Results saved to the output folder.',
    status: 'success',
    details: 'Final QC report and processed files are ready for download.',
  }),

  // ─ FASTQ Basics handlers ─
  run_profile: (ctx, _block) => ({
    context: ctx,
    message: 'Run profile configured. Docker/Singularity environment selected.',
    status: 'success',
    details: 'The -profile flag will be added to the generated nextflow run command.',
  }),
  parameter_setting: (ctx, _block) => ({
    context: ctx,
    message: 'Pipeline parameter applied.',
    status: 'success',
    details: 'This parameter will appear in the generated nextflow run command.',
  }),
  paired_validator: (ctx, _block) => ({
    context: { ...ctx, fastqLoaded: true },
    message: `Paired-end validation passed for ${ctx.samples.length} sample${ctx.samples.length !== 1 ? 's' : ''}.`,
    status: 'success',
    details: 'All samples have matching R1 and R2 files.',
  }),
  adapter_detector: (ctx, _block) => ({
    context: ctx,
    message: 'Adapter detection complete. Common Illumina adapters detected.',
    status: 'warning',
    details: 'TruSeq adapters found in SAMPLE1. Run Trim Reads to remove them before alignment.',
  }),
  read_length_checker: (ctx, _block) => ({
    context: ctx,
    message: 'Read length check passed. All reads are 150 bp.',
    status: 'success',
    details: 'Consistent read lengths across all samples. No trimming artefacts detected.',
  }),
}

// ─── Report card builder ─────────────────────────────────────────────────────

function buildReportCard(ctx: RunContext): ReportCard {
  const samples: SampleResult[] = ctx.samples.map((s, i) => ({
    name: s.sample,
    readCount: 1_250_000 + i * 150_000,
    qualityStatus: i === 0 ? 'pass' : 'warn',
    message:
      i === 0
        ? 'Excellent read quality. No issues detected.'
        : 'Slightly elevated adapter content. Consider trimming before alignment.',
  }))

  const anyWarn = samples.some(s => s.qualityStatus === 'warn')
  return {
    title: 'QC Report — My First Pipeline',
    status: anyWarn ? 'warn' : 'pass',
    summary: anyWarn
      ? 'Most samples passed QC. One sample has elevated adapter content — review before analysis.'
      : 'All samples passed quality control checks.',
    samples,
    generatedAt: '2026-05-14T00:00:00Z',
  }
}

// ─── Main simulate function ───────────────────────────────────────────────────

/**
 * Simulate a WorkflowIR deterministically.
 * Pure function — no I/O, no side effects, no async.
 * Call validate(ir) before calling this function.
 */
export function simulate(ir: WorkflowIR): SimulationResult {
  if (ir.blocks.length === 0) {
    return { status: 'blocked', trace: [], reportCard: null, generatedCommand: null }
  }

  let sortedIds: string[]
  try {
    sortedIds = topologicalSort(ir)
  } catch {
    return {
      status: 'failed',
      trace: [{ step: 1, blockId: '', blockType: 'start_pipeline', message: 'Pipeline has a loop and cannot run.', status: 'error' }],
      reportCard: null,
      generatedCommand: null,
    }
  }

  let ctx = freshContext()
  const trace: TraceEntry[] = []

  for (let i = 0; i < sortedIds.length; i++) {
    const blockId = sortedIds[i]
    const block = ir.blocks.find(b => b.id === blockId)
    if (!block) continue

    const handler = handlers[block.type] ?? ((ctx: RunContext): HandlerResult => ({
      context: ctx,
      message: `${block.type.replace(/_/g, ' ')} — coming in a future pack.`,
      status: 'warning',
    }))
    if (!handler) continue

    const result = handler(ctx, block)
    ctx = result.context
    trace.push({
      step: i + 1,
      blockId,
      blockType: block.type,
      message: result.message,
      status: result.status,
      details: result.details,
    })

    if (result.status === 'error') {
      return { status: 'failed', trace, reportCard: null, generatedCommand: null }
    }
  }

  const reportCard = ctx.reportGenerated ? buildReportCard(ctx) : null
  const generatedCommand =
    'nextflow run nf-core/rnaseq -profile test,docker \\\n' +
    '  --input samplesheet.csv \\\n' +
    '  --genome GRCh38 \\\n' +
    '  --outdir results'

  return { status: 'completed', trace, reportCard, generatedCommand }
}
