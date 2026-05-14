'use client'

import { useState, useCallback } from 'react'
import type { SampleRow } from '@/types'

// ─── Validation ───────────────────────────────────────────────────────────────

interface RowError {
  col: keyof SampleRow | null
  message: string
  fix: string
}

function validateRows(rows: SampleRow[]): RowError[][] {
  return rows.map(row => {
    const errors: RowError[] = []

    if (!row.sample.trim()) {
      errors.push({ col: 'sample', message: 'Sample name is empty.', fix: 'Add a unique name for this sample (e.g. SAMPLE1).' })
    }
    if (!row.fastq_1.trim()) {
      errors.push({ col: 'fastq_1', message: 'fastq_1 file path is missing.', fix: 'Add the path to the R1 FASTQ file (e.g. SAMPLE1_R1.fastq.gz).' })
    } else if (!row.fastq_1.endsWith('.fastq.gz') && !row.fastq_1.endsWith('.fq.gz') && !row.fastq_1.endsWith('.fastq') && !row.fastq_1.endsWith('.fq')) {
      errors.push({ col: 'fastq_1', message: 'fastq_1 does not look like a FASTQ file.', fix: 'File should end with .fastq.gz, .fq.gz, .fastq, or .fq.' })
    }
    if (!row.fastq_2.trim()) {
      errors.push({ col: 'fastq_2', message: 'fastq_2 is empty — this looks like a paired-end library.', fix: 'Add the R2 file path, or set strandedness to unstranded for single-end data.' })
    } else if (row.fastq_1.trim() && row.fastq_2.trim() && row.fastq_1 === row.fastq_2) {
      errors.push({ col: 'fastq_2', message: 'fastq_1 and fastq_2 are identical.', fix: 'R1 and R2 files must be different. Check that you are pointing to separate files.' })
    }
    return errors
  })
}

const ERROR_BG  = 'oklch(55% 0.170 20 / 0.10)'
const ERROR_BORDER = 'oklch(55% 0.170 20 / 0.60)'

// ─── Component ────────────────────────────────────────────────────────────────

interface SamplesheetEditorProps {
  rows: SampleRow[]
  onChange: (rows: SampleRow[]) => void
}

export function SamplesheetEditor({ rows, onChange }: SamplesheetEditorProps) {
  const [showErrors, setShowErrors] = useState(true)
  const allErrors = validateRows(rows)
  const totalErrors = allErrors.flat().length
  const isValid = totalErrors === 0

  const update = useCallback(
    (rowIdx: number, col: keyof SampleRow, value: string) => {
      const next = rows.map((r, i) => i === rowIdx ? { ...r, [col]: value } : r)
      onChange(next)
    },
    [rows, onChange]
  )

  const addRow = () => {
    onChange([...rows, { sample: '', fastq_1: '', fastq_2: '', strandedness: 'auto' }])
  }

  const removeRow = (idx: number) => {
    if (rows.length <= 1) return
    onChange(rows.filter((_, i) => i !== idx))
  }

  const COLS: { key: keyof SampleRow; label: string; placeholder: string; width: string }[] = [
    { key: 'sample',       label: 'sample',       placeholder: 'SAMPLE1',             width: '20%' },
    { key: 'fastq_1',      label: 'fastq_1',      placeholder: 'SAMPLE1_R1.fastq.gz', width: '35%' },
    { key: 'fastq_2',      label: 'fastq_2',      placeholder: 'SAMPLE1_R2.fastq.gz', width: '35%' },
    { key: 'strandedness', label: 'strand',        placeholder: 'auto',                width: '10%' },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-fg-muted uppercase tracking-wide">
          Samplesheet — {rows.length} sample{rows.length !== 1 ? 's' : ''}
        </span>
        {!isValid && (
          <button
            onClick={() => setShowErrors(v => !v)}
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: ERROR_BG, color: 'var(--color-error)' }}
          >
            {totalErrors} error{totalErrors !== 1 ? 's' : ''} {showErrors ? '▲' : '▼'}
          </button>
        )}
        {isValid && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: 'var(--color-teal-50)', color: 'var(--color-teal-700)' }}>
            ✓ Valid
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden text-xs font-mono">
        {/* Header */}
        <div className="flex border-b border-border bg-surface-2">
          {COLS.map(c => (
            <div key={c.key} className="px-2 py-1.5 font-semibold text-fg-muted truncate" style={{ width: c.width, flexShrink: 0 }}>
              {c.label}
            </div>
          ))}
          <div className="w-8 shrink-0" />
        </div>

        {/* Rows */}
        {rows.map((row, rIdx) => {
          const rowErrors = allErrors[rIdx] ?? []
          const errorCols = new Set(rowErrors.map(e => e.col))
          const hasError = rowErrors.length > 0
          return (
            <div key={rIdx} className="border-b border-border last:border-0">
              <div className="flex items-center" style={{ background: hasError ? ERROR_BG : undefined }}>
                {COLS.map(c => (
                  <div key={c.key} style={{ width: c.width, flexShrink: 0 }} className="relative">
                    {c.key === 'strandedness' ? (
                      <select
                        value={row[c.key]}
                        onChange={e => update(rIdx, c.key, e.target.value)}
                        className="w-full px-2 py-1.5 bg-transparent text-fg-primary focus:outline-none"
                        style={{ borderRight: '1px solid var(--color-border)' }}
                      >
                        {['auto', 'forward', 'reverse', 'unstranded'].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={row[c.key]}
                        onChange={e => update(rIdx, c.key, e.target.value)}
                        placeholder={c.placeholder}
                        className="w-full px-2 py-1.5 bg-transparent text-fg-primary placeholder:text-fg-muted focus:outline-none focus:bg-teal-50"
                        style={{
                          borderRight: '1px solid var(--color-border)',
                          borderBottom: errorCols.has(c.key) ? `2px solid var(--color-error)` : undefined,
                        }}
                      />
                    )}
                  </div>
                ))}
                <div className="w-8 flex items-center justify-center shrink-0">
                  {rows.length > 1 && (
                    <button
                      aria-label="Remove row"
                      onClick={() => removeRow(rIdx)}
                      className="text-fg-muted hover:text-error transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Inline errors */}
              {showErrors && rowErrors.length > 0 && (
                <div className="flex flex-col gap-0.5 px-2 py-1.5" style={{ background: ERROR_BG }}>
                  {rowErrors.map((e, i) => (
                    <div key={i} className="text-xs leading-tight" style={{ color: 'var(--color-error)' }}>
                      <span className="font-semibold">{e.message}</span>
                      {' '}<span className="text-fg-secondary">→ {e.fix}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-teal-600 border border-border hover:bg-teal-50 transition-colors self-start"
      >
        + Add sample
      </button>

      {/* nf-core hint */}
      <p className="text-xs text-fg-muted leading-relaxed">
        This samplesheet maps to <code className="font-mono">--input</code> in nf-core/rnaseq.
        Required columns: <code className="font-mono">sample</code>, <code className="font-mono">fastq_1</code>, <code className="font-mono">fastq_2</code>, <code className="font-mono">strandedness</code>.
      </p>
    </div>
  )
}
