<div align="center">

<img src="img/Banner%20_%20dark%20_1280%20_%20320_.png" alt="BioFlow Blocks Banner" width="100%" />

<br />
<br />

<img src="img/BioFlow%20Logo.svg" alt="BioFlow Blocks Logo" width="72" height="72" />

<h1>BioFlow Blocks</h1>

<p>
  <strong>A visual learning playground for Nextflow and nf-core pipeline concepts.</strong><br />
  Build bioinformatics workflows with blocks — before you ever touch a terminal.
</p>

<br />

<!-- Badges -->
<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="React Flow" src="https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
</p>

<p>
  <img alt="Status" src="https://img.shields.io/badge/Status-Phase%200%20Prototype-orange?style=flat-square" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-33%20passing-brightgreen?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img alt="nf-core" src="https://img.shields.io/badge/nf--core-aligned-23A559?style=flat-square" />
</p>

</div>

---

## What is BioFlow Blocks?

BioFlow Blocks is a **Scratch-inspired visual simulator** that teaches beginners how Nextflow and nf-core bioinformatics pipelines work — without requiring any command-line experience.

Learners drag colorful blocks onto a canvas, connect them into a pipeline, and click **Simulate** to see a friendly step-by-step trace and a mock QC report. Every block maps to a real nf-core concept (samplesheets, modules, processes, outputs), and each interaction is explained in plain language first, with the technical detail available on demand.

> **"Build and understand your first bioinformatics pipeline visually — before touching the terminal."**

---

## Who is it for?

| Persona | Context |
|---|---|
| **MSc bioinformatics students** | Need to understand nf-core pipelines for coursework or thesis |
| **Wet-lab researchers** | Want to know what happens to their sequencing files |
| **Workshop instructors** | Need an interactive teaching tool for 60–90 minute sessions |
| **Junior bioinformaticians** | Know commands but not the underlying structure |

---

## Features (Phase 0)

- **Visual pipeline canvas** — Scratch-style blocks with puzzle connectors, drag-and-drop, React Flow DAG
- **7 core block types** — Start Pipeline, Samplesheet, Input FASTQ, QC Step, Trim Reads, Generate Report, Output Results
- **Connection validation** — incompatible connections are rejected with a beginner-friendly explanation
- **Mock simulation engine** — pure, deterministic, client-side; produces a trace and QC report within seconds
- **Block inspector** — click any block to see its beginner explanation and nf-core concept side by side
- **Mission system** — a guided step-by-step mission to build your first RNA-seq QC pipeline
- **Workflow JSON viewer** — see the internal pipeline IR your blocks compile to
- **No installation required** — runs entirely in the browser; no backend, no auth, no database

---

## Getting Started

### Prerequisites

- Node.js 20 LTS or later
- npm 10+

### Run locally

```bash
git clone git@github.com:a-lamloum/bioflow-blocks.git
cd bioflow-blocks
git checkout 001-phase0-rnaseq-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Try the mission

1. Follow the **Mission Panel** strip at the top of the canvas
2. Drag **Start Pipeline → Samplesheet → Input FASTQ → QC Step → Generate Report → Output Results**
3. Connect each block to the next by dragging from the right bump to the left notch
4. Click **▶ Simulate** in the bottom panel
5. Read the trace and QC report that appear

### Other commands

```bash
npm run test       # 33 unit + component tests (Vitest)
npm run typecheck  # TypeScript strict check
npm run lint       # ESLint
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router, Client Components |
| Language | TypeScript 5 — `strict: true` throughout |
| Canvas | `@xyflow/react` (React Flow v12) — DAG pipeline visualization |
| Styling | Tailwind CSS v4 — CSS-native `@theme` token system |
| Design system | OKLCH color palette, Inter + JetBrains Mono via `next/font` |
| Simulation | Pure TypeScript — deterministic, synchronous, zero I/O |
| Testing | Vitest + React Testing Library |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main builder page (Client Component)
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Tailwind v4 @theme + design tokens
├── components/
│   ├── canvas/               # React Flow canvas, custom nodes, edges
│   ├── blocks/               # Block library panel + draggable cards
│   ├── inspector/            # Block inspector slide-over
│   ├── mission/              # Mission strip + floating guide card
│   ├── run/                  # Run panel, trace list, QC report card
│   └── ui/                   # Button, Badge, Card, Toast primitives
├── lib/
│   ├── blocks/definitions.ts # All 7 BlockDefinition objects + compatibility matrix
│   ├── compiler/compile.ts   # compile() + topologicalSort() — pure functions
│   ├── validator/validate.ts # validate() — 6 error codes, beginner messages
│   ├── simulator/simulate.ts # simulate() — deterministic mock execution
│   └── mission/missions.ts   # Mission data + completion logic
├── types/index.ts            # All shared TypeScript interfaces
└── data/demo-samplesheet.ts  # Static demo sample rows

specs/001-phase0-rnaseq-playground/
├── spec.md                   # Feature specification
├── plan.md                   # Implementation plan
├── research.md               # Technical decision log
├── data-model.md             # Entity reference
├── contracts/                # Pure-function interface contracts
├── quickstart.md             # Dev setup + exit checklist
└── tasks.md                  # 43 tasks (all completed)
```

---

## Architecture Principles

BioFlow Blocks follows a strict **separation of concerns** mandated by the [project constitution](.specify/memory/constitution.md):

```
UI layer          ← React components, canvas, panels
Block schema      ← TypeScript definitions, compatibility matrix
Simulator layer   ← Pure functions: compile → validate → simulate
Execution layer   ← (Phase 4+) sandboxed worker, not yet wired
```

The `lib/` modules have **zero React imports** — they are plain TypeScript functions that can be tested without mounting any component. All UI logic lives in `components/`; all business logic lives in `lib/`.

---

## Concept Mapping

Every block in BioFlow Blocks maps to a real nf-core or Nextflow concept:

| Block | Beginner label | nf-core concept |
|---|---|---|
| Start Pipeline | Where your pipeline begins | Workflow entry point |
| Samplesheet | Your sample list | `params.input` / CSV samplesheet |
| Input FASTQ | Raw sequencing files | FASTQ input channel, paired-end reads |
| QC Step | Read quality check | Process / Module concept (e.g. FastQC) |
| Trim Reads | Read cleaning | Preprocessing module (e.g. fastp) |
| Generate Report | Summary report | MultiQC-like aggregation step |
| Output Results | Where your results appear | `publishDir` / output directory |

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 0** | ✅ Complete | Visual prototype — blocks, canvas, mock simulation, mission |
| **Phase 1** | 🔜 Planned | Project save/load, samplesheet validator, module registry |
| **Phase 2** | 🔜 Planned | Mission map, gamification, badges, hints, reflection questions |
| **Phase 3** | 🔜 Planned | Command generator — visual pipeline → `nextflow run` command |
| **Phase 4** | 🔜 Planned | Tiny test-data execution in a sandboxed worker |
| **Phase 5** | 🔜 Planned | nf-core concept packs — Variant Calling, Metagenomics, etc. |

---

## Educational Disclaimer

BioFlow Blocks is a **learning simulator**. No real Nextflow pipelines are executed. All simulation output is deterministic and educational — it is not scientifically valid data. When execution is introduced in a later phase, it will use curated tiny test datasets in a controlled sandbox environment only.

This project is not an official nf-core product. It is a learning tool built *using* nf-core concepts and documentation.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with care for bioinformatics beginners everywhere. 🧬

<sub>Powered by <a href="https://nextflow.io">Nextflow</a> concepts · Aligned with <a href="https://nf-co.re">nf-core</a> documentation</sub>

</div>
