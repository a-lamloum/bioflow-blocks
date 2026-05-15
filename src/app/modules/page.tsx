'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PACKS, BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { BlockType } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  phase1:    'Phase 1',
  phase2:    'Phase 2',
  phase3:    'Phase 3',
}

const STATUS_COLORS: Record<string, string> = {
  available: 'var(--color-teal-500)',
  phase1:    'var(--color-fg-muted)',
  phase2:    'var(--color-fg-muted)',
  phase3:    'var(--color-fg-muted)',
}

function ModuleCard({ blockType }: { blockType: BlockType }) {
  const def = BLOCK_DEFINITIONS[blockType]
  const pack = PACKS.find(p => p.id === def.pack)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="flex flex-col gap-0 rounded-xl border border-border bg-surface overflow-hidden"
      style={{ opacity: def.status !== 'available' ? 0.7 : 1 }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors w-full"
        aria-expanded={expanded}
      >
        <span className="text-xl shrink-0">{def.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-fg-primary">{def.displayName}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-block-text shrink-0"
              style={{ background: STATUS_COLORS[def.status] ?? 'var(--color-fg-muted)' }}
            >
              {STATUS_LABELS[def.status] ?? def.status}
            </span>
          </div>
          <p className="text-xs text-fg-muted truncate mt-0.5">{def.technicalConcept}</p>
        </div>
        <span className="text-fg-muted text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="flex flex-col gap-3 px-4 py-4 border-t border-border bg-surface-2 text-sm">
          <p className="text-fg-primary leading-relaxed">{def.description}</p>

          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">Technical detail</p>
            <p className="text-fg-secondary text-xs leading-relaxed">{def.technicalDetail}</p>
          </div>

          {def.realToolExamples && def.realToolExamples.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {def.realToolExamples.map(t => (
                <code key={t} className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-fg-secondary font-mono">
                  {t}
                </code>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-fg-muted">
            <span>Pack: <strong className="text-fg-secondary">{pack?.name ?? def.pack}</strong></span>
            <span>Category: <strong className="text-fg-secondary">{def.category}</strong></span>
            <span>Mode: <strong className="text-fg-secondary">{def.executionMode}</strong></span>
          </div>

          {def.nfCoreDocsLink && (
            <a
              href={def.nfCoreDocsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-500 hover:text-teal-600 underline underline-offset-2"
            >
              nf-core docs ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function ModulesPage() {
  const [search, setSearch] = useState('')
  const [filterPack, setFilterPack] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ALL_BLOCK_TYPES.filter(t => {
      const def = BLOCK_DEFINITIONS[t]
      if (filterPack !== 'all' && def.pack !== filterPack) return false
      if (filterStatus !== 'all' && def.status !== filterStatus) return false
      if (!q) return true
      return (
        def.displayName.toLowerCase().includes(q) ||
        def.technicalConcept.toLowerCase().includes(q) ||
        def.description.toLowerCase().includes(q) ||
        (def.realToolExamples ?? []).some(e => e.toLowerCase().includes(q))
      )
    })
  }, [search, filterPack, filterStatus])

  const availableCount = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].status === 'available').length

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">Module Registry</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="light-surface" />
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
          <h1 className="text-4xl font-bold text-fg-primary mb-3">Module Registry</h1>
          <p className="text-xl text-fg-secondary">
            {ALL_BLOCK_TYPES.length} blocks across {PACKS.length} nf-core pipeline packs —
            {' '}<span className="font-semibold" style={{ color: 'var(--color-teal-600)' }}>{availableCount} available now</span>.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col tablet:flex-row gap-3 mb-8">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blocks, tools, concepts…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-fg-primary placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring text-sm"
          />
          <select
            value={filterPack}
            onChange={e => setFilterPack(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-surface text-fg-secondary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <option value="all">All packs</option>
            {PACKS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-surface text-fg-secondary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <option value="all">All statuses</option>
            <option value="available">Available now</option>
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-fg-muted mb-4">
          Showing <strong className="text-fg-secondary">{filtered.length}</strong> of {ALL_BLOCK_TYPES.length} blocks
        </p>

        {/* Grid by pack */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">🔍</span>
            <p className="text-fg-muted mt-4">No blocks match your search.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {PACKS.map(pack => {
              const packBlocks = filtered.filter(t => BLOCK_DEFINITIONS[t].pack === pack.id)
              if (packBlocks.length === 0) return null
              return (
                <section key={pack.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{pack.icon}</span>
                    <div>
                      <h2 className="text-lg font-bold text-fg-primary">{pack.name}</h2>
                      <a
                        href={pack.pipelineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-500 hover:text-teal-600"
                      >
                        {pack.pipeline} ↗
                      </a>
                    </div>
                    <span className="ml-auto text-xs text-fg-muted">{packBlocks.length} block{packBlocks.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {packBlocks.map(t => <ModuleCard key={t} blockType={t} />)}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
