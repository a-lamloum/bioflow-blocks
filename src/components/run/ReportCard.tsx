'use client'

import { Badge } from '@/components/ui/Badge'
import type { ReportCard as ReportCardType } from '@/types'

interface ReportCardProps {
  report: ReportCardType
}

const STATUS_BORDER: Record<ReportCardType['status'], string> = {
  pass: 'border-success',
  warn: 'border-warning',
  fail: 'border-error',
}

const STATUS_BADGE: Record<ReportCardType['status'], 'success' | 'warning' | 'error'> = {
  pass: 'success',
  warn: 'warning',
  fail: 'error',
}

const STATUS_LABELS: Record<ReportCardType['status'], string> = {
  pass: 'Pass',
  warn: 'Review',
  fail: 'Fail',
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <section
      aria-label="QC Report"
      className={[
        'border-t-4 bg-surface rounded-b-md',
        STATUS_BORDER[report.status],
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-fg-primary">{report.title}</span>
        <Badge variant={STATUS_BADGE[report.status]}>
          {STATUS_LABELS[report.status]}
        </Badge>
      </div>

      {/* Summary */}
      <p className="px-4 py-2 text-base text-fg-secondary">{report.summary}</p>

      {/* Sample rows */}
      <div className="px-4 pb-3">
        <table className="w-full text-sm" aria-label="Per-sample results">
          <thead>
            <tr className="text-xs text-fg-muted uppercase">
              <th className="text-left py-1 font-semibold">Sample</th>
              <th className="text-right py-1 font-semibold">Reads</th>
              <th className="text-right py-1 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {report.samples.map((sample, i) => (
              <tr
                key={sample.name}
                className={i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'}
              >
                <td className="py-1.5 pr-4 text-fg-primary font-mono text-xs">{sample.name}</td>
                <td className="py-1.5 px-2 text-right text-fg-secondary font-mono text-xs">
                  {sample.readCount.toLocaleString()}
                </td>
                <td className="py-1.5 pl-2 text-right">
                  <Badge
                    variant={sample.qualityStatus === 'pass' ? 'success' : 'warning'}
                  >
                    {sample.qualityStatus === 'pass' ? 'Pass' : 'Review'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
