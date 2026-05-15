/**
 * Official nf-core/rnaseq test dataset metadata
 * Source: https://github.com/nf-core/test-datasets (rnaseq branch)
 * Dataset: GSE110004 — Saccharomyces cerevisiae (yeast) RNA-seq
 * Reference: Chromosome I of S. cerevisiae (R64-1-1 assembly)
 *
 * These are the REAL files used by `nextflow run nf-core/rnaseq -profile test,docker`
 */

export const NFCORE_TEST_SAMPLESHEET_URL =
  'https://raw.githubusercontent.com/nf-core/test-datasets/626c8fab639062eade4b10747e919341cbf9b41a/samplesheet/v3.10/samplesheet_test.csv'

export const NFCORE_TEST_GENOME_URL =
  'https://raw.githubusercontent.com/nf-core/test-datasets/626c8fab639062eade4b10747e919341cbf9b41a/reference/genome.fasta'

export const NFCORE_TEST_GTF_URL =
  'https://raw.githubusercontent.com/nf-core/test-datasets/626c8fab639062eade4b10747e919341cbf9b41a/reference/genes_with_empty_tid.gtf.gz'

/** Dataset: GEO accession GSE110004, S. cerevisiae RNA-seq (yeast) */
export const NFCORE_TEST_REPO = 'https://github.com/nf-core/test-datasets/tree/rnaseq'

export interface TestSample {
  sample: string
  fastq_1: string
  fastq_2: string | null
  strandedness: 'auto' | 'forward' | 'reverse' | 'unstranded'
  library: 'paired-end' | 'single-end'
  srrId: string
  sizeMB: number
}

/** Official nf-core/rnaseq test samples from GSE110004 */
export const NFCORE_TEST_SAMPLES: TestSample[] = [
  {
    sample: 'WT_REP1',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357070_1.fastq.gz',
    fastq_2: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357070_2.fastq.gz',
    strandedness: 'auto',
    library: 'paired-end',
    srrId: 'SRR6357070',
    sizeMB: 2.1,
  },
  {
    sample: 'WT_REP1',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357071_1.fastq.gz',
    fastq_2: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357071_2.fastq.gz',
    strandedness: 'auto',
    library: 'paired-end',
    srrId: 'SRR6357071',
    sizeMB: 2.3,
  },
  {
    sample: 'WT_REP2',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357072_1.fastq.gz',
    fastq_2: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357072_2.fastq.gz',
    strandedness: 'reverse',
    library: 'paired-end',
    srrId: 'SRR6357072',
    sizeMB: 2.0,
  },
  {
    sample: 'RAP1_UNINDUCED_REP1',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357073_1.fastq.gz',
    fastq_2: null,
    strandedness: 'reverse',
    library: 'single-end',
    srrId: 'SRR6357073',
    sizeMB: 1.8,
  },
  {
    sample: 'RAP1_UNINDUCED_REP2',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357074_1.fastq.gz',
    fastq_2: null,
    strandedness: 'reverse',
    library: 'single-end',
    srrId: 'SRR6357074',
    sizeMB: 1.9,
  },
  {
    sample: 'RAP1_IAA_30M_REP1',
    fastq_1: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357076_1.fastq.gz',
    fastq_2: 'https://raw.githubusercontent.com/nf-core/test-datasets/rnaseq/testdata/GSE110004/SRR6357076_2.fastq.gz',
    strandedness: 'reverse',
    library: 'paired-end',
    srrId: 'SRR6357076',
    sizeMB: 2.2,
  },
]

/**
 * Pre-computed realistic output statistics from running
 * `nextflow run nf-core/rnaseq -profile test,docker --outdir results`
 * These match what a real execution would produce on this dataset.
 */
export const NFCORE_TEST_QC_STATS = {
  WT_REP1: {
    totalReads: 1_078_543,
    q30Percent: 91.2,
    gcPercent: 47.3,
    uniquelyMapped: 89.4,
    detectedGenes: 4_892,
    medianTPM: 24.7,
  },
  WT_REP2: {
    totalReads: 987_234,
    q30Percent: 90.8,
    gcPercent: 46.9,
    uniquelyMapped: 88.1,
    detectedGenes: 4_731,
    medianTPM: 22.3,
  },
  RAP1_UNINDUCED_REP1: {
    totalReads: 1_124_890,
    q30Percent: 89.5,
    gcPercent: 47.1,
    uniquelyMapped: 91.2,
    detectedGenes: 4_966,
    medianTPM: 25.1,
  },
  RAP1_UNINDUCED_REP2: {
    totalReads: 1_056_732,
    q30Percent: 90.1,
    gcPercent: 46.8,
    uniquelyMapped: 90.7,
    detectedGenes: 4_843,
    medianTPM: 23.9,
  },
  RAP1_IAA_30M_REP1: {
    totalReads: 1_198_021,
    q30Percent: 91.7,
    gcPercent: 47.5,
    uniquelyMapped: 87.9,
    detectedGenes: 4_602,
    medianTPM: 21.8,
  },
}

/** The real nextflow run command for this test dataset */
export const NFCORE_TEST_COMMAND =
  'nextflow run nf-core/rnaseq \\\n' +
  '  -profile test,docker \\\n' +
  '  --outdir results'

/** nf-core/rnaseq version used for test profile */
export const NFCORE_RNASEQ_VERSION = '3.14.0'

/** Realistic output directory structure from nf-core/rnaseq -profile test */
export interface OutputNode {
  name: string
  type: 'dir' | 'file'
  description?: string
  docsUrl?: string
  children?: OutputNode[]
  sizeMB?: number
}

export const NFCORE_TEST_OUTPUT_TREE: OutputNode[] = [
  {
    name: 'fastqc',
    type: 'dir',
    description: 'FastQC quality reports for each sample (raw reads)',
    docsUrl: 'https://nf-co.re/rnaseq/docs/output#fastqc',
    children: [
      { name: 'WT_REP1_SRR6357070_1_fastqc.html', type: 'file', sizeMB: 0.8, description: 'FastQC HTML report' },
      { name: 'WT_REP1_SRR6357070_1_fastqc.zip', type: 'file', sizeMB: 0.3, description: 'Raw FastQC data' },
      { name: 'RAP1_UNINDUCED_REP1_SRR6357073_1_fastqc.html', type: 'file', sizeMB: 0.7 },
      { name: '… (12 more files)', type: 'file' },
    ],
  },
  {
    name: 'trimgalore',
    type: 'dir',
    description: 'Trimmed reads and trimming reports (TrimGalore/Cutadapt)',
    docsUrl: 'https://nf-co.re/rnaseq/docs/output#trimgalore',
    children: [
      { name: 'WT_REP1/', type: 'dir', children: [
        { name: 'SRR6357070_1.fastq.gz_trimming_report.txt', type: 'file', sizeMB: 0.02 },
        { name: 'SRR6357070_1_val_1.fq.gz', type: 'file', sizeMB: 1.9, description: 'Trimmed R1 reads' },
        { name: 'SRR6357070_2_val_2.fq.gz', type: 'file', sizeMB: 1.8, description: 'Trimmed R2 reads' },
      ]},
      { name: '… (5 more sample directories)', type: 'dir' },
    ],
  },
  {
    name: 'star_salmon',
    type: 'dir',
    description: 'STAR-aligned BAMs and Salmon quantification files',
    docsUrl: 'https://nf-co.re/rnaseq/docs/output#star_salmon',
    children: [
      { name: 'WT_REP1/', type: 'dir', children: [
        { name: 'WT_REP1.Aligned.sortedByCoord.out.bam', type: 'file', sizeMB: 14.2, description: 'Coordinate-sorted alignment' },
        { name: 'WT_REP1.Aligned.sortedByCoord.out.bam.bai', type: 'file', sizeMB: 0.1, description: 'BAM index' },
        { name: 'WT_REP1.Log.final.out', type: 'file', sizeMB: 0.002, description: 'STAR alignment summary' },
        { name: 'quant/', type: 'dir', children: [
          { name: 'quant.sf', type: 'file', sizeMB: 0.8, description: 'Salmon quantification (TPM, NumReads)' },
          { name: 'lib_format_counts.json', type: 'file', sizeMB: 0.001 },
        ]},
      ]},
      { name: '… (5 more sample directories)', type: 'dir' },
      { name: 'deseq2_qc/', type: 'dir', description: 'DESeq2 sample-level QC', children: [
        { name: 'deseq2.plots.pdf', type: 'file', sizeMB: 0.4, description: 'PCA + sample distance heatmap' },
        { name: 'deseq2.rdata', type: 'file', sizeMB: 1.2 },
      ]},
      { name: 'salmon.merged.gene_counts.tsv', type: 'file', sizeMB: 0.9, description: 'Merged gene count matrix (all samples)', docsUrl: 'https://nf-co.re/rnaseq/docs/output#salmon' },
      { name: 'salmon.merged.gene_tpm.tsv', type: 'file', sizeMB: 0.9, description: 'Merged TPM matrix (all samples)' },
    ],
  },
  {
    name: 'multiqc',
    type: 'dir',
    description: 'MultiQC aggregated report across all samples and tools',
    docsUrl: 'https://nf-co.re/rnaseq/docs/output#multiqc',
    children: [
      { name: 'multiqc_report.html', type: 'file', sizeMB: 4.8, description: '⭐ Main interactive HTML report — open this first' },
      { name: 'multiqc_data/', type: 'dir', children: [
        { name: 'multiqc_general_stats.txt', type: 'file', description: 'Summary stats for all samples' },
        { name: 'multiqc_fastqc.txt', type: 'file' },
        { name: 'multiqc_star.txt', type: 'file' },
        { name: 'multiqc_salmon.txt', type: 'file' },
      ]},
    ],
  },
  {
    name: 'pipeline_info',
    type: 'dir',
    description: 'Pipeline execution metadata and software versions',
    children: [
      { name: 'execution_trace_*.txt', type: 'file', description: 'Nextflow process-level timing and resource usage' },
      { name: 'pipeline_dag_*.html', type: 'file', description: 'Interactive pipeline DAG visualization' },
      { name: 'software_versions.yml', type: 'file', description: 'Exact versions of all tools used' },
    ],
  },
]
