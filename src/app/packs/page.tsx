'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { PACKS, BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'

export default function PacksPage() {
  const totalBlocks = ALL_BLOCK_TYPES.length
  const availableBlocks = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].status === 'available').length
  const availablePacks = PACKS.filter(p => p.available).length

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-base font-semibold text-fg-secondary">nf-core Packs</span>
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
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-fg-primary mb-4">nf-core Pipeline Packs</h1>
          <p className="text-xl text-fg-secondary max-w-2xl leading-relaxed">
            Each pack teaches one nf-core pipeline through visual blocks, guided missions, and real test data.
            The platform grows as new packs are released.
          </p>
          <div className="flex gap-6 mt-4 text-sm text-fg-muted">
            <span><strong className="text-fg-primary" style={{ color: 'var(--color-teal-500)' }}>{availablePacks}</strong> packs available</span>
            <span><strong className="text-fg-primary">{availableBlocks}</strong> blocks available now</span>
            <span><strong className="text-fg-primary">{totalBlocks}</strong> blocks total</span>
          </div>
        </div>

        {/* Available packs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-fg-primary mb-6">Available now</h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
            {PACKS.filter(p => p.available).map(pack => {
              const packBlocks = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].pack === pack.id)
              const available = packBlocks.filter(t => BLOCK_DEFINITIONS[t].status === 'available').length
              return (
                <Link
                  key={pack.id}
                  href={`/packs/${pack.id}`}
                  className="flex flex-col gap-3 p-5 rounded-2xl border-2 hover:shadow-md transition-all group"
                  style={{ borderColor: pack.color + '55', background: pack.color + '08' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pack.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-fg-primary group-hover:text-teal-600 transition-colors">{pack.name}</h3>
                        <p className="text-xs font-mono text-fg-muted">{pack.pipeline}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full text-block-text"
                      style={{ background: pack.color }}>
                      Available
                    </span>
                  </div>
                  <p className="text-sm text-fg-secondary leading-relaxed">{pack.description}</p>
                  <div className="flex items-center justify-between text-xs text-fg-muted">
                    <span>{available} of {packBlocks.length} blocks available</span>
                    <span className="text-teal-500 font-semibold group-hover:text-teal-600">Explore →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Coming soon packs */}
        <section>
          <h2 className="text-2xl font-bold text-fg-primary mb-6">Coming in future phases</h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {PACKS.filter(p => !p.available).map(pack => {
              const packBlocks = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].pack === pack.id)
              return (
                <Link
                  key={pack.id}
                  href={`/packs/${pack.id}`}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-surface hover:border-border-strong transition-all opacity-75 hover:opacity-100 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{pack.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-fg-primary truncate group-hover:text-teal-600 transition-colors">{pack.name}</h3>
                      <p className="text-xs font-mono text-fg-muted">{pack.pipeline}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-fg-muted">
                      Phase {pack.phase}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted leading-relaxed">{pack.description}</p>
                  <p className="text-xs text-fg-muted">{packBlocks.length} blocks defined</p>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
