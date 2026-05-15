'use client'

import { useState } from 'react'
import type { CodeLine } from '@/lib/dsl2/codegen'

const TYPE_COLORS: Record<string, string> = {
  include:      'oklch(52% 0.22 152)',  // green
  channel:      'oklch(58% 0.20 212)',  // teal
  'process-call':'oklch(50% 0.25 302)', // purple
  output:       'oklch(68% 0.150 75)',  // amber
  keyword:      'oklch(52% 0.20 232)',  // blue
  'comment-only':'oklch(62% 0.015 260)', // muted
  meta:         'oklch(50% 0.22 258)',  // dark teal
}

interface AnnotatedCodeProps {
  lines: CodeLine[]
  title: string
  filename: string
}

export function AnnotatedCode({ lines, title, filename }: AnnotatedCodeProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const plainText = lines.map(l => {
    if (l.blank) return ''
    const indent = '    '.repeat(l.indent ?? 0)
    return `${indent}${l.code}`
  }).join('\n')

  const copyCode = async () => {
    await navigator.clipboard.writeText(plainText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedComment = selectedLine !== null ? lines[selectedLine]?.comment : null

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-fg-primary">{title}</h3>
          <p className="text-xs text-fg-muted">Click any line for an explanation.</p>
        </div>
        <button
          onClick={copyCode}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border transition-colors"
          style={{
            background: copied ? 'var(--color-success)' : 'var(--color-surface-2)',
            color: copied ? 'white' : 'var(--color-fg-secondary)',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code block */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: 'oklch(14% 0.02 220)' }}
      >
        {/* File tab */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b text-xs font-mono"
          style={{ borderColor: 'oklch(28% 0.02 220)', background: 'oklch(18% 0.02 220)', color: 'oklch(65% 0.02 220)' }}
        >
          <span style={{ color: 'oklch(68% 0.150 75)' }}>●</span>
          <span>{filename}</span>
        </div>

        {/* Lines */}
        <div className="overflow-x-auto">
          {lines.map((line, i) => {
            if (line.blank) return <div key={i} className="h-3" />
            const indent = '    '.repeat(line.indent ?? 0)
            const isSelected = selectedLine === i
            const hasComment = !!line.comment
            const color = TYPE_COLORS[line.type ?? 'keyword'] ?? 'oklch(85% 0.01 220)'

            return (
              <div
                key={i}
                className="flex items-start group cursor-pointer"
                onClick={() => setSelectedLine(isSelected ? null : i)}
                style={{
                  background: isSelected ? 'oklch(28% 0.03 220)' : hasComment ? 'oklch(16% 0.025 220)' : undefined,
                }}
              >
                {/* Line number */}
                <span
                  className="shrink-0 w-10 text-right pr-3 text-xs font-mono select-none pt-1"
                  style={{ color: 'oklch(42% 0.015 220)' }}
                >
                  {i + 1}
                </span>

                {/* Code */}
                <span
                  className="flex-1 text-xs font-mono py-1 pr-4"
                  style={{ color: line.type === 'comment-only' ? 'oklch(55% 0.015 220)' : color }}
                >
                  {indent}{line.code}
                </span>

                {/* Comment indicator */}
                {hasComment && (
                  <span
                    className="shrink-0 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'oklch(65% 0.02 220)' }}
                  >
                    ?
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Explanation card for selected line */}
      {selectedComment && (
        <div
          className="rounded-xl px-4 py-3 text-sm leading-relaxed animate-fade-up"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          <span className="font-bold mr-2">💬</span>
          {selectedComment}
        </div>
      )}

      {!selectedComment && (
        <p className="text-xs text-fg-muted text-center">
          Click any highlighted line to see what it does in nf-core.
        </p>
      )}
    </div>
  )
}
