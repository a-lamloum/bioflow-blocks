'use client'

import { useState } from 'react'

export interface NfError {
  id: string
  exitCode?: number | string
  title: string
  snippet: string
  cause: string
  fix: string[]
  category: 'memory' | 'container' | 'input' | 'network' | 'permission' | 'cluster' | 'pipeline'
  docsUrl?: string
  severity: 'critical' | 'warning' | 'info'
}

const CATEGORY_COLORS: Record<NfError['category'], string> = {
  memory:    'oklch(55% 0.170 20)',
  container: 'oklch(52% 0.20 232)',
  input:     'oklch(68% 0.150 75)',
  network:   'oklch(50% 0.22 258)',
  permission:'oklch(50% 0.25 302)',
  cluster:   'oklch(52% 0.22 152)',
  pipeline:  'oklch(58% 0.20 212)',
}

const CATEGORY_LABELS: Record<NfError['category'], string> = {
  memory:    'Memory',
  container: 'Container',
  input:     'Input / Data',
  network:   'Network',
  permission:'Permissions',
  cluster:   'Cluster / HPC',
  pipeline:  'Pipeline',
}

export const COMMON_ERRORS: NfError[] = [
  {
    id: 'exit-137',
    exitCode: 137,
    title: 'Out of memory (OOM kill)',
    snippet: `Process 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (SAMPLE1)' terminated with an error exit status (137)`,
    cause: 'The Linux kernel killed the process because it exceeded the available memory (RAM). Exit code 137 = 128 + 9, where 9 is SIGKILL.',
    fix: [
      'Increase memory for the process in nextflow.config: `memory = "64 GB"`',
      'Or use the --max_memory flag: `nextflow run nf-core/rnaseq ... --max_memory 64.GB`',
      'For STAR, the genome index alone needs ~30 GB RAM. Use --aligner hisat2 or --aligner salmon for lower memory.',
      'Check available RAM: `free -h` or `ulimit -v`',
    ],
    category: 'memory',
    severity: 'critical',
    docsUrl: 'https://nf-co.re/rnaseq/parameters#max_memory',
  },
  {
    id: 'exit-1-oom',
    exitCode: 1,
    title: 'SLURM / PBS job terminated (cluster OOM)',
    snippet: `slurmstepd: error: Detected 1 oom-kill event(s) in StepId=12345.0 cgroup.
The job allocation has been revoked.`,
    cause: 'The SLURM workload manager killed the job because the process exceeded the memory limit set in the cluster queue/partition.',
    fix: [
      'Increase the memory directive: `memory = "128.GB"` in the withName process block',
      'Add cluster-specific options: `clusterOptions = "--mem=128G --partition=highmem"`',
      'Use a different queue: `queue = "highmem"` in the executor config',
      'Check node memory with `sinfo -N -l` on your cluster',
    ],
    category: 'cluster',
    severity: 'critical',
  },
  {
    id: 'no-such-file',
    exitCode: 1,
    title: 'Input file not found',
    snippet: `No such file or directory: '/path/to/SAMPLE1_R1.fastq.gz'
Error executing process 'NFCORE_RNASEQ:RNASEQ:INPUT_CHECK:SAMPLESHEET_CHECK'`,
    cause: 'The file path in your samplesheet does not exist or is not accessible from where Nextflow is running.',
    fix: [
      'Use absolute file paths in the samplesheet (starting with /) instead of relative paths',
      'If on HPC, ensure the file is on a shared filesystem accessible from compute nodes',
      'Check permissions: `ls -la /path/to/SAMPLE1_R1.fastq.gz`',
      'If using S3, ensure your AWS credentials are configured and the bucket is accessible',
      'Run: `nextflow run nf-core/rnaseq --validate_params false` to skip early validation and get a better error',
    ],
    category: 'input',
    severity: 'critical',
  },
  {
    id: 'invalid-samplesheet',
    exitCode: 1,
    title: 'Samplesheet validation failed',
    snippet: `Error: Your samplesheet has invalid entries. Please check your samplesheet.
SAMPLE1 does not match expected pattern (must be alphanumeric + underscores)`,
    cause: 'nf-core pipelines validate the samplesheet format strictly using the nf-validation plugin before starting any computation.',
    fix: [
      'Use only alphanumeric characters and underscores in the sample column: SAMPLE_1, not SAMPLE-1 or SAMPLE 1',
      'Ensure fastq_1 and fastq_2 paths end in .fastq.gz, .fq.gz, .fastq, or .fq',
      'For paired-end data, both fastq_1 and fastq_2 must be provided',
      'For single-end data, leave fastq_2 empty',
      'Use the nf-core samplesheet check tool: `nf-core schema validate samplesheet.csv`',
    ],
    category: 'input',
    severity: 'warning',
    docsUrl: 'https://nf-co.re/rnaseq/docs/usage#samplesheet-input',
  },
  {
    id: 'docker-permission',
    exitCode: 1,
    title: 'Docker permission denied',
    snippet: `Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`,
    cause: 'Your user account does not have permission to communicate with the Docker daemon. Docker requires users to be in the docker group.',
    fix: [
      'Add your user to the docker group: `sudo usermod -aG docker $USER`',
      'Then log out and back in (or run `newgrp docker`)',
      'Alternatively, use Singularity instead: `-profile singularity`',
      'On HPC clusters, Docker is usually not available — use `-profile singularity`',
    ],
    category: 'container',
    severity: 'critical',
  },
  {
    id: 'singularity-pull',
    exitCode: 1,
    title: 'Singularity image pull failed',
    snippet: `FATAL:   Unable to pull docker://quay.io/biocontainers/fastqc:0.12.1--hdfd78af_0: exit status 255
Error executing process 'FASTQC'`,
    cause: 'Singularity could not download the container image from the registry. Usually a network connectivity issue on compute nodes.',
    fix: [
      'Pre-pull images before submitting: `singularity pull docker://quay.io/biocontainers/fastqc:0.12.1--hdfd78af_0`',
      'Set a local image cache: `singularity.cacheDir = "/path/to/cache"` in nextflow.config',
      'Use `--singularity_pull_docker_container` to use Docker images as a fallback',
      'Check network access from compute nodes: `ssh <compute_node> curl -I https://quay.io`',
      'Use `nf-core download` to pre-download all images for offline use',
    ],
    category: 'container',
    severity: 'critical',
    docsUrl: 'https://nf-co.re/docs/running/offline',
  },
  {
    id: 'timeout',
    exitCode: '143 / SIGTERM',
    title: 'Process timed out',
    snippet: `Process 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN' terminated with an error exit status (143)
SLURM: Job kill: 1 task(s) hit time limit`,
    cause: 'The process exceeded the time limit set in nextflow.config or imposed by the cluster scheduler. Exit 143 = 128 + 15 (SIGTERM).',
    fix: [
      'Increase the time directive: `time = "8 h"` (or `time = 8.h`)',
      'Add a labelled override for long processes: `withLabel: "process_high" { time = "16 h" }`',
      'Use `--max_time` flag: `nextflow run nf-core/rnaseq ... --max_time 8.h`',
      'Use `errorStrategy = "retry"` with `maxRetries = 2` and a multiplier to auto-scale resources',
    ],
    category: 'cluster',
    severity: 'warning',
  },
  {
    id: 'work-not-writable',
    exitCode: 1,
    title: 'Work directory not writable',
    snippet: `Cannot write to work directory: /work
Check that Nextflow can write to the work directory`,
    cause: 'Nextflow cannot create its work directory. Common on shared NFS filesystems that do not support certain file operations (e.g., symlinks).',
    fix: [
      'Set workDir to local scratch: `workDir = "/local/scratch/$USER"` in nextflow.config',
      'Or use the -w flag: `nextflow run nf-core/rnaseq -w /local/scratch/$USER/work ...`',
      'Check permissions: `ls -la /work` and `touch /work/test_write`',
      'If using NFS, prefer a local SSD or tmpfs for the work directory',
    ],
    category: 'permission',
    severity: 'warning',
  },
  {
    id: 'java-heap',
    exitCode: 'Java OOM',
    title: 'Nextflow JVM heap out of memory',
    snippet: `java.lang.OutOfMemoryError: Java heap space
at nextflow.processor.TaskRun.getScratchDir(TaskRun.groovy:...)`,
    cause: 'The Nextflow JVM process itself ran out of memory — separate from the pipeline tools. Happens with very large numbers of tasks.',
    fix: [
      'Increase JVM heap: `export NXF_OPTS="-Xms1g -Xmx8g"` before running',
      'Or set in a .nf.config: `process.maxForks = 50` to limit parallelism',
      'Update to the latest Nextflow version: `nextflow self-update`',
    ],
    category: 'pipeline',
    severity: 'warning',
  },
  {
    id: 'missing-module',
    exitCode: 'Import error',
    title: 'Module include path not found',
    snippet: `Module not found for path: modules/nf-core/fastqc/main
There is no file(s) at path: modules/nf-core/fastqc/main.nf`,
    cause: 'The nf-core module is referenced in main.nf but the module files are not present in your pipeline directory.',
    fix: [
      'Install the module: `nf-core modules install fastqc`',
      'Check the modules directory exists: `ls modules/nf-core/`',
      'If using a cloned pipeline, initialize submodules: `git submodule update --init --recursive`',
      'Use the nf-core pipeline template which sets up modules automatically',
    ],
    category: 'pipeline',
    severity: 'critical',
    docsUrl: 'https://nf-co.re/docs/contributing/modules',
  },
]

const SEVERITY_COLORS: Record<NfError['severity'], string> = {
  critical: 'var(--color-error)',
  warning:  'var(--color-warning)',
  info:     'var(--color-info)',
}

export function ErrorDecoder() {
  const [selected, setSelected] = useState<NfError | null>(null)
  const [filter, setFilter] = useState<NfError['category'] | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = COMMON_ERRORS.filter(e => {
    if (filter !== 'all' && e.category !== filter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return e.title.toLowerCase().includes(q) || e.snippet.toLowerCase().includes(q) || String(e.exitCode).includes(q)
  })

  const categories = ['all', ...Object.keys(CATEGORY_COLORS)] as const

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Common nf-core Errors</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Browse the most common Nextflow and nf-core errors with plain-language explanations and step-by-step fixes.
          Click any error to expand it.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search errors, exit codes, or symptoms…"
          className="px-4 py-2 rounded-xl border border-border bg-surface text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as typeof filter)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === cat
                  ? (cat === 'all' ? 'var(--color-teal-500)' : CATEGORY_COLORS[cat as NfError['category']])
                  : 'var(--color-surface-2)',
                color: filter === cat ? 'white' : 'var(--color-fg-secondary)',
                border: filter === cat ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as NfError['category']]}
            </button>
          ))}
        </div>
      </div>

      {/* Error list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="text-sm text-fg-muted text-center py-8">No errors match your search.</p>
        )}
        {filtered.map(err => (
          <div key={err.id} className="flex flex-col rounded-xl border border-border overflow-hidden">
            {/* Header row */}
            <button
              onClick={() => setSelected(selected?.id === err.id ? null : err)}
              className="flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors w-full"
              aria-expanded={selected?.id === err.id}
            >
              {/* Exit code badge */}
              {err.exitCode !== undefined && (
                <span
                  className="shrink-0 text-xs font-mono font-bold px-2 py-1 rounded text-block-text"
                  style={{ background: SEVERITY_COLORS[err.severity] }}
                >
                  {err.exitCode}
                </span>
              )}

              {/* Category */}
              <span
                className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: CATEGORY_COLORS[err.category] + '20',
                  color: CATEGORY_COLORS[err.category],
                }}
              >
                {CATEGORY_LABELS[err.category]}
              </span>

              {/* Title */}
              <span className="flex-1 text-sm font-semibold text-fg-primary">{err.title}</span>

              <span className="text-fg-muted text-xs">{selected?.id === err.id ? '▲' : '▼'}</span>
            </button>

            {/* Expanded detail */}
            {selected?.id === err.id && (
              <div className="flex flex-col gap-4 px-4 py-4 border-t border-border bg-surface">
                {/* Error snippet */}
                <div>
                  <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">What you see in the log</p>
                  <pre
                    className="text-xs font-mono p-3 rounded-xl overflow-x-auto"
                    style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.17 20)', border: '1px solid oklch(28% 0.02 220)' }}
                  >
                    {err.snippet}
                  </pre>
                </div>

                {/* Cause */}
                <div
                  className="px-4 py-3 rounded-xl text-sm leading-relaxed"
                  style={{ background: 'oklch(55% 0.170 20 / 0.08)', border: '1px solid oklch(55% 0.170 20 / 0.20)' }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--color-error)' }}>Root cause</p>
                  <p className="text-fg-secondary">{err.cause}</p>
                </div>

                {/* Fixes */}
                <div>
                  <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">How to fix it</p>
                  <ol className="flex flex-col gap-2">
                    {err.fix.map((fix, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-block-text mt-0.5"
                          style={{ background: 'var(--color-teal-500)' }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-fg-secondary leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: fix.replace(/`([^`]+)`/g, '<code style="font-family:monospace;background:var(--color-surface-2);padding:1px 4px;border-radius:4px;border:1px solid var(--color-border)">$1</code>') }}
                        />
                      </li>
                    ))}
                  </ol>
                </div>

                {err.docsUrl && (
                  <a
                    href={err.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-teal-500 hover:text-teal-600 self-start"
                  >
                    nf-core docs ↗
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
