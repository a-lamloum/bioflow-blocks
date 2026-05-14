# Data Model: Phase 0 — RNA-seq QC Playground Prototype

**Date**: 2026-05-14
**Branch**: `001-phase0-rnaseq-playground`

All entities below map to TypeScript interfaces in `src/types/index.ts`.
No database — all state is in-memory (React state) or static (TypeScript constants).

---

## Entity Map

```
BlockDefinition (static data, 7 instances)
    ↓ referenced by
PipelineNode (canvas state)
    ↓ connected via
PipelineEdge (canvas state)
    ↓ compiled into
WorkflowIR
    ↓ validated by
ValidationResult
    ↓ simulated into
SimulationResult
    ├── TraceEntry[]
    └── ReportCard
            └── SampleResult[]

Mission (static data, 1 instance in Phase 0)
    ↓ tracks
MissionStep[]
    ↓ completes via
SimulationResult.status === 'completed'
```

---

## BlockDefinition

Represents one type of pipeline block. Static data — defined once in `src/lib/blocks/definitions.ts`.

| Field | Type | Description |
|---|---|---|
| `type` | `BlockType` | Unique identifier string for this block type |
| `displayName` | `string` | Beginner-friendly name shown on the block and in the library |
| `technicalConcept` | `string` | Official nf-core/Nextflow concept this block teaches |
| `description` | `string` | Beginner plain-language explanation (shown by default) |
| `technicalDetail` | `string` | Expanded technical explanation (shown on toggle) |
| `category` | `'pipeline' \| 'data' \| 'analysis' \| 'output'` | Groups blocks in the library panel |
| `icon` | `string` | Emoji or icon name for visual identification |
| `inputPorts` | `Port[]` | Accepted input connections |
| `outputPorts` | `Port[]` | Produced output connections |
| `commonMistake` | `string` | One common beginner error for this block |
| `exampleOutput` | `string` | Plain-language description of what this block produces |
| `nfCoreDocsLink` | `string \| undefined` | Optional official nf-core docs URL |

**BlockType union** (exhaustive):
```
'start_pipeline' | 'samplesheet' | 'input_fastq' |
'qc_step' | 'trim_reads' | 'generate_report' | 'output_results'
```

### Port

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique within the block (e.g. `'out-reads'`) |
| `label` | `string` | Human-readable label shown on hover |
| `dataType` | `DataType` | The kind of data flowing through this port |

**DataType union** (exhaustive):
```
'pipeline_context' | 'sample_records' | 'fastq_reads' |
'qc_output' | 'trimmed_reads' | 'report_data' | 'final_output'
```

### DataType Compatibility Matrix

| Source DataType | Accepted by Target |
|---|---|
| `pipeline_context` | `sample_records` |
| `sample_records` | `fastq_reads` |
| `fastq_reads` | `qc_output`, `trimmed_reads` |
| `qc_output` | `report_data` |
| `trimmed_reads` | `report_data` |
| `report_data` | `final_output` |

---

## PipelineNode (Canvas State)

Extends React Flow's `Node` type. Stored in `useNodesState`.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | UUID generated at drop time |
| `type` | `'pipelineBlock'` | React Flow custom node type key |
| `position` | `{ x: number; y: number }` | Canvas coordinates |
| `data.blockType` | `BlockType` | Which block definition this node uses |
| `data.config` | `Record<string, unknown>` | Block-specific runtime config (empty for most Phase 0 blocks) |
| `data.hasError` | `boolean` | Whether the validator flagged this node |
| `data.errorMessage` | `string \| undefined` | Beginner-friendly error for this node |

---

## PipelineEdge (Canvas State)

Extends React Flow's `Edge` type. Stored in `useEdgesState`.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | UUID generated at connect time |
| `source` | `string` | ID of the source PipelineNode |
| `target` | `string` | ID of the target PipelineNode |
| `sourceHandle` | `string` | Port ID on the source node |
| `targetHandle` | `string` | Port ID on the target node |
| `data.dataType` | `DataType` | Data type flowing through this edge |
| `data.label` | `string` | Human-readable label shown on edge hover |

---

## WorkflowIR

The compiled internal representation. Output of `compile(nodes, edges)`.
This is the JSON shown in the "View Workflow JSON" panel.

| Field | Type | Description |
|---|---|---|
| `schema_version` | `'0.1'` | Fixed for Phase 0 |
| `project_id` | `string` | UUID for this session's pipeline |
| `name` | `string` | User-visible pipeline name |
| `execution_mode` | `'simulated'` | Always `'simulated'` in Phase 0 |
| `blocks` | `IRBlock[]` | Ordered list of blocks (topologically sorted) |
| `edges` | `IREdge[]` | All connections |

### IRBlock

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Matches the PipelineNode `id` |
| `type` | `BlockType` | Block type |
| `config` | `Record<string, unknown>` | Block config |

### IREdge

| Field | Type | Description |
|---|---|---|
| `from` | `string` | Source block ID |
| `to` | `string` | Target block ID |
| `dataType` | `DataType` | Data type on this edge |

---

## ValidationResult

Output of `validate(ir: WorkflowIR)`.

| Field | Type | Description |
|---|---|---|
| `valid` | `boolean` | Whether the pipeline can be simulated |
| `errors` | `ValidationError[]` | Blocking errors (simulation cannot start) |
| `warnings` | `ValidationWarning[]` | Non-blocking issues shown as hints |

### ValidationError

| Field | Type | Description |
|---|---|---|
| `blockId` | `string \| null` | Which block caused the error, or null for global errors |
| `code` | `ValidationErrorCode` | Machine-readable code |
| `message` | `string` | Beginner-friendly explanation |
| `fix` | `string` | Plain-language fix instruction |

**ValidationErrorCode union**:
```
'MISSING_START' | 'MISSING_OUTPUT' | 'DISCONNECTED_BLOCK' |
'INVALID_CONNECTION' | 'DUPLICATE_START' | 'CYCLE_DETECTED'
```

---

## SimulationResult

Output of `simulate(ir: WorkflowIR)`.

| Field | Type | Description |
|---|---|---|
| `status` | `'completed' \| 'failed' \| 'blocked'` | Overall simulation outcome |
| `trace` | `TraceEntry[]` | Ordered list of step messages |
| `reportCard` | `ReportCard \| null` | Mock QC report (null if pipeline didn't reach QC) |
| `generatedCommand` | `string \| null` | Illustrative `nextflow run` command (always marked educational) |

### TraceEntry

| Field | Type | Description |
|---|---|---|
| `step` | `number` | 1-based step index |
| `blockId` | `string` | Which block produced this entry |
| `blockType` | `BlockType` | Block type for icon lookup |
| `message` | `string` | Beginner-friendly plain-English description |
| `status` | `'success' \| 'warning' \| 'error'` | Visual indicator |
| `details` | `string \| undefined` | Optional additional context |

### ReportCard

| Field | Type | Description |
|---|---|---|
| `title` | `string` | e.g. `"QC Report — My First Pipeline"` |
| `status` | `'pass' \| 'warn' \| 'fail'` | Overall QC status |
| `summary` | `string` | One-sentence plain-language QC result |
| `samples` | `SampleResult[]` | Per-sample results |
| `generatedAt` | `string` | ISO timestamp (deterministic/fixed for mock) |

### SampleResult

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Sample name (e.g. `"SAMPLE1"`) |
| `readCount` | `number` | Mock read count (static per demo sample) |
| `qualityStatus` | `'pass' \| 'warn'` | Per-sample QC status |
| `message` | `string` | Plain-language quality summary for this sample |

---

## Mission

Static data — one instance in Phase 0, defined in `src/lib/mission/missions.ts`.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | e.g. `'mission_first_qc_pipeline'` |
| `title` | `string` | Display title |
| `description` | `string` | One-sentence overview |
| `steps` | `MissionStep[]` | Ordered guided steps |
| `requiredBlockTypes` | `BlockType[]` | All types that must be present for completion |
| `completionCondition` | `'simulation_success'` | How completion is determined |

### MissionStep

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique step identifier |
| `instruction` | `string` | What to do (beginner language) |
| `hint` | `string` | Shown if the learner is stuck |
| `completed` | `boolean` | Runtime state — updated as learner progresses |

---

## Demo Samplesheet (Static Data)

Defined in `src/data/demo-samplesheet.ts`. Two paired-end samples.

| Field | Type | Example |
|---|---|---|
| `sample` | `string` | `"SAMPLE1"` |
| `fastq_1` | `string` | `"SAMPLE1_R1.fastq.gz"` |
| `fastq_2` | `string` | `"SAMPLE1_R2.fastq.gz"` |
| `strandedness` | `'auto' \| 'forward' \| 'reverse'` | `"auto"` |

---

## State Relationships (Runtime)

```
page.tsx (Client Component)
├── useNodesState → PipelineNode[]        (React Flow)
├── useEdgesState → PipelineEdge[]        (React Flow)
├── useState<string | null>               (selectedNodeId)
├── useState<SimulationResult | null>     (simulationResult)
├── useState<ValidationResult | null>     (validationResult)
└── useState<MissionState>                (missionProgress)

MissionState {
  currentStepIndex: number
  completedStepIds: string[]
  completed: boolean
}
```

No global state store. `page.tsx` passes state down as props and callbacks.
The `lib/` modules receive plain data objects — zero React imports.
