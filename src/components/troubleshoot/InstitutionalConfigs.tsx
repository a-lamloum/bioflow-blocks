'use client'

import { useState } from 'react'

interface InstitutionalProfile {
  id: string
  name: string
  institution: string
  executor: string
  scheduler: string
  flag: string
  config: string
  notes: string
}

const PROFILES: InstitutionalProfile[] = [
  {
    id: 'uppmax',
    name: 'UPPMAX',
    institution: 'Uppsala University (Sweden)',
    executor: 'SLURM',
    scheduler: 'SLURM + UPPMAX modules',
    flag: '-profile uppmax',
    config: `params {
    config_profile_name = 'UPPMAX cluster profile'
    config_profile_url  = 'https://www.uppmax.uu.se/'
    max_memory          = 6.TB
    max_cpus            = 512
    max_time            = 10.d
}

process {
    executor       = 'slurm'
    clusterOptions = "-A $params.project"
}

singularity {
    enabled    = true
    cacheDir   = '/proj/\${params.project}/singularity-images'
    autoMounts = true
}`,
    notes: 'Requires -profile uppmax and --project <SNIC_project>',
  },
  {
    id: 'aws',
    name: 'AWS Batch',
    institution: 'Amazon Web Services',
    executor: 'AWS Batch',
    scheduler: 'AWS managed',
    flag: '-profile aws',
    config: `plugins {
    id 'nf-amazon'
}

process {
    executor = 'awsbatch'
    queue    = 'nextflow-batch-queue'
}

aws {
    region     = 'eu-west-1'
    batch.cliPath = '/home/ec2-user/miniconda/bin/aws'
}

docker.enabled = true`,
    notes: 'Requires Seqera Platform or manual AWS Batch setup',
  },
  {
    id: 'google',
    name: 'Google Cloud Life Sciences',
    institution: 'Google Cloud Platform',
    executor: 'Google LS / Batch',
    scheduler: 'GCP managed',
    flag: '-profile google',
    config: `google {
    project     = 'my-gcp-project'
    location    = 'europe-west2'
    batch.spot  = true  // use preemptible instances
}

process {
    executor     = 'google-batch'
    maxRetries   = 2
    errorStrategy = { task.exitStatus in [50000, 8] ? 'retry' : 'finish' }
}

docker.enabled = true`,
    notes: 'Spot instances save ~70% cost but can be preempted — use maxRetries',
  },
  {
    id: 'hpc-generic',
    name: 'Generic HPC (SLURM)',
    institution: 'Any SLURM cluster',
    executor: 'SLURM',
    scheduler: 'SLURM',
    flag: '-profile slurm',
    config: `process {
    executor       = 'slurm'
    queue          = 'normal'
    clusterOptions = '--export=ALL'

    withLabel: process_high {
        cpus   = 16
        memory = '64 GB'
        time   = '8 h'
        queue  = 'highmem'
    }
}

singularity {
    enabled    = true
    autoMounts = true
    cacheDir   = '/scratch/\$USER/singularity-cache'
}`,
    notes: 'Adjust queue names and resource limits for your cluster',
  },
]

export function InstitutionalConfigs() {
  const [active, setActive] = useState('uppmax')
  const profile = PROFILES.find(p => p.id === active) ?? PROFILES[0]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Institutional Config Profiles</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          nf-core maintains a <a href="https://github.com/nf-core/configs" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-600">library of institutional configs</a> for 70+ HPC clusters and cloud platforms.
          Add the right <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">-profile</code> and your pipeline automatically uses the correct executor, scheduler, and resource defaults.
        </p>
      </div>

      {/* Profile selector */}
      <div className="flex flex-wrap gap-2">
        {PROFILES.map(p => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
            style={{
              background: active === p.id ? 'var(--color-teal-500)' : 'var(--color-surface-2)',
              color: active === p.id ? 'white' : 'var(--color-fg-secondary)',
              borderColor: active === p.id ? 'var(--color-teal-500)' : 'var(--color-border)',
              boxShadow: active === p.id ? '0 3px 0 var(--color-teal-700)' : 'none',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Selected profile detail */}
      <div className="flex flex-col gap-4">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Institution', value: profile.institution },
            { label: 'Executor', value: profile.executor },
            { label: 'Scheduler', value: profile.scheduler },
            { label: 'Profile flag', value: profile.flag },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl border border-border bg-surface">
              <p className="text-xs text-fg-muted uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-mono font-semibold text-fg-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Config snippet */}
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">nextflow.config excerpt</p>
          <pre
            className="text-xs font-mono p-4 rounded-xl overflow-x-auto"
            style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
          >
            {profile.config}
          </pre>
        </div>

        {/* Usage */}
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          <strong>Usage note:</strong> {profile.notes}
        </div>

        {/* Run with this profile */}
        <pre
          className="text-sm font-mono p-3 rounded-xl overflow-x-auto"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-fg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {`nextflow run nf-core/rnaseq ${profile.flag},docker -r 3.14.0 --input samplesheet.csv --genome GRCh38 --outdir results`}
        </pre>
      </div>

      <div className="flex gap-3 flex-wrap">
        <a
          href="https://github.com/nf-core/configs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600"
        >
          Browse all 70+ institutional configs on GitHub ↗
        </a>
        <a
          href="https://nf-co.re/docs/running/configuration"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600"
        >
          nf-core configuration guide ↗
        </a>
      </div>
    </div>
  )
}
