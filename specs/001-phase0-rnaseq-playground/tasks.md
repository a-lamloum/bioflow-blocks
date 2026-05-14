---
description: "Tasks for Phase 0 — RNA-seq QC Playground Prototype"
---

# Tasks: Phase 0 — RNA-seq QC Playground Prototype

**Input**: Design documents from `specs/001-phase0-rnaseq-playground/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Unit tests included for pure-function modules (simulator, compiler, validator) —
mandated by Constitution Principle VI. Component smoke tests included for inspector.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story. The mission (FR-008) has its own phase as it cuts across US1–US3.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in all task descriptions

---

## Phase 1: Setup

**Purpose**: Project initialization — run once before any feature work begins.

- [ ] T001 Initialize Next.js 14 app at repo root: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias`
- [ ] T002 Install runtime and dev dependencies: `npm install @xyflow/react` and `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @radix-ui/react-tooltip`
- [ ] T003 [P] Configure `tsconfig.json`: set `"strict": true`, `"paths"` not needed, confirm `"baseUrl"` is `"."` — verify `npm run typecheck` passes on empty project
- [ ] T004 [P] Create `vitest.config.ts` at repo root with jsdom environment, setup file pointing to `tests/setup.ts`; create `tests/setup.ts` importing `@testing-library/jest-dom`; add `"test"` and `"test:ui"` scripts to `package.json`
- [ ] T005 [P] Replace generated `tailwind.config.ts` with the seed config from `tailwind.config.seed.ts` (design tokens, custom screens, easing functions); delete `tailwind.config.seed.ts` after merge
- [ ] T006 Update `src/app/layout.tsx`: load Inter and JetBrains Mono via `next/font/google` (self-hosted); apply font CSS variables to `<html>`; import `globals.css`; set `<html lang="en">`; add `color-scheme: light` meta; verify `globals.css` Tailwind directives are present

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript contracts, data, and pure-function modules that ALL user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Define all shared TypeScript interfaces in `src/types/index.ts`: `BlockType` union (7 values), `DataType` union (7 values), `Port`, `BlockDefinition`, `PipelineNodeData`, `PipelineEdge` (extends RF Edge), `WorkflowIR`, `IRBlock`, `IREdge`, `ValidationErrorCode` union, `ValidationError`, `ValidationWarning`, `ValidationResult`, `TraceEntry`, `ReportCard`, `SampleResult`, `SimulationResult`, `MissionStep`, `Mission`, `MissionState`, `SampleRow`
- [ ] T008 Define `DATA_TYPE_COMPATIBILITY` matrix in `src/lib/blocks/definitions.ts`: `Record<DataType, DataType[]>` covering all 7 port-to-port rules documented in `data-model.md`; export as a named constant
- [ ] T009 Define all 7 `BlockDefinition` objects in `src/lib/blocks/definitions.ts`: Start Pipeline, Samplesheet, Input FASTQ, QC Step, Trim Reads, Generate Report, Output Results — each with type, displayName, technicalConcept, description, category, icon, inputPorts, outputPorts, commonMistake, exampleOutput; export as `BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition>`
- [ ] T010 [P] Create static demo samplesheet in `src/data/demo-samplesheet.ts`: 2 `SampleRow` objects (SAMPLE1, SAMPLE2), each with fastq_1, fastq_2, strandedness: 'auto'; export as `DEMO_SAMPLES: SampleRow[]`
- [ ] T011 Implement `compile(nodes, edges): WorkflowIR` in `src/lib/compiler/compile.ts`: filter isolated nodes, build `IRBlock[]` from nodes, build `IREdge[]` from edges carrying dataType; no validation logic here
- [ ] T012 Implement `topologicalSort(ir: WorkflowIR): string[]` in `src/lib/compiler/compile.ts`: Kahn's algorithm on block IDs; throw `Error('CYCLE_DETECTED')` if cycle found; export alongside compile
- [ ] T013 Implement `validate(ir: WorkflowIR): ValidationResult` in `src/lib/validator/validate.ts`: run all 5 checks in order (MISSING_START, MISSING_OUTPUT, DISCONNECTED_BLOCK, INVALID_CONNECTION using DATA_TYPE_COMPATIBILITY, CYCLE_DETECTED); never throw; all error messages beginner-friendly with a `fix` string
- [ ] T014 [P] Unit tests for compiler in `tests/unit/compiler.test.ts`: test compile() on a valid 6-block pipeline → correct IRBlock[] and IREdge[]; test topologicalSort() on linear pipeline → correct order; test topologicalSort() on cyclic graph → throws
- [ ] T015 [P] Unit tests for validator in `tests/unit/validator.test.ts`: one test per ValidationErrorCode (MISSING_START, MISSING_OUTPUT, DISCONNECTED_BLOCK, INVALID_CONNECTION, CYCLE_DETECTED, DUPLICATE_START); one test for valid pipeline → `valid: true`; all tests use pure IR objects, no React

**Checkpoint**: `npm run test` passes all T014 and T015 tests. `npm run typecheck` passes. All exports from `src/types/index.ts`, `src/lib/blocks/definitions.ts`, `src/lib/compiler/compile.ts`, `src/lib/validator/validate.ts` are correct.

---

## Phase 3: User Story 1 — Build a Visual QC Pipeline and Simulate It (Priority: P1) 🎯 MVP

**Goal**: Learner drags 6 blocks onto the canvas, connects them in order, clicks "Simulate",
and sees a beginner-friendly trace + mock QC report card within 3 seconds.

**Independent Test**: Open prototype → drag Start → Samplesheet → Input FASTQ → QC Step →
Generate Report → Output Results → connect all → click Simulate → verify trace appears with
6 entries and a QC Report Card with pass/warn status appears above the trace.

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create base UI components in `src/components/ui/`: `Button.tsx` (variant prop: primary/secondary/ghost; focus-visible ring; disabled state); `Badge.tsx` (variant: success/warning/error/info/default; solid fill, text-xs); `Card.tsx` (surface background, border, radius-md, no nesting)
- [ ] T017 [P] [US1] Implement `simulate(ir: WorkflowIR): SimulationResult` in `src/lib/simulator/simulate.ts`: topological-sort blocks, walk in order invoking a `BlockHandler` per BlockType, accumulate `RunContext`, produce deterministic `TraceEntry[]` and `ReportCard`; use DEMO_SAMPLES for samplesheet data; generated command: `"nextflow run nf-core/demo -profile test,docker --outdir results"` (labeled educational); never throw
- [ ] T018 [US1] Unit tests for simulator in `tests/unit/simulator.test.ts`: test valid 6-block IR → status 'completed', trace has 6 entries, reportCard is non-null; test IR missing QC block → reportCard is null; test empty IR → status 'blocked'; all tests call simulate() directly, no React
- [ ] T019 [US1] Implement `PipelineNode` custom React Flow node in `src/components/canvas/PipelineNode.tsx`: block fill from `--block-{category}`, white `--block-text`, min 160×72px, block icon + name (text-sm semibold), port handles (12px visual diameter, 32px invisible hit area via padding/wrapper), selected state ring-2 teal-500, error state terracotta border + warning icon; `aria-label="[BlockName] block"`; accepts `NodeProps<PipelineNodeData>`
- [ ] T020 [P] [US1] Implement `ConnectionLine` styled edge in `src/components/canvas/ConnectionLine.tsx`: stroke `--color-border-strong`, stroke-width 2, animated dash on selected/hover using teal-500; accepts React Flow `EdgeProps`
- [ ] T021 [US1] Implement `PipelineCanvas` in `src/components/canvas/PipelineCanvas.tsx`: React Flow wrapper with `nodeTypes={{ pipelineBlock: PipelineNode }}`, `edgeTypes={{ default: ConnectionLine }}`; `useNodesState` / `useEdgesState`; `onDrop` creates new PipelineNode at drop position with UUID id; `isValidConnection` uses DATA_TYPE_COMPATIBILITY; `onNodeClick` calls `onSelectNode(nodeId)`; `onDrop` and `onDragOver` handlers; canvas background `--color-canvas`; emits `nodes` and `edges` upward via props for compile step
- [ ] T022 [P] [US1] Implement `BlockCard` in `src/components/blocks/BlockCard.tsx`: 48px height, full width, `draggable`, `onDragStart` sets `dataTransfer.setData('blockType', definition.type)`; left 6px color chip using `--block-{category}`; block displayName text-sm semibold; keyboard: `role="button"`, `tabIndex={0}`, Enter/Space triggers `onKeyDown` that calls a click-to-add fallback (adds block to canvas center); focus-visible ring
- [ ] T023 [P] [US1] Implement `BlockLibrary` panel in `src/components/blocks/BlockLibrary.tsx`: 200px fixed width, surface-2 background, border-right; group definitions by category; render a section heading (text-xs muted uppercase) per category followed by `BlockCard` components; `overflow-y-auto` with thin scrollbar
- [ ] T024 [US1] Implement `RunPanel` in `src/components/run/RunPanel.tsx`: full-width bottom panel; **Idle state** (simulationResult is null): centered "Simulate" Button (primary variant), validate pipeline first and show ValidationError list if invalid (text-sm error-color, each error shows `fix` string); **Active state** (simulationResult set): `ReportCard` at top (if status 'completed'), `TraceList` below, JSON toggle link at footer; panel heights: 240px collapsed / 380px expanded (toggle chevron)
- [ ] T025 [P] [US1] Implement `TraceList` in `src/components/run/TraceList.tsx`: ordered list of `TraceEntry`; each entry: 24px-wide step number column (text-xs muted monospace), 12px status dot + icon, message (text-sm semibold) + optional detail (text-sm normal); stagger-in animation using CSS custom property `--stagger-delay` = `step * 60ms`; wrap animation in `motion-safe:`
- [ ] T026 [P] [US1] Implement `ReportCard` in `src/components/run/ReportCard.tsx`: 4px top border in success/warning/error color (no left stripe); status Badge; one-sentence summary (text-base); sample rows table (text-sm, alternating surface/surface-2 rows, no card wrapper around rows); `aria-label` on the status region
- [ ] T027 [US1] Wire `src/app/page.tsx` as the main builder Client Component (`'use client'`): compose `BlockLibrary` (left, 200px) + canvas area (flex-1, flex-col: `MissionPanel` strip 48px + `PipelineCanvas` flex-1) + `RunPanel` (bottom); state: `useNodesState`, `useEdgesState`, `useState<string | null>(selectedNodeId)`, `useState<SimulationResult | null>`, `useState<ValidationResult | null>`, `useState<MissionState>`; `handleSimulate` callback: compile(nodes, edges) → validate(ir) → if valid: simulate(ir) → set results; if invalid: set validationResult only
- [ ] T028 [P] [US1] Add simulator disclaimer to `src/app/page.tsx`: persistent text at very bottom of page (text-xs muted): "This is a learning simulator. No real Nextflow pipelines are executed." — always visible regardless of panel state
- [ ] T029 [US1] Keyboard navigation pass on US1 components: verify Tab reaches BlockCard items, Simulate button, RunPanel expand toggle, TraceList entries; verify Enter/Space activates BlockCard (adds block to center of canvas) and Simulate button; add any missing `tabIndex`, `role`, `aria-label`, `onKeyDown` handlers to `PipelineCanvas.tsx`, `BlockCard.tsx`, `RunPanel.tsx`

**Checkpoint**: US1 is independently functional. A learner can build and simulate the QC pipeline end-to-end. `npm run test` passes all unit tests.

---

## Phase 4: User Story 2 — Understand What Each Block Means (Priority: P2)

**Goal**: Clicking any block opens the inspector slide-over showing beginner explanation +
nf-core concept (always visible, no toggle needed) + common mistake.

**Independent Test**: Click each of the 7 block types → verify inspector opens at 300px wide,
shows: block displayName (text-xl bold teal-500), one-line technical concept (text-sm muted),
beginner description (text-base), common mistake (amber chip, no left stripe). Press Escape →
inspector closes and canvas returns to full width.

### Implementation for User Story 2

- [ ] T030 [P] [US2] Implement `BlockInspector` slide-over in `src/components/inspector/BlockInspector.tsx`: renders null (0 width) when `selectedNodeId` is null; slides in at 300px from right edge when set; block name text-xl weight-bold teal-500; one-line nf-core concept (format: `nf-core concept: [concept]`, text-sm muted, always visible); beginner description text-base max-65ch `.prose`; common mistake: text-sm, warning-color at 8% opacity background, full border radius, no left stripe; port list (inputs/outputs) text-sm; close on Escape keydown + outside click; `aria-label="Block inspector"` on panel root; `focus-trap` when open (Tab cycles within panel)
- [ ] T031 [US2] Wire `selectedNodeId` state and inspector in `src/app/page.tsx`: pass `onSelectNode` callback to `PipelineCanvas`; pass `selectedNodeId` + `onClose` to `BlockInspector`; when inspector is open, canvas area `paddingRight` or `marginRight` adjusts by 300px (or inspector overlays — coordinate with layout)
- [ ] T032 [P] [US2] Component smoke tests for `BlockInspector` in `tests/components/BlockInspector.test.tsx`: render with each of the 7 block types → assert displayName, technicalConcept substring, description substring, commonMistake substring are all present in the document; assert panel has `aria-label="Block inspector"`

**Checkpoint**: Clicking any block opens the inspector with correct content. Escape closes it. All 7 block types show non-empty, accurate content. Canvas adapts width.

---

## Phase 5: User Story 3 — View Internal Workflow JSON (Priority: P3)

**Goal**: Learner clicks "View workflow JSON" in the run panel and sees the WorkflowIR
inline, labeled as educational only.

**Independent Test**: Build any connected pipeline → click "View workflow JSON ↓" link at
run panel footer → verify an inline JSON block appears with `blocks` and `edges` arrays
matching the canvas; verify the educational disclaimer label is visible.

### Implementation for User Story 3

- [ ] T033 [US3] Add JSON toggle to `RunPanel` in `src/components/run/RunPanel.tsx`: text-sm link at panel footer "View workflow JSON ↓" / "Hide workflow JSON ↑"; on expand, render `<pre>` block with `font-mono text-xs` containing `JSON.stringify(currentIR, null, 2)`; above the `<pre>`: text-xs muted label "Educational pipeline representation — not a real Nextflow workflow file"; animate expand/collapse with height transition (motion-safe); `aria-expanded` on the toggle link
- [ ] T034 [P] [US3] Keep `currentIR` state in `src/app/page.tsx` updated on every nodes/edges change: add `useEffect` that calls `compile(nodes, edges)` whenever `nodes` or `edges` change and stores result in `useState<WorkflowIR | null>`; pass `currentIR` to `RunPanel`; this decouples IR visibility from simulation state

**Checkpoint**: JSON panel shows correct IR at all times, including before simulation. Empty canvas shows empty blocks/edges arrays.

---

## Phase 6: Mission — Build Your First QC Pipeline

**Purpose**: Guided mission strip implementing FR-008. Cuts across US1–US3 and depends on
the simulation completing (US1), so placed after US1 checkpoint.

- [ ] T035 Define mission data in `src/lib/mission/missions.ts`: one `Mission` object with id `'mission_first_qc_pipeline'`, title, description, 6 `MissionStep` objects (each with instruction and hint), `requiredBlockTypes: ['start_pipeline', 'samplesheet', 'input_fastq', 'qc_step', 'generate_report', 'output_results']`, `completionCondition: 'simulation_success'`; export `MISSIONS` and `checkCompletion(nodes: PipelineNode[], result: SimulationResult | null): boolean`
- [ ] T036 Implement `MissionPanel` in `src/components/mission/MissionPanel.tsx`: 48px strip pinned to top of canvas area (full canvas width, surface-2 background, 1px bottom border); left: step counter pill (teal-500, text-xs semibold e.g. "Step 2 of 6") + current instruction text (text-sm, truncated with ellipsis); right: expand chevron Button (ghost variant, 44×44px touch target); on expand: floating card (300px wide, top-left anchored, surface background, shadow, radius-xl) showing all steps — completed steps with check icon + muted text, active step highlighted, locked steps muted; dismiss on outside click or Escape; `aria-label="Mission guide"` on strip
- [ ] T037 Wire mission completion in `src/app/page.tsx`: after successful simulation, call `checkCompletion(nodes, simulationResult)` and update `MissionState.completed`; when `completed` transitions to `true`, show a one-time completion feedback in the `RunPanel` or canvas (text, badge, or brief animation — no modal); pass `missionState` + `onStepAdvance` to `MissionPanel`; advance `currentStepIndex` as learner adds each required block type

---

## Phase 7: Polish and Cross-Cutting Concerns

**Purpose**: Tablet responsiveness, reduced-motion compliance, focus audit, and exit-criteria validation.

- [ ] T038 [P] Tablet responsive pass (768px breakpoint): `BlockLibrary` — add `tablet:w-12 tablet:overflow-hidden` icon-rail variant, `tablet:w-48` expanded drawer overlay triggered by a toggle button; `BlockInspector` — on tablet, render as bottom sheet (`tablet:bottom-0 tablet:h-80 tablet:w-full`) instead of right slide-over; `MissionPanel` strip stays; `RunPanel` height: `tablet:h-52 tablet:expanded:h-80`; verify canvas fills full width between icon rail and right edge on tablet
- [ ] T039 [P] Reduced-motion audit: grep all animation and transition utility classes across `src/components/`; wrap each with `motion-safe:` prefix (e.g. `motion-safe:transition-transform motion-safe:duration-normal`); verify the global `prefers-reduced-motion` rule in `globals.css` is present; spot-check in browser DevTools by toggling the media query
- [ ] T040 [P] Focus ring audit: grep all interactive elements (`button`, `[role="button"]`, `[tabIndex]`, React Flow handles) across `src/components/`; verify each has `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-focus-ring]`; fix any missing; verify focus ring is visible on both `--color-canvas` and `--color-surface-2` backgrounds
- [ ] T041 Port dot touch target: in `src/components/canvas/PipelineNode.tsx`, wrap each React Flow `<Handle>` in a `<div className="p-[10px] -m-[10px]">` (creates 32px effective hit area at 12px visual size; on tablet use `tablet:p-[16px] tablet:-m-[16px]` for 44px); verify handles are still correctly positioned after wrapper
- [ ] T042 Final quality gate: run `npm run test` (all unit + component tests pass), `npm run typecheck` (zero errors), `npm run lint` (zero warnings); fix any failures before marking this task complete
- [ ] T043 Manual validation of quickstart.md exit checklist: walk through all 9 items in `specs/001-phase0-rnaseq-playground/quickstart.md`; mark each passed; document any that fail and create a follow-up task for each failure found

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — blocks ALL user stories
- **Phase 3 (US1)**: Depends on Phase 2 — primary MVP deliverable
- **Phase 4 (US2)**: Depends on Phase 2 (types, definitions) — can start in parallel with Phase 3 for the inspector component, but wiring (T031) depends on T027
- **Phase 5 (US3)**: Depends on T027 (page.tsx state) — JSON toggle is additive
- **Phase 6 (Mission)**: Depends on T027 and T017 (simulate) — completion check needs both
- **Phase 7 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: T030 (inspector component) can start after Phase 2; T031 (wiring) depends on T027
- **US3 (P3)**: T034 can start after T027; T033 additive to RunPanel

### Within Each User Story

- Lib modules before components (T017 before T024; T011–T013 before T019–T026)
- Components before wiring (T019–T026 before T027)
- Wiring before keyboard pass (T027 before T029)

### Parallel Opportunities

**Phase 1**: T003, T004, T005 all touch different config files — run in parallel after T001+T002

**Phase 2**: T007–T010 can all run in parallel (different files); T011 before T012 (topologicalSort calls compile internals); T013 depends on T008; T014 depends on T011+T012; T015 depends on T013

**Phase 3**:
- T016, T017, T022, T023, T025, T026 can all start in parallel after Phase 2
- T019 before T021 (PipelineCanvas imports PipelineNode)
- T020 (ConnectionLine) can run in parallel with T019
- T021 depends on T019, T020
- T024 depends on T025, T026
- T027 depends on T021, T023, T024

**Phase 7**: T038, T039, T040 all touch different files — run in parallel

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 — T016–T029
4. **STOP and VALIDATE**: Learner can build + simulate the QC pipeline end-to-end
5. Demo/share if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Phase 3 (US1) → Simulate pipeline → MVP ✅
3. Phase 4 (US2) → Inspector → Learner understands blocks
4. Phase 5 (US3) → JSON view → Learner sees internal representation
5. Phase 6 → Mission → Guided learning experience complete
6. Phase 7 → Polish → Workshop-ready

### Parallel Team Strategy

With two developers after Phase 2 completes:
- **Dev A**: T016, T017, T019–T021 (canvas + simulator core)
- **Dev B**: T022–T023, T025–T026 (library + trace/report components)
- Both converge on T027 (page.tsx wiring) once their components are ready

---

## Notes

- `[P]` tasks touch different files and have no unmet dependencies — safe to parallelize
- `[US*]` label maps task to specific user story for traceability
- No `any` types — all cross-layer data uses interfaces from `src/types/index.ts`
- No logic inline in JSX — extract to named functions or hooks before T027
- All pure functions (compiler, validator, simulator) must be testable with `simulate()` / `compile()` / `validate()` called directly — no React mounting required
- `prefers-reduced-motion` and focus rings are non-negotiable exit criteria (Constitution Principle VII)
- The simulator disclaimer (T028) is a hard functional requirement (FR-017)
