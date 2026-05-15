'use client'

import { useState } from 'react'

type ModuleFile = 'main' | 'meta' | 'env' | 'test'

const FILE_TABS: { id: ModuleFile; label: string; filename: string; desc: string }[] = [
  { id: 'main', label: 'main.nf',              filename: 'modules/nf-core/fastqc/main.nf',                   desc: 'The Nextflow process definition — input, output, script, and container' },
  { id: 'meta', label: 'meta.yml',             filename: 'modules/nf-core/fastqc/meta.yml',                  desc: 'Structured documentation: tool description, input/output schema, authors' },
  { id: 'env',  label: 'environment.yml',      filename: 'modules/nf-core/fastqc/environment.yml',           desc: 'Conda package specification — pinned tool version for reproducibility' },
  { id: 'test', label: 'tests/main.nf.test',   filename: 'modules/nf-core/fastqc/tests/main.nf.test',       desc: 'nf-test test file — every nf-core module must have tests before merging' },
]

interface AnnotatedLine { code: string; comment?: string; type?: string }

const FILES: Record<ModuleFile, AnnotatedLine[]> = {
  main: [
    { code: "process FASTQC {", comment: "Process name = module name in ALLCAPS. Used in trace: 'NFCORE_RNASEQ:RNASEQ:FASTQC'", type: 'keyword' },
    { code: '    tag "$meta.id"', comment: "'tag' labels each process execution in the log — shows which sample is running", type: 'channel' },
    { code: "    label 'process_medium'", comment: "'label' selects resource defaults from nextflow.config (cpus, memory, time)", type: 'channel' },
    { code: '', type: '' },
    { code: '    conda "${moduleDir}/environment.yml"', comment: "Conda: uses environment.yml in this same directory — pins exact tool version", type: 'channel' },
    { code: "    container \"\\${ workflow.containerEngine == 'singularity' && !task.ext.singularity_pull_docker_container ?", comment: 'Container selector: uses Singularity URL for HPC, Docker image for cloud/local', type: 'channel' },
    { code: "        'https://depot.galaxyproject.org/singularity/fastqc:0.12.1--hdfd78af_0' :", type: 'channel' },
    { code: "        'biocontainers/fastqc:0.12.1--hdfd78af_0' }\"", type: 'channel' },
    { code: '', type: '' },
    { code: '    input:', comment: "'input:' block defines what this process receives. Always [ val(meta), path(file) ] convention", type: 'keyword' },
    { code: '    tuple val(meta), path(reads)', comment: "'meta' is a Groovy Map { id: 'SAMPLE1', single_end: false }. 'reads' is 1 or 2 FASTQ files", type: 'meta' },
    { code: '', type: '' },
    { code: '    output:', comment: "'output:' block defines emitted channels. 'emit:' names them so callers can reference FASTQC.out.html", type: 'keyword' },
    { code: '    tuple val(meta), path("*.html"), emit: html', comment: "Emits HTML reports. 'meta' travels unchanged — same sample info as input", type: 'meta' },
    { code: '    tuple val(meta), path("*.zip") , emit: zip', type: 'meta' },
    { code: '    path  "versions.yml"           , emit: versions', comment: "Every nf-core module must emit versions.yml with exact tool version", type: 'channel' },
    { code: '', type: '' },
    { code: '    when:', comment: "'when:' allows conditional execution — task.ext.when is set in nextflow.config withName blocks", type: 'keyword' },
    { code: '    task.ext.when == null || task.ext.when', type: 'channel' },
    { code: '', type: '' },
    { code: '    script:', comment: "'script:' is the shell commands that run inside the container", type: 'keyword' },
    { code: '    def args = task.ext.args ?: \'\'', comment: "task.ext.args lets pipelines pass extra flags to this module without changing its code", type: 'channel' },
    { code: '    def prefix = task.ext.prefix ?: "${meta.id}"', comment: 'Output file prefix — defaults to sample ID so files are named SAMPLE1_fastqc.html', type: 'meta' },
    { code: '    """', type: 'keyword' },
    { code: '    fastqc \\', type: 'channel' },
    { code: '        $args \\', comment: 'Inject any extra args from the pipeline config', type: 'channel' },
    { code: '        --threads $task.cpus \\', comment: 'task.cpus is set by the process label in nextflow.config', type: 'channel' },
    { code: '        $reads', type: 'channel' },
    { code: '', type: '' },
    { code: '    cat <<-END_VERSIONS > versions.yml', comment: 'Heredoc writes the versions.yml — required by every nf-core module for reproducibility', type: 'channel' },
    { code: '    "${task.process}":', type: 'channel' },
    { code: '        fastqc: $( fastqc --version | sed \'/FastQC v/!d; s/.*v//\' )', type: 'channel' },
    { code: '    END_VERSIONS', type: 'channel' },
    { code: '    """', type: 'keyword' },
    { code: '}', type: 'keyword' },
  ],
  meta: [
    { code: 'name: fastqc', comment: "Module name — must match the directory name exactly", type: 'keyword' },
    { code: 'description: Run FastQC on sequencing data', type: 'channel' },
    { code: 'keywords:', type: 'keyword' },
    { code: '  - quality control', type: 'channel' },
    { code: '  - qc', type: 'channel' },
    { code: '  - fastq', type: 'channel' },
    { code: '', type: '' },
    { code: 'tools:', comment: "List every tool wrapped by this module with its metadata", type: 'keyword' },
    { code: '  - fastqc:', type: 'channel' },
    { code: '      description: |', type: 'channel' },
    { code: '        FastQC gives general quality metrics about your sequencing data.', type: 'channel' },
    { code: '      homepage: https://www.bioinformatics.babraham.ac.uk/projects/fastqc/', type: 'channel' },
    { code: '      documentation: https://www.bioinformatics.babraham.ac.uk/projects/fastqc/Help/', type: 'channel' },
    { code: "      licence: [\"GPL-2.0-or-later\"]", comment: "Tool licence — not the module licence (that is always MIT for nf-core)", type: 'channel' },
    { code: '', type: '' },
    { code: 'input:', comment: "Mirrors the Nextflow input block. meta is always first.", type: 'keyword' },
    { code: '  - meta:', type: 'meta' },
    { code: '      type: map', comment: "'type: map' tells users meta is a Groovy Map, not a file", type: 'meta' },
    { code: "      description: |", type: 'meta' },
    { code: "        Groovy Map with sample info e.g. `[ id:'sample1', single_end:false ]`", type: 'meta' },
    { code: '  - reads:', type: 'channel' },
    { code: '      type: file', type: 'channel' },
    { code: '      description: Input FastQ files', type: 'channel' },
    { code: '      pattern: "*.{fq.gz,fastq.gz}"', comment: "Glob pattern helps users know what file extensions are accepted", type: 'channel' },
    { code: '', type: '' },
    { code: 'output:', comment: "Mirrors the Nextflow output block. Each emit: name is a key here.", type: 'keyword' },
    { code: '  - html:', type: 'channel' },
    { code: '      type: file', type: 'channel' },
    { code: '      description: FastQC HTML report', type: 'channel' },
    { code: '      pattern: "*.{html}"', type: 'channel' },
    { code: '  - versions:', type: 'channel' },
    { code: '      type: file', type: 'channel' },
    { code: '      description: File containing software versions', type: 'channel' },
    { code: '      pattern: "versions.yml"', type: 'channel' },
    { code: '', type: '' },
    { code: 'authors:', comment: "GitHub usernames of original authors — credit for the contribution", type: 'keyword' },
    { code: '  - "@drpatelh"', type: 'channel' },
    { code: 'maintainers:', comment: "GitHub usernames who review PRs to this module", type: 'keyword' },
    { code: '  - "@drpatelh"', type: 'channel' },
  ],
  env: [
    { code: 'channels:', comment: "Conda channel priority: conda-forge > bioconda > defaults", type: 'keyword' },
    { code: '  - conda-forge', type: 'channel' },
    { code: '  - bioconda', comment: "Bioconda hosts most bioinformatics tools", type: 'channel' },
    { code: '  - defaults', type: 'channel' },
    { code: '', type: '' },
    { code: 'dependencies:', type: 'keyword' },
    { code: '  - bioconda::fastqc=0.12.1', comment: "Pin the EXACT version — never use >=. nf-core modules must be 100% reproducible", type: 'channel' },
    { code: '', type: '' },
    { code: '# The container image is derived from this file:', type: 'channel' },
    { code: '# quay.io/biocontainers/fastqc:0.12.1--hdfd78af_0', comment: "Biocontainers auto-builds Docker + Singularity from Bioconda recipes", type: 'meta' },
    { code: '# biocontainers/fastqc:0.12.1--hdfd78af_0', comment: "Both Quay.io and Docker Hub images are available for all Bioconda packages", type: 'meta' },
  ],
  test: [
    { code: 'nextflow_process {', comment: "'nextflow_process' is the nf-test block type for testing a single process", type: 'keyword' },
    { code: '    name "Test Process FASTQC"', type: 'channel' },
    { code: '    script "../main.nf"', comment: "Points to the module's main.nf relative to this test file", type: 'channel' },
    { code: '    process "FASTQC"', comment: "The process name to test — must match exactly", type: 'channel' },
    { code: '', type: '' },
    { code: '    test("Should run without failures") {', comment: "Each test() block is one scenario. Add more blocks for edge cases.", type: 'keyword' },
    { code: '        when {', comment: "'when' sets up the inputs exactly as they would appear in a pipeline", type: 'keyword' },
    { code: '            process {', type: 'channel' },
    { code: '                """', type: 'channel' },
    { code: '                input[0] = [', comment: "input[0] is the first input channel. Must match the process input block order.", type: 'meta' },
    { code: "                    [ id:'test', single_end:false ],", comment: "meta map — id is the sample name, single_end controls paired/single behavior", type: 'meta' },
    { code: '                    [', type: 'channel' },
    { code: "                        file(params.modules_testdata_base_path + 'genomics/sarscov2/illumina/fastq/test_1.fastq.gz', checkIfExists: true),", comment: "Uses tiny test files from nf-core/test-datasets — SARS-CoV-2 reads, <1 MB", type: 'channel' },
    { code: "                        file(params.modules_testdata_base_path + 'genomics/sarscov2/illumina/fastq/test_2.fastq.gz', checkIfExists: true)", type: 'channel' },
    { code: '                    ]', type: 'channel' },
    { code: '                ]', type: 'channel' },
    { code: '                """', type: 'channel' },
    { code: '            }', type: 'channel' },
    { code: '        }', type: 'channel' },
    { code: '', type: '' },
    { code: '        then {', comment: "'then' block contains assertions about the process output", type: 'keyword' },
    { code: '            assertAll(', type: 'channel' },
    { code: '                { assert process.success },', comment: "Checks the process completed with exit code 0", type: 'channel' },
    { code: '                { assert snapshot(process.out).match() }', comment: "Snapshot test: first run creates .snap file; subsequent runs compare against it", type: 'channel' },
    { code: '            )', type: 'channel' },
    { code: '        }', type: 'channel' },
    { code: '    }', type: 'channel' },
    { code: '}', type: 'keyword' },
  ],
}

const TYPE_COLORS: Record<string, string> = {
  keyword: 'oklch(65% 0.14 195)',
  channel: 'oklch(75% 0.01 220)',
  meta:    'oklch(75% 0.15 68)',
  '':      'oklch(55% 0.015 220)',
}

export function ModuleAnatomy() {
  const [activeFile, setActiveFile] = useState<ModuleFile>('main')
  const [selectedLine, setSelectedLine] = useState<number | null>(null)

  const file = FILE_TABS.find(f => f.id === activeFile)!
  const lines = FILES[activeFile]
  const comment = selectedLine !== null ? lines[selectedLine]?.comment : null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">nf-core Module Anatomy</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Every nf-core module is a directory with these 4 required files.
          Using <strong>FASTQC</strong> as the example — click any line to learn what it does.
        </p>
      </div>

      {/* Directory tree */}
      <div
        className="rounded-xl border border-border px-4 py-3 text-xs font-mono"
        style={{ background: 'var(--color-surface-2)' }}
      >
        <div className="text-fg-muted mb-1">modules/nf-core/fastqc/</div>
        {FILE_TABS.map(f => (
          <div key={f.id} className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--color-teal-500)' }}>├──</span>
            <button
              onClick={() => { setActiveFile(f.id); setSelectedLine(null) }}
              className="font-mono hover:underline text-left"
              style={{ color: activeFile === f.id ? 'oklch(75% 0.14 195)' : 'var(--color-fg-secondary)' }}
            >
              {f.filename.split('/').pop()}
            </button>
          </div>
        ))}
        <div className="pl-4 flex items-center gap-2">
          <span style={{ color: 'var(--color-teal-500)' }}>└──</span>
          <span className="text-fg-muted">tests/</span>
        </div>
        <div className="pl-12 flex items-center gap-2">
          <span style={{ color: 'var(--color-teal-500)' }}>├──</span>
          <button
            onClick={() => { setActiveFile('test'); setSelectedLine(null) }}
            className="font-mono hover:underline"
            style={{ color: activeFile === 'test' ? 'oklch(75% 0.14 195)' : 'var(--color-fg-secondary)' }}
          >
            main.nf.test
          </button>
        </div>
        <div className="pl-12 flex items-center gap-2">
          <span style={{ color: 'var(--color-teal-500)' }}>└──</span>
          <span className="text-fg-muted">main.nf.test.snap</span>
        </div>
      </div>

      {/* File tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {FILE_TABS.map(f => (
          <button
            key={f.id}
            onClick={() => { setActiveFile(f.id); setSelectedLine(null) }}
            className={[
              'px-3 py-2 text-xs font-mono font-semibold rounded-t-lg transition-colors',
              activeFile === f.id
                ? 'bg-surface border border-b-0 border-border text-teal-500'
                : 'text-fg-muted hover:text-fg-secondary',
            ].join(' ')}
            style={{ marginBottom: -1 }}
          >
            {f.filename.split('/').pop()}
          </button>
        ))}
      </div>

      {/* File description */}
      <p className="text-xs text-fg-muted">{file.desc}</p>

      {/* Code */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: 'oklch(14% 0.02 220)' }}
      >
        <div
          className="px-4 py-2 border-b text-xs font-mono text-fg-muted"
          style={{ borderColor: 'oklch(28% 0.02 220)', background: 'oklch(18% 0.02 220)' }}
        >
          <span style={{ color: 'oklch(68% 0.150 75)' }}>●</span>
          <span className="ml-2">{file.filename}</span>
          <a
            href={`https://github.com/nf-core/modules/blob/master/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 text-teal-500 hover:text-teal-400"
          >
            view on GitHub ↗
          </a>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          {lines.map((line, i) => {
            const isSelected = selectedLine === i
            return (
              <div
                key={i}
                className="flex items-start group cursor-pointer"
                onClick={() => setSelectedLine(isSelected ? null : i)}
                style={{
                  background: isSelected ? 'oklch(28% 0.03 220)' : line.comment ? 'oklch(16% 0.025 220)' : undefined,
                }}
              >
                <span className="shrink-0 w-8 text-right pr-3 text-xs font-mono select-none pt-1"
                  style={{ color: 'oklch(40% 0.015 220)' }}>
                  {i + 1}
                </span>
                <span
                  className="flex-1 text-xs font-mono py-1 pr-4 whitespace-pre"
                  style={{ color: TYPE_COLORS[line.type ?? ''] ?? 'oklch(75% 0.01 220)' }}
                >
                  {line.code}
                </span>
                {line.comment && (
                  <span className="shrink-0 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'oklch(55% 0.02 220)' }}>?</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {comment ? (
        <div
          className="px-4 py-3 rounded-xl text-sm animate-fade-up"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          <span className="font-bold mr-2">💬</span>{comment}
        </div>
      ) : (
        <p className="text-xs text-fg-muted text-center">Click any highlighted line for an explanation.</p>
      )}

      <div className="flex gap-3 flex-wrap">
        <a href="https://nf-co.re/docs/contributing/modules" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          nf-core module writing guide ↗
        </a>
        <a href="https://github.com/nf-core/modules/tree/master/modules/nf-core/fastqc" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          FASTQC module on GitHub ↗
        </a>
      </div>
    </div>
  )
}
