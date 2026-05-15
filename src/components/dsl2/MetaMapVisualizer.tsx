'use client'

import { useState } from 'react'

interface MetaField {
  key: string
  value: string
  desc: string
}

const META_FIELDS: MetaField[] = [
  { key: 'id',          value: '"SAMPLE1"',   desc: 'Unique sample identifier — used to name output files' },
  { key: 'single_end',  value: 'false',        desc: 'true = single-end reads (1 FASTQ); false = paired-end (R1+R2)' },
  { key: 'strandedness',value: '"auto"',        desc: 'Library strand: auto, forward, reverse, or unstranded' },
]

const PIPELINE_STEPS = [
  { name: 'Samplesheet',    module: 'Channel.fromSamplesheet()', out: '[meta, fastq_1, fastq_2]' },
  { name: 'FASTQC',         module: 'FASTQC',                    out: '[meta, html, zip]' },
  { name: 'TRIMGALORE',     module: 'TRIMGALORE',                out: '[meta, reads, log]' },
  { name: 'STAR_ALIGN',     module: 'STAR_ALIGN',                out: '[meta, bam, bai, log]' },
  { name: 'SALMON_QUANT',   module: 'SALMON_QUANT',              out: '[meta, quant_dir]' },
]

export function MetaMapVisualizer() {
  const [activeField, setActiveField] = useState<number | null>(null)
  const [activeStep, setActiveStep] = useState<number>(0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">The Meta Map Convention</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Every nf-core module receives and emits data as a <strong>tuple</strong>:{' '}
          <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">[ meta, file1, file2, ... ]</code>.
          The <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">meta</code> map carries
          sample metadata through the entire pipeline so every output knows which sample it belongs to.
        </p>
      </div>

      {/* Meta map structure */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="px-4 py-2 border-b border-border text-xs font-mono font-semibold"
          style={{ background: 'var(--color-surface-2)' }}
        >
          meta map — always the first element of every nf-core tuple
        </div>
        <div className="p-4">
          <div
            className="font-mono text-sm rounded-xl p-4"
            style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(85% 0.01 220)' }}
          >
            <div style={{ color: 'oklch(68% 0.150 75)' }}>meta = {'{'}</div>
            {META_FIELDS.map((f, i) => (
              <div
                key={f.key}
                className="cursor-pointer pl-4 py-0.5 rounded transition-colors"
                onClick={() => setActiveField(activeField === i ? null : i)}
                style={{
                  background: activeField === i ? 'oklch(28% 0.03 220)' : undefined,
                  color: activeField === i ? 'oklch(75% 0.14 195)' : 'oklch(75% 0.01 220)',
                }}
              >
                <span style={{ color: 'oklch(65% 0.12 152)' }}>{f.key}</span>
                <span style={{ color: 'oklch(55% 0.02 220)' }}>: </span>
                <span style={{ color: 'oklch(75% 0.15 68)' }}>{f.value}</span>
                {i < META_FIELDS.length - 1 && <span style={{ color: 'oklch(55% 0.02 220)' }}>,</span>}
                {activeField !== i && <span className="ml-2 text-xs" style={{ color: 'oklch(48% 0.02 220)' }}>← click</span>}
              </div>
            ))}
            <div style={{ color: 'oklch(68% 0.150 75)' }}>{'}'}</div>
          </div>

          {activeField !== null && (
            <div
              className="mt-3 px-4 py-3 rounded-xl text-sm animate-fade-up"
              style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
            >
              <code className="font-mono font-bold">{META_FIELDS[activeField].key}</code>: {META_FIELDS[activeField].desc}
            </div>
          )}
        </div>
      </div>

      {/* Meta flows through pipeline */}
      <div>
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">
          meta travels unchanged through every module
        </p>
        <div className="flex flex-col gap-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveStep(i)}
            >
              {/* Step indicator */}
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-block-text"
                style={{
                  background: activeStep === i ? 'var(--color-teal-500)' : 'var(--color-surface-2)',
                  color: activeStep === i ? 'white' : 'var(--color-fg-muted)',
                  border: activeStep === i ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {i + 1}
              </div>

              {/* Module name */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-teal-500 transition-colors">
                <span className="text-xs font-mono font-semibold text-fg-primary truncate">{step.module}</span>
                <span className="text-fg-muted">→</span>
                <code className="text-xs font-mono text-fg-secondary truncate">{step.out}</code>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-3 rounded-xl px-4 py-3"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-teal-700)' }}>
            <strong>Step {activeStep + 1} — {PIPELINE_STEPS[activeStep].name}:</strong>{' '}
            emits <code className="font-mono">{PIPELINE_STEPS[activeStep].out}</code>.
            The <code className="font-mono">meta</code> map is always the first element —
            it carries <code className="font-mono">id</code>, <code className="font-mono">single_end</code>,
            and <code className="font-mono">strandedness</code> so every downstream process knows which sample it&apos;s processing.
          </p>
        </div>
      </div>
    </div>
  )
}
