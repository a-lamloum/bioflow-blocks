<div align="center">

<img src="img/Banner _ compact _960 _ 480_.png" alt="BioFlow Blocks Banner" width="100%" />

<br />
<br />

<!-- <img src="img/BioFlow%20Logo.svg" alt="BioFlow Blocks Logo" width="72" height="72" /> -->

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
  <img alt="Status" src="https://img.shields.io/badge/Status-Phase%200--4%20Complete-brightgreen?style=flat-square" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-111%20passing-brightgreen?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT--NC-blue?style=flat-square" />
  <img alt="nf-core" src="https://img.shields.io/badge/nf--core-aligned-23A559?style=flat-square" />
</p>

</div>

---

## What is BioFlow Blocks?

BioFlow Blocks is a **Scratch-inspired visual simulator** that teaches beginners how Nextflow and nf-core bioinformatics pipelines work — without requiring any command-line experience.

Learners drag colorful blocks onto a canvas, connect them into a pipeline, and click **Simulate** to see a friendly step-by-step trace and a mock QC report. Every block maps to a real nf-core concept (samplesheets, modules, processes, outputs), and each interaction is explained in plain language first, with the technical detail available on demand.

> **"Build and understand your first bioinformatics pipeline visually — before touching the terminal."**

---

## Demo

<div align="center">
  <img
    src="img/screenshot.png"
    alt="BioFlow Blocks — completed RNA-seq QC pipeline with inspector and QC report"
    width="100%"
    style="border-radius: 12px;"
  />
  <p><em>A completed RNA-seq QC pipeline: blocks connected on the canvas, block inspector open on the right, QC report card and trace in the run panel below.</em></p>
</div>

---

## Who is it for?

| Persona | Context |
|---|---|
| **Bioinformatics students** | Need to understand nf-core pipelines for coursework or thesis |
| **Wet-lab researchers** | Want to know what happens to their sequencing files |
| **Workshop instructors** | Need an interactive teaching tool for 60–90 minute sessions |
| **Junior bioinformaticians** | Know commands but not the underlying structure |

---

## Features (Phase 0–4 complete)

- **Visual pipeline canvas** — Scratch-style puzzle-connector blocks, drag-and-drop, React Flow DAG
- **45 blocks across 7 nf-core packs** — from nf-core/rnaseq to nf-core/sarek, nf-core/scrnaseq, and more
- **Connection validation** — incompatible connections rejected with a beginner-friendly toast
- **Mock simulation engine** — pure, deterministic, client-side; trace + QC report in under 3 seconds
- **Block inspector** — beginner explanation + nf-core module name always visible side by side
- **Test Run page** (`/test-run`) — Phase 4: real nf-core/rnaseq test dataset (GSE110004, S. cerevisiae, 6 samples, ~2 MB FASTQs), simulated execution with realistic Nextflow trace, per-sample QC stats, and interactive output directory explorer
- **Command Bridge** — interactive dissector: click any part of the `nextflow run` command to get a plain-language explanation, nf-core docs link, and real-world examples
- **Profile selector** — choose docker/singularity/conda/test with explanations; updates the full command instantly
- **Params JSON preview** — see the `params.json` file that maps to your pipeline choices, with copy button
- **Command Anatomy** — visual breakdown on the landing page showing every flag in the nf-core command
- **Project save/load** — save pipelines to localStorage, load/duplicate/delete from the Projects panel in builder
- **Editable samplesheet** — click the Samplesheet block to open a live-validated table with per-cell error hints
- **Module registry** — searchable `/modules` page showing all 45 blocks with nf-core docs, filterable by pack and status
- **3 guided missions** — Build QC Pipeline · Add Trimming · Generate the nf-core Command
- **Mission map** — visual gallery at `/missions` showing locked/available/completed states
- **Completion badges** — earned on mission completion with a reflection question and "Next Mission" CTA
- **Mission persistence** — progress saved to localStorage across sessions
- **Tutorial wizard** — 6-step guided tour on first visit
- **Demo run preview** — completed simulation shown immediately on first load
- **Light/dark theme** — toggle in nav, persisted to localStorage, no flash on reload
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
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Try the missions

Go to [http://localhost:3000/missions](http://localhost:3000/missions) to see the mission map, then:

1. **Mission 1** — Build Your First QC Pipeline: drag 6 nf-core/rnaseq blocks, connect, simulate
2. **Mission 2** — Add Trimming: add TrimGalore alongside FASTQC, see both in the report
3. **Mission 3** — Generate the Command: add a profile and parameter block, inspect the `nextflow run` output

Each mission earns a badge and shows a reflection question to reinforce the nf-core concept.

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
| **Phase 0** | ✅ Complete | Visual prototype — 7 blocks, canvas, mock simulation, first mission |
| **Phase 1** | ✅ Complete | Project save/load (localStorage), editable samplesheet validator, module registry at `/modules` |
| **Phase 2** | ✅ Complete | Mission map, 3 missions, completion badges, reflection questions, dark mode, 45-block library |
| **Phase 3** | ✅ Complete | Command Bridge — interactive command dissector, profile selector, params JSON preview, docs integration |
| **Phase 4** | ✅ Complete | Tiny test-data execution — real nf-core/rnaseq test dataset (GSE110004, S. cerevisiae), realistic trace, QC stats, output explorer at `/test-run` |
| **Phase 5** | 🔜 Planned | nf-core concept packs — Variant Calling, Metagenomics, scRNA-seq (blocks already defined) |

---

## Educational Disclaimer

BioFlow Blocks is a **learning simulator**. No real Nextflow pipelines are executed. All simulation output is deterministic and educational — it is not scientifically valid data. When execution is introduced in a later phase, it will use curated tiny test datasets in a controlled sandbox environment only.

This project is not an official nf-core product. It is a learning tool built *using* nf-core concepts and documentation.

---

## License

This project is released under a **MIT-based Non-Commercial License**.

Free to use for personal, academic, educational, and open-source purposes.
**Commercial use requires explicit written permission from the author.**

> Commercial use includes — but is not limited to — selling, licensing, offering
> as a paid service, integrating into a commercial product, or using in any
> revenue-generating context.

See the full [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with care for bioinformatics beginners everywhere. 🧬

<sub>Powered by <a href="https://nextflow.io">Nextflow</a> concepts · Aligned with <a href="https://nf-co.re">nf-core</a> documentation</sub>

<br />

<sub>© 2026 Ahmed Lamloum — Commercial use by author permission only.</sub>

</div>
