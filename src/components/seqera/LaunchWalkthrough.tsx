'use client'

import { useState } from 'react'

const STEPS = [
  {
    n: '1',
    title: 'Build your pipeline in BioFlow Blocks',
    substeps: [
      'Connect blocks: Start → Samplesheet → Input FASTQ → QC Step → Trim Reads → Generate Report → Output Results',
      'Open the Command tab in the Run panel',
      'Select your profile (docker for cloud, singularity for HPC)',
      'Copy the generated command',
    ],
    bfNote: 'Use BioFlow Blocks to understand and validate your pipeline structure before launching at scale.',
    seqeraStep: false,
  },
  {
    n: '2',
    title: 'Upload your samplesheet as a Seqera Dataset',
    substeps: [
      'In Seqera Platform → Datasets → Add Dataset',
      'Upload your samplesheet.csv (same format as in BioFlow Blocks)',
      'Give it a name: "RNA-seq samples 2024-05"',
      'Seqera stores and versions it — reference it by URL in pipeline params',
    ],
    bfNote: 'The samplesheet you validated in BioFlow\'s samplesheet editor is now a managed Dataset in Seqera.',
    seqeraStep: true,
  },
  {
    n: '3',
    title: 'Set up or select a Compute Environment',
    substeps: [
      'AWS Batch: Seqera provisions EC2 instances automatically',
      'SLURM: Seqera submits jobs via SSH to your HPC head node',
      'GCP Life Sciences or Azure Batch: similar cloud-managed execution',
      'Seqera manages credentials, queues, and resource limits',
    ],
    bfNote: 'The profile you chose in BioFlow (docker/singularity) tells you which Compute Environment type to use in Seqera.',
    seqeraStep: true,
  },
  {
    n: '4',
    title: 'Add nf-core/rnaseq as a Seqera Pipeline',
    substeps: [
      'Pipelines → Add Pipeline',
      'Repository URL: https://github.com/nf-core/rnaseq',
      'Revision: 3.14.0 (same as -r 3.14.0 in the CLI)',
      'Set default params: genome=GRCh38, aligner=star_salmon',
      'Select your Compute Environment',
    ],
    bfNote: 'The pipeline version from BioFlow\'s Pipeline Versioning tab becomes the Revision field in Seqera.',
    seqeraStep: true,
  },
  {
    n: '5',
    title: 'Launch the pipeline',
    substeps: [
      'Pipelines → nf-core/rnaseq → Launch',
      'Select your Dataset (samplesheet from Step 2)',
      'Override --outdir with your results bucket path',
      'Override any params you changed (genome, aligner, skip_trimming, etc.)',
      'Click Launch — Seqera submits the Nextflow head job',
    ],
    bfNote: 'The params you explored in BioFlow\'s Params Preview become the launch overrides here.',
    seqeraStep: true,
  },
  {
    n: '6',
    title: 'Monitor the Run',
    substeps: [
      'Runs → your run → live task table',
      'See each process: STAR_ALIGN (SAMPLE1) — RUNNING / COMPLETED / FAILED',
      'Click any task → view .command.log and .command.err inline',
      'Seqera shows CPU%, peak memory, and wall time per process',
      'Exit codes explained — same as the Error Decoder in BioFlow Troubleshoot',
    ],
    bfNote: 'The nextflow log table from BioFlow Phase 7 maps directly to the Seqera Runs task table.',
    seqeraStep: true,
  },
]

const COMPUTE_ENVS = [
  { name: 'AWS Batch', icon: '☁️', desc: 'Seqera provisions EC2 instances automatically. Supports Spot instances for ~70% cost reduction. Best for cloud-native analyses.' },
  { name: 'Google Cloud Batch', icon: '🌐', desc: 'GCP managed compute with preemptible instance support. Integrates with GCS buckets for input/output storage.' },
  { name: 'Azure Batch', icon: '🔷', desc: 'Microsoft Azure managed HPC. Supports spot VMs and integrates with Azure Blob Storage.' },
  { name: 'SLURM (HPC)', icon: '🖥️', desc: 'Seqera SSHes into your HPC head node and submits SLURM jobs. Your data stays on the cluster — no cloud needed.' },
  { name: 'Kubernetes', icon: '⚓', desc: 'Run pipelines as Kubernetes pods. Used by cloud-native bioinformatics platforms and large research institutes.' },
  { name: 'Local', icon: '💻', desc: 'Run on the machine where the Seqera agent is installed. Good for testing before scaling to cloud or HPC.' },
]

export function LaunchWalkthrough() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeEnv, setActiveEnv] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      {/* Launch walkthrough */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-fg-primary mb-1">
            Launching nf-core/rnaseq from Seqera Platform
          </h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            A step-by-step walkthrough connecting BioFlow Blocks to a real Seqera Platform launch.
            Click any step to expand it.
          </p>
        </div>

        {STEPS.map((step, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setActiveStep(activeStep === i ? -1 : i)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-surface-2 transition-colors"
              aria-expanded={activeStep === i}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-block-text"
                style={{ background: step.seqeraStep ? 'oklch(52% 0.20 232)' : 'var(--color-teal-500)' }}
              >
                {step.n}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-fg-primary">{step.title}</p>
                <p className="text-xs text-fg-muted">
                  {step.seqeraStep ? '🔷 In Seqera Platform' : '🧬 In BioFlow Blocks'}
                </p>
              </div>
              <span className="text-fg-muted text-xs">{activeStep === i ? '▲' : '▼'}</span>
            </button>

            {activeStep === i && (
              <div className="flex flex-col gap-3 px-4 py-4 border-t border-border bg-surface">
                <ol className="flex flex-col gap-1.5">
                  {step.substeps.map((s, j) => (
                    <li key={j} className="flex gap-2 text-sm text-fg-secondary">
                      <span className="shrink-0 text-fg-muted">{j + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <div
                  className="px-4 py-2.5 rounded-xl text-xs leading-relaxed"
                  style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
                >
                  <strong>BioFlow connection:</strong> {step.bfNote}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compute environments */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-fg-primary mb-1">Compute Environments</h3>
          <p className="text-sm text-fg-secondary leading-relaxed">
            Seqera abstracts all execution backends behind a unified interface.
            Your nf-core pipeline runs the same way regardless of where it executes.
          </p>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2">
          {COMPUTE_ENVS.map((env, i) => (
            <button
              key={i}
              onClick={() => setActiveEnv(i)}
              className="flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all"
              style={{
                borderColor: activeEnv === i ? 'var(--color-teal-500)' : 'var(--color-border)',
                background: activeEnv === i ? 'var(--color-teal-50)' : 'var(--color-surface)',
              }}
            >
              <span className="text-xl">{env.icon}</span>
              <span className="text-xs font-bold text-fg-primary">{env.name}</span>
            </button>
          ))}
        </div>
        {COMPUTE_ENVS[activeEnv] && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
          >
            <strong>{COMPUTE_ENVS[activeEnv].icon} {COMPUTE_ENVS[activeEnv].name}:</strong>{' '}
            {COMPUTE_ENVS[activeEnv].desc}
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <a href="https://docs.seqera.io/platform/latest/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          Seqera Platform docs ↗
        </a>
        <a href="https://seqera.io/platform/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          Seqera Platform (free tier available) ↗
        </a>
        <a href="https://training.nextflow.io/latest/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          Nextflow Training Portal ↗
        </a>
      </div>
    </div>
  )
}
