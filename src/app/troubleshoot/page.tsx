'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'
import { ErrorDecoder } from '@/components/troubleshoot/ErrorDecoder'
import { PipelineVersioning } from '@/components/troubleshoot/PipelineVersioning'
import { InstitutionalConfigs } from '@/components/troubleshoot/InstitutionalConfigs'
import { NextflowLogViewer } from '@/components/troubleshoot/NextflowLogViewer'

type Tab = 'errors' | 'log' | 'versioning' | 'institutional'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'errors',        label: 'Error Decoder',       icon: '🔴' },
  { id: 'log',           label: 'nextflow log',         icon: '📋' },
  { id: 'versioning',    label: 'Pipeline Versioning',  icon: '📌' },
  { id: 'institutional', label: 'Institutional Configs',icon: '🏛️' },
]

export default function TroubleshootPage() {
  const [activeTab, setActiveTab] = useState<Tab>('errors')

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Troubleshoot</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-block-text"
            style={{ background: 'oklch(68% 0.150 75)' }}
          >
            Phase 7
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
          <h1 className="text-4xl font-bold text-fg-primary mb-4">Execution & Troubleshooting</h1>
          <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
            Decode Nextflow errors, read execution logs, pin pipeline versions for reproducibility,
            and configure institutional HPC profiles — aligned with the official{' '}
            <a href="https://training.nextflow.io/latest/side_quests/" target="_blank" rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600">Troubleshooting side quest</a>.
          </p>
        </div>

        {/* Quick tips */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '137', tip: 'Exit 137 is always out of memory. Increase memory in nextflow.config or use --max_memory.', color: 'var(--color-error)' },
            { icon: '-r',  tip: 'Always pin the version with -r 3.14.0 for reproducible analyses. Use it in publications.', color: 'var(--color-teal-500)' },
            { icon: '↺',   tip: 'Add -resume after fixing a failure. Nextflow reuses cached steps — saving hours.', color: 'oklch(52% 0.22 152)' },
          ].map(({ icon, tip, color }) => (
            <div key={icon} className="flex gap-3 p-4 rounded-xl border border-border bg-surface">
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-block-text"
                style={{ background: color }}
              >
                {icon}
              </div>
              <p className="text-sm text-fg-secondary leading-relaxed">{tip}</p>
            </div>
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
        <div>
          {activeTab === 'errors'        && <ErrorDecoder />}
          {activeTab === 'log'           && <NextflowLogViewer />}
          {activeTab === 'versioning'    && <PipelineVersioning />}
          {activeTab === 'institutional' && <InstitutionalConfigs />}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
