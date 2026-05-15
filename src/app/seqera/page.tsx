'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'
import { SeqeraConceptMap } from '@/components/seqera/SeqeraConceptMap'
import { LaunchWalkthrough } from '@/components/seqera/LaunchWalkthrough'
import { BioflowToSeqera } from '@/components/seqera/BioflowToSeqera'

type Tab = 'concepts' | 'bridge' | 'launch'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'concepts', label: 'Platform Concepts', icon: '🗺️' },
  { id: 'bridge',   label: 'BioFlow → Seqera', icon: '🔗' },
  { id: 'launch',   label: 'Launch Walkthrough', icon: '▶️' },
]

export default function SeqeraPage() {
  const [activeTab, setActiveTab] = useState<Tab>('concepts')

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Seqera Platform</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-block-text"
            style={{ background: 'oklch(52% 0.20 232)' }}
          >
            Phase 10
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔷</span>
            <h1 className="text-4xl font-bold text-fg-primary">Seqera Platform Bridge</h1>
          </div>
          <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
            Seqera Platform (formerly Nextflow Tower) is the production environment for nf-core pipelines —
            team collaboration, managed compute, automated launches, and real-time monitoring.
            Everything you learned in BioFlow Blocks maps directly to a Seqera concept.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🆓', title: 'Free Community tier', desc: 'Seqera Platform has a free tier for individuals and small teams — up to 5 users.', url: 'https://seqera.io/platform/' },
            { icon: '📚', title: 'Official docs', desc: 'Complete documentation for all Platform concepts: Workspaces, Compute Envs, Datasets, Runs.', url: 'https://docs.seqera.io/platform/latest/' },
            { icon: '🎓', title: 'Seqera Academy', desc: 'Free online courses for Nextflow and Seqera Platform — includes hands-on labs.', url: 'https://seqera.io/training/' },
          ].map(({ icon, title, desc, url }) => (
            <a key={title} href={url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface hover:border-teal-500 transition-all hover:shadow-sm">
              <span className="text-2xl">{icon}</span>
              <p className="text-sm font-bold text-fg-primary">{title}</p>
              <p className="text-xs text-fg-secondary leading-relaxed">{desc}</p>
            </a>
          ))}
        </div>

        {/* How BioFlow fits in the Seqera ecosystem */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: 'oklch(52% 0.20 232 / 0.07)', border: '1px solid oklch(52% 0.20 232 / 0.25)' }}
        >
          <h2 className="text-xl font-bold text-fg-primary mb-3">The nf-core learning journey</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              { label: 'BioFlow Blocks', sub: 'Learn concepts visually', icon: '🧬', here: true },
              { label: '→', sub: '', icon: '', here: false },
              { label: 'CLI (`nextflow run`)', sub: 'Run on your machine', icon: '💻', here: false },
              { label: '→', sub: '', icon: '', here: false },
              { label: 'Seqera Platform', sub: 'Scale with your team', icon: '🔷', here: false },
            ].map((item, i) =>
              item.label === '→' ? (
                <span key={i} className="text-2xl text-fg-muted font-bold">→</span>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                  style={{
                    borderColor: item.here ? 'var(--color-teal-500)' : 'var(--color-border)',
                    background: item.here ? 'var(--color-teal-50)' : 'var(--color-surface)',
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-fg-primary">{item.label}</p>
                    <p className="text-xs text-fg-muted">{item.sub}</p>
                  </div>
                  {item.here && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded text-block-text"
                      style={{ background: 'var(--color-teal-500)', fontSize: 9 }}>YOU ARE HERE</span>
                  )}
                </div>
              )
            )}
          </div>
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
          {activeTab === 'concepts' && <SeqeraConceptMap />}
          {activeTab === 'bridge'   && <BioflowToSeqera />}
          {activeTab === 'launch'   && <LaunchWalkthrough />}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
