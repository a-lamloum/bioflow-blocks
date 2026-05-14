'use client'

interface Profile {
  id: string
  label: string
  icon: string
  description: string
  whenToUse: string
  docsUrl: string
  color: string
}

const PROFILES: Profile[] = [
  {
    id: 'docker',
    label: 'Docker',
    icon: '🐳',
    description: 'Runs every process inside a Docker container. The most portable option — works on any machine with Docker installed.',
    whenToUse: 'Local development, cloud (AWS Batch, Google Life Sciences), anywhere Docker is available.',
    docsUrl: 'https://nf-co.re/docs/running/configuration#docker',
    color: 'oklch(52% 0.20 232)',
  },
  {
    id: 'singularity',
    label: 'Singularity',
    icon: '🦭',
    description: 'Like Docker but designed for HPC clusters where Docker is not allowed. Containers run without root privileges.',
    whenToUse: 'SLURM / PBS / LSF clusters (most university HPC systems).',
    docsUrl: 'https://nf-co.re/docs/running/configuration#singularity',
    color: 'oklch(50% 0.25 302)',
  },
  {
    id: 'conda',
    label: 'Conda',
    icon: '🐍',
    description: 'Installs each tool as a Conda environment instead of a container. Slower to start but no Docker/Singularity required.',
    whenToUse: 'When you cannot use containers but have Conda or Mamba installed.',
    docsUrl: 'https://nf-co.re/docs/running/configuration#conda',
    color: 'oklch(52% 0.22 152)',
  },
  {
    id: 'test',
    label: 'test',
    icon: '🧪',
    description: 'Uses a tiny built-in test dataset to verify the pipeline runs end-to-end. Always combine with a container profile.',
    whenToUse: 'Verify setup before running real data: -profile test,docker',
    docsUrl: 'https://nf-co.re/docs/running/test_data',
    color: 'oklch(68% 0.150 75)',
  },
]

interface ProfileSelectorProps {
  selected: string
  onChange: (profile: string) => void
}

export function ProfileSelector({ selected, onChange }: ProfileSelectorProps) {
  const selectedProfile = PROFILES.find(p => p.id === selected) ?? PROFILES[0]

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">Execution profile</p>
        <div className="grid grid-cols-2 gap-2">
          {PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              aria-pressed={selected === p.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all duration-fast text-left focus-visible:ring-2 focus-visible:ring-focus-ring"
              style={{
                borderColor: selected === p.id ? p.color : 'var(--color-border)',
                background: selected === p.id ? `${p.color}18` : 'var(--color-surface-2)',
                color: selected === p.id ? p.color : 'var(--color-fg-secondary)',
              }}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected profile explanation */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2"
        style={{
          background: `${selectedProfile.color}0f`,
          border: `1px solid ${selectedProfile.color}44`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedProfile.icon}</span>
          <span className="text-sm font-bold" style={{ color: selectedProfile.color }}>{selectedProfile.label}</span>
        </div>
        <p className="text-sm text-fg-secondary leading-relaxed">{selectedProfile.description}</p>
        <p className="text-xs text-fg-muted">
          <span className="font-semibold">When to use:</span> {selectedProfile.whenToUse}
        </p>
        <a
          href={selectedProfile.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold self-start"
          style={{ color: selectedProfile.color }}
        >
          nf-core docs ↗
        </a>
      </div>
    </div>
  )
}
