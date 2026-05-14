# Implementation Plan: Phase 0 — RNA-seq QC Playground Prototype

**Branch**: `001-phase0-rnaseq-playground` | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-phase0-rnaseq-playground/spec.md`

---

## Summary

Build a frontend-only Next.js prototype that lets a bioinformatics beginner visually assemble
a small RNA-seq QC pipeline from 7 typed blocks, click "Simulate", and receive a beginner-friendly
execution trace and mock QC report — all in the browser with no backend, no auth, and no real
Nextflow execution. The UI is a playful learning lab: left block library, center canvas (React Flow),
right inspector, top mission panel, bottom run/trace panel. Block definitions and the simulation
engine are pure TypeScript modules, fully decoupled from the UI layer per the constitution.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 20 LTS

**Primary Dependencies**:
- Next.js 14 (App Router)
- React 18
- `@xyflow/react` (React Flow v12) — pipeline DAG canvas
- Tailwind CSS v3
- shadcn/ui component primitives (Button, Card, Badge, Tooltip, ScrollArea, Tabs)
- Vitest + React Testing Library — unit and component tests
- `@types/node`, `eslint-config-next`

**Storage**: None — pipeline graph state in React state; block definitions as static TypeScript
constants; demo samplesheet as a static data file. No localStorage in Phase 0.

**Testing**: Vitest (pure function unit tests for simulator, compiler, validator); React Testing
Library (component smoke tests). No E2E in Phase 0.

**Target Platform**: Modern browser (Chrome, Firefox, Safari, Edge); tablet and desktop viewport.
Mobile is best-effort only.

**Project Type**: Single-page web app — Next.js App Router, single route `/`.

**Performance Goals**: Simulated execution must display trace + report within 3 seconds
of user clicking "Simulate" (client-side only — deterministic mock, no I/O). Canvas must
render 7–10 nodes at 60 fps on a modern laptop.

**Constraints**:
- Phase 0 MUST run with `next dev` only — no backend process, no database, no env secrets
- No real Nextflow execution, Docker, or shell command execution under any code path
- No file upload — demo samplesheet is static data baked into the app
- All block logic and simulation MUST be pure functions (no side effects, no async in simulator)
- `strict: true` enforced in `tsconfig.json` from day one

**Scale/Scope**: 7 block types, 1 mission, 1 canvas page, ~15–20 React components,
~5 pure-function modules (compiler, validator, simulator, block defs, mission defs)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Learning-First Simulator | No real execution exists anywhere in this plan | ✅ PASS |
| II. Phase 0 Minimal Scope | No backend, no DB, no auth, no file upload, no save/load | ✅ PASS |
| III. Separation of Concerns | UI / block schema / simulator / (future execution) are distinct modules; no cross-imports | ✅ PASS |
| IV. Concept-to-Reality Mapping | Every block has `technicalConcept` field; simulator disclaimer is a FR | ✅ PASS |
| V. Playful Educational Design | Mission panel, beginner trace, puzzle-style errors, inspector toggle planned | ✅ PASS |
| VI. TypeScript & Code Quality | `strict: true`, typed interfaces for all cross-layer data, pure functions | ✅ PASS |
| VII. Accessibility & Learning Feedback | Keyboard nav, focus states, WCAG AA, <3s feedback planned as FR | ✅ PASS |

**Gate result: ALL PASS — proceeding to Phase 0 research.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-phase0-rnaseq-playground/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── simulator.ts     # Pure simulator function signature
│   ├── compiler.ts      # Graph → IR compiler signature
│   └── validator.ts     # Pipeline validator signature
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx               # Root layout, Tailwind globals
│   ├── page.tsx                 # Main builder page — single route
│   └── globals.css
├── components/
│   ├── canvas/
│   │   ├── PipelineCanvas.tsx   # React Flow wrapper; owns node/edge state
│   │   ├── PipelineNode.tsx     # Custom React Flow node for pipeline blocks
│   │   └── ConnectionLine.tsx   # Styled animated edge
│   ├── blocks/
│   │   ├── BlockLibrary.tsx     # Left panel: block category list + drag source
│   │   └── BlockCard.tsx        # Individual draggable block card
│   ├── inspector/
│   │   └── BlockInspector.tsx   # Right panel: selected block detail + toggle
│   ├── mission/
│   │   └── MissionPanel.tsx     # Top panel: step-by-step guided mission
│   ├── run/
│   │   ├── RunPanel.tsx         # Bottom panel: simulate button + output tabs
│   │   ├── TraceList.tsx        # Ordered list of simulation trace entries
│   │   └── ReportCard.tsx       # Mock QC report card with status indicators
│   ├── pipeline-preview/
│   │   └── PipelinePreview.tsx  # Animated pipeline stage: file → step cards
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── Tooltip.tsx
├── lib/
│   ├── blocks/
│   │   └── definitions.ts       # All 7 BlockDefinition objects (pure data)
│   ├── simulator/
│   │   └── simulate.ts          # simulate(ir): SimulationResult — pure function
│   ├── compiler/
│   │   └── compile.ts           # compile(nodes, edges): WorkflowIR — pure function
│   ├── validator/
│   │   └── validate.ts          # validate(ir): ValidationResult — pure function
│   └── mission/
│       └── missions.ts          # Mission definitions + checkCompletion()
├── types/
│   └── index.ts                 # All shared TypeScript interfaces
└── data/
    └── demo-samplesheet.ts      # Static demo sample rows (2 paired-end samples)

tests/
├── unit/
│   ├── simulator.test.ts
│   ├── compiler.test.ts
│   └── validator.test.ts
└── components/
    ├── PipelineCanvas.test.tsx
    └── BlockInspector.test.tsx
```

**Structure Decision**: Single Next.js app at repository root (no `frontend/` or `backend/`
subdirectory) — Phase 0 is frontend-only with zero backend. Source under `src/` with strict
layer separation: `lib/` modules have no React imports; `components/` have no simulator imports
except through a thin hook in `app/page.tsx`.

---

## Complexity Tracking

> No constitution violations — section left intentionally empty.
