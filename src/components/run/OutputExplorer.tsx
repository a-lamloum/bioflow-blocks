'use client'

import { useState } from 'react'
import type { OutputNode } from '@/data/nfcore-test-data'

interface OutputNodeRowProps {
  node: OutputNode
  depth?: number
}

function FileIcon({ type, name }: { type: OutputNode['type']; name: string }) {
  if (type === 'dir') return <span>📁</span>
  if (name.endsWith('.html')) return <span>🌐</span>
  if (name.endsWith('.bam') || name.endsWith('.bai')) return <span>🧬</span>
  if (name.endsWith('.fastq.gz') || name.endsWith('.fq.gz')) return <span>📄</span>
  if (name.endsWith('.pdf')) return <span>📊</span>
  if (name.endsWith('.tsv') || name.endsWith('.txt') || name.endsWith('.csv')) return <span>📋</span>
  return <span>📄</span>
}

function OutputNodeRow({ node, depth = 0 }: OutputNodeRowProps) {
  const [open, setOpen] = useState(depth === 0 && node.type === 'dir')

  const indent = depth * 16
  const hasChildren = node.children && node.children.length > 0
  const isSpecial = node.name.includes('multiqc_report') || node.name.includes('⭐')

  return (
    <div>
      <div
        className={[
          'flex items-start gap-2 py-1 px-2 rounded-lg text-xs cursor-default transition-colors',
          hasChildren ? 'hover:bg-surface-2 cursor-pointer' : 'hover:bg-surface-2',
          isSpecial ? 'bg-teal-50 border border-teal-100' : '',
        ].join(' ')}
        style={{ paddingLeft: indent + 8 }}
        onClick={() => hasChildren && setOpen(v => !v)}
        role={hasChildren ? 'button' : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        {/* Toggle */}
        {hasChildren ? (
          <span className="text-fg-muted shrink-0 w-3">{open ? '▾' : '▸'}</span>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Icon */}
        <FileIcon type={node.type} name={node.name} />

        {/* Name */}
        <span
          className={[
            'font-mono truncate',
            node.type === 'dir' ? 'font-semibold text-fg-primary' : 'text-fg-secondary',
            isSpecial ? 'text-teal-700 font-bold' : '',
          ].join(' ')}
        >
          {node.name}
        </span>

        {/* Size */}
        {node.sizeMB && (
          <span className="shrink-0 text-fg-muted ml-auto">{node.sizeMB.toFixed(1)} MB</span>
        )}

        {/* Docs link */}
        {node.docsUrl && (
          <a
            href={node.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="shrink-0 text-teal-500 hover:text-teal-600 ml-1"
            title="nf-core docs"
          >
            ↗
          </a>
        )}
      </div>

      {/* Description */}
      {node.description && (
        <div
          className="text-xs text-fg-muted pb-0.5"
          style={{ paddingLeft: indent + 36 }}
        >
          {node.description}
        </div>
      )}

      {/* Children */}
      {open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <OutputNodeRow key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface OutputExplorerProps {
  tree: OutputNode[]
  commandUsed: string
}

export function OutputExplorer({ tree, commandUsed }: OutputExplorerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-fg-primary mb-1">Output directory — results/</h3>
        <p className="text-xs text-fg-muted leading-relaxed">
          This is the real file structure produced by{' '}
          <code className="font-mono">nextflow run nf-core/rnaseq -profile test,docker</code>.
          Click any folder to expand it.
        </p>
      </div>

      {/* Command used */}
      <pre
        className="text-xs font-mono p-3 rounded-xl overflow-x-auto"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg-secondary)' }}
      >
        {commandUsed}
      </pre>

      {/* File tree */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: 'var(--color-surface)' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 border-b border-border text-xs font-semibold text-fg-muted"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <span>📁</span>
          <span className="font-mono">results/</span>
          <span className="ml-auto text-fg-muted">nf-core/rnaseq v3.14.0</span>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
          {tree.map((node, i) => (
            <OutputNodeRow key={`${node.name}-${i}`} node={node} depth={0} />
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-3 text-xs leading-relaxed"
        style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
      >
        <strong>💡 Start here:</strong> Open <code className="font-mono">results/multiqc/multiqc_report.html</code> in your
        browser for an interactive summary of all samples. Then explore{' '}
        <code className="font-mono">results/star_salmon/salmon.merged.gene_tpm.tsv</code> for the gene expression matrix.
      </div>
    </div>
  )
}
