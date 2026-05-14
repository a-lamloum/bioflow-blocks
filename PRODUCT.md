# Product

## Register

product

## Users

**Primary**: MSc bioinformatics students, wet-lab researchers entering computational biology,
workshop learners in Nextflow/nf-core bootcamps, junior bioinformaticians who know biology
but struggle with workflow tooling.

**Context**: Opening a browser during a university lab session, a workshop, or self-study.
Often on a laptop, sometimes a lab desktop. Likely anxious about terminal commands.
The job: understand how a bioinformatics pipeline works before touching the terminal.

**Secondary**: Workshop instructors who need an interactive teaching tool they can demo
live in 60-90 minutes with learners who have no Nextflow experience.

## Product Purpose

BioFlow Blocks is a visual learning simulator for Nextflow and nf-core pipeline concepts.
Learners build small bioinformatics workflows by connecting visual blocks (not typing commands),
see simulated pipeline traces, and read beginner-friendly explanations of each step.

The product is a bridge — from "I don't know what a samplesheet is" to "I can explain what
happens when I run nextflow run nf-core/rnaseq." It teaches the mental model, not the syntax.

Success looks like: a new learner builds their first QC pipeline in under 10 minutes,
fixes a samplesheet error, and leaves with a correct mental model of what each step does.

## Brand Personality

Playful, Warm, Encouraging.

Voice: a knowledgeable labmate who explains things without making you feel stupid. Celebrates
small wins. Treats errors as puzzles, not failures. Curious and enthusiastic about the subject.
Never condescending, never terse.

The feeling should be "Duolingo for bioinformatics" — structured, gamified, satisfying to
complete. Not childish (this is for graduate students and researchers), but genuinely fun.

## Anti-references

- **Terminal / CLI emulators**: Dark background, monospace-everything, command prompt aesthetic.
  This is exactly the interface beginners fear. BioFlow Blocks must feel like the opposite.
- **Dry documentation sites**: White background, dense prose, zero interactivity. No sense of
  play, no visual progress, no warmth.
- **Children's learning apps**: Primary colors, cartoon mascots, bubbly rounded fonts. Would
  alienate MSc students and wet-lab researchers who want to feel taken seriously.
- **Generic SaaS dashboards**: Slate sidebar, metric cards, "Overview" breadcrumb, the B2B
  default template. Cold, clinical, data-dense, no educational affordance.

## Design Principles

1. **Concept before command.** Every visual element should teach the pipeline idea first.
   Commands and technical detail are reveals, not defaults.

2. **Errors are puzzles, not failures.** Error states should feel like game challenges:
   here's what went wrong, here's the hint, here's how to fix it. Never a red wall of text.

3. **Progress is visible.** Learners should always know where they are in the mission and
   feel the satisfaction of each step completing. Empty states are teaching moments.

4. **Scientific warmth, not clinical cold.** The aesthetic is a well-lit lab notebook, not
   a hospital form or a developer console. Warm off-white, natural tones, purposeful color.

5. **Beginner mode hides nothing important, reveals nothing overwhelming.** Complexity is
   available on demand through toggles and inspector reveals, never forced on the learner.

## Accessibility & Inclusion

- Target: WCAG 2.1 AA (mandated by constitution)
- Keyboard navigation: all blocks, buttons, and panels must be reachable by Tab + Enter/Space
- Color must never be the sole status indicator: icons and text always accompany color cues
- Motion: respect `prefers-reduced-motion`; no required animations for task completion
- Focus states: visible and high-contrast on all interactive elements
- Future: English-first; Arabic-ready layout (RTL) in a later phase
