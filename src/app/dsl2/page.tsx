'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'
import { AnnotatedCode } from '@/components/dsl2/AnnotatedCode'
import { MetaMapVisualizer } from '@/components/dsl2/MetaMapVisualizer'
import { ChannelOperatorExplorer } from '@/components/dsl2/ChannelOperatorExplorer'
import { WorkDirExplorer } from '@/components/dsl2/WorkDirExplorer'
import { generateDSL2 } from '@/lib/dsl2/codegen'

// Demo IR — a typical nf-core/rnaseq QC pipeline
const DEMO_IR = {
  schema_version: '0.1' as const,
  project_id: 'demo',
  name: 'My QC Pipeline',
  execution_mode: 'simulated' as const,
  blocks: [
    { id: 'b1', type: 'start_pipeline'  as const, config: {} },
    { id: 'b2', type: 'samplesheet'     as const, config: {} },
    { id: 'b3', type: 'input_fastq'     as const, config: {} },
    { id: 'b4', type: 'qc_step'         as const, config: {} },
    { id: 'b5', type: 'trim_reads'      as const, config: {} },
    { id: 'b6', type: 'generate_report' as const, config: {} },
    { id: 'b7', type: 'output_results'  as const, config: {} },
  ],
  edges: [
    { from: 'b1', to: 'b2', dataType: 'pipeline_context' as const },
    { from: 'b2', to: 'b3', dataType: 'sample_records'   as const },
    { from: 'b3', to: 'b4', dataType: 'fastq_reads'      as const },
    { from: 'b3', to: 'b5', dataType: 'fastq_reads'      as const },
    { from: 'b4', to: 'b6', dataType: 'qc_output'        as const },
    { from: 'b5', to: 'b6', dataType: 'trimmed_reads'    as const },
    { from: 'b6', to: 'b7', dataType: 'report_data'      as const },
  ],
}

const { mainNf, nextflowConfig, samplesheetCsv, runCommand } = generateDSL2(DEMO_IR)

type Tab = 'code' | 'meta' | 'operators' | 'workdir' | 'config'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'code',      label: 'main.nf',            icon: '📄' },
  { id: 'meta',      label: 'Meta Maps',           icon: '🔗' },
  { id: 'operators', label: 'Channel Operators',   icon: '🌊' },
  { id: 'workdir',   label: 'Work Directory',      icon: '📁' },
  { id: 'config',    label: 'nextflow.config',     icon: '⚙️' },
]

export default function DSL2Page() {
  const [activeTab, setActiveTab] = useState<Tab>('code')

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">DSL2 Code Bridge</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-block-text"
            style={{ background: 'oklch(50% 0.25 302)' }}
          >
            Phase 6
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="light-surface" />
          <AuthButton variant="light-surface" />
          <Link href="/builder"
            className="text-sm font-bold px-5 py-2 rounded-lg text-block-text"
            style={{ background: 'var(--color-teal-500)', boxShadow: '0 3px 0 var(--color-teal-700)' }}>
            Open Builder →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-fg-primary mb-4">Nextflow DSL2 Code Bridge</h1>
          <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
            See the real Nextflow DSL2 code behind your visual pipeline.
            Learn channels, processes, meta maps, the work directory, and the{' '}
            <code className="font-mono text-base">-resume</code> flag —
            aligned with <a href="https://training.nextflow.io/latest/" target="_blank" rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600">training.nextflow.io</a>.
          </p>
        </div>

        {/* Visual → Code bridge diagram */}
        <div
          className="rounded-2xl p-5 mb-8 flex items-center gap-6 flex-wrap"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          {[
            { label: 'Visual Block', icon: '🧩', color: 'oklch(52% 0.22 152)' },
            { label: '→', icon: '', color: '' },
            { label: 'DSL2 Process', icon: '⚙️', color: 'oklch(50% 0.25 302)' },
            { label: '→', icon: '', color: '' },
            { label: 'nf-core Module', icon: '📦', color: 'oklch(58% 0.20 212)' },
            { label: '→', icon: '', color: '' },
            { label: 'Container', icon: '🐳', color: 'oklch(52% 0.20 232)' },
          ].map((item, i) => (
            item.icon === '' ? (
              <span key={i} className="text-2xl text-fg-muted">→</span>
            ) : (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base text-block-text"
                  style={{ background: item.color }}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-semibold text-fg-primary">{item.label}</span>
              </div>
            )
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-border mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-surface border border-b-0 border-border text-teal-600'
                  : 'text-fg-muted hover:text-fg-secondary',
              ].join(' ')}
              style={{ marginBottom: -1 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex flex-col gap-6">
          {activeTab === 'code' && (
            <div className="flex flex-col gap-6">
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-teal-700)' }}>
                  <strong>How to read this:</strong> This is the real Nextflow DSL2 skeleton for the visual pipeline you&apos;d build in BioFlow Blocks.
                  Each block maps to one or more lines of code.
                  Click any line to see what it does in nf-core.
                </p>
              </div>

              <AnnotatedCode
                lines={mainNf}
                title="main.nf — Nextflow DSL2 workflow"
                filename="main.nf"
              />

              {/* Run command */}
              <div>
                <p className="text-sm font-semibold text-fg-muted uppercase tracking-wide mb-2">Run command</p>
                <pre
                  className="text-sm font-mono p-4 rounded-xl overflow-x-auto"
                  style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
                >
                  {runCommand}
                </pre>
              </div>

              {/* Samplesheet */}
              <div>
                <p className="text-sm font-semibold text-fg-muted uppercase tracking-wide mb-2">samplesheet.csv</p>
                <pre
                  className="text-sm font-mono p-4 rounded-xl overflow-x-auto"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-fg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  {samplesheetCsv}
                </pre>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://training.nextflow.io/latest/nextflow/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-500 hover:text-teal-600"
                >
                  training.nextflow.io — Hello Nextflow course ↗
                </a>
                <a
                  href="https://nf-co.re/docs/contributing/modules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-500 hover:text-teal-600"
                >
                  nf-core module writing guide ↗
                </a>
              </div>
            </div>
          )}

          {activeTab === 'meta' && <MetaMapVisualizer />}
          {activeTab === 'operators' && <ChannelOperatorExplorer />}
          {activeTab === 'workdir' && <WorkDirExplorer />}

          {activeTab === 'config' && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-fg-secondary leading-relaxed">
                  Every nf-core pipeline reads <code className="font-mono text-sm">nextflow.config</code> at startup.
                  It defines parameters, process resources, and execution profiles.
                  Click any line to see what it controls.
                </p>
              </div>
              <AnnotatedCode
                lines={nextflowConfig}
                title="nextflow.config — pipeline configuration"
                filename="nextflow.config"
              />
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.nextflow.io/docs/latest/config.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-500 hover:text-teal-600"
                >
                  Nextflow config docs ↗
                </a>
                <a
                  href="https://nf-co.re/docs/running/configuration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-500 hover:text-teal-600"
                >
                  nf-core configuration guide ↗
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
