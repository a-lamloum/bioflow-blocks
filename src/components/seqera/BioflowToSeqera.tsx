'use client'

const BRIDGE_ROWS = [
  {
    bioflow: { icon: '🧩', label: 'Visual block pipeline', page: '/builder' },
    arrow: '→',
    seqera: { icon: '🔄', label: 'Saved Pipeline in Seqera Launchpad', hint: 'GitHub repo URL + version pinned' },
  },
  {
    bioflow: { icon: '📋', label: 'Samplesheet (edited in inspector)', page: '/builder' },
    arrow: '→',
    seqera: { icon: '📊', label: 'Seqera Dataset (uploaded CSV)', hint: 'Versioned, reusable across runs' },
  },
  {
    bioflow: { icon: '⚙️', label: 'Profile selector (docker/singularity)', page: '/builder' },
    arrow: '→',
    seqera: { icon: '⚙️', label: 'Compute Environment', hint: 'AWS Batch / SLURM / GCP / Azure' },
  },
  {
    bioflow: { icon: '📌', label: 'Pipeline version (-r 3.14.0)', page: '/troubleshoot' },
    arrow: '→',
    seqera: { icon: '🏷️', label: 'Pipeline Revision field', hint: 'Locked to exact git tag' },
  },
  {
    bioflow: { icon: '⚙️', label: 'Params preview (params.json)', page: '/builder' },
    arrow: '→',
    seqera: { icon: '📝', label: 'Launch parameters (override UI)', hint: '--genome, --aligner, --outdir' },
  },
  {
    bioflow: { icon: '📋', label: 'nextflow log table', page: '/troubleshoot' },
    arrow: '→',
    seqera: { icon: '▶️', label: 'Run monitoring (task table)', hint: 'Real-time CPU/memory/status' },
  },
  {
    bioflow: { icon: '🔴', label: 'Error decoder (exit codes)', page: '/troubleshoot' },
    arrow: '→',
    seqera: { icon: '🔍', label: 'Failed task → .command.err inline', hint: 'Same error messages, shown in Seqera UI' },
  },
]

export function BioflowToSeqera() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">BioFlow Blocks → Seqera Platform</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Everything you learned in BioFlow Blocks maps directly to a concept in Seqera Platform.
          The learning is transferable — Seqera is the production UI for the same nf-core ecosystem.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {BRIDGE_ROWS.map((row, i) => (
          <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-surface">
            {/* BioFlow side */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-base shrink-0">{row.bioflow.icon}</span>
              <div>
                <p className="text-xs font-semibold text-fg-primary">{row.bioflow.label}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--color-teal-500)' }}>
                  {row.bioflow.page}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <span className="shrink-0 text-lg text-fg-muted font-bold">→</span>

            {/* Seqera side */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-base shrink-0">{row.seqera.icon}</span>
              <div>
                <p className="text-xs font-semibold text-fg-primary">{row.seqera.label}</p>
                <p className="text-xs text-fg-muted">{row.seqera.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl px-5 py-4"
        style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-teal-700)' }}>
          <strong>The progression:</strong> BioFlow Blocks teaches you the concepts. The CLI
          (<code className="font-mono">nextflow run nf-core/rnaseq ...</code>) gives you control.
          Seqera Platform gives you scale — team collaboration, compute management, monitoring,
          and automated pipelines — all powered by the same Nextflow and nf-core ecosystem you
          learned in BioFlow.
        </p>
      </div>
    </div>
  )
}
