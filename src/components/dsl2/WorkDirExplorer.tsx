'use client'

import { useState } from 'react'

interface WorkFile {
  name: string
  icon: string
  desc: string
  content?: string
}

const WORK_FILES: WorkFile[] = [
  {
    name: '.command.sh',
    icon: '📜',
    desc: 'The exact shell script Nextflow generated and executed for this process. Shows the real command with all resolved parameters.',
    content: `#!/bin/bash -ue
# nf-core/rnaseq — FASTQC process

fastqc \\
    --outdir . \\
    --threads 4 \\
    SAMPLE1_R1.fastq.gz \\
    SAMPLE1_R2.fastq.gz`,
  },
  {
    name: '.command.log',
    icon: '📋',
    desc: 'Combined stdout + stderr from the process. First place to look when debugging — contains tool output and any warnings.',
    content: `Started analysis of SAMPLE1_R1.fastq.gz
Approx 5% complete for SAMPLE1_R1.fastq.gz
Approx 10% complete for SAMPLE1_R1.fastq.gz
...
Analysis complete for SAMPLE1_R1.fastq.gz
Analysis complete for SAMPLE1_R2.fastq.gz`,
  },
  {
    name: '.exitcode',
    icon: '🔢',
    desc: 'Process exit code. 0 = success. Any other number means failure. Common codes: 137 = out of memory, 1 = tool error.',
    content: `0`,
  },
  {
    name: '.command.err',
    icon: '⚠️',
    desc: 'Stderr output only. If the process failed, this is where the error message lives.',
    content: `(empty — process succeeded)`,
  },
  {
    name: '.command.run',
    icon: '⚙️',
    desc: 'The wrapper script Nextflow uses to run .command.sh, including environment setup and output staging.',
    content: '#!/bin/bash\n# Nextflow process wrapper\n# Sets up the container environment, binds paths, and captures exit code\n\nNXF_DEBUG=${NXF_DEBUG:=0}; [[ $NXF_DEBUG > 2 ]] && set -x\n...',
  },
  {
    name: 'SAMPLE1_R1_fastqc.html',
    icon: '🌐',
    desc: 'Output file produced by FastQC — staged here first, then published to results/ via publishDir.',
    content: `(binary HTML file — open in browser)`,
  },
  {
    name: 'SAMPLE1_R1.fastq.gz → (symlink)',
    icon: '🔗',
    desc: 'Nextflow stages input files as symlinks into the work directory. The tool sees local files but no data is copied.',
    content: `symlink → /original/data/SAMPLE1_R1.fastq.gz`,
  },
]

const RESUME_STEPS = [
  { name: 'FASTQC (SAMPLE1)',      status: 'cached',  reason: 'Input unchanged — using cached result' },
  { name: 'FASTQC (SAMPLE2)',      status: 'cached',  reason: 'Input unchanged — using cached result' },
  { name: 'TRIMGALORE (SAMPLE1)', status: 'rerun',   reason: 'Input FASTQ changed — rerunning' },
  { name: 'TRIMGALORE (SAMPLE2)', status: 'rerun',   reason: 'Input FASTQ changed — rerunning' },
  { name: 'STAR_ALIGN (SAMPLE1)', status: 'pending',  reason: 'Waiting for TRIMGALORE output' },
  { name: 'STAR_ALIGN (SAMPLE2)', status: 'pending',  reason: 'Waiting for TRIMGALORE output' },
  { name: 'MULTIQC',              status: 'pending',  reason: 'Waiting for all QC inputs' },
]

const STATUS_STYLE: Record<string, { bg: string; label: string; icon: string }> = {
  cached:  { bg: 'var(--color-success)', label: 'CACHED', icon: '✓' },
  rerun:   { bg: 'oklch(58% 0.20 212)', label: 'RERUN', icon: '↺' },
  failed:  { bg: 'var(--color-error)',   label: 'FAILED', icon: '✕' },
  pending: { bg: 'var(--color-fg-muted)', label: 'PENDING', icon: '…' },
}

export function WorkDirExplorer() {
  const [selectedFile, setSelectedFile] = useState<WorkFile | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* Work directory section */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-fg-primary mb-1">The Work Directory</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            Every Nextflow process gets its own isolated directory under <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">work/</code>.
            The 8-character hash in the path (<code className="font-mono text-xs">work/ab/cd12ef.../</code>)
            is derived from the process inputs — if inputs don&apos;t change, Nextflow reuses the cached result.
          </p>
        </div>

        {/* Directory tree */}
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--color-surface)' }}
        >
          <div
            className="px-4 py-2 border-b border-border text-xs font-mono font-semibold text-fg-muted"
            style={{ background: 'var(--color-surface-2)' }}
          >
            work/ab/cd12ef89a23b45/ (FASTQC process for SAMPLE1)
          </div>
          <div className="p-3 flex flex-col gap-1">
            {WORK_FILES.map((file, i) => (
              <button
                key={i}
                onClick={() => setSelectedFile(selectedFile?.name === file.name ? null : file)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-surface-2 transition-colors w-full"
                style={{
                  background: selectedFile?.name === file.name ? 'var(--color-teal-50)' : undefined,
                  border: selectedFile?.name === file.name ? '1px solid var(--color-teal-200)' : '1px solid transparent',
                }}
              >
                <span>{file.icon}</span>
                <span className="text-xs font-mono text-fg-primary">{file.name}</span>
                <span className="ml-auto text-xs text-fg-muted">→ click</span>
              </button>
            ))}
          </div>
        </div>

        {/* File detail */}
        {selectedFile && (
          <div className="flex flex-col gap-2 animate-fade-up">
            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-teal-700)' }}>
                {selectedFile.icon} {selectedFile.name}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-teal-600)' }}>
                {selectedFile.desc}
              </p>
            </div>
            {selectedFile.content && (
              <pre
                className="text-xs font-mono p-3 rounded-xl overflow-x-auto"
                style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.01 220)', border: '1px solid oklch(28% 0.02 220)' }}
              >
                {selectedFile.content}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Resume simulator */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-fg-primary mb-1">The <code className="font-mono">-resume</code> Flag</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            When you add <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">-resume</code> to your command,
            Nextflow checks each process hash. Unchanged processes use their cached work directory output.
            Only changed or downstream processes re-run. This can save hours on large datasets.
          </p>
          <pre
            className="mt-3 text-xs font-mono p-3 rounded-xl"
            style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
          >
            {`nextflow run nf-core/rnaseq -profile docker --input samplesheet.csv -resume`}
          </pre>
        </div>

        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">
            Scenario: input FASTQ for 2 samples changed — what gets re-run?
          </p>
          <div className="flex flex-col gap-2">
            {RESUME_STEPS.map((step, i) => {
              const s = STATUS_STYLE[step.status]
              return (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="shrink-0 w-20 text-center text-xs font-bold py-1 rounded-full text-block-text"
                    style={{ background: s.bg, fontSize: 10 }}
                  >
                    {s.icon} {s.label}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-fg-primary">{step.name}</p>
                    <p className="text-xs text-fg-muted">{step.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div
            className="mt-3 px-4 py-3 rounded-xl text-xs leading-relaxed"
            style={{ background: 'var(--color-success)', color: 'white', opacity: 0.9 }}
          >
            <strong>Result:</strong> FastQC for both samples reused from cache (saved ~1 minute each).
            Only TrimGalore onwards re-ran. Total time saved: ~30 minutes.
          </div>
        </div>
      </div>
    </div>
  )
}
