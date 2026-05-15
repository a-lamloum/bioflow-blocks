'use client'

import { useState } from 'react'

const LOG_COLUMNS = [
  { key: 'timestamp', label: 'Timestamp', desc: 'When the process started' },
  { key: 'duration',  label: 'Duration',  desc: 'How long the process took' },
  { key: 'cpu',       label: 'CPU%',      desc: 'Peak CPU usage' },
  { key: 'memory',    label: 'Memory',    desc: 'Peak RAM usage' },
  { key: 'process',   label: 'Process',   desc: 'Full nf-core module path' },
  { key: 'status',    label: 'Status',    desc: 'COMPLETED, FAILED, CACHED, etc.' },
]

const LOG_ROWS = [
  { timestamp: '2024-05-14 09:02:11', duration: '3m 14s', cpu: '396%',  memory: '6.2 GB', process: 'NFCORE_RNASEQ:RNASEQ:PREPARE_GENOME:STAR_GENOMEGENERATE', status: 'COMPLETED' },
  { timestamp: '2024-05-14 09:05:26', duration: '28s',    cpu: '98%',   memory: '372 MB', process: 'NFCORE_RNASEQ:RNASEQ:FASTQ_FASTQC_UMITOOLS_TRIMGALORE:FASTQC (WT_REP1)', status: 'COMPLETED' },
  { timestamp: '2024-05-14 09:05:31', duration: '32s',    cpu: '102%',  memory: '446 MB', process: 'NFCORE_RNASEQ:RNASEQ:FASTQ_FASTQC_UMITOOLS_TRIMGALORE:TRIMGALORE (WT_REP1)', status: 'COMPLETED' },
  { timestamp: '2024-05-14 09:06:04', duration: '1m 47s', cpu: '790%',  memory: '7.1 GB', process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (WT_REP1)', status: 'COMPLETED' },
  { timestamp: '2024-05-14 09:06:04', duration: '1m 52s', cpu: '792%',  memory: '7.0 GB', process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (WT_REP2)', status: 'CACHED' },
  { timestamp: '2024-05-14 09:07:51', duration: '14s',    cpu: '201%',  memory: '891 MB', process: 'NFCORE_RNASEQ:RNASEQ:QUANTIFY_STAR_SALMON:SALMON_QUANT (WT_REP1)', status: 'COMPLETED' },
  { timestamp: '2024-05-14 09:07:53', duration: '-',      cpu: '-',     memory: '-',      process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (RAP1_IAA_30M_REP1)', status: 'FAILED' },
  { timestamp: '2024-05-14 09:08:12', duration: '23s',    cpu: '445%',  memory: '1.8 GB', process: 'NFCORE_RNASEQ:RNASEQ:MULTIQC', status: 'COMPLETED' },
]

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'var(--color-success)',
  CACHED:    'oklch(58% 0.20 212)',
  FAILED:    'var(--color-error)',
  RUNNING:   'var(--color-warning)',
}

export function NextflowLogViewer() {
  const [selectedCol, setSelectedCol] = useState<string | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const activeCol = LOG_COLUMNS.find(c => c.key === selectedCol)

  const commands = [
    { cmd: 'nextflow log',                       desc: 'List all pipeline runs with status, duration, and exit code' },
    { cmd: 'nextflow log <run_name>',             desc: 'Show per-process trace for a specific run (replace with hash shown in nextflow log)' },
    { cmd: 'nextflow log -f process,exit,memory', desc: 'Show only process name, exit code, and memory columns' },
    { cmd: 'nextflow log -filter "status == FAILED"', desc: 'Filter to show only failed processes' },
    { cmd: 'nextflow log -before <timestamp>',    desc: 'Show runs before a specific date' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1"><code className="font-mono">nextflow log</code> — Execution History</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          The <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-border">nextflow log</code> command
          shows per-process timing, memory, CPU, and status for every run.
          Click any column header to learn what it means.
          Click a FAILED row to understand what to check.
        </p>
      </div>

      {/* Useful commands */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Useful commands</p>
        {commands.map((c, i) => (
          <div key={i} className="flex gap-3 items-start">
            <code className="shrink-0 text-xs font-mono px-2 py-1 rounded bg-surface-2 border border-border text-fg-secondary">
              {c.cmd}
            </code>
            <span className="text-xs text-fg-muted pt-1">{c.desc}</span>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="px-4 py-2 border-b border-border text-xs font-mono font-semibold text-fg-muted"
          style={{ background: 'var(--color-surface-2)' }}
        >
          nextflow log nxf-run-2024-05-14
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {LOG_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left cursor-pointer hover:bg-surface transition-colors"
                    style={{ color: selectedCol === col.key ? 'var(--color-teal-500)' : 'var(--color-fg-muted)' }}
                    onClick={() => setSelectedCol(selectedCol === col.key ? null : col.key)}
                  >
                    {col.label} {selectedCol === col.key ? '▲' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOG_ROWS.map((row, i) => (
                <tr
                  key={i}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedRow(selectedRow === i ? null : i)}
                  style={{
                    background: selectedRow === i ? 'var(--color-teal-50)' : i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <td className="px-3 py-1.5 text-fg-muted">{row.timestamp}</td>
                  <td className="px-3 py-1.5 text-fg-secondary">{row.duration}</td>
                  <td className="px-3 py-1.5 text-fg-secondary">{row.cpu}</td>
                  <td className="px-3 py-1.5 text-fg-secondary">{row.memory}</td>
                  <td className="px-3 py-1.5 text-fg-primary truncate max-w-60">{row.process.split(':').pop()}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className="font-bold px-2 py-0.5 rounded text-block-text text-xs"
                      style={{ background: STATUS_COLORS[row.status] ?? 'var(--color-fg-muted)' }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Column explanation */}
      {activeCol && (
        <div
          className="px-4 py-3 rounded-xl text-sm animate-fade-up"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          <strong>{activeCol.label}:</strong> {activeCol.desc}
        </div>
      )}

      {/* Row detail — FAILED */}
      {selectedRow === 6 && (
        <div
          className="px-4 py-3 rounded-xl text-sm animate-fade-up"
          style={{ background: 'oklch(55% 0.170 20 / 0.08)', border: '1px solid oklch(55% 0.170 20 / 0.30)' }}
        >
          <p className="font-semibold mb-2" style={{ color: 'var(--color-error)' }}>
            ✕ STAR_ALIGN (RAP1_IAA_30M_REP1) failed
          </p>
          <p className="text-fg-secondary text-xs leading-relaxed">
            Check the work directory for this process: find the hash in{' '}
            <code className="font-mono">.nextflow/cache/</code>, then read{' '}
            <code className="font-mono">.command.err</code> and{' '}
            <code className="font-mono">.exitcode</code>. Use{' '}
            <code className="font-mono">-resume</code> after fixing the issue to avoid re-running completed steps.
          </p>
        </div>
      )}

      {selectedRow !== null && selectedRow !== 6 && (
        <div
          className="px-4 py-3 rounded-xl text-sm animate-fade-up"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-fg-secondary text-xs">
            <strong className="text-fg-primary">CPU {LOG_ROWS[selectedRow].cpu}</strong> —
            multiples above 100% mean the tool used multiple cores. STAR_ALIGN at 790% used ~8 cores.
            Set <code className="font-mono">cpus = 8</code> in your process config to allocate them explicitly.
          </p>
        </div>
      )}

      <a
        href="https://www.nextflow.io/docs/latest/cli.html#log"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-teal-500 hover:text-teal-600 self-start"
      >
        Nextflow log command reference ↗
      </a>
    </div>
  )
}
