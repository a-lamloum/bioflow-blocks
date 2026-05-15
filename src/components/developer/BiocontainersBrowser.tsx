'use client'

import { useState } from 'react'

const EXAMPLE_TOOLS = [
  { tool: 'fastqc',    version: '0.12.1', build: 'hdfd78af_0',  bioconda: 'bioconda::fastqc=0.12.1' },
  { tool: 'star',      version: '2.7.11a', build: 'h0033a41_0', bioconda: 'bioconda::star=2.7.11a' },
  { tool: 'samtools',  version: '1.19.2', build: 'h50ea8bc_0',  bioconda: 'bioconda::samtools=1.19.2' },
  { tool: 'salmon',    version: '1.10.2', build: 'hecfa306_0',   bioconda: 'bioconda::salmon=1.10.2' },
  { tool: 'trimgalore',version: '0.6.10', build: 'hdfd78af_0', bioconda: 'bioconda::trim-galore=0.6.10' },
  { tool: 'multiqc',   version: '1.21',   build: 'pyhdfd78af_0', bioconda: 'bioconda::multiqc=1.21' },
  { tool: 'bwa-mem2',  version: '2.2.1',  build: 'hd03093a_5',  bioconda: 'bioconda::bwa-mem2=2.2.1' },
  { tool: 'gatk4',     version: '4.5.0.0', build: 'py36hdfd78af_0', bioconda: 'bioconda::gatk4=4.5.0.0' },
]

export function BiocontainersBrowser() {
  const [selected, setSelected] = useState(EXAMPLE_TOOLS[0])

  const quayUrl = `https://quay.io/biocontainers/${selected.tool}:${selected.version}--${selected.build}`
  const dockerUrl = `biocontainers/${selected.tool}:${selected.version}--${selected.build}`

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Biocontainers Browser</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Every nf-core module uses a Biocontainers image — auto-built from Bioconda recipes.
          Container images are automatically pinned to the exact tool version specified in
          <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border ml-1">environment.yml</code>.
        </p>
      </div>

      {/* Tool picker */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Select a tool</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TOOLS.map(t => (
            <button
              key={t.tool}
              onClick={() => setSelected(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all"
              style={{
                background: selected.tool === t.tool ? 'var(--color-teal-500)' : 'var(--color-surface-2)',
                color: selected.tool === t.tool ? 'white' : 'var(--color-fg-secondary)',
                borderColor: selected.tool === t.tool ? 'var(--color-teal-500)' : 'var(--color-border)',
              }}
            >
              {t.tool}
            </button>
          ))}
        </div>
      </div>

      {/* Container details */}
      <div className="flex flex-col gap-4">
        {/* environment.yml */}
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
            1. Bioconda dependency in environment.yml
          </p>
          <code
            className="block text-sm font-mono px-4 py-3 rounded-xl"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg-secondary)' }}
          >
            {selected.bioconda}
          </code>
        </div>

        {/* Auto-built container images */}
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
            2. Auto-built Biocontainers images (from the Bioconda recipe)
          </p>
          <div className="flex flex-col gap-2">
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-mono"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <span className="shrink-0 font-semibold text-fg-muted mt-0.5">Quay.io:</span>
              <div className="flex-1">
                <a
                  href={quayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:text-teal-600 break-all"
                >
                  {quayUrl} ↗
                </a>
                <p className="text-fg-muted mt-1">Used by Singularity on HPC clusters</p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-mono"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <span className="shrink-0 font-semibold text-fg-muted mt-0.5">Docker Hub:</span>
              <div className="flex-1">
                <a
                  href={`https://hub.docker.com/r/biocontainers/${selected.tool}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:text-teal-600 break-all"
                >
                  {dockerUrl} ↗
                </a>
                <p className="text-fg-muted mt-1">Used by Docker on cloud/local</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it appears in main.nf */}
        <div>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
            3. How it appears in the module&apos;s main.nf
          </p>
          <pre
            className="text-xs font-mono p-3 rounded-xl overflow-x-auto"
            style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(72% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
          >
{`conda "\${moduleDir}/environment.yml"
container "\${ workflow.containerEngine == 'singularity' && !task.ext.singularity_pull_docker_container ?
    'https://depot.galaxyproject.org/singularity/${selected.tool}:${selected.version}--${selected.build}' :
    'biocontainers/${selected.tool}:${selected.version}--${selected.build}' }"`}
          </pre>
        </div>

        {/* Flow diagram */}
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          <strong>The automatic pipeline:</strong>
          {' '}Bioconda recipe → Biocontainers builds Docker + Singularity images → Pinned in environment.yml →
          nf-core module references them → nf-core CI pulls and tests them automatically.
          You never need to build container images manually.
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <a href="https://biocontainers.pro/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          biocontainers.pro ↗
        </a>
        <a href="https://quay.io/organization/biocontainers" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          Biocontainers on Quay.io ↗
        </a>
        <a href="https://bioconda.github.io/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          Bioconda ↗
        </a>
      </div>
    </div>
  )
}
