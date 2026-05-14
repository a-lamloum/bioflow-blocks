---
title: "BioFlow Blocks PRD"
subtitle: "A Gamified Visual Learning Platform for Nextflow and nf-core Concepts"
author: "Prepared for implementation handoff"
date: "May 14, 2026"
version: "0.1"
source_base: "Built from nf-core official documentation at https://nf-co.re/docs/"
---

# BioFlow Blocks PRD

**Working product name:** BioFlow Blocks  
**Alternative names:** Pipeline Blocks, nf-core Playground, Bioinformatics Blocks  
**Document type:** Product Requirements Document  
**Primary purpose:** Give a product, curriculum, design, and engineering team - or an AI coding model - enough context to build a first production-quality prototype and MVP.  
**Document status:** Draft v0.1  
**Target launch:** Private beta for bioinformatics learners  
**Primary language of product v1:** English-first, Arabic-ready later  
**Official-source basis:** nf-core documentation, especially the documentation overview, running pipelines, pipeline specifications, component specifications, nf-core/tools launch docs, and test-dataset docs.

---

## 1. Executive Summary

BioFlow Blocks is a gamified, visual learning platform that teaches beginners how Nextflow and nf-core-style bioinformatics pipelines work. Users build small pipelines by connecting visual blocks instead of starting with terminal commands, configuration files, and workflow syntax.

The product starts as a **learning simulator**, not a full workflow execution platform. The first version should let a learner build a tiny RNA-seq quality-control workflow visually, understand samplesheets, pipeline steps, containers/profiles, outputs, reports, and common errors, and then see the equivalent command or simplified Nextflow/nf-core concept.

The long-term vision is a bridge from beginner bioinformatics learning to real reproducible workflow usage. A learner starts by connecting blocks such as **Input FASTQ**, **Quality Control**, **Trim Reads**, and **Report**, then gradually learns that these map to real concepts such as samplesheets, channels, processes, modules, subworkflows, profiles, parameters, and pipeline outputs.

### 1.1 One-Sentence Pitch

BioFlow Blocks is a Scratch-inspired visual playground where bioinformatics beginners learn Nextflow and nf-core by building, debugging, and remixing small pipeline workflows with blocks.

### 1.2 Why This Fits nf-core

The idea fits nf-core especially well because nf-core already has a modular mental model. The official nf-core docs describe nf-core as an open-source community dedicated to high-quality, reproducible, well-documented Nextflow pipelines. They also describe nf-core pipelines as end-to-end workflows combining multiple tools and processes to analyze biological data, and describe components as the building blocks of nf-core pipelines, consisting of modules and subworkflows.

### 1.3 MVP Thesis

If a learner can visually build a tiny bioinformatics pipeline, run or simulate it, understand what each step does, fix a simple samplesheet/configuration error, and see the equivalent nf-core/Nextflow command or concept, the product has validated its core learning loop.

---

## 2. Source Alignment With nf-core Documentation

This product should be educationally aligned with nf-core concepts, but it should not pretend to be an official nf-core product unless formally accepted by the nf-core community.

### 2.1 Official Concepts Used

| nf-core documentation concept | Product interpretation |
|---|---|
| nf-core pipelines are end-to-end analysis workflows | Learners build visual end-to-end mini-pipelines. |
| Components are building blocks made of modules and subworkflows | Blocks map to conceptual modules, subworkflows, or pipeline templates. |
| nf-core/tools can launch pipelines through TUI or GUI and validate inputs using schema files | Later phases may generate parameters and commands inspired by nf-core launch behavior. |
| nf-core pipelines use consistent command structure | The product teaches command generation gradually after visual learning. |
| Most pipelines use samplesheets for user data | Samplesheet validation and repair should be a core learning mission. |
| Test profiles and test datasets exist for verifying setup | Later phases can use tiny test-data experiences before real user data. |
| nf-core specifications define standards and best practices | Advanced mode can teach best practices, structure, linting, and contribution concepts. |

### 2.2 Important Naming Constraint

The product should not call itself an official `nf-core/<pipeline>` or imply official nf-core status. It should say: **"A visual learning tool for Nextflow and nf-core concepts"** or **"using nf-core concepts and documentation"**. This avoids confusion with official nf-core pipelines and community governance.

---

## 3. Product Goals and Non-Goals

### 3.1 Goals

1. Teach Nextflow/nf-core pipeline concepts visually and progressively.
2. Reduce beginner fear of terminal commands, samplesheets, profiles, containers, and pipeline errors.
3. Let learners assemble small bioinformatics workflows with blocks.
4. Provide guided missions that introduce one concept at a time.
5. Show simplified execution traces and outputs.
6. Generate beginner-friendly explanations, nf-core-style commands, and eventually simple Nextflow snippets.
7. Provide a module/skill library that can grow over time.
8. Keep the architecture modular so new packs can be added without rewriting the platform.
9. Support a future path to real Nextflow execution using tiny test datasets and controlled compute.
10. Make the product useful for workshops, MSc students, wet-lab researchers, and junior bioinformaticians.

### 3.2 Non-Goals for MVP

The MVP should **not** attempt to do the following:

- Run arbitrary nf-core pipelines on user-uploaded large data.
- Replace the nf-core website, nf-core/tools, or official documentation.
- Become a full production workflow orchestration system.
- Offer arbitrary shell command execution.
- Launch Docker/Singularity/Conda jobs from the browser without sandboxing.
- Support every nf-core pipeline.
- Support HPC/cloud execution in the first release.
- Build a public community/remix marketplace immediately.
- Teach all of Nextflow DSL2 syntax in the first version.
- Let users import arbitrary GitHub repositories and run code.

### 3.3 Success Definition for MVP

The MVP is successful when:

- A new learner completes the first RNA-seq QC mission without help.
- The learner understands the basic flow: input files -> QC -> optional trimming -> report.
- The learner can fix a simple samplesheet error.
- The system can compile blocks into a stable internal workflow representation.
- The system can simulate a run and/or generate a valid teaching command.
- The product shows a simplified trace explaining what happened at each step.
- The product avoids unsafe execution and makes all limitations clear.

---

## 4. Target Users and Personas

### 4.1 Primary MVP Audience

The first product should target **bioinformatics beginners**, not children. The ideal first audience:

- MSc bioinformatics students.
- Biology/pharmacy/medicine students entering computational biology.
- Wet-lab researchers learning pipelines.
- Workshop learners in Nextflow/nf-core bootcamps.
- Junior bioinformaticians who understand biology but struggle with workflow tooling.

### 4.2 Personas

#### Persona A: MSc Bioinformatics Beginner

- Motivation: Needs to understand nf-core pipelines for coursework, thesis, or research.
- Pain: Terminal commands, samplesheets, config profiles, containers, and errors feel overwhelming.
- Success moment: Builds a tiny QC pipeline visually and understands the equivalent command.

#### Persona B: Wet-Lab Researcher

- Motivation: Wants to understand what happens to sequencing files after handing them to bioinformatics staff.
- Pain: Does not know what QC, trimming, alignment, or reports mean.
- Success moment: Can explain the first steps of an RNA-seq pipeline and interpret a simple QC report.

#### Persona C: Workshop Instructor

- Motivation: Wants an interactive way to teach Nextflow/nf-core concepts in 60-90 minutes.
- Pain: Learners get stuck installing tools and copying commands before understanding the ideas.
- Success moment: Runs a session where learners build and debug visual pipelines before using the terminal.

#### Persona D: Junior Bioinformatician

- Motivation: Wants to move from using pipelines to understanding how they are structured.
- Pain: Knows commands but does not fully understand modules, subworkflows, channels, or config profiles.
- Success moment: Sees how visual blocks map to pipeline components and generated code.

---

## 5. Product Principles

1. **Concept before terminal.** Learners should understand pipeline logic before memorizing commands.
2. **Visual first, real concepts underneath.** Blocks should be playful, but they must map to real nf-core/Nextflow ideas.
3. **Start simulated, then become real.** Begin with safe simulation and command generation; add controlled execution later.
4. **No unsafe code execution in MVP.** Do not run arbitrary code or user-selected GitHub tools.
5. **Small data only.** When execution is introduced, use official or curated tiny test datasets first.
6. **Progressive disclosure.** Beginner mode hides complexity; student/advanced mode reveals commands, schemas, modules, and code.
7. **Error learning is part of the game.** Samplesheet/config errors should become puzzles, not scary failures.
8. **Use nf-core language respectfully.** Explain official terms accurately and link to official docs.
9. **Pack-based expansion.** Add new pipeline domains as packs without changing the core platform.
10. **Bridge to real practice.** Every playful block should eventually point toward real command-line or workflow concepts.

---

## 6. Core Product Strategy: Core Platform + Bioinformatics Packs

The product should be built as a stable core platform with add-on learning packs.

```text
BioFlow Blocks Core
|
|-- Visual Builder
|-- Module / Skill Library
|-- Mission System
|-- Pipeline Simulator
|-- Samplesheet Validator
|-- Command Generator
|-- Learning Trace
|-- Project Save / Load
|-- Safety Layer
|
|-- Packs added over time:
    |-- RNA-seq QC Pack
    |-- FASTQ Basics Pack
    |-- nf-core Command Pack
    |-- Samplesheet Debugging Pack
    |-- Variant Calling Concepts Pack
    |-- Metagenomics Concepts Pack
    |-- Single-cell Concepts Pack
    |-- nf-core Developer Pack
```

### 6.1 First Pack Recommendation

The first pack should be:

> **RNA-seq QC Playground**

It should not attempt to teach all RNA-seq analysis. It should teach the earliest and most visual-friendly concepts:

- FASTQ files.
- Paired-end reads.
- Samplesheets.
- Quality control.
- Optional trimming.
- Reports.
- Output folders.
- Test profile / test data idea.
- Generated command.

---

## 7. Learning Model

### 7.1 Beginner Vocabulary Mapping

| Real concept | Beginner label | Explanation |
|---|---|---|
| FASTQ file | Sequencing file | Raw reads from a sequencing machine. |
| Sample | Sample | One biological sample or library. |
| Samplesheet | Sample list | A table telling the pipeline where files are. |
| Parameter | Setting | A value that changes how a pipeline runs. |
| Profile | Run environment | Docker, Singularity, Conda, test mode, HPC, cloud. |
| Channel | Data path | A stream that moves files between steps. |
| Process | Step | One computational task. |
| Module | Tool block | A reusable wrapper around one tool. |
| Subworkflow | Step group | A reusable group of related steps. |
| Pipeline | Full workflow | End-to-end analysis process. |
| Report | Result summary | Human-readable output from the pipeline. |
| Work directory | Temporary workshop | Where Nextflow keeps intermediate files. |
| Output directory | Result folder | Where final results are saved. |

### 7.2 Concept Progression

The product should teach concepts in this order:

1. What is a sequencing file?
2. What is a sample?
3. What is a samplesheet?
4. What is a pipeline step?
5. What is quality control?
6. What is a report?
7. What is a parameter?
8. What is a profile/container?
9. What is a data path/channel?
10. What is a module?
11. What is a subworkflow?
12. What is a full nf-core pipeline?
13. How does a visual workflow become a command?
14. How does a workflow become Nextflow code?
15. How do test data and reproducibility work?

---

## 8. MVP Scope

### 8.1 MVP Feature Set

The first MVP includes:

1. Web-based visual pipeline builder.
2. Initial block library with 7 core blocks.
3. RNA-seq QC Playground pack.
4. Four guided missions.
5. Visual pipeline stage / DAG preview.
6. Internal pipeline JSON generation from blocks.
7. Simulated execution engine for supported blocks.
8. Samplesheet upload or manual table entry.
9. Samplesheet validation with friendly errors.
10. Generated command preview for educational use.
11. Project save/load/duplicate.
12. Run panel with output, trace, warnings, and mock report.
13. Beginner and advanced explanations for each block.
14. A documentation reference panel linking concepts to nf-core docs.

### 8.2 MVP Core Blocks

Start with 7 blocks only:

1. **Start Pipeline**
2. **Samplesheet**
3. **Input FASTQ**
4. **QC Step**
5. **Trim Reads**
6. **Generate Report**
7. **Output Results**

Optional in late MVP:

8. **Run Profile**
9. **Parameter Setting**
10. **Error Checker**

### 8.3 MVP Missions

1. **Build Your First QC Pipeline**  
   Build a pipeline from FASTQ input to QC report.

2. **Fix the Samplesheet**  
   Find and correct missing columns, invalid file names, or paired-end mismatch.

3. **Add Trimming After QC**  
   Understand why reads may be cleaned before later analysis.

4. **Generate the Command**  
   See how visual choices map to a simplified `nextflow run` command.

5. **Read the Report** *(optional MVP stretch)*  
   Interpret a simplified MultiQC-like report and decide if data is acceptable.

### 8.4 MVP Non-Execution Rule

The MVP should not execute full nf-core pipelines on real user data. It may use:

- mock execution,
- curated static example outputs,
- generated commands,
- generated parameter files,
- tiny demo/test-data execution only in a later controlled phase.

---

## 9. User Experience Requirements

### 9.1 Main Navigation

The MVP should have:

- **Home:** what the product teaches and who it is for.
- **Missions:** guided learning challenges.
- **Builder:** visual pipeline canvas.
- **Module Library:** searchable blocks/modules with beginner explanations.
- **My Projects:** saved visual pipelines.
- **Docs Bridge:** concept-to-nf-core documentation references.
- **Settings:** user profile, mode, theme, future execution preferences.

### 9.2 Builder Layout

The builder should include five regions:

1. **Left panel:** block/module categories.
2. **Center canvas:** visual workflow builder.
3. **Pipeline Stage:** visual preview/DAG of files flowing through steps.
4. **Right inspector:** selected block explanation, configuration, real concept, docs link.
5. **Bottom run panel:** simulate/run, output, trace, errors, generated command.

### 9.3 Pipeline Stage

The Pipeline Stage is the Scratch-like visual area. It should show:

- file cards moving from one step to another,
- pipeline step cards lighting up during execution,
- report cards appearing after QC,
- warnings as friendly puzzle hints,
- simplified DAG view for advanced mode.

### 9.4 Block Inspector

When a learner clicks a block, show:

- beginner name,
- real nf-core/Nextflow concept,
- simple explanation,
- technical explanation toggle,
- required inputs,
- produced outputs,
- common mistakes,
- related command/parameter,
- official docs link,
- example before/after.

### 9.5 Run Panel

The run panel should show:

- status: idle, validating, simulating, completed, failed,
- final output or mock report,
- beginner-friendly trace,
- generated command,
- generated parameter preview,
- errors with clear fixes,
- advanced JSON view.

Example beginner trace:

```text
1. Your samplesheet was checked.
2. Two paired-end FASTQ files were found for SAMPLE1.
3. The QC step checked read quality.
4. The report step collected the QC results.
5. Your results are ready in the Output Results block.
```

---

## 10. Functional Requirements

### 10.1 Project Management

Requirements:

- Users can create, save, rename, duplicate, and delete projects.
- Projects store visual workspace, internal pipeline IR, selected pack, mission progress, and generated outputs.
- Anonymous local mode may be allowed for prototype.
- Logged-in mode should enable cloud-saved projects.

Acceptance criteria:

- User can create a pipeline project, refresh, and reopen it.
- Duplicating a project creates an independent copy.
- Invalid project data does not crash the builder.

### 10.2 Visual Pipeline Builder

Requirements:

- Users can drag blocks onto the canvas.
- Users can connect compatible blocks.
- The editor should flag invalid connections.
- The workspace should serialize to JSON.
- The system should compile visual blocks into internal pipeline IR.

Acceptance criteria:

- A valid mission template loads correctly.
- The system detects missing input, missing output, and invalid ordering.
- A valid workflow produces an internal IR and simulated output.

### 10.3 Module / Skill Library

Requirements:

The library stores reusable educational components. In MVP, these are educational/simulated components, not arbitrary executable packages.

Each module card should include:

- ID,
- display name,
- beginner description,
- real concept,
- category,
- input types,
- output types,
- execution mode,
- docs references,
- example output,
- common errors,
- level.

Acceptance criteria:

- A learner can add a module/step from the library.
- Each module explains both simple and technical meaning.
- Adding a new module should not require rewriting core builder logic.

### 10.4 Samplesheet Handling

Requirements:

- Learners can enter a small samplesheet manually or upload CSV.
- The system validates required columns for the active mission/template.
- Errors are explained in beginner language.
- The validator suggests fixes.

Acceptance criteria:

- Missing `sample` column is detected.
- Missing `fastq_1` or `fastq_2` is detected for paired-end mode.
- Empty cells are detected.
- The system can show a corrected example.

### 10.5 Pipeline Simulation

Requirements:

- The product simulates supported workflow steps.
- The simulator should not execute arbitrary code.
- The simulator produces trace entries, mock files, mock reports, and warnings.
- Outputs should be deterministic for teaching missions.

Acceptance criteria:

- QC mission produces a mock QC report.
- Trim mission produces a clear before/after explanation.
- Failed validation stops before simulation.

### 10.6 Command Generator

Requirements:

- Generate a simplified educational command from visual choices.
- Show beginner explanation for each command part.
- Optionally generate a params JSON preview.
- Make clear whether the command is illustrative or ready to run.

Example generated command:

```bash
nextflow run nf-core/demo -profile test,docker --outdir results
```

For RNA-seq concept missions, command generation may be illustrative unless the selected pipeline/test profile is supported.

Acceptance criteria:

- Command includes pipeline name, version placeholder, profile, input, and output directory when relevant.
- Each command part is explainable in the UI.
- The system never claims a command was executed unless execution actually happened.

### 10.7 Documentation Bridge

Requirements:

- Every advanced concept should link to an official nf-core docs page where possible.
- Links should be shown as optional references, not forced reading.
- Docs references should be attached to module cards and inspector panels.

Acceptance criteria:

- A learner can click from "samplesheet" to relevant nf-core running docs.
- A learner can click from "module" to nf-core components docs.
- The docs bridge never replaces the product explanation; it supports it.

---

## 11. Block Specifications

### 11.1 Start Pipeline Block

**Purpose:** Defines the beginning of the visual pipeline.  
**Beginner explanation:** "This is where your pipeline begins."  
**Technical concept:** Workflow entry point.  
**Inputs:** None.  
**Outputs:** Initializes pipeline context.  
**Validation:** Exactly one Start Pipeline block must exist.

### 11.2 Samplesheet Block

**Purpose:** Defines the sample table.  
**Beginner explanation:** "This table tells the pipeline which files belong to each sample."  
**Technical concept:** Pipeline input samplesheet / `params.input`.  
**Inputs:** CSV upload or editable table.  
**Outputs:** Validated sample records.  
**Validation:** Required columns depend on mission/template.

### 11.3 Input FASTQ Block

**Purpose:** Represents sequencing input files.  
**Beginner explanation:** "These are raw sequencing read files."  
**Technical concept:** FASTQ input file paths, paired-end/single-end structure.  
**Inputs:** Sample records.  
**Outputs:** Read file cards / channel-like data stream.  
**Validation:** File extension and pairing checks in simulation mode.

### 11.4 QC Step Block

**Purpose:** Simulates quality control.  
**Beginner explanation:** "This checks whether your sequencing reads look healthy."  
**Technical concept:** Quality-control process/module concept, e.g. FastQC-like step.  
**Inputs:** FASTQ file stream.  
**Outputs:** QC report objects.  
**Validation:** Requires input FASTQ data.

### 11.5 Trim Reads Block

**Purpose:** Simulates read cleaning/trimming.  
**Beginner explanation:** "This removes low-quality parts from reads before later analysis."  
**Technical concept:** Preprocessing process/module concept.  
**Inputs:** FASTQ file stream.  
**Outputs:** Cleaned read file stream.  
**Validation:** Requires FASTQ input.

### 11.6 Generate Report Block

**Purpose:** Collects outputs into a report.  
**Beginner explanation:** "This gathers results into a readable summary."  
**Technical concept:** Report aggregation, MultiQC-like idea.  
**Inputs:** QC outputs, trimming outputs, warnings.  
**Outputs:** Human-readable report card.  
**Validation:** Requires at least one reportable step.

### 11.7 Output Results Block

**Purpose:** Displays final outputs.  
**Beginner explanation:** "This is where your final results appear."  
**Technical concept:** Output directory / published results.  
**Inputs:** Report and result objects.  
**Outputs:** Final UI-rendered result.  
**Validation:** At least one Output Results block must exist.

### 11.8 Optional: Run Profile Block

**Purpose:** Teaches profiles such as test, docker, singularity, conda.  
**Beginner explanation:** "This chooses where and how your pipeline can run."  
**Technical concept:** `-profile` configuration.  
**MVP status:** Stretch feature.

### 11.9 Optional: Parameter Setting Block

**Purpose:** Teaches pipeline parameters.  
**Beginner explanation:** "This is a setting that changes how the pipeline behaves."  
**Technical concept:** `params` / `nextflow_schema.json` concept.  
**MVP status:** Stretch feature.

---

## 12. Module Library Schema

Each module/skill should be defined as data, not hardcoded UI.

```json
{
  "id": "qc_fastq_basic",
  "name": "Quality Control",
  "category": "RNA-seq QC",
  "level": "beginner",
  "beginner_description": "Checks whether your sequencing reads look healthy.",
  "technical_concept": "QC process / module concept",
  "nf_core_reference_type": "conceptual_module",
  "real_tool_examples": ["FastQC", "MultiQC"],
  "input_types": ["fastq_reads"],
  "output_types": ["qc_report"],
  "execution_mode": "simulated",
  "docs_links": [
    {
      "label": "nf-core components overview",
      "url": "https://nf-co.re/docs/specifications/components/overview"
    }
  ],
  "common_errors": [
    "No FASTQ input connected",
    "Samplesheet has missing file paths"
  ],
  "example_output": "A simplified QC report card",
  "version": "0.1"
}
```

### 12.1 Execution Modes

| Mode | Description | MVP? |
|---|---|---|
| `mock` | Static fake output | Yes |
| `simulated` | Deterministic educational simulation | Yes |
| `command_generation` | Generate command/params but do not run | Yes |
| `tiny_test_run` | Run curated tiny data in sandbox | Post-MVP |
| `real_nextflow_run` | Run selected real pipeline with controlled compute | Later |
| `external_hpc_cloud` | Submit to external HPC/cloud | Much later |

---

## 13. Internal Pipeline Representation

The visual editor should compile blocks into a stable internal representation.

```json
{
  "schema_version": "0.1",
  "project_id": "project_123",
  "name": "My First QC Pipeline",
  "product_mode": "beginner",
  "pack_id": "rnaseq_qc_playground",
  "execution_mode": "simulated",
  "pipeline_template": {
    "type": "educational",
    "nf_core_pipeline_reference": "nf-core/demo"
  },
  "blocks": [
    {
      "id": "start_1",
      "type": "start_pipeline",
      "config": {"title": "My First QC Pipeline"}
    },
    {
      "id": "samplesheet_1",
      "type": "samplesheet",
      "config": {
        "columns": ["sample", "fastq_1", "fastq_2"],
        "rows": [
          {
            "sample": "SAMPLE1",
            "fastq_1": "SAMPLE1_R1.fastq.gz",
            "fastq_2": "SAMPLE1_R2.fastq.gz"
          }
        ]
      }
    },
    {
      "id": "input_1",
      "type": "input_fastq",
      "config": {"paired_end": true}
    },
    {
      "id": "qc_1",
      "type": "module_step",
      "config": {"module_id": "qc_fastq_basic"}
    },
    {
      "id": "report_1",
      "type": "generate_report",
      "config": {"format": "report_card"}
    },
    {
      "id": "output_1",
      "type": "output_results",
      "config": {"title": "QC Results"}
    }
  ],
  "edges": [
    {"from": "start_1", "to": "samplesheet_1"},
    {"from": "samplesheet_1", "to": "input_1"},
    {"from": "input_1", "to": "qc_1"},
    {"from": "qc_1", "to": "report_1"},
    {"from": "report_1", "to": "output_1"}
  ]
}
```

---

## 14. Runtime Context Shape

```json
{
  "run_id": "run_abc",
  "project_id": "project_123",
  "user_id": "user_123",
  "mode": "beginner",
  "execution_mode": "simulated",
  "samples": [],
  "files": [],
  "step_outputs": {},
  "reports": [],
  "trace": [],
  "warnings": [],
  "errors": [],
  "generated_command": null,
  "generated_params": null,
  "final_output": null,
  "usage": {
    "compute_seconds": 0,
    "simulated": true
  }
}
```

---

## 15. Validation Rules

Before simulation or command generation:

1. Exactly one Start Pipeline block exists.
2. At least one Output Results block exists.
3. Samplesheet block exists for missions that require samples.
4. Required samplesheet columns are present.
5. Required cells are not empty.
6. Paired-end samples must have both R1 and R2 if paired mode is enabled.
7. QC block must receive FASTQ input.
8. Report block must receive at least one reportable output.
9. Unsupported execution modes are blocked.
10. Real execution cannot be triggered from client-side data alone.

Acceptance criteria:

- Invalid workflows fail before simulation.
- Errors identify the exact block and issue.
- Error messages explain the fix in beginner language.

---

## 16. Example Missions

### 16.1 Mission: Build Your First QC Pipeline

**Goal:** Build a simple visual workflow from sample table to QC report.  
**Concepts:** samplesheet, FASTQ input, QC step, report, output.  
**Required blocks:** Start, Samplesheet, Input FASTQ, QC Step, Generate Report, Output Results.  
**Success condition:** A mock QC report is generated.

### 16.2 Mission: Fix the Samplesheet

**Goal:** Learn why samplesheets matter.  
**Concepts:** required columns, paired-end reads, file paths.  
**Required action:** Fix a broken CSV/table.  
**Success condition:** Samplesheet validator passes.

Broken example:

```csv
sample,fastq_1,fastq_2
SAMPLE1,SAMPLE1_R1.fastq.gz,
```

Friendly error:

```text
SAMPLE1 is missing its second read file. In paired-end mode, every sample needs fastq_1 and fastq_2.
```

### 16.3 Mission: Add Trimming

**Goal:** Understand preprocessing before later analysis.  
**Concepts:** read quality, trimming, before/after outputs.  
**Required blocks:** Start, Samplesheet, Input FASTQ, QC Step, Trim Reads, Generate Report, Output Results.  
**Success condition:** The report explains that reads were cleaned after QC.

### 16.4 Mission: Generate the Command

**Goal:** Bridge visual pipeline to real nf-core/Nextflow style command.  
**Concepts:** pipeline name, version, profile, input, output.  
**Required action:** Choose a profile and output directory.  
**Success condition:** The system generates a commented command preview.

### 16.5 Mission: Read the Report

**Goal:** Interpret simplified QC results.  
**Concepts:** pass/warn/fail, report interpretation.  
**Required action:** Decide whether the data is acceptable.  
**Success condition:** Learner identifies one quality warning correctly.

---

## 17. Gamification and Learning Design

### 17.1 Game Loop

1. Choose mission.
2. Learn a new pipeline concept.
3. Build a visual workflow.
4. Validate it.
5. Simulate or generate command.
6. Read trace/report.
7. Fix errors.
8. Unlock new block/module.
9. Remix or extend the project.

### 17.2 World Map

Suggested learning world:

1. **FASTQ Island** - sequencing files and samples.
2. **Samplesheet Gate** - CSV structure and validation.
3. **QC Lab** - quality-control reports.
4. **Trimming Workshop** - read cleaning.
5. **Profile Station** - Docker, Singularity, Conda, test profiles.
6. **Command Bridge** - visual workflow to command line.
7. **Module Factory** - modules and reusable components.
8. **Subworkflow City** - groups of steps.
9. **Pipeline Observatory** - full nf-core pipeline structure.
10. **Developer Dock** - linting, tests, contribution concepts.

### 17.3 Rewards

MVP rewards should be lightweight:

- Mission completion checkmark.
- First Pipeline Built badge.
- Samplesheet Fixer badge.
- QC Detective badge.
- Command Bridge badge.
- Error Solver badge.
- Unlock next concept/block.

### 17.4 Assessment Design

Every mission should include:

- learning objective,
- required blocks,
- common mistake,
- validation puzzle,
- reflection question,
- success evidence.

Example reflection question:

> Why does the pipeline need a samplesheet before it can find your FASTQ files?

---

## 18. Architecture

### 18.1 Recommended Stack

| Layer | Recommended option | Notes |
|---|---|---|
| Frontend | Next.js + React + TypeScript | Fast iteration and easy deployment. |
| Visual builder | Blockly or React Flow | Blockly is better for Scratch-like blocks; React Flow is better for DAG/pipeline visualization. A hybrid is possible. |
| UI | Tailwind CSS + shadcn/ui | Clean educational interface. |
| Backend | FastAPI or Node.js/NestJS | Choose based on developer strength. |
| Database | PostgreSQL / Supabase | Projects, missions, modules, runs. |
| Simulation engine | Server-side TypeScript/Python | Deterministic educational execution. |
| Docs bridge | Curated metadata | Store official docs links per concept/module. |
| Auth | Supabase Auth / Clerk / Auth.js | Optional for prototype, useful for beta. |
| Execution later | Isolated worker service | Only for controlled tiny test runs. |

### 18.2 High-Level Architecture

```text
Browser UI
  -> Mission Map
  -> Visual Builder
  -> Pipeline Stage / DAG Preview
  -> Inspector
  -> Run Panel
  -> Generated Command Panel

Backend API
  -> Auth / User Service
  -> Project Service
  -> Mission Service
  -> Module Registry
  -> Workflow Compiler / Validator
  -> Samplesheet Validator
  -> Simulation Engine
  -> Command Generator
  -> Docs Reference Service
  -> Run Logging

Database
  -> Users
  -> Projects
  -> Workflows
  -> Missions
  -> Modules
  -> Runs
  -> Learning Progress
```

### 18.3 Suggested API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/missions` | List missions |
| GET | `/api/missions/:id` | Get mission details and starter workspace |
| GET | `/api/modules` | List educational modules/steps |
| GET | `/api/modules/:id` | Get module metadata |
| POST | `/api/samplesheets/validate` | Validate samplesheet |
| POST | `/api/workflows/validate` | Validate visual workflow IR |
| POST | `/api/workflows/simulate` | Run simulated workflow |
| POST | `/api/workflows/generate-command` | Generate command/params preview |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Load project |
| PUT | `/api/projects/:id` | Save project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/runs/:id` | Get simulation result |

---

## 19. Data Model

### 19.1 User

```json
{
  "id": "user_123",
  "email": "learner@example.com",
  "display_name": "Learner",
  "role": "learner",
  "mode": "beginner",
  "created_at": "2026-05-14T00:00:00Z"
}
```

### 19.2 Project

```json
{
  "id": "project_123",
  "owner_id": "user_123",
  "title": "My First QC Pipeline",
  "description": "A visual RNA-seq QC learning pipeline.",
  "pack_id": "rnaseq_qc_playground",
  "workspace_json": {},
  "workflow_ir": {},
  "visibility": "private",
  "created_at": "2026-05-14T00:00:00Z",
  "updated_at": "2026-05-14T00:00:00Z"
}
```

### 19.3 Mission

```json
{
  "id": "mission_first_qc_pipeline",
  "title": "Build Your First QC Pipeline",
  "difficulty": "beginner",
  "pack_id": "rnaseq_qc_playground",
  "concepts": ["samplesheet", "fastq", "qc", "report", "output"],
  "starter_workspace_json": {},
  "completion_rules": {
    "required_block_types": [
      "start_pipeline",
      "samplesheet",
      "input_fastq",
      "module_step",
      "generate_report",
      "output_results"
    ],
    "requires_successful_simulation": true
  }
}
```

### 19.4 Module

```json
{
  "id": "trim_reads_basic",
  "name": "Trim Reads",
  "version": "0.1",
  "category": "RNA-seq QC",
  "beginner_description": "Removes low-quality parts from reads.",
  "technical_concept": "Read preprocessing process/module concept",
  "input_schema": {
    "reads": "fastq_reads"
  },
  "output_schema": {
    "trimmed_reads": "fastq_reads"
  },
  "execution_mode": "simulated",
  "docs_links": [],
  "allowed_modes": ["beginner", "student", "advanced"]
}
```

### 19.5 Run

```json
{
  "id": "run_abc",
  "project_id": "project_123",
  "user_id": "user_123",
  "status": "completed",
  "execution_mode": "simulated",
  "workflow_snapshot": {},
  "input_snapshot": {},
  "trace": [],
  "final_output": {},
  "generated_command": "nextflow run nf-core/demo -profile test,docker --outdir results",
  "created_at": "2026-05-14T00:00:00Z",
  "completed_at": "2026-05-14T00:00:05Z"
}
```

---

## 20. Safety, Privacy, and Compute Control

### 20.1 Safety Philosophy

BioFlow Blocks should be safe by design. In early versions, the platform should teach workflows without executing arbitrary user code or large data.

### 20.2 Restricted Capabilities for MVP

Disallow:

- arbitrary shell command execution,
- arbitrary GitHub repository execution,
- large file upload,
- unrestricted Docker/Singularity execution,
- user-supplied scripts,
- public project sharing by default,
- storing sensitive human genomic data,
- external compute submission without explicit future controls.

### 20.3 Future Execution Requirements

Before adding real execution, require:

- sandboxed worker environment,
- strict allowlist of pipelines/modules,
- small test datasets only,
- resource limits,
- timeout handling,
- storage quotas,
- audit logging,
- clear cost model,
- no sensitive data in beta.

### 20.4 Privacy Requirements

- Projects private by default.
- User-uploaded samplesheets deletable.
- No secrets in logs.
- No sensitive biological data collection in MVP.
- Clear notice: outputs are educational and may not be scientifically valid unless real execution is explicitly supported.

---

## 21. Analytics and Metrics

### 21.1 Product Metrics

- Sign-up conversion.
- Mission start rate.
- Mission completion rate.
- First successful simulation rate.
- Time to first successful pipeline.
- Projects created per user.
- Return/edit rate.
- Block/module usage frequency.
- Error frequency by block type.

### 21.2 Learning Metrics

- Concepts introduced.
- Concepts successfully used.
- Samplesheet errors fixed.
- Hints used per mission.
- Command explanation viewed.
- Docs links clicked.
- Reflection questions answered.

### 21.3 Technical Metrics

- Validation latency.
- Simulation latency.
- Backend error rate.
- Command generation errors.
- Storage usage.
- Future compute cost per run.

---

## 22. Implementation Milestones

### Phase 0: Visual Prototype Spike

Goal: Prove the visual builder and learning loop.

Deliverables:

- Visual canvas.
- Start, Samplesheet, Input FASTQ, QC Step, Report, Output blocks.
- Hard-coded starter mission.
- Mock samplesheet table.
- Mock QC output.
- Workflow JSON preview.

Exit criteria:

- Learner builds a visual QC pipeline and sees a fake report.

### Phase 1: MVP Core Platform

Goal: Save projects and support deterministic simulation.

Deliverables:

- Project CRUD.
- Module registry.
- Samplesheet validator.
- Workflow validator.
- Simulation engine.
- Run panel and trace.
- Two missions: QC pipeline and samplesheet fix.

Exit criteria:

- Learner can save, reopen, validate, simulate, and fix a simple pipeline.

### Phase 2: Learning Layer and Gamification

Goal: Make it feel like a learning game.

Deliverables:

- Mission map.
- Pipeline Stage visual preview.
- Badges.
- Hints.
- Reflection questions.
- More missions: trimming and report reading.

Exit criteria:

- New learners complete missions with minimal help.

### Phase 3: Command Bridge

Goal: Connect blocks to real nf-core/Nextflow command concepts.

Deliverables:

- Generated command panel.
- Command part explanations.
- Parameter preview.
- Profile explanation.
- Docs bridge links.

Exit criteria:

- Learner can explain what pipeline name, profile, input, and outdir mean.

### Phase 4: Tiny Test-Data Execution

Goal: Run selected tiny workflows in a controlled sandbox.

Deliverables:

- Allowlisted test execution only.
- Worker queue.
- Resource/time limits.
- Output capture.
- Logs cleaned for learner view.

Exit criteria:

- Learner can run one curated tiny demo safely.

### Phase 5: nf-core Concept Packs

Goal: Expand content without rebuilding platform.

Deliverables:

- FASTQ Basics Pack.
- RNA-seq Concepts Pack.
- Variant Calling Concepts Pack.
- Metagenomics Concepts Pack.
- Developer Pack.

Exit criteria:

- New packs can be added by data definitions and missions.

### Phase 6: Advanced Developer Mode

Goal: Teach nf-core contribution and development structure.

Deliverables:

- Module vs subworkflow explanation.
- Simplified DSL2 code preview.
- Lint/test concept simulator.
- GitHub reference links.
- Contribution workflow explainer.

Exit criteria:

- Learner understands how visual components relate to nf-core components and pipeline structure.

---

## 23. Initial Backlog

### Epic 1: Visual Builder Foundation

- Create Next.js TypeScript app.
- Add visual builder library.
- Define initial block types.
- Serialize workspace.
- Compile workspace to workflow IR.
- Show JSON preview.

### Epic 2: Module Registry

- Create module metadata schema.
- Add initial RNA-seq QC modules.
- Add docs links field.
- Add beginner/advanced descriptions.
- Render module cards.

### Epic 3: Samplesheet Validator

- Build editable samplesheet table.
- Support CSV paste/upload.
- Validate required columns.
- Validate paired-end rows.
- Show friendly errors and fix examples.

### Epic 4: Simulation Engine

- Implement deterministic simulation context.
- Execute supported blocks.
- Create mock file cards.
- Create mock report outputs.
- Create trace entries.

### Epic 5: Missions

- Build mission data model.
- Add starter workspaces.
- Add completion checks.
- Add hints.
- Add reflection questions.

### Epic 6: Command Generator

- Generate simplified command.
- Explain command parts.
- Generate params preview.
- Mark whether command is illustrative or runnable.

### Epic 7: UX Polish

- Add Pipeline Stage.
- Add block inspector.
- Add error states.
- Add empty states.
- Add copy command/output buttons.
- Add onboarding.

### Epic 8: Safety and Beta Hardening

- Add rate limits.
- Block unsafe execution modes.
- Add file upload restrictions.
- Add privacy notice.
- Add basic analytics.

---

## 24. Acceptance Criteria for Private Beta

The MVP can be considered ready for private beta when:

1. Users can create, save, reopen, duplicate, and delete projects.
2. Users can complete at least four guided missions.
3. Users can build a visual RNA-seq QC workflow.
4. The samplesheet validator catches common beginner mistakes.
5. The simulation engine produces a trace for every run.
6. The product generates a command preview with explanations.
7. No arbitrary command or GitHub code execution is possible.
8. Every block has beginner and technical explanations.
9. The product links core concepts to official nf-core docs.
10. Errors are understandable to beginners.
11. The UI is stable enough for a 20-30 learner private workshop.
12. The product clearly states when outputs are simulated.

---

## 25. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Product becomes too broad | Slow execution | Start with RNA-seq QC Playground only. |
| Learners expect real pipeline execution | Misunderstanding | Clearly label MVP as simulator/learning tool. |
| Running real pipelines is expensive/unsafe | Technical and financial risk | Delay execution; use mock/simulated/test-data phases. |
| nf-core concepts are too advanced | Learning failure | Use beginner labels, missions, and progressive disclosure. |
| GitHub/tool integration becomes dangerous | Security risk | Use references first; do not execute arbitrary repositories. |
| UI becomes too technical | Poor adoption | Use Pipeline Stage, badges, visual file flow, and friendly errors. |
| Inaccurate mapping to nf-core concepts | Trust problem | Tie concept explanations to official docs and review with bioinformaticians. |
| Official nf-core branding confusion | Community/brand issue | Say "learning tool for nf-core concepts," not official nf-core product. |

---

## 26. AI Coding Agent Implementation Prompt

Use this prompt for the first implementation task:

```text
Build Phase 0 only for BioFlow Blocks.

Goal:
Create a Next.js + TypeScript prototype that teaches a tiny RNA-seq QC pipeline visually.

Scope:
- Visual builder canvas
- Blocks: Start Pipeline, Samplesheet, Input FASTQ, QC Step, Generate Report, Output Results
- Editable sample table with one example row
- Compile connected blocks into internal workflow JSON
- Show workflow JSON preview
- Mock simulation engine that produces a fake QC report and beginner trace
- One guided mission: Build Your First QC Pipeline
- No auth
- No database
- No real Nextflow execution
- No Docker/Singularity
- No arbitrary command execution
- No GitHub execution

Architecture rule:
Keep UI, workflow compiler, samplesheet validator, and simulation engine separated.

Quality bar:
The user should be able to build the workflow, click Simulate, see a friendly trace, see a fake report, and understand what each block means.
```

---

## 27. Difference From the Earlier AI Agent Blocks PRD

| Area | AI Agent Blocks | BioFlow Blocks |
|---|---|---|
| Domain | AI agents and prompt/tool workflows | Bioinformatics workflows, Nextflow, nf-core concepts |
| Main learner | AI beginners, teens, educators | Bioinformatics students, wet-lab researchers, junior bioinformaticians |
| First MVP | Story/Study agent builder | RNA-seq QC visual playground |
| Core object | Agent workflow | Pipeline workflow |
| Blocks map to | Prompt, skill, memory, tool, reviewer | Samplesheet, FASTQ, QC, trimming, report, profile, module |
| First output | Generated story/quiz/email | Mock QC report and command preview |
| Safety risk | LLM content and tool misuse | Compute execution, sensitive data, arbitrary code |
| Expansion model | Skill packs for agents | Bioinformatics concept/pipeline packs |
| Long-term bridge | Visual agents -> real agent frameworks | Visual workflows -> Nextflow/nf-core practice |

---

## 28. Final MVP Recommendation

Build the first version as a **visual simulator and teaching product**, not as a real nf-core execution platform.

The ideal MVP promise is:

> Build and understand your first bioinformatics pipeline visually - before touching the terminal.

The first private beta should prove:

1. Learners understand samplesheets, FASTQ inputs, QC steps, reports, and outputs better through blocks.
2. Learners can fix a simple samplesheet error.
3. The block-to-pipeline-IR architecture works.
4. The simulation and trace create a satisfying learning loop.
5. The product can later expand toward command generation, tiny test-data execution, and advanced nf-core development concepts.

---

## 29. References Used

This PRD is based on official nf-core documentation pages:

1. nf-core documentation overview: https://nf-co.re/docs/
2. nf-core community overview: https://nf-co.re/docs/community/overview
3. nf-core pipeline specifications overview: https://nf-co.re/docs/specifications/pipelines/overview
4. nf-core components overview: https://nf-co.re/docs/specifications/components/overview
5. nf-core/tools launch documentation: https://nf-co.re/docs/nf-core-tools/cli/pipelines/launch
6. nf-core running pipelines documentation: https://nf-co.re/docs/running/run-pipelines
7. nf-core test-datasets documentation: https://nf-co.re/docs/nf-core-tools/cli/test-datasets/list
8. nf-core specifications overview: https://nf-co.re/docs/specifications/overview
