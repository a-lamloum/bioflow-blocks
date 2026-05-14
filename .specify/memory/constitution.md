<!-- SYNC IMPACT REPORT
Version change: None (initial placeholders) → 1.0.0
Modified principles: N/A — initial constitution creation
Added sections:
  - Core Principles (I through VII, expanded from template's 5-principle structure)
  - Technology Stack and Architecture
  - Development Workflow and Quality Gates
  - Governance
Removed sections: N/A — no prior content existed
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate references "constitution file";
     no structural change required; gates will be derived from this document at plan time
  ✅ .specify/templates/spec-template.md — Requirement FR-* format and MUST/SHOULD language
     is consistent with Principle VI (strict typing, testable criteria); no change required
  ✅ .specify/templates/tasks-template.md — Phase-based task organization (Setup → Foundational
     → User Stories → Polish) aligns directly with Principle III (Separation of Concerns) and
     Principle II (Phase 0 minimal scope); no change required
  ⚠  docs/PRD.md — Product source of truth; constitution is now authoritative on engineering
     principles and any future PRD revision should cross-reference constitution v1.0.0
Follow-up TODOs:
  - TODO(BACKEND_CHOICE): Backend technology (NestJS vs FastAPI) deferred to Phase 1 planning
  - TODO(DB_CHOICE): Database (PostgreSQL vs Supabase) deferred to Phase 1 planning
-->

# BioFlow Blocks Constitution

## Core Principles

### I. Learning-First Simulator (NON-NEGOTIABLE)

BioFlow Blocks MUST be a visual learning simulator first. The MVP MUST NOT attempt real Nextflow
pipeline execution on user data, real cloud or HPC submission, or arbitrary code execution of any
kind. Every release decision MUST be evaluated against learning value, not execution capability.

The product's promise is: *Build and understand your first bioinformatics pipeline visually — before
touching the terminal.* Every principle and engineering decision MUST serve that promise.

**Rationale**: The product's core thesis is that beginners understand pipeline concepts visually
before facing terminal commands. Premature execution complexity shifts engineering effort toward
infrastructure and away from the learning loop — the opposite of the mission.

### II. Phase 0 Minimal Scope (NON-NEGOTIABLE)

Phase 0 MUST ship with zero authentication, zero real Nextflow execution, zero cloud or HPC
submission, and zero arbitrary code execution. Phase 0 MUST be demonstrable as a lightweight
frontend-only prototype requiring no running backend, database, or auth service.

Phase 0 scope MUST include exactly:
- Visual builder canvas with the 7 core block types
- One hard-coded starter mission (Build Your First QC Pipeline)
- Mock editable samplesheet table
- Mock QC simulation output and beginner-friendly trace
- Internal workflow JSON (IR) preview panel

Any capability beyond this scope MUST NOT be included in Phase 0 without a documented
constitution amendment. No Phase 0 PR MUST introduce a backend dependency.

**Rationale**: Scope creep in Phase 0 delays learning loop validation. If a learner cannot try
the product in a browser with zero setup, Phase 0 has already failed its exit criteria.

### III. Separation of Concerns (NON-NEGOTIABLE)

The codebase MUST maintain strict module boundaries between four independent layers:

- **UI layer**: React components, visual builder canvas, block inspector, run panel, mission map
- **Block schema layer**: typed block definitions, module registry, samplesheet column schema
- **Workflow simulator layer**: compiler, validator, deterministic simulation engine, trace builder
- **Execution layer**: sandboxed worker service — MUST be isolated and only wired in at Phase 4

No UI component MUST import from the simulation engine directly. No simulation engine MUST
import from any UI component. Business logic MUST never live inside React component bodies.
The execution layer MUST be a pluggable backend added after Phase 3 exit criteria are met.

**Rationale**: Without hard architectural boundaries, execution logic bleeds into UI code and
the educational layers become impossible to test in isolation or replace. These boundaries also
make it safe to add real execution in later phases without rewriting the learning product.

### IV. Concept-to-Reality Mapping

Every block, mission, explanation, and generated command MUST be traceable to an official
nf-core or Nextflow concept. No block MUST invent fictional pipeline behavior.

Mapping requirements:
- Each block definition MUST include a `technical_concept` field referencing the real nf-core term
- All learner-facing copy MUST distinguish beginner label (e.g. "Step") from official term ("Process")
- Generated commands MUST accurately reflect nf-core command structure (pipeline, profile, outdir)
- Docs bridge links MUST point to current official nf-core documentation pages
- The product MUST NOT claim to be an official nf-core product or pipeline

**Rationale**: The product's educational credibility depends entirely on accurate concept mapping.
A learner transitioning to real Nextflow MUST not need to unlearn anything BioFlow Blocks taught.

### V. Playful Educational Design

The product MUST feel like a gamified educational web app, not a terminal emulator or developer
tool. Every design decision MUST favor learner confidence over technical density.

Design requirements:
- Errors MUST be presented as solvable puzzles with specific fix guidance, not raw error codes
- Block names MUST use beginner-friendly labels as the primary display, with technical names secondary
- The Pipeline Stage MUST use visual metaphors: file cards, step cards, animated data flow
- All empty states MUST include a teaching hint or a clear next-action prompt
- Raw JSON, terminal output, and log streams MUST be hidden in beginner mode by default
- Advanced mode MAY reveal technical detail progressively, never all at once

**Rationale**: The primary persona is an MSc student or wet-lab researcher who fears the terminal.
If the UI reproduces that fear, the learning loop fails before it begins.

### VI. TypeScript and Code Quality (NON-NEGOTIABLE)

All production code MUST be written in TypeScript with strict mode enabled. No `any` type MUST
be introduced without a documented rationale in a code comment. Component files MUST remain
small and focused on a single responsibility. Business logic MUST live in pure, testable functions
outside React component bodies.

Requirements:
- `strict: true` MUST be set in `tsconfig.json` from project initialization
- Every block schema, workflow IR, samplesheet schema, and simulation context MUST have a
  typed interface or type alias — no untyped objects crossing layer boundaries
- No logic MUST be inline in JSX — extract to named pure functions or React hooks
- Pure functions MUST be unit-testable without mounting any component
- No production `console.log` calls MUST be committed; use structured logging utilities

**Rationale**: The block schema and simulation engine are the core data contracts of this product.
Type safety prevents silent schema mismatches between UI, compiler, and simulator — especially
critical as the execution layer is introduced in later phases with real side effects.

### VII. Accessibility and Learning Feedback

The product MUST meet WCAG 2.1 AA accessibility requirements. Every interactive element MUST
be keyboard-navigable. The UI MUST be responsive for tablet and desktop use. Learning feedback
MUST be immediate, specific, and encouraging.

Requirements:
- All blocks and interactive controls MUST have accessible labels and visible focus states
- Color MUST NOT be the sole indicator of status — icons and text MUST accompany color cues
- Simulated execution feedback MUST appear within 500 ms of the user triggering a simulation
- Mission completion MUST trigger a clear, positive confirmation (badge, message, or animation)
- Every error message MUST state what went wrong AND exactly how to fix it
- The product MUST be usable by a learner with a keyboard only (no mouse required for missions)

**Rationale**: The product serves learners in workshop environments with screen-size variability
and accessibility needs. Slow or confusing feedback breaks the learning loop the product depends
on, and inaccessible UI excludes the learners the product is designed to serve.

## Technology Stack and Architecture

The MVP MUST be built with the following stack. Deviations MUST be documented in the
implementation plan's Complexity Tracking table with justification against project principles.

| Layer | Technology | Phase |
|---|---|---|
| Frontend framework | Next.js + React + TypeScript (strict) | Phase 0+ |
| UI system | Tailwind CSS + shadcn/ui | Phase 0+ |
| Visual builder | React Flow (pipeline DAG) | Phase 0+ |
| Simulation engine | Client-side TypeScript (Phase 0 mocks) | Phase 0 |
| Backend API | Node.js/NestJS or FastAPI — TODO(BACKEND_CHOICE) | Phase 1+ |
| Database | PostgreSQL or Supabase — TODO(DB_CHOICE) | Phase 1+ |
| Auth | Supabase Auth / Clerk / Auth.js | Phase 2+ |
| Execution worker | Isolated sandboxed service | Phase 4+ |

Phase 0 MUST NOT require a backend, database, auth service, or Docker runtime to be running.

## Development Workflow and Quality Gates

### Branching

All features MUST be developed on short-lived feature branches named `###-feature-name`.
Direct commits to `main` are NOT permitted after Phase 0 initial setup.

### Constitution Check Gate

Every implementation plan MUST include a Constitution Check section that verifies compliance
with all seven principles before Phase 0 research or any design work begins. Plans that fail
a check MUST document the violation in the plan's Complexity Tracking table with a written
justification. Violations without justification MUST block plan approval.

### Testing Standards

- Pure functions in the simulation engine and workflow compiler MUST have unit tests
- The samplesheet validator MUST have table-driven tests covering every documented error case
- UI components MUST NOT contain untested business logic
- Integration tests (Phase 1+) MUST cover the full compile → validate → simulate path
- No test MUST mock the simulation engine when testing the UI compile path end-to-end

### Safety Gate (PERMANENT — applies to every phase)

No PR MUST introduce real Nextflow execution, Docker or Singularity execution, arbitrary
shell command execution, or arbitrary GitHub repository execution until Phase 4 exit criteria
are formally passed and documented in the project changelog. This gate MUST be verified in
every code review as a blocking check.

## Governance

This constitution supersedes all prior guidance documents for BioFlow Blocks. All
implementation plans, specifications, and task lists MUST be consistent with its principles.

**Amendment procedure**: Amendments require a written rationale, a version bump following
semantic versioning rules below, an updated Sync Impact Report prepended as an HTML comment,
and propagation review across all dependent templates.

**Versioning policy**:
- MAJOR: Principle removal, redefinition, or backward-incompatible governance restructure
- MINOR: New principle or major section added or materially expanded
- PATCH: Wording clarification, typo fix, or non-semantic refinement

**Compliance review**: The Constitution Check section in every implementation plan serves as
the compliance review gate. Any principle violation found during code review MUST be either
documented with justification or blocked before merge.

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
