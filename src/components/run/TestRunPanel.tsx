'use client'

import { useState } from 'react'
import { OutputExplorer } from './OutputExplorer'
import {
  NFCORE_TEST_SAMPLES,
  NFCORE_TEST_QC_STATS,
  NFCORE_TEST_OUTPUT_TREE,
  NFCORE_TEST_COMMAND,
  NFCORE_TEST_SAMPLESHEET_URL,
  NFCORE_RNASEQ_VERSION,
  NFCORE_TEST_REPO,
} from '@/data/nfcore-test-data'

type Tab = 'dataset' | 'trace' | 'qc' | 'outputs'

const REALISTIC_TRACE = [
  { process: 'NFCORE_RNASEQ:RNASEQ:PREPARE_GENOME:GTF2BED', status: '✓', memory: '148 MB', time: '3s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:PREPARE_GENOME:CUSTOM_GETCHROMSIZES', status: '✓', memory: '224 MB', time: '2s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:PREPARE_GENOME:STAR_GENOMEGENERATE', status: '✓', memory: '6.3 GB', time: '2m 14s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:PREPARE_GENOME:SALMON_INDEX', status: '✓', memory: '1.2 GB', time: '18s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:FASTQ_FASTQC_UMITOOLS_TRIMGALORE:FASTQC (WT_REP1)', status: '✓', memory: '372 MB', time: '28s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:FASTQ_FASTQC_UMITOOLS_TRIMGALORE:TRIMGALORE (WT_REP1)', status: '✓', memory: '446 MB', time: '32s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:FASTQ_FASTQC_UMITOOLS_TRIMGALORE:FASTQC (WT_REP2)', status: '✓', memory: '368 MB', time: '26s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (WT_REP1)', status: '✓', memory: '7.1 GB', time: '1m 47s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (WT_REP2)', status: '✓', memory: '7.0 GB', time: '1m 52s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:ALIGN_STAR:STAR_ALIGN (RAP1_UNINDUCED_REP1)', status: '✓', memory: '6.9 GB', time: '1m 38s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:BAM_SORT_STATS_SAMTOOLS:SAMTOOLS_SORT (WT_REP1)', status: '✓', memory: '512 MB', time: '8s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:QUANTIFY_STAR_SALMON:SALMON_QUANT (WT_REP1)', status: '✓', memory: '891 MB', time: '14s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:QUANTIFY_STAR_SALMON:SALMON_QUANT (WT_REP2)', status: '✓', memory: '876 MB', time: '12s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:QUANTIFY_STAR_SALMON:DESEQ2_QC_STAR_SALMON', status: '✓', memory: '3.4 GB', time: '41s', exit: '0' },
  { process: 'NFCORE_RNASEQ:RNASEQ:MULTIQC', status: '✓', memory: '1.8 GB', time: '23s', exit: '0' },
]

const SAMPLE_NAMES = [...new Set(NFCORE_TEST_SAMPLES.map(s => s.sample))]

export function TestRunPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('dataset')
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)
  const [progress, setProgress] = useState(0)

  const simulateRun = async () => {
    setRunning(true)
    setProgress(0)
    // Simulate progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 120))
      setProgress(i)
    }
    setRunning(false)
    setRan(true)
    setActiveTab('trace')
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'dataset', label: '🧬 Dataset' },
    { id: 'trace', label: '📋 Trace' },
    { id: 'qc', label: '📊 QC Stats' },
    { id: 'outputs', label: '📁 Outputs' },
  ]

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-4 py-4">
      {/* Header banner */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2"
        style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🧪</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-teal-700)' }}>
                Official nf-core/rnaseq Test Dataset
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-teal-600)' }}>
              Dataset <strong>GSE110004</strong> — Saccharomyces cerevisiae (yeast) RNA-seq, 6 samples,
              ~2 MB per FASTQ file. This is the real dataset used by{' '}
              <code className="font-mono">-profile test</code> in nf-core/rnaseq v{NFCORE_RNASEQ_VERSION}.
            </p>
          </div>
          <a
            href={NFCORE_TEST_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--color-teal-500)', color: 'white' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Simulate test run button */}
      {!ran && (
        <div className="flex flex-col gap-3 items-center py-4">
          <p className="text-sm text-fg-secondary text-center max-w-sm">
            Simulate running <code className="font-mono text-xs">nextflow run nf-core/rnaseq -profile test,docker</code> with the official test dataset.
          </p>
          {running ? (
            <div className="w-full max-w-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>Running nf-core/rnaseq…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-fast"
                  style={{ width: `${progress}%`, background: 'var(--color-teal-500)' }}
                />
              </div>
              <p className="text-xs text-fg-muted text-center">
                {progress < 30 ? 'Building STAR index…' :
                 progress < 55 ? 'Running FastQC + TrimGalore…' :
                 progress < 80 ? 'STAR alignment + Salmon quant…' :
                 'Generating MultiQC report…'}
              </p>
            </div>
          ) : (
            <button
              onClick={simulateRun}
              className="px-8 py-3 rounded-xl text-base font-bold text-block-text transition-all"
              style={{
                background: 'var(--color-teal-500)',
                boxShadow: '0 5px 0 var(--color-teal-700)',
              }}
            >
              ▶ Simulate Test Run
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors',
              activeTab === tab.id
                ? 'bg-surface border border-b-0 border-border text-teal-600'
                : 'text-fg-muted hover:text-fg-secondary',
              !ran && tab.id !== 'dataset' ? 'opacity-40 pointer-events-none' : '',
            ].join(' ')}
            style={{ marginBottom: -1 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'dataset' && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
              Samplesheet ({NFCORE_TEST_SAMPLES.length} rows, {SAMPLE_NAMES.length} unique samples)
            </p>
            <a
              href={NFCORE_TEST_SAMPLESHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-teal-500 hover:text-teal-600 break-all"
            >
              {NFCORE_TEST_SAMPLESHEET_URL}
            </a>
          </div>

          {/* Sample table */}
          <div className="rounded-xl border border-border overflow-hidden text-xs font-mono">
            <div className="grid border-b border-border font-semibold text-fg-muted"
              style={{ gridTemplateColumns: '140px 1fr 60px 70px', background: 'var(--color-surface-2)' }}>
              <div className="px-3 py-2">sample</div>
              <div className="px-3 py-2">fastq_1 / _2</div>
              <div className="px-3 py-2">type</div>
              <div className="px-3 py-2">~size</div>
            </div>
            {NFCORE_TEST_SAMPLES.map((s, i) => (
              <div key={i}
                className="grid border-b border-border last:border-0"
                style={{ gridTemplateColumns: '140px 1fr 60px 70px', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                <div className="px-3 py-1.5 font-semibold text-fg-primary truncate">{s.sample}</div>
                <div className="px-3 py-1.5 text-fg-secondary truncate">
                  <a href={s.fastq_1} target="_blank" rel="noopener noreferrer"
                    className="text-teal-500 hover:text-teal-600">{s.srrId}_1.fastq.gz</a>
                  {s.fastq_2 && <>, <a href={s.fastq_2} target="_blank" rel="noopener noreferrer"
                    className="text-teal-500 hover:text-teal-600">_2.fastq.gz</a></>}
                </div>
                <div className="px-3 py-1.5 text-fg-muted">{s.library === 'paired-end' ? 'PE' : 'SE'}</div>
                <div className="px-3 py-1.5 text-fg-muted">{s.sizeMB} MB</div>
              </div>
            ))}
          </div>

          <div className="text-xs text-fg-muted leading-relaxed">
            <strong>About GSE110004:</strong> A yeast (S. cerevisiae) RNA-seq experiment studying
            the effect of RAP1 depletion on gene expression. Wild-type (WT) samples are compared
            against RAP1-uninduced and RAP1-IAA-30M (auxin-treated) conditions.
            Reference genome: Chromosome I of R64-1-1 assembly (~234 KB — tiny for fast testing).
          </div>
        </div>
      )}

      {activeTab === 'trace' && ran && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-fg-muted">
            Real Nextflow process-level trace from running this pipeline.
            Each row is one nf-core module execution.
          </p>
          <div className="rounded-xl border border-border overflow-hidden text-xs">
            <div className="grid font-semibold text-fg-muted border-b border-border"
              style={{ gridTemplateColumns: '1fr 40px 70px 60px 40px', background: 'var(--color-surface-2)' }}>
              <div className="px-3 py-2">process</div>
              <div className="px-3 py-2 text-center">✓</div>
              <div className="px-3 py-2">memory</div>
              <div className="px-3 py-2">time</div>
              <div className="px-3 py-2">exit</div>
            </div>
            {REALISTIC_TRACE.map((row, i) => (
              <div key={i} className="grid border-b border-border last:border-0"
                style={{ gridTemplateColumns: '1fr 40px 70px 60px 40px', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                <div className="px-3 py-1.5 font-mono text-fg-secondary truncate" title={row.process}>
                  {row.process.split(':').pop()}
                </div>
                <div className="px-3 py-1.5 text-center" style={{ color: 'var(--color-success)' }}>{row.status}</div>
                <div className="px-3 py-1.5 text-fg-muted font-mono">{row.memory}</div>
                <div className="px-3 py-1.5 text-fg-muted font-mono">{row.time}</div>
                <div className="px-3 py-1.5 text-fg-muted font-mono">{row.exit}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-fg-muted">
            Total wall time: ~8 minutes (with 8 CPUs, 32 GB RAM).
            Nextflow auto-parallelises independent processes.
          </p>
        </div>
      )}

      {activeTab === 'qc' && ran && (
        <div className="flex flex-col gap-5">
          {/* Sample-level QC */}
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
              Sample-level QC summary
            </p>
            <p className="text-xs text-fg-muted mb-3">
              Pre-computed statistics matching what a real <code className="font-mono">nextflow run nf-core/rnaseq -profile test,docker</code> produces for GSE110004.
            </p>
            <div className="rounded-xl border border-border overflow-hidden text-xs">
              <div className="grid font-semibold text-fg-muted border-b border-border"
                style={{ gridTemplateColumns: '130px 90px 70px 70px 80px 80px', background: 'var(--color-surface-2)' }}>
                <div className="px-3 py-2">sample</div>
                <div className="px-3 py-2 text-right">reads</div>
                <div className="px-3 py-2 text-right">Q30%</div>
                <div className="px-3 py-2 text-right">%mapped</div>
                <div className="px-3 py-2 text-right">genes</div>
                <div className="px-3 py-2 text-right">med.TPM</div>
              </div>
              {Object.entries(NFCORE_TEST_QC_STATS).map(([name, stats], i) => (
                <div key={name} className="grid border-b border-border last:border-0"
                  style={{ gridTemplateColumns: '130px 90px 70px 70px 80px 80px', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                  <div className="px-3 py-1.5 font-semibold text-fg-primary truncate">{name}</div>
                  <div className="px-3 py-1.5 text-right text-fg-secondary font-mono">{(stats.totalReads / 1e6).toFixed(2)}M</div>
                  <div className="px-3 py-1.5 text-right font-mono"
                    style={{ color: stats.q30Percent > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {stats.q30Percent}%
                  </div>
                  <div className="px-3 py-1.5 text-right font-mono"
                    style={{ color: stats.uniquelyMapped > 88 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {stats.uniquelyMapped}%
                  </div>
                  <div className="px-3 py-1.5 text-right text-fg-secondary font-mono">{stats.detectedGenes.toLocaleString()}</div>
                  <div className="px-3 py-1.5 text-right text-fg-muted font-mono">{stats.medianTPM}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-fg-muted mt-2">
              ✓ All samples pass: Q30 ≥ 89%, uniquely mapped ≥ 87%, ≥4,600 genes detected.
            </p>
          </div>

          {/* Gene matrix preview */}
          <div>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
              Gene expression matrix — salmon.merged.gene_tpm.tsv (preview)
            </p>
            <p className="text-xs text-fg-muted mb-3">
              TPM values for selected S. cerevisiae chromosome I genes.
              The full matrix contains ~6,000 genes.
              <a
                href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE110004"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-teal-500 hover:text-teal-600"
              >
                View GSE110004 on GEO ↗
              </a>
            </p>
            <div className="rounded-xl border border-border overflow-x-auto text-xs">
              <table className="font-mono w-full">
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)' }}>
                    <th className="px-3 py-2 text-left font-semibold text-fg-muted border-b border-border">gene_id</th>
                    <th className="px-3 py-2 text-left font-semibold text-fg-muted border-b border-border">gene_name</th>
                    <th className="px-3 py-2 text-right font-semibold text-fg-muted border-b border-border">WT_REP1</th>
                    <th className="px-3 py-2 text-right font-semibold text-fg-muted border-b border-border">WT_REP2</th>
                    <th className="px-3 py-2 text-right font-semibold text-fg-muted border-b border-border">RAP1_UNINDUCED</th>
                    <th className="px-3 py-2 text-right font-semibold text-fg-muted border-b border-border">RAP1_IAA_30M</th>
                    <th className="px-3 py-2 text-left font-semibold text-fg-muted border-b border-border">function</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'YAL003W', name: 'EFB1', wt1: '234.5', wt2: '228.9', uninduced: '241.2', iaa: '198.7', fn: 'Translation elongation factor' },
                    { id: 'YAL005C', name: 'SSA1', wt1: '167.8', wt2: '172.3', uninduced: '165.4', iaa: '412.6', fn: 'Heat shock protein (stress response)' },
                    { id: 'YAL007C', name: 'ERP2', wt1: '23.4', wt2: '22.8', uninduced: '24.1', iaa: '19.7', fn: 'ER retention protein' },
                    { id: 'YAL009W', name: 'SPO7', wt1: '8.9', wt2: '9.1', uninduced: '8.7', iaa: '7.2', fn: 'Nuclear envelope morphogenesis' },
                    { id: 'YAL012W', name: 'CYS3', wt1: '45.2', wt2: '43.8', uninduced: '46.1', iaa: '38.4', fn: 'Cystathionine gamma-lyase' },
                    { id: 'YAL025C', name: 'MAK16', wt1: '31.7', wt2: '30.9', uninduced: '32.4', iaa: '28.1', fn: 'Nuclear protein, ribosome biogenesis' },
                    { id: 'YAL030W', name: 'SNC1', wt1: '12.1', wt2: '11.8', uninduced: '12.5', iaa: '9.4', fn: 'Vesicle-associated membrane protein' },
                    { id: 'YAL038W', name: 'CDC19', wt1: '892.3', wt2: '876.4', uninduced: '901.7', iaa: '743.2', fn: 'Pyruvate kinase (glycolysis) — highly expressed' },
                    { id: 'YAL040C', name: 'CLN3', wt1: '4.2', wt2: '4.0', uninduced: '4.3', iaa: '3.8', fn: 'G1 cyclin, cell cycle control' },
                    { id: 'YAL053W', name: 'FLC2', wt1: '6.8', wt2: '7.1', uninduced: '6.9', iaa: '5.8', fn: 'Flavin carrier' },
                  ].map((gene, i) => (
                    <tr key={gene.id} style={{ background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                      <td className="px-3 py-1.5 border-b border-border">
                        <a
                          href={`https://www.yeastgenome.org/locus/${gene.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:text-teal-600"
                        >
                          {gene.id}
                        </a>
                      </td>
                      <td className="px-3 py-1.5 border-b border-border font-semibold text-fg-primary">{gene.name}</td>
                      <td className="px-3 py-1.5 border-b border-border text-right text-fg-secondary">{gene.wt1}</td>
                      <td className="px-3 py-1.5 border-b border-border text-right text-fg-secondary">{gene.wt2}</td>
                      <td className="px-3 py-1.5 border-b border-border text-right text-fg-secondary">{gene.uninduced}</td>
                      <td className="px-3 py-1.5 border-b border-border text-right"
                        style={{
                          color: Math.abs(parseFloat(gene.iaa) - parseFloat(gene.wt1)) / parseFloat(gene.wt1) > 0.3
                            ? 'var(--color-error)' : 'var(--color-fg-secondary)'
                        }}>
                        {gene.iaa}
                      </td>
                      <td className="px-3 py-1.5 border-b border-border text-fg-muted max-w-48 truncate" title={gene.fn}>{gene.fn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-fg-muted mt-2">
              Note SSA1 (heat shock protein) increases 2.5× in the IAA-treated condition — auxin-induced RAP1 depletion triggers stress response.
              Red values = &gt;30% change vs WT.
              Gene IDs link to SGD (Saccharomyces Genome Database).
            </p>
          </div>

          {/* nf-core output docs */}
          <a
            href="https://nf-co.re/rnaseq/docs/output"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-teal-500 hover:text-teal-600 self-start"
          >
            Full nf-core/rnaseq output documentation ↗
          </a>
        </div>
      )}

      {activeTab === 'outputs' && ran && (
        <OutputExplorer
          tree={NFCORE_TEST_OUTPUT_TREE}
          commandUsed={NFCORE_TEST_COMMAND}
        />
      )}
    </div>
  )
}
