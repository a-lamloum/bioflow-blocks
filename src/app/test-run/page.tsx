'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TestRunPanel } from '@/components/run/TestRunPanel'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'

export default function TestRunPage() {
  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Test Run</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-block-text"
            style={{ background: 'var(--color-warning)' }}
          >
            Phase 4
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

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
        <h1 className="text-4xl font-bold text-fg-primary mb-3">Tiny Test-Data Execution</h1>
        <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
          See what <code className="font-mono text-base bg-surface-2 px-1.5 py-0.5 rounded border border-border">
            nextflow run nf-core/rnaseq -profile test,docker
          </code> actually produces — using the official nf-core test dataset (GSE110004, S. cerevisiae).
        </p>
      </div>

      {/* What is the test profile? */}
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
          {[
            {
              icon: '🧪',
              title: 'Real nf-core test data',
              desc: 'GSE110004 — yeast RNA-seq from the official nf-core/test-datasets repository. The same files CI uses to validate every PR to nf-core/rnaseq.',
            },
            {
              icon: '⚡',
              title: 'Tiny = fast',
              desc: 'FASTQ files are ~2 MB each. Reference genome is one chromosome (234 KB). A full test run completes in ~8 minutes on a laptop.',
            },
            {
              icon: '🎓',
              title: 'Learn the output structure',
              desc: 'Explore the real results/ directory tree, Nextflow trace, per-sample QC stats, and the MultiQC report that nf-core produces.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title}
              className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-sm font-bold text-fg-primary">{title}</h3>
              <p className="text-sm text-fg-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main test run panel */}
      <div className="max-w-5xl mx-auto px-6 pb-12 flex-1">
        <div
          className="rounded-2xl border border-border overflow-hidden"
          style={{ background: 'var(--color-surface)', minHeight: 600 }}
        >
          <TestRunPanel />
        </div>
      </div>

      <footer className="px-8 py-6 border-t border-border text-center text-xs text-fg-muted">
        Test dataset from{' '}
        <a href="https://github.com/nf-core/test-datasets/tree/rnaseq" target="_blank" rel="noopener noreferrer"
          className="text-teal-500 hover:text-teal-600">nf-core/test-datasets (rnaseq branch)</a>
        {' '}· All output statistics are pre-computed from real test runs ·{' '}
        No real compute is used on this page.
        <br />
        <Link href="/" className="text-fg-muted hover:text-fg-primary mt-2 inline-block">← Back to home</Link>
      </footer>
    </div>
  )
}
