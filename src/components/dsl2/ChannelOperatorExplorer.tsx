'use client'

import { useState } from 'react'

interface Operator {
  name: string
  syntax: string
  description: string
  useCase: string
  before: string[]
  after: string[]
  docsUrl: string
}

const OPERATORS: Operator[] = [
  {
    name: 'map',
    syntax: 'ch.map { meta, file -> [ meta, file.baseName ] }',
    description: 'Transforms each element of a channel. Returns a new channel with one output per input.',
    useCase: 'Extract just the base filename from a path; add a new field to meta; rename samples.',
    before: ['[ {id: "S1"}, /data/S1.fastq.gz ]', '[ {id: "S2"}, /data/S2.fastq.gz ]'],
    after: ['[ {id: "S1"}, "S1.fastq" ]', '[ {id: "S2"}, "S2.fastq" ]'],
    docsUrl: 'https://www.nextflow.io/docs/latest/operator.html#map',
  },
  {
    name: 'groupTuple',
    syntax: 'ch.groupTuple(by: [0])',
    description: 'Groups elements that share the same key into a list. Used when one sample spans multiple FASTQ files (multiple lanes).',
    useCase: 'nf-core/rnaseq uses this to merge multi-lane FASTQs for the same sample ID before alignment.',
    before: ['[ {id: "S1"}, S1_L001_R1.fq ]', '[ {id: "S1"}, S1_L002_R1.fq ]', '[ {id: "S2"}, S2_L001_R1.fq ]'],
    after: ['[ {id: "S1"}, [S1_L001_R1.fq, S1_L002_R1.fq] ]', '[ {id: "S2"}, [S2_L001_R1.fq] ]'],
    docsUrl: 'https://www.nextflow.io/docs/latest/operator.html#grouptuple',
  },
  {
    name: 'combine',
    syntax: 'ch_reads.combine(ch_genome)',
    description: 'Pairs every element of one channel with every element of another (cartesian product). Useful for pairing samples with a shared reference.',
    useCase: 'Pair each sample FASTQ channel with the single reference genome/index for alignment.',
    before: ['ch_reads: [ {id:"S1"}, reads ]', 'ch_reads: [ {id:"S2"}, reads ]', 'ch_genome: [ genome.fasta ]'],
    after: ['[ {id:"S1"}, reads, genome.fasta ]', '[ {id:"S2"}, reads, genome.fasta ]'],
    docsUrl: 'https://www.nextflow.io/docs/latest/operator.html#combine',
  },
  {
    name: 'branch',
    syntax: 'ch.branch { paired: it[0].single_end == false; single: true }',
    description: 'Splits a channel into multiple sub-channels based on a condition. Each element goes into exactly one branch.',
    useCase: 'nf-core/rnaseq branches samples into paired-end and single-end streams for different downstream handling.',
    before: ['[ {id:"S1", single_end: false}, R1, R2 ]', '[ {id:"S2", single_end: true}, R1 ]'],
    after: ['paired: [ {id:"S1", single_end: false}, R1, R2 ]', 'single: [ {id:"S2", single_end: true}, R1 ]'],
    docsUrl: 'https://www.nextflow.io/docs/latest/operator.html#branch',
  },
  {
    name: 'collect',
    syntax: 'ch.collect()',
    description: 'Gathers ALL elements from a channel into a single list. Blocks until the channel is complete.',
    useCase: 'Used before MultiQC to gather all QC report files from all samples into one list for aggregation.',
    before: ['[ {id:"S1"}, fastqc.zip ]', '[ {id:"S2"}, fastqc.zip ]', '[ {id:"S3"}, fastqc.zip ]'],
    after: ['[ [{id:"S1"}, fastqc.zip], [{id:"S2"}, fastqc.zip], [{id:"S3"}, fastqc.zip] ]'],
    docsUrl: 'https://www.nextflow.io/docs/latest/operator.html#collect',
  },
]

export function ChannelOperatorExplorer() {
  const [active, setActive] = useState(0)
  const op = OPERATORS[active]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">Channel Operators</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Channels are data streams. Operators transform them between processes.
          These 5 operators appear in almost every nf-core pipeline.
        </p>
      </div>

      {/* Operator tabs */}
      <div className="flex flex-wrap gap-2">
        {OPERATORS.map((o, i) => (
          <button
            key={o.name}
            onClick={() => setActive(i)}
            className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-all"
            style={{
              background: active === i ? 'var(--color-teal-500)' : 'var(--color-surface-2)',
              color: active === i ? 'white' : 'var(--color-fg-secondary)',
              border: active === i ? 'none' : '1px solid var(--color-border)',
              boxShadow: active === i ? '0 3px 0 var(--color-teal-700)' : 'none',
            }}
          >
            .{o.name}()
          </button>
        ))}
      </div>

      {/* Active operator */}
      <div className="flex flex-col gap-4">
        {/* Syntax */}
        <pre
          className="text-xs font-mono p-3 rounded-xl overflow-x-auto"
          style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(75% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
        >
          {op.syntax}
        </pre>

        {/* Description + use case */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-fg-primary leading-relaxed">{op.description}</p>
          <div
            className="px-4 py-3 rounded-xl text-xs leading-relaxed"
            style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
          >
            <strong>In nf-core:</strong> {op.useCase}
          </div>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">Before</p>
            <div
              className="rounded-xl p-3 text-xs font-mono flex flex-col gap-1"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              {op.before.map((line, i) => (
                <div key={i} className="text-fg-secondary">{line}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">After .{op.name}()</p>
            <div
              className="rounded-xl p-3 text-xs font-mono flex flex-col gap-1"
              style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
            >
              {op.after.map((line, i) => (
                <div key={i} style={{ color: 'var(--color-teal-700)' }}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        <a
          href={op.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-teal-500 hover:text-teal-600 self-start"
        >
          Nextflow docs: .{op.name}() ↗
        </a>
      </div>
    </div>
  )
}
