'use client'

import { useState } from 'react'

const VERSIONS = [
  { version: '3.14.0', date: '2024-02-15', notes: 'Latest stable — STAR 2.7.11a, SALMON 1.10.2, MultiQC 1.21', recommended: true },
  { version: '3.13.2', date: '2024-01-08', notes: 'Bugfix: TrimGalore paired-end detection fix', recommended: false },
  { version: '3.13.1', date: '2023-12-12', notes: 'Bugfix: Singularity image paths', recommended: false },
  { version: '3.12.0', date: '2023-10-23', notes: 'Feature: Added --aligner salmon_alevin', recommended: false },
]

export function PipelineVersioning() {
  const [pinned, setPinned] = useState('3.14.0')
  const [showWhy, setShowWhy] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Pipeline Versioning with <code className="font-mono">-r</code></h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Every nf-core pipeline uses semantic versioning.
          The <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">-r</code> flag
          pins the exact pipeline version so your results are reproducible months or years later.
        </p>
      </div>

      {/* Command builder */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Select a version to pin</p>
        <div className="flex flex-col gap-2">
          {VERSIONS.map(v => (
            <button
              key={v.version}
              onClick={() => setPinned(v.version)}
              className="flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all"
              style={{
                borderColor: pinned === v.version ? 'var(--color-teal-500)' : 'var(--color-border)',
                background: pinned === v.version ? 'var(--color-teal-50)' : 'var(--color-surface)',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold" style={{ color: pinned === v.version ? 'var(--color-teal-700)' : 'var(--color-fg-primary)' }}>
                    v{v.version}
                  </span>
                  {v.recommended && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded text-block-text"
                      style={{ background: 'var(--color-success)' }}>
                      Recommended
                    </span>
                  )}
                  <span className="text-xs text-fg-muted">{v.date}</span>
                </div>
                <p className="text-xs text-fg-muted mt-0.5">{v.notes}</p>
              </div>
              {pinned === v.version && <span style={{ color: 'var(--color-teal-500)' }}>✓</span>}
            </button>
          ))}
        </div>

        {/* Generated command */}
        <pre
          className="text-sm font-mono p-4 rounded-xl overflow-x-auto"
          style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
        >
          {`nextflow run nf-core/rnaseq \\
  -r ${pinned} \\
  -profile docker \\
  --input samplesheet.csv \\
  --genome GRCh38 \\
  --outdir results`}
        </pre>
      </div>

      {/* Why it matters */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={() => setShowWhy(v => !v)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-fg-primary hover:bg-surface-2 transition-colors"
          aria-expanded={showWhy}
        >
          <span>💡 Why does pinning the version matter?</span>
          <span>{showWhy ? '▲' : '▼'}</span>
        </button>
        {showWhy && (
          <div className="px-4 py-4 border-t border-border bg-surface flex flex-col gap-3 text-sm text-fg-secondary">
            <p><strong className="text-fg-primary">Without -r:</strong> Nextflow always pulls the latest commit from the main branch. A run today vs next month may use a different version of STAR, SALMON, or trimming parameters — making results hard to compare.</p>
            <p><strong className="text-fg-primary">With -r {pinned}:</strong> Nextflow uses exactly this Git tag. The pipeline code, all module versions, and default parameters are frozen. Someone running the same command in 2 years gets the same pipeline.</p>
            <p><strong className="text-fg-primary">For publications:</strong> Always pin the version and include it in your Methods section: <em>&quot;Raw reads were processed with nf-core/rnaseq v{pinned}&quot;</em>.</p>
          </div>
        )}
      </div>

      {/* nf-core release history */}
      <div className="flex gap-3 flex-wrap">
        <a
          href="https://github.com/nf-core/rnaseq/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600"
        >
          nf-core/rnaseq release history on GitHub ↗
        </a>
        <a
          href="https://nf-co.re/rnaseq/changelog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600"
        >
          nf-core/rnaseq changelog ↗
        </a>
      </div>
    </div>
  )
}
