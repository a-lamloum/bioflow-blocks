'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Mini block component for hero animation ──────────────────────────────────

function HeroBlock({
  label,
  icon,
  color,
  shadow,
  style,
}: {
  label: string
  icon: string
  color: string
  shadow: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: color,
        boxShadow: `0 5px 0 ${shadow}`,
        borderRadius: 10,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 140,
        ...style,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ color: 'white', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: string
  title: string
  description: string
  delay?: number
}) {
  return (
    <div
      className="reveal flex flex-col gap-3 p-6 rounded-xl border border-border bg-surface"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="text-xl font-bold text-fg-primary">{title}</h3>
      <p className="text-base text-fg-secondary leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Step ─────────────────────────────────────────────────────────────────────

function Step({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string
  title: string
  description: string
  delay?: number
}) {
  return (
    <div
      className="reveal flex gap-5 items-start"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-block-text"
        style={{ background: 'var(--color-teal-500)', boxShadow: '0 4px 0 var(--color-teal-700)' }}
      >
        {number}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-fg-primary">{title}</h3>
        <p className="text-base text-fg-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scroll-reveal: add .revealed when elements enter viewport
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            observerRef.current?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    document.querySelectorAll('.reveal').forEach(el => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-canvas font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: 'oklch(12% 0.02 200 / 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid oklch(100% 0 0 / 0.08)',
        }}>
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="BioFlow Blocks" width={32} height={32} />
          <span className="text-xl font-bold" style={{ color: 'oklch(95% 0.03 195)' }}>
            BioFlow Blocks
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/a-lamloum/bioflow-blocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'oklch(80% 0.03 200)', background: 'oklch(100% 0 0 / 0.06)' }}
          >
            GitHub
          </a>
          <Link
            href="/builder"
            className="text-sm font-bold px-5 py-2 rounded-lg transition-all animate-pulse-glow"
            style={{
              background: 'var(--color-teal-500)',
              color: 'white',
              boxShadow: '0 3px 0 var(--color-teal-700)',
            }}
          >
            Launch Builder →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24 pb-20 overflow-hidden"
        style={{ background: 'oklch(12% 0.025 200)' }}
      >
        {/* Animated floating blocks background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="animate-float absolute" style={{ top: '18%', left: '8%', animationDelay: '0s', opacity: 0.7 }}>
            <HeroBlock label="Start Pipeline" icon="🚀" color="oklch(68% 0.23 38)" shadow="oklch(46% 0.23 38)" />
          </div>
          <div className="animate-float absolute" style={{ top: '28%', left: '22%', animationDelay: '1.2s', opacity: 0.6 }}>
            <HeroBlock label="Samplesheet" icon="📋" color="oklch(50% 0.22 258)" shadow="oklch(33% 0.22 258)" />
          </div>
          <div className="animate-float-slow absolute" style={{ top: '55%', left: '5%', animationDelay: '0.4s', opacity: 0.5 }}>
            <HeroBlock label="Input FASTQ" icon="🧬" color="oklch(58% 0.20 212)" shadow="oklch(40% 0.20 212)" />
          </div>
          <div className="animate-float absolute" style={{ top: '15%', right: '8%', animationDelay: '0.8s', opacity: 0.7 }}>
            <HeroBlock label="QC Step" icon="🔬" color="oklch(50% 0.25 302)" shadow="oklch(33% 0.25 302)" />
          </div>
          <div className="animate-float-slow absolute" style={{ top: '38%', right: '12%', animationDelay: '2s', opacity: 0.6 }}>
            <HeroBlock label="Generate Report" icon="📊" color="oklch(52% 0.22 152)" shadow="oklch(35% 0.22 152)" />
          </div>
          <div className="animate-float absolute" style={{ top: '65%', right: '6%', animationDelay: '0.6s', opacity: 0.5 }}>
            <HeroBlock label="Output Results" icon="📁" color="oklch(52% 0.20 232)" shadow="oklch(35% 0.20 232)" />
          </div>
          <div className="animate-float-slow absolute" style={{ top: '70%', left: '28%', animationDelay: '1.8s', opacity: 0.45 }}>
            <HeroBlock label="Trim Reads" icon="✂️" color="oklch(66% 0.22 24)" shadow="oklch(46% 0.22 24)" />
          </div>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(60% 0.145 195 / 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: 'oklch(60% 0.145 195 / 0.18)',
              border: '1px solid oklch(60% 0.145 195 / 0.35)',
              color: 'oklch(85% 0.10 195)',
              animationDelay: '0.1s',
            }}
          >
            🧬 Phase 0 · RNA-seq QC Playground
          </div>

          <h1
            className="animate-fade-up text-5xl font-bold leading-tight tracking-tight"
            style={{ color: 'oklch(97% 0.01 200)', animationDelay: '0.25s' }}
          >
            Learn Nextflow pipelines<br />
            <span style={{ color: 'var(--color-teal-400)' }}>visually. Before the terminal.</span>
          </h1>

          <p
            className="animate-fade-up text-xl leading-relaxed max-w-xl"
            style={{ color: 'oklch(72% 0.03 200)', animationDelay: '0.4s' }}
          >
            Drag blocks, connect them, and simulate a bioinformatics pipeline — right in
            your browser. Every block maps to a real nf-core concept.
          </p>

          <div
            className="animate-fade-up flex flex-wrap gap-3 justify-center"
            style={{ animationDelay: '0.55s' }}
          >
            <Link
              href="/builder"
              className="px-8 py-3 rounded-xl text-base font-bold transition-all"
              style={{
                background: 'var(--color-teal-500)',
                color: 'white',
                boxShadow: '0 5px 0 var(--color-teal-700)',
              }}
            >
              Start Building →
            </Link>
            <a
              href="https://github.com/a-lamloum/bioflow-blocks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl text-base font-bold transition-all"
              style={{
                background: 'oklch(100% 0 0 / 0.08)',
                border: '1px solid oklch(100% 0 0 / 0.15)',
                color: 'oklch(90% 0.02 200)',
              }}
            >
              View on GitHub
            </a>
          </div>

          <p
            className="animate-fade-up text-sm"
            style={{ color: 'oklch(55% 0.02 200)', animationDelay: '0.65s' }}
          >
            No installation · No login · No real pipeline execution
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-up"
          style={{ animationDelay: '1s', color: 'oklch(45% 0.02 200)' }}
          aria-hidden="true"
        >
          <span className="text-xs font-medium">scroll</span>
          <div className="w-px h-8 animate-float-slow" style={{ background: 'oklch(45% 0.02 200)' }} />
        </div>
      </section>

      {/* ── WHAT IT TEACHES ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="reveal text-center mb-16">
          <h2 className="text-4xl font-bold text-fg-primary mb-4">Real concepts. Playful interface.</h2>
          <p className="text-xl text-fg-secondary max-w-xl mx-auto">
            Built for MSc students, wet-lab researchers, and anyone stepping into bioinformatics workflows for the first time.
          </p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
          <FeatureCard
            icon="🧩"
            title="Scratch-style blocks"
            description="Drag colourful puzzle blocks onto a canvas and connect them into a pipeline — no commands, no config files."
            delay={0}
          />
          <FeatureCard
            icon="🔬"
            title="nf-core concepts inside"
            description="Every block maps to a real Nextflow or nf-core idea: samplesheets, modules, channels, processes, publishDir."
            delay={100}
          />
          <FeatureCard
            icon="⚡"
            title="Instant simulation"
            description="Click Simulate and see a step-by-step trace and a mock QC report card — pure client-side, under 3 seconds."
            delay={200}
          />
          <FeatureCard
            icon="🎓"
            title="Guided missions"
            description="A built-in mission walks you through building your first RNA-seq QC pipeline from scratch, step by step."
            delay={0}
          />
          <FeatureCard
            icon="🔍"
            title="Block inspector"
            description="Click any block to see its beginner explanation alongside the official nf-core concept — always visible, no toggle."
            delay={100}
          />
          <FeatureCard
            icon="📄"
            title="Workflow JSON"
            description="See the typed internal pipeline representation your blocks compile to — the same structure a real engine would use."
            delay={200}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="px-6 py-24"
        style={{ background: 'oklch(93% 0.012 85)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="reveal text-center mb-16">
            <h2 className="text-4xl font-bold text-fg-primary mb-4">Three steps to your first pipeline</h2>
            <p className="text-xl text-fg-secondary">No setup required. Opens in your browser.</p>
          </div>

          <div className="flex flex-col gap-10">
            <Step
              number="1"
              title="Drag blocks onto the canvas"
              description="Pick from 7 block types in the library panel. Drag them onto the warm-toned canvas — or click to add them at the center."
              delay={0}
            />
            <Step
              number="2"
              title="Connect them in order"
              description="Draw edges from the output bump of one block to the input notch of the next. Incompatible connections are gently rejected with a hint explaining why."
              delay={100}
            />
            <Step
              number="3"
              title="Click Simulate and read the trace"
              description="Hit Simulate and watch the step-by-step trace appear. A QC report card surfaces with per-sample results, plus an illustrative nextflow run command."
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="reveal text-center mb-10">
          <h2 className="text-4xl font-bold text-fg-primary mb-4">See it in action</h2>
          <p className="text-xl text-fg-secondary">A completed RNA-seq QC pipeline with the inspector and report open.</p>
        </div>
        <div className="reveal" style={{ transitionDelay: '150ms' }}>
          <div
            className="rounded-2xl overflow-hidden border border-border"
            style={{ boxShadow: '0 24px 80px oklch(0% 0 0 / 0.15)' }}
          >
            <img
              src="img/screenshot.png"
              alt="BioFlow Blocks — completed RNA-seq QC pipeline"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── BLOCK SHOWCASE ── */}
      <section
        className="px-6 py-20"
        style={{ background: 'oklch(12% 0.025 200)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'oklch(97% 0.01 200)' }}>
              7 blocks. One complete pipeline.
            </h2>
            <p className="text-lg" style={{ color: 'oklch(65% 0.03 200)' }}>
              Each block teaches a distinct nf-core concept.
            </p>
          </div>

          <div className="reveal flex flex-wrap justify-center gap-3" style={{ transitionDelay: '120ms' }}>
            {[
              { label: 'Start Pipeline',   icon: '🚀', color: 'oklch(68% 0.23 38)',  shadow: 'oklch(46% 0.23 38)' },
              { label: 'Samplesheet',      icon: '📋', color: 'oklch(50% 0.22 258)', shadow: 'oklch(33% 0.22 258)' },
              { label: 'Input FASTQ',      icon: '🧬', color: 'oklch(58% 0.20 212)', shadow: 'oklch(40% 0.20 212)' },
              { label: 'QC Step',          icon: '🔬', color: 'oklch(50% 0.25 302)', shadow: 'oklch(33% 0.25 302)' },
              { label: 'Trim Reads',       icon: '✂️', color: 'oklch(66% 0.22 24)',  shadow: 'oklch(46% 0.22 24)' },
              { label: 'Generate Report',  icon: '📊', color: 'oklch(52% 0.22 152)', shadow: 'oklch(35% 0.22 152)' },
              { label: 'Output Results',   icon: '📁', color: 'oklch(52% 0.20 232)', shadow: 'oklch(35% 0.20 232)' },
            ].map((block, i) => (
              <div
                key={block.label}
                className="animate-float"
                style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${5 + i * 0.4}s` }}
              >
                <HeroBlock {...block} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-28 text-center max-w-3xl mx-auto">
        <div className="reveal flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-fg-primary">
            Ready to build your first<br />bioinformatics pipeline?
          </h2>
          <p className="text-xl text-fg-secondary max-w-md">
            It takes under 5 minutes. No account, no install, no terminal.
          </p>
          <Link
            href="/builder"
            className="px-10 py-4 rounded-xl text-lg font-bold transition-all animate-pulse-glow"
            style={{
              background: 'var(--color-teal-500)',
              color: 'white',
              boxShadow: '0 6px 0 var(--color-teal-700)',
            }}
          >
            Open the Builder →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-8 py-10 border-t border-border"
        style={{ background: 'oklch(12% 0.025 200)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col tablet:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <span className="text-sm font-semibold" style={{ color: 'oklch(75% 0.03 200)' }}>
              BioFlow Blocks
            </span>
            <span className="text-sm" style={{ color: 'oklch(45% 0.02 200)' }}>
              · Phase 0 Prototype
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm" style={{ color: 'oklch(50% 0.02 200)' }}>
            <a href="https://github.com/a-lamloum/bioflow-blocks" target="_blank" rel="noopener noreferrer"
              className="hover:text-teal-400 transition-colors">
              GitHub
            </a>
            <a href="https://nf-co.re" target="_blank" rel="noopener noreferrer"
              className="hover:text-teal-400 transition-colors">
              nf-core docs
            </a>
            <Link href="/builder" className="hover:text-teal-400 transition-colors">
              Builder
            </Link>
          </div>

          <div className="text-sm text-center" style={{ color: 'oklch(40% 0.02 200)' }}>
            © 2026 Ahmed Lamloum · MIT-NC License<br />
            <span style={{ fontSize: 11 }}>Commercial use by author permission only</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
