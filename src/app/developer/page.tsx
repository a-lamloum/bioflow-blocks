'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'
import { ModuleAnatomy } from '@/components/developer/ModuleAnatomy'
import { NfTestExplorer } from '@/components/developer/NfTestExplorer'
import { BiocontainersBrowser } from '@/components/developer/BiocontainersBrowser'
import { PRChecklist } from '@/components/developer/PRChecklist'

type Tab = 'anatomy' | 'nftest' | 'biocontainers' | 'checklist' | 'workflow'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'anatomy',      label: 'Module Anatomy',       icon: '🏗️' },
  { id: 'nftest',       label: 'nf-test',              icon: '🧪' },
  { id: 'biocontainers',label: 'Biocontainers',        icon: '🐳' },
  { id: 'checklist',    label: 'PR Checklist',         icon: '✅' },
  { id: 'workflow',     label: 'Dev Workflow',         icon: '🔄' },
]

const WORKFLOW_STEPS = [
  {
    n: '1',
    cmd: 'nf-core modules create fastqc',
    title: 'Scaffold the module',
    desc: 'nf-core/tools generates the directory structure with placeholder main.nf, meta.yml, environment.yml, and test files.',
    docsUrl: 'https://nf-co.re/docs/contributing/modules#creating-a-new-module',
  },
  {
    n: '2',
    cmd: 'vim modules/nf-core/fastqc/main.nf',
    title: 'Write the process',
    desc: 'Fill in the Nextflow process definition following the nf-core template conventions (tag, label, conda/container, input, output, when, script, versions.yml).',
    docsUrl: 'https://nf-co.re/docs/contributing/modules',
  },
  {
    n: '3',
    cmd: 'vim modules/nf-core/fastqc/meta.yml',
    title: 'Document in meta.yml',
    desc: 'Add tool description, input/output schemas with types and patterns, keywords, and author GitHub usernames.',
    docsUrl: 'https://nf-co.re/docs/contributing/modules#meta-yml-file',
  },
  {
    n: '4',
    cmd: 'nf-test test modules/nf-core/fastqc/tests/main.nf.test',
    title: 'Write and run nf-test',
    desc: 'Write test() blocks covering at least paired-end and single-end (if applicable). Run to generate .snap file. Fix any failures.',
    docsUrl: 'https://www.nf-test.com/',
  },
  {
    n: '5',
    cmd: 'nf-core modules lint fastqc',
    title: 'Lint the module',
    desc: 'Run nf-core lint to catch missing files, naming violations, and template deviations. Fix all errors (warnings can be explained in the PR).',
    docsUrl: 'https://nf-co.re/docs/nf-core-tools/cli/modules/lint',
  },
  {
    n: '6',
    cmd: 'prettier --write modules/nf-core/fastqc/',
    title: 'Format with Prettier',
    desc: 'nf-core CI enforces Prettier formatting. Run it locally to avoid CI failures. The .editorconfig in nf-core/modules configures the formatting rules.',
  },
  {
    n: '7',
    cmd: 'git push && open GitHub PR',
    title: 'Open a PR to nf-core/modules',
    desc: 'Use the PR template. The nf-core bot will run lint checks, trigger CI (nf-test + Prettier), and assign reviewers. Respond to review comments to get the PR merged.',
    docsUrl: 'https://nf-co.re/docs/contributing/modules#pull-request-review-process',
  },
]

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<Tab>('anatomy')

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Developer Track</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-block-text"
            style={{ background: 'oklch(52% 0.18 85)' }}
          >
            Phase 9
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
          <h1 className="text-4xl font-bold text-fg-primary mb-4">nf-core Developer Track</h1>
          <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
            Learn to create and contribute nf-core modules — module anatomy, nf-test,
            Biocontainers, the PR checklist, and the full contribution workflow.
            Aligned with the official{' '}
            <a href="https://training.nextflow.io/latest/" target="_blank" rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600">Hello nf-core course</a> (5 parts).
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 mb-10">
          {[
            { n: '1,400+', label: 'nf-core modules', url: 'https://nf-co.re/modules' },
            { n: '70+', label: 'nf-core subworkflows', url: 'https://nf-co.re/subworkflows' },
            { n: '149', label: 'nf-core pipelines', url: 'https://nf-co.re/pipelines' },
            { n: '100%', label: 'CI-tested modules', url: 'https://github.com/nf-core/modules' },
          ].map(({ n, label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-4 rounded-xl border border-border bg-surface hover:border-teal-500 transition-colors">
              <span className="text-3xl font-bold" style={{ color: 'var(--color-teal-500)' }}>{n}</span>
              <span className="text-xs text-fg-muted text-center">{label}</span>
            </a>
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
          {activeTab === 'anatomy'       && <ModuleAnatomy />}
          {activeTab === 'nftest'        && <NfTestExplorer />}
          {activeTab === 'biocontainers' && <BiocontainersBrowser />}
          {activeTab === 'checklist'     && <PRChecklist />}

          {activeTab === 'workflow' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-fg-primary mb-1">nf-core Module Development Workflow</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">
                  The complete workflow from scaffolding to merged PR.
                  Each step uses the nf-core/tools CLI or standard tools.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {WORKFLOW_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base font-bold text-block-text"
                      style={{ background: 'oklch(52% 0.18 85)', boxShadow: '0 3px 0 oklch(36% 0.18 85)' }}
                    >
                      {step.n}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-sm font-bold text-fg-primary">{step.title}</p>
                      <code
                        className="text-xs font-mono px-3 py-1.5 rounded-lg self-start"
                        style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(72% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
                      >
                        {step.cmd}
                      </code>
                      <p className="text-sm text-fg-secondary leading-relaxed">{step.desc}</p>
                      {step.docsUrl && (
                        <a href={step.docsUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-teal-500 hover:text-teal-600 self-start">
                          docs ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl px-5 py-4"
                style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-teal-700)' }}>
                  <strong>First time?</strong> Start with the{' '}
                  <a href="https://training.nextflow.io/latest/" target="_blank" rel="noopener noreferrer"
                    className="font-semibold underline">official Hello nf-core course</a>{' '}
                  (5 parts, free). It walks through all these steps with a real worked example.
                  Then join the{' '}
                  <a href="https://nf-co.re/join/slack" target="_blank" rel="noopener noreferrer"
                    className="font-semibold underline">nf-core Slack</a>{' '}
                  and ask in #modules-reviews when you have a draft module ready.
                </p>
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
