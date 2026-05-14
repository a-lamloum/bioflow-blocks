# Feature Specification: Phase 0 — RNA-seq QC Playground Prototype

**Feature Branch**: `001-phase0-rnaseq-playground`

**Created**: 2026-05-14

**Status**: Draft

**Input**: User description: "Read docs/PRD.md and create the first feature specification only for
Phase 0: RNA-seq QC Playground Prototype."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Build a Visual QC Pipeline and See a Simulated Result (Priority: P1)

A bioinformatics beginner opens the prototype in a browser with no installation and no login.
They see a canvas with a starter block already placed. They drag blocks from a left panel onto
the canvas — Samplesheet, Input FASTQ, QC Step, Generate Report, Output Results — and connect
them in order. They click "Simulate" and within seconds they see a friendly step-by-step trace
and a mock QC report card. They understand what each step did in plain language.

**Why this priority**: This is the entire MVP thesis. If a learner cannot complete this flow
unassisted, the prototype has failed its only exit criterion.

**Independent Test**: Can be fully tested by opening the prototype, connecting 6 blocks in the
correct order, clicking Simulate, and verifying a mock trace and mock report appear. No backend,
login, or real data required.

**Acceptance Scenarios**:

1. **Given** the prototype is open in a browser, **When** the learner connects Start → Samplesheet
   → Input FASTQ → QC Step → Generate Report → Output Results, **Then** all connections are
   accepted without errors and the canvas shows a valid pipeline.
2. **Given** a valid connected pipeline, **When** the learner clicks "Simulate", **Then** a
   beginner-friendly trace appears listing each completed step in plain language.
3. **Given** a completed simulation, **Then** a mock QC report card is displayed with a clear
   pass/warn result and a short human-readable summary.
4. **Given** any block on the canvas, **When** the learner clicks it, **Then** a right-side
   inspector shows the block's beginner name, plain explanation, real nf-core concept, and an
   example of what the step produces.

---

### User Story 2 — Understand What Each Block Means (Priority: P2)

After placing or clicking any block, the learner wants to understand what it represents in
real Nextflow/nf-core terms. They click a block and see a beginner explanation alongside the
technical concept it maps to. Optionally they can toggle to a more technical view.

**Why this priority**: The learning goal is concept comprehension, not just pipeline building.
Without explanations, the prototype is a drag-and-drop toy with no educational value.

**Independent Test**: Can be tested by clicking each of the 7 block types and verifying each
inspector panel shows a non-empty beginner explanation, a real nf-core concept name, and at
least one example of what the block produces or consumes.

**Acceptance Scenarios**:

1. **Given** any block placed on the canvas, **When** the learner clicks it, **Then** the
   inspector panel shows: beginner name, plain-language explanation, real nf-core/Nextflow
   concept, required inputs, produced outputs, and a common mistake for that block.
2. **Given** the inspector panel is open, **When** the learner toggles "Show technical detail",
   **Then** the panel reveals the official nf-core term (e.g. "Process / Module concept")
   alongside the beginner label.
3. **Given** any block, **Then** the explanation is never empty, never shows raw JSON, and
   contains no terminal commands in beginner mode.

---

### User Story 3 — See the Internal Pipeline JSON (Priority: P3)

A more curious learner or instructor wants to see the internal representation that the visual
blocks compile to. They click "View Workflow JSON" and see a structured JSON document showing
their connected blocks and edges. They understand that this is what a real pipeline engine
would receive.

**Why this priority**: This is the bridge between visual learning and real concepts. It is
a stretch goal for Phase 0 but delivers outsized educational value for instructors and
curious students without adding any backend complexity.

**Independent Test**: Can be tested by building any valid pipeline, clicking "View JSON",
and verifying the output contains a `blocks` array and an `edges` array that accurately
reflect the connected blocks on canvas.

**Acceptance Scenarios**:

1. **Given** a pipeline with at least 2 connected blocks, **When** the learner clicks
   "View Workflow JSON", **Then** a JSON preview panel shows `blocks` and `edges` matching
   the canvas layout.
2. **Given** the JSON panel is open, **Then** the JSON is pretty-printed, readable, and labeled
   as "Educational pipeline representation — not a real Nextflow workflow file."
3. **Given** an empty or disconnected canvas, **When** the learner views JSON, **Then** the
   JSON reflects the current (empty or partial) state without crashing.

---

### Edge Cases

- What happens when the learner clicks "Simulate" with no blocks connected?
  → Simulation is blocked; a friendly message explains that a complete pipeline is required.
- What happens when blocks are connected out of order (e.g. Output before QC)?
  → The validator highlights the invalid ordering with a puzzle-style hint, not a raw error.
- What happens when the learner disconnects a block mid-pipeline?
  → The canvas immediately reflects the disconnection and any dependent connections are
    visually flagged as incomplete.
- What happens if the learner reloads the page?
  → Phase 0 does not persist state. A reload starts fresh. This is a documented limitation,
    not an error.
- What if the learner opens the prototype on a mobile screen?
  → The canvas degrades gracefully: scroll is enabled, blocks are still readable, but the
    experience is optimized for tablet and desktop. Mobile is not a Phase 0 exit criterion.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The prototype MUST be usable in a browser with no installation, no login, and
  no backend service running.
- **FR-002**: The canvas MUST support at least 7 block types: Start Pipeline, Samplesheet,
  Input FASTQ, QC Step, Trim Reads, Generate Report, Output Results.
- **FR-003**: The learner MUST be able to drag blocks from a block panel onto the canvas.
- **FR-004**: The learner MUST be able to connect compatible blocks by drawing edges between
  them on the canvas.
- **FR-005**: The system MUST prevent connections between incompatible block output/input types
  and explain the incompatibility in beginner language.
- **FR-006**: Clicking any block MUST open a right-side inspector panel with: beginner name,
  plain-language explanation, real nf-core/Nextflow concept, required inputs, produced outputs,
  and a common mistake.
- **FR-007**: The inspector MUST include a toggleable "Technical detail" section that reveals
  the official nf-core term without replacing the beginner explanation.
- **FR-008**: The prototype MUST include exactly one guided mission: "Build Your First QC
  Pipeline", which provides a step-by-step prompt guiding the learner to connect all 6 required
  blocks in a valid order.
- **FR-009**: Clicking "Simulate" on a valid pipeline MUST trigger a deterministic mock
  simulation that produces a beginner-friendly trace listing each step in plain language.
- **FR-010**: The simulation MUST produce a mock QC report card with a pass/warn status and
  a plain-language summary of what the QC step found.
- **FR-011**: The simulation MUST complete and display results within 3 seconds of the learner
  clicking "Simulate" (no real computation — client-side deterministic output only).
- **FR-012**: Clicking "Simulate" on an invalid or incomplete pipeline MUST block execution
  and display a puzzle-style hint identifying which block or connection is missing or wrong.
- **FR-013**: The prototype MUST include a "View Workflow JSON" panel that shows the internal
  IR compiled from the current canvas state (blocks + edges), labeled as educational only.
- **FR-014**: The samplesheet block MUST display a small hard-coded demo table (1–2 rows)
  with columns: `sample`, `fastq_1`, `fastq_2`. The learner MUST NOT be required to upload
  a file in Phase 0.
- **FR-015**: All block labels, error messages, trace steps, and inspector explanations MUST
  use beginner-friendly language. No raw terminal output, stack traces, or technical error
  codes MUST be shown in the default view.
- **FR-016**: Every accessible interactive element (block, button, panel) MUST be keyboard
  navigable and have a visible focus state.
- **FR-017**: The prototype MUST clearly display a notice: "This is a learning simulator.
  No real Nextflow pipelines are executed."

### Key Entities

- **Block**: A visual unit representing one pipeline step. Has a type, beginner name, technical
  concept, input port(s), output port(s), configuration, and inspector content.
- **Edge**: A directed connection between an output port of one block and an input port of
  another. Carries a data type label (e.g. `fastq_reads`, `qc_report`).
- **Workflow IR**: The compiled internal JSON representation of blocks and edges. Includes
  `schema_version`, `blocks[]`, and `edges[]`.
- **SimulationResult**: The deterministic output of the mock simulation engine. Contains
  `trace[]` (step entries), `report_card` (mock QC result), `status` (completed / failed).
- **Mission**: A guided learning challenge. Phase 0 contains exactly one mission with a
  step-by-step prompt, required block types, and a completion condition.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner with no prior Nextflow experience MUST be able to complete the "Build
  Your First QC Pipeline" mission without external help within 10 minutes of first opening
  the prototype.
- **SC-002**: Every one of the 7 block types MUST have a non-empty inspector panel with
  beginner explanation, technical concept, and at least one example — verified by manual
  review of all 7 panels.
- **SC-003**: The simulated run MUST produce a visible trace and mock report card within
  3 seconds of clicking "Simulate" on a valid pipeline, measured in a standard browser on
  a modern laptop.
- **SC-004**: The prototype MUST be openable and fully usable with no backend process, no
  database, and no login — verified by running it as a static or local-dev frontend only.
- **SC-005**: All 7 block types and all interactive controls MUST pass a keyboard-navigation
  check: reachable by Tab, activatable by Enter/Space, with visible focus indicators.
- **SC-006**: An instructor MUST be able to demonstrate the full "Build Your First QC Pipeline"
  mission live in a workshop setting in under 5 minutes, including showing the mock trace and
  the workflow JSON.

---

## Assumptions

- The prototype is a static or local-dev Next.js frontend. No server-side rendering,
  authentication, or database is required in Phase 0.
- The samplesheet block displays a hard-coded demo table. File upload is explicitly out of scope.
  CSV paste and inline editing are out of scope for Phase 0.
- The simulation engine is entirely client-side and deterministic. The same pipeline always
  produces the same mock output — this is by design for teaching purposes.
- The Trim Reads block is included in the block library but is NOT required for the one
  mandatory mission. It can be added by the learner for exploration (and the simulation handles it),
  but the mission completion check only requires the 6 core blocks.
- State is not persisted across page reloads in Phase 0. Save/load is a Phase 1 feature.
- The prototype is English-only in Phase 0. Arabic-readiness is a later phase concern.
- The product is designed for tablet and desktop screen sizes. Mobile layout is a best-effort
  concern, not a Phase 0 exit criterion.
- The product will clearly and visibly disclaim that it is a learning simulator, not a real
  Nextflow execution environment, to avoid confusion about scientific validity of outputs.
- The mock QC report does not need to reflect real bioinformatics quality metrics — it needs
  to teach the learner what a QC report looks like and what to look for.
