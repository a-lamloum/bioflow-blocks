'use client'

import { useState } from 'react'

interface Concept {
  id: string
  icon: string
  name: string
  tagline: string
  description: string
  nfcoreNote: string
  docsUrl: string
  color: string
}

const CONCEPTS: Concept[] = [
  {
    id: 'org',
    icon: '🏢',
    name: 'Organization',
    tagline: 'Top-level account (your institution or team)',
    description: 'An Organization is the top-level account on Seqera Platform. It groups multiple Workspaces. Universities, companies, or research groups each have one Organization.',
    nfcoreNote: 'nf-core community members often share an Organization to collaborate on pipeline development and benchmarking.',
    docsUrl: 'https://docs.seqera.io/platform/latest/orgs-and-teams/organizations',
    color: 'oklch(52% 0.20 232)',
  },
  {
    id: 'workspace',
    icon: '🗂️',
    name: 'Workspace',
    tagline: 'Isolated project space with its own resources and team',
    description: 'A Workspace contains Compute Environments, Pipelines, Datasets, and Runs. It is the primary unit of isolation — different projects or teams get different Workspaces with separate permissions.',
    nfcoreNote: 'A typical setup: one Workspace per project ("RNA-seq study 2024", "ChIP-seq analysis"). Each Workspace has its own credentials and compute resources.',
    docsUrl: 'https://docs.seqera.io/platform/latest/orgs-and-teams/workspaces',
    color: 'oklch(50% 0.25 302)',
  },
  {
    id: 'compute',
    icon: '⚙️',
    name: 'Compute Environment',
    tagline: 'Pre-configured execution backend (AWS Batch, SLURM, GCP, Azure)',
    description: 'A Compute Environment stores all the configuration for a specific execution backend: credentials, region, instance types, queues, resource limits, and the Nextflow head job configuration. Once set up, users select it like a profile.',
    nfcoreNote: 'This replaces the -profile docker flag. When launching nf-core/rnaseq via Seqera, you pick a Compute Environment instead of typing -profile parameters manually.',
    docsUrl: 'https://docs.seqera.io/platform/latest/compute-envs/overview',
    color: 'oklch(68% 0.150 75)',
  },
  {
    id: 'dataset',
    icon: '📊',
    name: 'Dataset',
    tagline: 'Managed samplesheet stored and versioned in Seqera',
    description: 'Datasets are CSV/TSV files (nf-core samplesheets) stored directly in Seqera Platform. They can be uploaded, versioned, and reused across pipeline runs without pointing to external file paths.',
    nfcoreNote: 'Upload your nf-core samplesheet as a Seqera Dataset. When launching nf-core/rnaseq, select the Dataset as --input instead of typing a file path. Seqera handles staging the file to compute nodes.',
    docsUrl: 'https://docs.seqera.io/platform/latest/datasets/overview',
    color: 'oklch(52% 0.22 152)',
  },
  {
    id: 'pipeline',
    icon: '🔄',
    name: 'Pipeline',
    tagline: 'Saved nf-core pipeline configuration with pinned version and default params',
    description: 'A Pipeline in Seqera is a saved configuration pointing to a Nextflow pipeline repository (e.g. https://github.com/nf-core/rnaseq) with a specific version (-r), default parameters, and a default Compute Environment.',
    nfcoreNote: 'Add nf-core/rnaseq once as a Seqera Pipeline (with -r 3.14.0 pinned). Users can then launch it with one click, overriding only the parameters they need to change.',
    docsUrl: 'https://docs.seqera.io/platform/latest/launch/launchpad',
    color: 'oklch(58% 0.20 212)',
  },
  {
    id: 'run',
    icon: '▶️',
    name: 'Run',
    tagline: 'A single pipeline execution — real-time monitoring, logs, metrics',
    description: 'A Run records one pipeline execution: which Pipeline and Dataset were used, the Compute Environment, start/end time, per-process resource usage (CPU, memory, wall time), and all Nextflow logs.',
    nfcoreNote: 'Seqera shows you a live task table equivalent to `nextflow log` — process status, exit codes, memory used, and links to work directory logs. Failed runs show .command.err inline.',
    docsUrl: 'https://docs.seqera.io/platform/latest/monitoring/overview',
    color: 'oklch(55% 0.170 20)',
  },
  {
    id: 'action',
    icon: '⚡',
    name: 'Action',
    tagline: 'Automated pipeline launch — webhook, schedule, or GitHub push trigger',
    description: 'Actions automatically launch pipelines when triggered: on a schedule (cron), via a GitHub webhook (new data committed), or via an API call. No manual launch needed.',
    nfcoreNote: 'Example: trigger nf-core/fetchngs + nf-core/rnaseq automatically when new sequencing data arrives in an S3 bucket — the whole analysis runs without a bioinformatician clicking anything.',
    docsUrl: 'https://docs.seqera.io/platform/latest/pipeline-actions/overview',
    color: 'oklch(50% 0.22 258)',
  },
]

export function SeqeraConceptMap() {
  const [selected, setSelected] = useState<string | null>('workspace')
  const concept = CONCEPTS.find(c => c.id === selected)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Seqera Platform Concepts</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Seqera Platform (formerly Nextflow Tower) is the official platform for launching and monitoring
          nf-core pipelines at scale. These 7 concepts map to everything in the Seqera UI.
        </p>
      </div>

      {/* Hierarchy diagram */}
      <div
        className="rounded-xl p-4 border border-border"
        style={{ background: 'var(--color-surface-2)' }}
      >
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">Hierarchy</p>
        <div className="flex flex-col gap-1 text-xs font-mono">
          {[
            { level: 0, icon: '🏢', label: 'Organization (your institution)' },
            { level: 1, icon: '🗂️', label: 'Workspace (one per project)' },
            { level: 2, icon: '⚙️', label: 'Compute Environments' },
            { level: 2, icon: '📊', label: 'Datasets (samplesheets)' },
            { level: 2, icon: '🔄', label: 'Pipelines (nf-core/rnaseq + params)' },
            { level: 2, icon: '▶️', label: 'Runs (one per execution)' },
            { level: 2, icon: '⚡', label: 'Actions (automated triggers)' },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2"
              style={{ paddingLeft: row.level * 20 }}>
              {row.level > 0 && <span className="text-fg-muted">└─</span>}
              <span>{row.icon}</span>
              <span className="text-fg-secondary">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Concept cards */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2">
        {CONCEPTS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all"
            style={{
              borderColor: selected === c.id ? c.color : 'var(--color-border)',
              background: selected === c.id ? `${c.color}12` : 'var(--color-surface)',
            }}
          >
            <span className="text-2xl">{c.icon}</span>
            <span className="text-xs font-bold" style={{ color: selected === c.id ? c.color : 'var(--color-fg-primary)' }}>
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      {concept && (
        <div
          className="rounded-xl p-5 flex flex-col gap-3 animate-fade-up"
          style={{ background: `${concept.color}0a`, border: `1px solid ${concept.color}44` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{concept.icon}</span>
            <div>
              <h4 className="text-base font-bold" style={{ color: concept.color }}>{concept.name}</h4>
              <p className="text-xs text-fg-muted">{concept.tagline}</p>
            </div>
          </div>
          <p className="text-sm text-fg-secondary leading-relaxed">{concept.description}</p>
          <div
            className="px-4 py-3 rounded-xl text-sm leading-relaxed"
            style={{ background: `${concept.color}12` }}
          >
            <span className="font-semibold" style={{ color: concept.color }}>nf-core context: </span>
            <span className="text-fg-secondary">{concept.nfcoreNote}</span>
          </div>
          <a href={concept.docsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold self-start" style={{ color: concept.color }}>
            Seqera docs ↗
          </a>
        </div>
      )}
    </div>
  )
}
