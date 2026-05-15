'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PACKS, BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'

// ─── Floating hero block ───────────────────────────────────────────────────────

function HeroBlock({ label, icon, color, shadow, style }: {
  label: string; icon: string; color: string; shadow: string; style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: color, boxShadow: `0 5px 0 ${shadow}`,
      borderRadius: 10, padding: '9px 14px',
      display: 'flex', alignItems: 'center', gap: 7, ...style,
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ color: 'white', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

// ─── Pack card ────────────────────────────────────────────────────────────────

function PackCard({ pack }: { pack: typeof PACKS[0] }) {
  const blockCount = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].pack === pack.id).length
  const isAvailable = pack.available

  return (
    <Link
      href={`/packs/${pack.id}`}
      className="reveal flex flex-col gap-3 p-5 rounded-xl border transition-all hover:shadow-md group"
      style={{
        borderColor: isAvailable ? pack.color + '55' : 'var(--color-border)',
        background: isAvailable ? pack.color + '0a' : 'var(--color-surface)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{pack.icon}</span>
          <h3 className="text-base font-bold text-fg-primary group-hover:text-teal-600 transition-colors">{pack.name}</h3>
        </div>
        <span
          className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
          style={isAvailable
            ? { background: pack.color + '22', color: pack.color }
            : { background: 'var(--color-surface-2)', color: 'var(--color-fg-muted)' }
          }
        >
          {isAvailable ? 'Available' : `Phase ${pack.phase}`}
        </span>
      </div>
      <p className="text-sm text-fg-secondary leading-relaxed">{pack.description}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-fg-muted font-semibold">{blockCount} blocks</p>
        <span className="text-xs text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
          Explore →
        </span>
      </div>
    </Link>
  )
}

// ─── Stats strip ─────────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-bold" style={{ color: 'oklch(72% 0.130 195)' }}>{value}</span>
      <span className="text-sm text-fg-secondary">{label}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const HERO_BLOCKS = [
  { label: 'Start Pipeline',  icon: '🚀', color: 'oklch(68% 0.23 38)',  shadow: 'oklch(46% 0.23 38)',  style: { top: '20%', left: '6%',   animationDelay: '0s',   animationDuration: '6s'  } },
  { label: 'Samplesheet',     icon: '📋', color: 'oklch(50% 0.22 258)', shadow: 'oklch(33% 0.22 258)', style: { top: '38%', left: '4%',   animationDelay: '1.4s', animationDuration: '7s'  } },
  { label: 'Input FASTQ',     icon: '🧬', color: 'oklch(58% 0.20 212)', shadow: 'oklch(40% 0.20 212)', style: { top: '60%', left: '7%',   animationDelay: '0.5s', animationDuration: '8s'  } },
  { label: 'BWA Aligner',     icon: '🔍', color: 'oklch(52% 0.20 232)', shadow: 'oklch(35% 0.20 232)', style: { top: '16%', right: '5%',  animationDelay: '0.8s', animationDuration: '6.5s'} },
  { label: 'Kraken2',         icon: '🧫', color: 'oklch(50% 0.22 258)', shadow: 'oklch(33% 0.22 258)', style: { top: '35%', right: '3%',  animationDelay: '2.2s', animationDuration: '7.5s'} },
  { label: 'Cell Ranger',     icon: '🔬', color: 'oklch(50% 0.25 15)',  shadow: 'oklch(33% 0.25 15)',  style: { top: '58%', right: '6%',  animationDelay: '0.3s', animationDuration: '9s'  } },
  { label: 'DESeq2',          icon: '📈', color: 'oklch(50% 0.25 302)', shadow: 'oklch(33% 0.25 302)', style: { top: '76%', left: '18%',  animationDelay: '1.8s', animationDuration: '7s'  } },
  { label: 'Volcano Plot',    icon: '🌋', color: 'oklch(52% 0.22 152)', shadow: 'oklch(35% 0.22 152)', style: { top: '76%', right: '18%', animationDelay: '0.9s', animationDuration: '6.8s'} },
]

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); observerRef.current?.unobserve(e.target) }
      }),
      { threshold: 0.10 }
    )
    document.querySelectorAll('.reveal').forEach(el => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const availablePacks = PACKS.filter(p => p.available)
  const comingSoonPacks = PACKS.filter(p => !p.available)
  const totalBlocks = ALL_BLOCK_TYPES.length

  return (
    <div className="min-h-screen bg-canvas font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'oklch(12% 0.02 200 / 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid oklch(100% 0 0 / 0.07)' }}
      >
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <span className="text-base font-bold" style={{ color: 'oklch(95% 0.03 195)' }}>BioFlow Blocks</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/a-lamloum/bioflow-blocks" target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            GitHub
          </a>
          <Link href="/missions"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            Missions
          </Link>
          <Link href="/packs"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            Packs
          </Link>
          <Link href="/dsl2"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            DSL2
          </Link>
          <Link href="/troubleshoot"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            Troubleshoot
          </Link>
          <Link href="/modules"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            Modules
          </Link>
          <Link href="/test-run"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ color: 'oklch(75% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}>
            🧪 Test Run
          </Link>
          <ThemeToggle variant="dark-surface" />
          <AuthButton variant="dark-surface" />
          <Link href="/builder"
            className="text-sm font-bold px-5 py-2 rounded-lg animate-pulse-glow"
            style={{ background: 'var(--color-teal-500)', color: 'white', boxShadow: '0 3px 0 var(--color-teal-700)' }}>
            Launch Builder →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-16 overflow-hidden"
        style={{ background: 'oklch(12% 0.025 200)' }}
      >
        {/* Floating blocks */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {HERO_BLOCKS.map((b) => (
            <div key={b.label} className="absolute animate-float" style={b.style as React.CSSProperties}>
              <HeroBlock {...b} style={undefined} />
            </div>
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, oklch(60% 0.145 195 / 0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-3xl">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: 'oklch(60% 0.145 195 / 0.15)', border: '1px solid oklch(60% 0.145 195 / 0.30)', color: 'oklch(82% 0.10 195)', animationDelay: '0.1s' }}>
            🧬 {totalBlocks} blocks · {PACKS.length} packs · growing
          </div>

          <h1 className="animate-fade-up text-5xl font-bold leading-tight tracking-tight"
            style={{ color: 'oklch(97% 0.01 200)', animationDelay: '0.25s' }}>
            Practice any bioinformatics pipeline.<br />
            <span style={{ color: 'var(--color-teal-400)' }}>Visually. No terminal needed.</span>
          </h1>

          <p className="animate-fade-up text-xl leading-relaxed max-w-2xl"
            style={{ color: 'oklch(68% 0.03 200)', animationDelay: '0.4s' }}>
            BioFlow Blocks is a growing library of bioinformatics blocks — from RNA-seq QC to variant
            calling, metagenomics, and single-cell analysis. Drag. Connect. Simulate. Learn.
          </p>

          <div className="animate-fade-up flex flex-wrap gap-3 justify-center" style={{ animationDelay: '0.55s' }}>
            <Link href="/builder"
              className="px-8 py-3 rounded-xl text-base font-bold"
              style={{ background: 'var(--color-teal-500)', color: 'white', boxShadow: '0 5px 0 var(--color-teal-700)' }}>
              Start Building →
            </Link>
            <a href="https://github.com/a-lamloum/bioflow-blocks" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl text-base font-bold"
              style={{ background: 'oklch(100% 0 0 / 0.07)', border: '1px solid oklch(100% 0 0 / 0.14)', color: 'oklch(88% 0.02 200)' }}>
              View on GitHub
            </a>
          </div>

          <p className="animate-fade-up text-sm" style={{ color: 'oklch(48% 0.02 200)', animationDelay: '0.65s' }}>
            No login · No install · No real pipeline execution in Phase 0
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-up"
          style={{ animationDelay: '1s', color: 'oklch(38% 0.02 200)' }} aria-hidden="true">
          <span className="text-xs font-medium">scroll</span>
          <div className="w-px h-8 animate-float-slow" style={{ background: 'oklch(38% 0.02 200)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ background: 'oklch(93% 0.012 85)' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          <Stat value={String(totalBlocks)} label="blocks across all packs" />
          <Stat value={String(PACKS.length)} label="learning packs" />
          <Stat value={String(availablePacks.length)} label="packs available now" />
          <Stat value="15" label="nf-core concepts taught" />
        </div>
      </section>

      {/* ── PACKS — AVAILABLE ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="reveal text-center mb-12">
          <h2 className="text-4xl font-bold text-fg-primary mb-4">Start learning today</h2>
          <p className="text-xl text-fg-secondary max-w-xl mx-auto">
            These packs are live in the builder. Drag blocks, build pipelines, simulate runs.
          </p>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5 mb-16">
          {availablePacks.map((pack, i) => (
            <div key={pack.id} style={{ transitionDelay: `${i * 80}ms` }}>
              <PackCard pack={pack} />
            </div>
          ))}
        </div>

        {/* ── PACKS — COMING SOON ── */}
        <div className="reveal text-center mb-10">
          <h2 className="text-3xl font-bold text-fg-primary mb-3">Coming in future phases</h2>
          <p className="text-lg text-fg-secondary max-w-xl mx-auto">
            Each pack adds new blocks, new missions, and new pipelines to practice.
            The platform grows as packs are released.
          </p>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {comingSoonPacks.map((pack, i) => (
            <div key={pack.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <PackCard pack={pack} />
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-10" style={{ transitionDelay: '200ms' }}>
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-sm font-semibold text-fg-primary hover:border-teal-500 hover:text-teal-600 transition-all"
          >
            View all {PACKS.length} nf-core packs →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24" style={{ background: 'oklch(93% 0.012 85)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal text-center mb-16">
            <h2 className="text-4xl font-bold text-fg-primary mb-4">One learning loop. Many pipelines.</h2>
            <p className="text-xl text-fg-secondary">
              The same visual workflow teaches every domain — only the blocks change.
            </p>
          </div>
          <div className="flex flex-col gap-10">
            {[
              { n: '1', title: 'Choose a pack and open the builder', desc: 'Pick the domain you want to learn — RNA-seq QC, variant calling, metagenomics, or single-cell. The matching blocks appear in the library panel.' },
              { n: '2', title: 'Drag blocks and connect them', desc: 'Build your pipeline by placing Scratch-style blocks on the canvas and drawing connections between compatible outputs and inputs. Incompatible connections are gently rejected with an explanation.' },
              { n: '3', title: 'Click Simulate — read the trace', desc: 'Hit Simulate and watch a step-by-step trace describe what each block did in plain language. A QC report card and an illustrative nextflow run command appear when the pipeline completes.' },
              { n: '4', title: 'Open the inspector — learn the concept', desc: 'Click any block to see its beginner explanation alongside the official nf-core concept, real tool examples, and a link to official documentation.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="reveal flex gap-5 items-start" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-block-text"
                  style={{ background: 'var(--color-teal-500)', boxShadow: '0 4px 0 var(--color-teal-700)' }}>
                  {n}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-fg-primary mb-1">{title}</h3>
                  <p className="text-base text-fg-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="reveal text-center mb-10">
          <h2 className="text-4xl font-bold text-fg-primary mb-4">See it in action</h2>
          <p className="text-xl text-fg-secondary">
            A completed RNA-seq QC pipeline — mission done, inspector open, QC report visible.
          </p>
        </div>
        <div className="reveal" style={{ transitionDelay: '120ms' }}>
          <div className="rounded-2xl overflow-hidden border border-border"
            style={{ boxShadow: '0 24px 80px oklch(0% 0 0 / 0.12)' }}>
            <img src="/screenshot.png" alt="BioFlow Blocks in action" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── COMMAND ANATOMY ── */}
      <section className="px-6 py-20" style={{ background: 'oklch(93% 0.012 85)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="reveal text-center mb-10">
            <h2 className="text-3xl font-bold text-fg-primary mb-3">From blocks to a real nf-core command</h2>
            <p className="text-lg text-fg-secondary">
              Every block you build maps directly to a flag in a real{' '}
              <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded border border-border">nextflow run</code> command.
              Click any part to learn what it means.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-2 p-6 rounded-2xl border border-border bg-surface shadow-sm justify-center">
            {[
              { text: 'nextflow run', label: 'CLI', color: 'oklch(44% 0.150 270)' },
              { text: 'nf-core/rnaseq', label: 'Pipeline', color: 'oklch(52% 0.22 152)' },
              { text: '-profile docker', label: 'Profile', color: 'oklch(58% 0.20 212)' },
              { text: '--input samplesheet.csv', label: '--input', color: 'oklch(68% 0.150 75)' },
              { text: '--genome GRCh38', label: '--genome', color: 'oklch(68% 0.150 75)' },
              { text: '--outdir results', label: '--outdir', color: 'oklch(52% 0.20 232)' },
            ].map(part => (
              <div key={part.text} className="flex flex-col items-center gap-1">
                <span
                  className="px-3 py-2 rounded-lg text-sm font-mono font-bold text-block-text"
                  style={{ background: part.color, boxShadow: `0 3px 0 oklch(0% 0 0 / 0.20)` }}
                >
                  {part.text}
                </span>
                <span className="text-xs text-fg-muted">{part.label}</span>
              </div>
            ))}
          </div>
          <p className="reveal text-center mt-6 text-sm text-fg-muted" style={{ transitionDelay: '150ms' }}>
            The <strong>Command</strong> tab in the Run panel explains each part interactively — with profile picker and params file preview.
          </p>
        </div>
      </section>

      {/* ── BLOCK SHOWCASE ── */}
      <section className="px-6 py-20" style={{ background: 'oklch(12% 0.025 200)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'oklch(97% 0.01 200)' }}>
              A growing library of blocks
            </h2>
            <p className="text-lg" style={{ color: 'oklch(60% 0.03 200)' }}>
              Phase 0 ships with {ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].status === 'available').length} available blocks.
              The library grows with every phase.
            </p>
          </div>
          <div className="reveal flex flex-wrap justify-center gap-2.5" style={{ transitionDelay: '100ms' }}>
            {HERO_BLOCKS.map((b, i) => (
              <div key={b.label} className="animate-float" style={{ animationDelay: `${i * 0.35}s`, animationDuration: `${5 + i * 0.5}s` }}>
                <HeroBlock {...b} style={undefined} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="reveal text-center mb-12">
          <h2 className="text-4xl font-bold text-fg-primary mb-4">Built for bioinformatics beginners</h2>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-5">
          {[
            { icon: '🎓', title: 'Students', desc: 'Understand pipeline concepts before your first lab practical.' },
            { icon: '🧫', title: 'Wet-lab researchers', desc: 'See what happens to your sequencing files without writing code.' },
            { icon: '👩‍🏫', title: 'Workshop instructors', desc: 'Teach nf-core concepts interactively in 60–90 minutes.' },
            { icon: '👨‍💻', title: 'Junior bioinformaticians', desc: 'Map tools and steps to the nf-core module system.' },
          ].map(({ icon, title, desc }, i) => (
            <div key={title} className="reveal flex flex-col gap-3 p-5 rounded-xl border border-border bg-surface"
              style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="text-3xl">{icon}</span>
              <h3 className="text-base font-bold text-fg-primary">{title}</h3>
              <p className="text-sm text-fg-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-28 text-center max-w-3xl mx-auto">
        <div className="reveal flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-fg-primary">
            Ready to build your first pipeline?
          </h2>
          <p className="text-xl text-fg-secondary max-w-md">
            Start with the RNA-seq QC pack. Takes under 5 minutes. No setup.
          </p>
          <Link href="/builder"
            className="px-10 py-4 rounded-xl text-lg font-bold animate-pulse-glow"
            style={{ background: 'var(--color-teal-500)', color: 'white', boxShadow: '0 6px 0 var(--color-teal-700)' }}>
            Open the Builder →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-8 py-10 border-t border-border" style={{ background: 'oklch(12% 0.025 200)' }}>
        <div className="max-w-6xl mx-auto flex flex-col tablet:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧬</span>
            <span className="text-sm font-semibold" style={{ color: 'oklch(72% 0.03 200)' }}>BioFlow Blocks</span>
            <span className="text-sm" style={{ color: 'oklch(42% 0.02 200)' }}>· {totalBlocks} blocks · {PACKS.length} packs</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: 'oklch(48% 0.02 200)' }}>
            <a href="https://github.com/a-lamloum/bioflow-blocks" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">GitHub</a>
            <a href="https://nf-co.re" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">nf-core docs</a>
            <Link href="/builder" className="hover:text-teal-400 transition-colors">Builder</Link>
          </div>
          <div className="text-sm text-center" style={{ color: 'oklch(38% 0.02 200)' }}>
            © 2026 Ahmed Lamloum · MIT-NC License<br />
            <span style={{ fontSize: 11 }}>Commercial use by author permission only</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
