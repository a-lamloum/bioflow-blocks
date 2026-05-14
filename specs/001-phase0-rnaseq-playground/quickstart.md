# Quickstart: Phase 0 — RNA-seq QC Playground Prototype

**Branch**: `001-phase0-rnaseq-playground`

This guide gets the prototype running locally in under 5 minutes. No backend, no Docker,
no environment secrets required.

---

## Prerequisites

- Node.js 20 LTS (`node -v` should print `v20.x.x`)
- npm 10+ (bundled with Node 20)
- Git

---

## 1. Clone and install

```bash
git clone git@github.com:a-lamloum/bioflow-blocks.git
cd bioflow-blocks
git checkout 001-phase0-rnaseq-playground
npm install
```

---

## 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Try the prototype

### Build your first QC pipeline

1. The **Mission Panel** at the top shows the first step: "Add a Samplesheet block."
2. In the **Block Library** (left panel), find the block and drag it onto the canvas.
3. Continue following the mission steps to connect:
   `Start Pipeline → Samplesheet → Input FASTQ → QC Step → Generate Report → Output Results`
4. Click **Simulate** in the run panel at the bottom.
5. Watch the trace appear step-by-step. A mock QC Report Card will appear when the run completes.

### Explore the inspector

Click any block on the canvas. The **Inspector Panel** (right side) shows:
- The beginner explanation for that block
- The real nf-core/Nextflow concept it maps to
- A "Show technical detail" toggle for more depth

### View the Workflow JSON

Click **View JSON** in the bottom panel to see the internal pipeline IR compiled from your
connected blocks. This is labeled as an educational representation.

---

## 4. Run tests

```bash
npm run test          # Vitest unit tests (pure functions)
npm run test:ui       # Vitest UI browser (optional)
```

Tests for the simulator, compiler, and validator run without mounting any React component.

---

## 5. TypeScript check

```bash
npm run typecheck     # tsc --noEmit
```

All code must pass strict TypeScript before any PR.

---

## 6. Lint

```bash
npm run lint          # eslint src/
```

---

## Project layout (key files)

```
src/
├── app/page.tsx                     # Main builder page — start here
├── lib/blocks/definitions.ts        # All 7 block type definitions
├── lib/simulator/simulate.ts        # Pure simulation function
├── lib/compiler/compile.ts          # Graph → WorkflowIR
├── lib/validator/validate.ts        # Pipeline validation rules
├── lib/mission/missions.ts          # Mission definitions
├── types/index.ts                   # All shared TypeScript interfaces
└── data/demo-samplesheet.ts         # Static demo sample data

specs/001-phase0-rnaseq-playground/
├── spec.md                          # Feature specification
├── plan.md                          # This implementation plan
├── research.md                      # Technical decisions
├── data-model.md                    # Entity reference
└── contracts/                       # Module interface contracts
```

---

## What Phase 0 does NOT do

- No real Nextflow execution (all output is deterministic mock data)
- No file upload (demo samplesheet is static)
- No save/load (refreshing the page resets the canvas)
- No login or database
- No backend — `npm run dev` is all you need

These are Phase 1+ features, documented in the PRD at `docs/PRD.md`.

---

## Validation steps (exit criteria for Phase 0)

Run through these manually before marking Phase 0 complete:

- [ ] Can build Start → Samplesheet → Input FASTQ → QC Step → Generate Report → Output Results
- [ ] Clicking Simulate shows a trace and a mock QC Report Card
- [ ] Each of the 7 block types shows a complete inspector panel when clicked
- [ ] "View JSON" shows a valid-looking WorkflowIR
- [ ] Clicking Simulate on an incomplete pipeline shows a beginner-friendly error
- [ ] Simulator disclaimer is visible somewhere in the UI
- [ ] All 7 block types and buttons are reachable by keyboard (Tab + Enter)
- [ ] `npm run test` passes
- [ ] `npm run typecheck` passes with zero errors
