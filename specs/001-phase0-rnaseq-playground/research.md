# Research: Phase 0 — RNA-seq QC Playground Prototype

**Date**: 2026-05-14
**Branch**: `001-phase0-rnaseq-playground`

All NEEDS CLARIFICATION items from the specification have been resolved below.
Decisions are final for Phase 0 implementation.

---

## Decision 1: Block Canvas Library

**Decision**: `@xyflow/react` (React Flow v12)

**Rationale**:
- Purpose-built for directed acyclic graph (DAG) / pipeline visualization — exactly the mental
  model BioFlow Blocks teaches
- Ships with TypeScript-first API, built-in `useNodesState` / `useEdgesState` hooks, and native
  connection validation callbacks (`isValidConnection`)
- Drag-from-panel → drop-on-canvas flow is well-documented and commonly implemented
- Custom node renderer (`nodeTypes`) lets us build fully styled `PipelineNode` components in
  React — the block appearance is 100% in our control
- Active maintenance (xyflow org), MIT license, widely used in production

**Alternatives considered**:
- **Blockly (Google)**: Better for sequential snap-block (Scratch-style) UI. More complex setup,
  harder to do free-form DAG layout, larger bundle, less TypeScript-friendly. Reconsidered for
  Phase 2 if Scratch-like snapping is needed, but React Flow wins for Phase 0 DAG model.
- **Custom SVG/HTML5 Canvas**: Would require building drag-and-drop, hit testing, edge routing,
  and zoom/pan from scratch. Violates Principle II (Phase 0 minimal scope) — too much build cost.
- **Mermaid / static diagrams**: Read-only, not interactive. Not suitable.

---

## Decision 2: State Architecture

**Decision**: React Flow's built-in `useNodesState` / `useEdgesState` for canvas state;
`useState` for UI state (selected block, simulation result, mission progress). No global
state manager in Phase 0.

**Rationale**:
- React Flow owns node/edge state — lifting it out into Zustand/Redux would add complexity
  with no Phase 0 benefit
- UI state (inspector selection, run panel tab, mission step) is local and does not cross
  component boundaries deep enough to need a store
- `page.tsx` acts as the single coordinator — it holds simulation result and selected block ID,
  passes down via props and callbacks
- If Phase 1 adds save/load, state can be serialized from React Flow's `getNodes()` /
  `getEdges()` methods without needing a store migration

**Alternatives considered**:
- **Zustand**: Cleaner for cross-component state, but adds a dependency and forces global
  coupling that Principle III explicitly prohibits for the simulator layer.
- **React Context**: Appropriate for theming / mission config, but using Context for canvas
  state creates hidden coupling between canvas and run panel.

---

## Decision 3: Styling and Component System

**Decision**: Tailwind CSS v3 + manually implemented shadcn/ui-style components
(Button, Card, Badge, Tooltip, ScrollArea). Do NOT run the shadcn CLI — copy and adapt
primitives by hand to avoid external registry dependencies.

**Rationale**:
- Tailwind provides the utility-first constraint that keeps components small and single-purpose
  (aligns with Principle VI)
- shadcn/ui-style primitives give polished defaults without a heavy component library bundle
- Hand-copying the specific components we need (Button, Card, Badge) avoids the shadcn CLI's
  registry fetches and keeps the dependency graph minimal for Phase 0
- `@radix-ui/react-*` primitives (Tooltip, ScrollArea) may be added individually if needed
  for accessibility (Principle VII)

**Alternatives considered**:
- **MUI / Chakra UI**: Too opinionated, large bundle, hard to make "playful lab" aesthetic
  without fighting the library's design system.
- **Plain CSS modules**: Too verbose for rapid Phase 0 iteration.
- **Full shadcn CLI setup**: Fine for Phase 1+, but requires registry access and generates
  more files than Phase 0 needs.

---

## Decision 4: Testing Framework

**Decision**: Vitest + `@vitest/ui` + React Testing Library (`@testing-library/react`)

**Rationale**:
- Vitest integrates natively with Vite-based and Next.js projects with minimal config
- The simulator, compiler, and validator are pure functions — Vitest unit tests require no
  DOM, no React mount, and run in milliseconds
- React Testing Library for smoke tests on key components (PipelineCanvas renders nodes,
  BlockInspector shows correct block data)
- Constitution Principle VI requires pure functions to be unit-testable without mounting
  components — Vitest enforces this naturally

**Alternatives considered**:
- **Jest with SWC**: The Next.js official recommendation, but requires more config for ESM
  imports and has slower cold starts than Vitest.
- **Playwright E2E**: Deferred to Phase 1 when there is a stable UI to test end-to-end.

---

## Decision 5: Block-to-Canvas Drag Interaction

**Decision**: HTML5 drag-and-drop from `BlockCard` (with `draggable` + `onDragStart`
carrying block type in `dataTransfer`) → React Flow canvas `onDrop` handler instantiates
a new node at the drop position.

**Rationale**:
- React Flow documents exactly this pattern as the recommended approach for external drag sources
- No additional DnD library needed (no `react-dnd`, no `dnd-kit`) — keeps dependencies minimal
- `dataTransfer.setData('blockType', type)` is type-safe when read back with a Zod parse or
  explicit cast against the `BlockType` union

**Alternatives considered**:
- **`dnd-kit`**: More powerful, but overkill for a single drag source → single drop target pattern.
- **Click-to-add**: Simpler UX for mobile, but PRD specifies a drag-and-drop canvas — the drag
  interaction is core to the learning experience.

---

## Decision 6: Connection Validation Strategy

**Decision**: React Flow `isValidConnection` callback checks `sourceHandle.dataType` against
`targetHandle.dataType` using a compatibility matrix defined in `src/lib/blocks/definitions.ts`.

**Rationale**:
- React Flow calls `isValidConnection` before committing any edge — clean intercept point
- The compatibility matrix is a pure data structure (`Record<DataType, DataType[]>`) — no
  runtime side effects, fully testable
- Invalid connections are blocked silently in the canvas (React Flow shows a visual snap-fail)
  and explained in the inspector when a block with incompatible ports is selected

**Compatibility matrix (DataType → accepted by)**:
```
pipeline_context → sample_records (Samplesheet accepts from Start)
sample_records   → fastq_reads    (Input FASTQ accepts from Samplesheet)
fastq_reads      → qc_output      (QC Step accepts from Input FASTQ)
fastq_reads      → trimmed_reads  (Trim Reads accepts from Input FASTQ)
qc_output        → report_data    (Generate Report accepts QC output)
trimmed_reads    → report_data    (Generate Report accepts trimmed reads)
report_data      → final_output   (Output Results accepts from Report)
```

---

## Decision 7: Simulation Engine Design

**Decision**: A single exported pure function `simulate(ir: WorkflowIR): SimulationResult`
that walks the IR's block-topological-sort order and returns a deterministic `SimulationResult`
object. No async, no I/O, no randomness.

**Rationale**:
- Constitution Principle III mandates the simulator is a separate layer with no UI imports
- Constitution Principle VI requires pure functions that are unit-testable without mounting React
- Determinism is a feature: the same valid pipeline always produces the same teaching output,
  which means mission completion checks are reliable and tests never flake
- The function is called synchronously from a `useCallback` in `page.tsx` and its result is
  stored in React state — no loading spinner needed for Phase 0

**Simulation algorithm**:
1. Topological sort of IR blocks by edge dependencies
2. For each block in order, look up its handler in a `BlockHandlers` map
3. Each handler receives the accumulated `RunContext` and returns an updated context + trace entry
4. After all blocks: assemble `SimulationResult` from context

---

## Decision 8: Next.js App Router Setup

**Decision**: Next.js 14 App Router, single page at `src/app/page.tsx`. Server Components
used only for the root layout; the builder page is a Client Component (`'use client'`) because
it uses React state and browser APIs (drag events).

**Rationale**:
- App Router is the current Next.js default and aligns with the plan's TypeScript-first approach
- The entire builder is interactive — there is no meaningful Server Component boundary inside
  the canvas or panels; making `page.tsx` a Client Component is correct
- No API routes in Phase 0 — the `app/api/` directory stays empty

---

## Decision 9: Project Initialization Command

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-import-alias
```

Then add:
```bash
npm install @xyflow/react
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

Optional (for accessible primitives):
```bash
npm install @radix-ui/react-tooltip @radix-ui/react-scroll-area
```

---

## Resolved Clarifications

| Clarification | Resolution |
|---|---|
| Canvas library choice | React Flow (`@xyflow/react`) |
| State manager | React built-in state only |
| Component library | Tailwind + hand-adapted shadcn/ui primitives |
| Testing framework | Vitest + React Testing Library |
| Drag-to-canvas pattern | HTML5 dataTransfer + React Flow onDrop |
| Connection validation | Compatibility matrix in block definitions |
| Simulator architecture | Pure function, synchronous, deterministic |
| Next.js Router | App Router, `page.tsx` is a Client Component |
