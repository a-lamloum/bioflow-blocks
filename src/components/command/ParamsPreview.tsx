'use client'

import { useState } from 'react'

interface ParamEntry {
  key: string
  value: string
  description: string
  docsUrl: string
}

interface ParamsPreviewProps {
  pipelineName: string
  profile: string
  genome?: string
}

export function ParamsPreview({ pipelineName, profile, genome = 'GRCh38' }: ParamsPreviewProps) {
  const [copied, setCopied] = useState(false)

  const params: ParamEntry[] = [
    {
      key: 'input',
      value: 'samplesheet.csv',
      description: 'Path to your CSV samplesheet (--input param)',
      docsUrl: 'https://nf-co.re/rnaseq/docs/usage#samplesheet-input',
    },
    {
      key: 'genome',
      value: genome,
      description: 'Reference genome from AWS iGenomes (--genome param)',
      docsUrl: 'https://nf-co.re/rnaseq/parameters#genome',
    },
    {
      key: 'outdir',
      value: 'results',
      description: 'Output directory for published results (--outdir param)',
      docsUrl: 'https://nf-co.re/rnaseq/parameters',
    },
    {
      key: 'aligner',
      value: 'star_salmon',
      description: 'Alignment + quantification tool (STAR + Salmon default)',
      docsUrl: 'https://nf-co.re/rnaseq/parameters#aligner',
    },
  ]

  const json = JSON.stringify(
    Object.fromEntries(params.map(p => [p.key, p.value])),
    null, 2
  )

  const copyJson = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Params file preview</p>
          <p className="text-xs text-fg-muted mt-0.5">
            Save this as <code className="font-mono">params.json</code> and pass with{' '}
            <code className="font-mono">-params-file params.json</code>
          </p>
        </div>
        <button
          onClick={copyJson}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors border border-border"
          style={{
            background: copied ? 'var(--color-success)' : 'var(--color-surface-2)',
            color: copied ? 'white' : 'var(--color-fg-secondary)',
          }}
        >
          {copied ? '✓ Copied!' : 'Copy JSON'}
        </button>
      </div>

      {/* JSON with annotations */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="px-4 py-2 border-b border-border text-xs font-mono text-fg-muted"
          style={{ background: 'var(--color-surface-2)' }}
        >
          params.json
        </div>
        <div className="p-4 font-mono text-xs" style={{ background: 'var(--color-surface)' }}>
          <span className="text-fg-muted">{'{'}</span>
          {params.map((param, i) => (
            <div key={param.key} className="group flex items-start gap-2 pl-4 py-0.5 hover:bg-surface-2 rounded transition-colors">
              <div className="flex-1">
                <span className="text-teal-500">&quot;{param.key}&quot;</span>
                <span className="text-fg-muted">: </span>
                <span className="text-fg-primary">&quot;{param.value}&quot;</span>
                {i < params.length - 1 && <span className="text-fg-muted">,</span>}
              </div>
              <a
                href={param.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={param.description}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-xs text-teal-500 transition-opacity"
              >
                ↗
              </a>
            </div>
          ))}
          <span className="text-fg-muted">{'}'}</span>
        </div>
      </div>

      {/* Usage hint */}
      <div
        className="rounded-xl p-3 text-xs font-mono"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      >
        <span className="text-fg-muted"># Use with -params-file:</span>
        <br />
        <span className="text-fg-secondary">nextflow run {pipelineName} \</span>
        <br />
        <span className="text-fg-secondary">{'  '}-profile {profile} \</span>
        <br />
        <span className="text-fg-secondary">{'  '}-params-file params.json</span>
      </div>

      <a
        href="https://nf-co.re/docs/running/run-pipelines#nextflow-parameters"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-teal-500 hover:text-teal-600"
      >
        Learn about nf-core parameters ↗
      </a>
    </div>
  )
}
