'use client'

import { useState } from 'react'

// ─── Command part definitions ─────────────────────────────────────────────────

export interface CommandPart {
  id: string
  text: string
  label: string
  category: 'cli' | 'pipeline' | 'profile' | 'param' | 'flag'
  description: string
  whyItMatters: string
  docsUrl: string
  example?: string
}

const CATEGORY_COLORS: Record<CommandPart['category'], string> = {
  cli:      'oklch(44% 0.150 270)',  // purple — the tool itself
  pipeline: 'oklch(52% 0.22 152)',   // green — the pipeline name
  profile:  'oklch(58% 0.20 212)',   // teal-blue — execution environment
  param:    'oklch(68% 0.150 75)',   // amber — parameters
  flag:     'oklch(52% 0.20 232)',   // blue — output flags
}

const CATEGORY_LABELS: Record<CommandPart['category'], string> = {
  cli:      'CLI command',
  pipeline: 'Pipeline',
  profile:  'Profile',
  param:    'Parameter',
  flag:     'Flag',
}

// ─── Build command parts from the active pipeline context ─────────────────────

export interface CommandContext {
  pipelineName: string       // e.g. 'nf-core/rnaseq'
  pipelineUrl: string
  profile: string            // e.g. 'docker'
  genome?: string
  hasParameterBlock: boolean
  hasProfileBlock: boolean
}

export function buildCommandParts(ctx: CommandContext): CommandPart[] {
  const parts: CommandPart[] = [
    {
      id: 'nextflow-run',
      text: 'nextflow run',
      label: 'Nextflow CLI',
      category: 'cli',
      description: 'The Nextflow command-line tool invokes your pipeline. "run" tells it to execute a named workflow.',
      whyItMatters: 'Nextflow manages parallelisation, retry logic, caching, and container pulling automatically. You never call the pipeline tools directly.',
      docsUrl: 'https://www.nextflow.io/docs/latest/cli.html#run',
      example: 'nextflow run hello  # runs the Hello World pipeline',
    },
    {
      id: 'pipeline-name',
      text: ctx.pipelineName,
      label: 'Pipeline name',
      category: 'pipeline',
      description: `The nf-core pipeline to run. Nextflow downloads it from GitHub (github.com/${ctx.pipelineName}) automatically the first time.`,
      whyItMatters: 'Using a named nf-core pipeline gives you a peer-reviewed, versioned, containerised workflow with documented parameters and consistent output structure.',
      docsUrl: ctx.pipelineUrl,
      example: `nextflow run ${ctx.pipelineName} --help`,
    },
    {
      id: 'profile',
      text: `-profile ${ctx.profile}`,
      label: '-profile',
      category: 'profile',
      description: `Selects the "${ctx.profile}" execution profile. This controls how Nextflow runs each process — which container engine, scheduler, or compute environment to use.`,
      whyItMatters: 'nf-core pipelines ship with profiles for Docker, Singularity, Conda, and institutional HPC clusters. Choosing the right one ensures reproducibility across environments.',
      docsUrl: 'https://nf-co.re/docs/running/configuration',
      example: '-profile docker,test  # combine multiple profiles',
    },
    {
      id: 'input',
      text: '--input samplesheet.csv',
      label: '--input',
      category: 'param',
      description: 'Points to your samplesheet CSV file. nf-core/rnaseq reads sample names and FASTQ file paths from this table.',
      whyItMatters: 'The samplesheet is the primary user input to any nf-core pipeline. It is validated at startup using JSON Schema before any compute begins.',
      docsUrl: 'https://nf-co.re/rnaseq/docs/usage#samplesheet-input',
      example: '--input s3://my-bucket/samples.csv  # works with S3 too',
    },
    {
      id: 'genome',
      text: `--genome ${ctx.genome ?? 'GRCh38'}`,
      label: '--genome',
      category: 'param',
      description: `Selects the reference genome. nf-core/rnaseq downloads the FASTA, GTF, and pre-built STAR index from AWS iGenomes automatically.`,
      whyItMatters: 'Specifying a genome by name rather than file path lets nf-core manage versioning, checksums, and index caching — no manual genome prep needed.',
      docsUrl: 'https://nf-co.re/rnaseq/parameters#genome',
      example: '--genome GRCm39  # mouse genome',
    },
    {
      id: 'outdir',
      text: '--outdir results',
      label: '--outdir',
      category: 'flag',
      description: 'The directory where all pipeline outputs will be published. nf-core/rnaseq creates subdirectories per tool (fastqc/, star_salmon/, multiqc/).',
      whyItMatters: "Every nf-core pipeline uses Nextflow's publishDir directive to copy final outputs here. Intermediate work files go in a separate work/ directory.",
      docsUrl: 'https://nf-co.re/rnaseq/docs/output',
      example: '--outdir s3://my-bucket/results  # publish directly to S3',
    },
  ]

  return parts
}

// ─── Single chip ──────────────────────────────────────────────────────────────

function CommandChip({ part, selected, onSelect }: {
  part: CommandPart
  selected: boolean
  onSelect: (id: string | null) => void
}) {
  const color = CATEGORY_COLORS[part.category]

  return (
    <button
      onClick={() => onSelect(selected ? null : part.id)}
      aria-expanded={selected}
      aria-label={`${part.text} — ${part.label}`}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-mono font-semibold transition-all duration-fast focus-visible:ring-2 focus-visible:ring-focus-ring"
      style={{
        background: selected ? color : `${color}22`,
        color: selected ? 'white' : color,
        border: `1.5px solid ${color}`,
        boxShadow: selected ? `0 3px 0 oklch(0% 0 0 / 0.20)` : 'none',
      }}
    >
      {part.text}
    </button>
  )
}

// ─── Explanation card ─────────────────────────────────────────────────────────

function ExplanationCard({ part, onClose }: { part: CommandPart; onClose: () => void }) {
  const color = CATEGORY_COLORS[part.category]

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4 animate-fade-up"
      style={{ borderColor: color, background: `${color}0a` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <code className="text-sm font-mono font-bold" style={{ color }}>{part.text}</code>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-block-text"
              style={{ background: color }}
            >
              {CATEGORY_LABELS[part.category]}
            </span>
          </div>
          <p className="text-base text-fg-primary leading-relaxed">{part.description}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-fg-muted hover:text-fg-primary transition-colors"
          aria-label="Close explanation"
        >
          ✕
        </button>
      </div>

      {/* Why it matters */}
      <div
        className="rounded-lg px-4 py-3"
        style={{ background: `${color}12` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color }}>
          💡 Why this matters
        </p>
        <p className="text-sm text-fg-secondary leading-relaxed">{part.whyItMatters}</p>
      </div>

      {/* Example */}
      {part.example && (
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">Example</p>
          <code className="text-xs font-mono text-fg-secondary bg-surface-2 px-3 py-1.5 rounded-lg block">
            {part.example}
          </code>
        </div>
      )}

      {/* Docs link */}
      <a
        href={part.docsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold self-start focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
        style={{ color }}
      >
        View nf-core docs ↗
      </a>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CommandBridgeProps {
  ctx: CommandContext
}

export function CommandBridge({ ctx }: CommandBridgeProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const parts = buildCommandParts(ctx)
  const selectedPart = parts.find(p => p.id === selected) ?? null

  const fullCommand = parts.map(p => p.text).join(' \\\n  ')

  const copyCommand = async () => {
    await navigator.clipboard.writeText(parts.map(p => p.text).join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-fg-primary">Command Bridge</h3>
          <p className="text-xs text-fg-muted">Click any part of the command to learn what it does.</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full text-block-text"
          style={{ background: 'var(--color-warning)' }}
        >
          Educational — not executed
        </span>
      </div>

      {/* Command chips */}
      <div
        className="flex flex-wrap gap-2 p-4 rounded-xl border border-border bg-surface-2"
        role="group"
        aria-label="Command parts — click to learn"
      >
        {parts.map(part => (
          <CommandChip
            key={part.id}
            part={part}
            selected={selected === part.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Explanation card for selected part */}
      {selectedPart && (
        <ExplanationCard part={selectedPart} onClose={() => setSelected(null)} />
      )}

      {/* Raw command + copy */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Full command</p>
          <button
            onClick={copyCommand}
            className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
            style={{
              background: copied ? 'var(--color-success)' : 'var(--color-surface-2)',
              color: copied ? 'white' : 'var(--color-fg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre
          className="text-xs font-mono p-4 rounded-xl overflow-x-auto"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-fg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {fullCommand}
        </pre>
      </div>
    </div>
  )
}
