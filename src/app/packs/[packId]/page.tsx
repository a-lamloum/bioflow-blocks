'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PACKS, BLOCK_DEFINITIONS, ALL_BLOCK_TYPES } from '@/lib/blocks/definitions'
import { MISSIONS, MISSION_BADGES } from '@/lib/mission/missions'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AuthButton } from '@/components/auth/AuthButton'
import type { PackId } from '@/types'

// ─── Rich pipeline info per pack ─────────────────────────────────────────────

interface PipelineInfo {
  tagline: string
  whatItDoes: string
  whoUsesIt: string
  keySteps: { icon: string; name: string; desc: string }[]
  testCommand: string
  docsUrl: string
  githubUrl: string
  paperUrl?: string
  organism?: string
  citationCount?: string
}

const PIPELINE_INFO: Partial<Record<PackId, PipelineInfo>> = {
  rnaseq_qc: {
    tagline: 'Quality control and quantification for RNA sequencing data',
    whatItDoes:
      'nf-core/rnaseq takes raw FASTQ files through FastQC, TrimGalore, STAR alignment, ' +
      'Salmon quantification, and MultiQC reporting — producing a ready-to-use gene expression matrix.',
    whoUsesIt: 'Researchers studying gene expression changes between conditions: disease vs healthy, treated vs untreated, time courses.',
    keySteps: [
      { icon: '📋', name: 'Samplesheet', desc: 'CSV listing sample names, FASTQ paths, strandedness' },
      { icon: '🔬', name: 'FastQC + TrimGalore', desc: 'Read quality check and adapter trimming' },
      { icon: '🎯', name: 'STAR alignment', desc: 'Splice-aware alignment to reference genome' },
      { icon: '🔢', name: 'Salmon quant', desc: 'Gene-level TPM and count quantification' },
      { icon: '📊', name: 'MultiQC report', desc: 'Aggregated QC summary across all samples' },
    ],
    testCommand: 'nextflow run nf-core/rnaseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/rnaseq',
    githubUrl: 'https://github.com/nf-core/rnaseq',
    paperUrl: 'https://doi.org/10.5281/zenodo.1400710',
    organism: 'Any organism with a reference genome',
    citationCount: '3,400+',
  },
  fastq_basics: {
    tagline: 'Foundation concepts for working with sequencing data in nf-core',
    whatItDoes:
      'Covers the sequencing file formats, paired-end library concepts, samplesheet conventions, ' +
      'adapter contamination, and QC metrics that underpin every nf-core pipeline.',
    whoUsesIt: 'Anyone starting their nf-core journey — students, wet-lab researchers, and anyone preparing their first samplesheet.',
    keySteps: [
      { icon: '🧬', name: 'FASTQ format', desc: 'What sequencing reads look like — quality scores, headers' },
      { icon: '🔗', name: 'Paired-end reads', desc: 'R1 + R2 file pairs and why they matter' },
      { icon: '📋', name: 'nf-core samplesheet', desc: 'The CSV format required by all nf-core pipelines' },
      { icon: '🔎', name: 'Adapter detection', desc: 'How FastQC and TrimGalore identify adapter contamination' },
      { icon: '📏', name: 'Read length QC', desc: 'Expected vs actual read lengths and what changes mean' },
    ],
    testCommand: 'nextflow run nf-core/rnaseq -profile test,docker --input samplesheet.csv',
    docsUrl: 'https://nf-co.re/docs/running/run-pipelines',
    githubUrl: 'https://github.com/nf-core',
    organism: 'All organisms',
  },
  rnaseq_full: {
    tagline: 'Complete RNA-seq workflow: alignment, quantification, and differential expression',
    whatItDoes:
      'The full nf-core/rnaseq pipeline extends QC to include STAR/HISAT2 alignment, ' +
      'Salmon quantification, and feeds into nf-core/differentialabundance for DESeq2 analysis.',
    whoUsesIt: 'Researchers performing differential expression analysis comparing two or more biological conditions.',
    keySteps: [
      { icon: '📚', name: 'Genome indexing', desc: 'STAR_GENOMEGENERATE or HISAT2_BUILD module' },
      { icon: '🎯', name: 'Read alignment', desc: 'STAR_ALIGN — splice-aware, outputs sorted BAMs' },
      { icon: '🗂️', name: 'BAM processing', desc: 'SAMTOOLS_SORT + SAMTOOLS_INDEX' },
      { icon: '🔢', name: 'Feature counting', desc: 'SALMON_QUANT or SUBREAD_FEATURECOUNTS' },
      { icon: '📈', name: 'DESeq2', desc: 'DESEQ2_DIFFERENTIAL via nf-core/differentialabundance' },
    ],
    testCommand: 'nextflow run nf-core/rnaseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/rnaseq',
    githubUrl: 'https://github.com/nf-core/rnaseq',
    paperUrl: 'https://doi.org/10.5281/zenodo.1400710',
    organism: 'Human, mouse, or any organism with a genome + annotation',
    citationCount: '3,400+',
  },
  variant_calling: {
    tagline: 'GATK best-practices germline variant calling pipeline',
    whatItDoes:
      'nf-core/sarek implements the GATK best-practices pipeline for germline SNP and INDEL calling: ' +
      'BWA-MEM2 alignment, GATK MarkDuplicates, BQSR, HaplotypeCaller, joint genotyping, VQSR filtering, and VEP annotation.',
    whoUsesIt:
      'Clinical and population genomics researchers identifying disease-causing variants, ' +
      'comparing germline variants between individuals or cohorts.',
    keySteps: [
      { icon: '🔍', name: 'BWAMEM2_MEM', desc: 'Fast DNA alignment to reference genome' },
      { icon: '👥', name: 'GATK4_MARKDUPLICATES', desc: 'PCR duplicate flagging' },
      { icon: '🎚️', name: 'GATK4_BASERECALIBRATOR', desc: 'Base quality score recalibration (BQSR)' },
      { icon: '🧫', name: 'GATK4_HAPLOTYPECALLER', desc: 'SNP + INDEL calling in GVCF mode' },
      { icon: '🏷️', name: 'ENSEMBLVEP_VEP', desc: 'Variant annotation with gene names + consequences' },
    ],
    testCommand: 'nextflow run nf-core/sarek -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/sarek',
    githubUrl: 'https://github.com/nf-core/sarek',
    paperUrl: 'https://doi.org/10.12688/f1000research.11523.1',
    organism: 'Human (GRCh38 / GRCh37), any organism with known variants',
    citationCount: '900+',
  },
  metagenomics: {
    tagline: 'Taxonomic classification and functional profiling of shotgun metagenomics',
    whatItDoes:
      'nf-core/taxprofiler profiles microbial communities from shotgun metagenomics data using ' +
      'multiple classifiers (Kraken2, MetaPhlAn, Bracken) in parallel, with host removal and Krona visualisation.',
    whoUsesIt:
      'Microbiome researchers studying environmental samples, clinical gut microbiome studies, ' +
      'infectious disease epidemiology, and environmental surveillance.',
    keySteps: [
      { icon: '🧹', name: 'BOWTIE2_ALIGN', desc: 'Host read removal (human, plant, etc.)' },
      { icon: '🧫', name: 'KRAKEN2_KRAKEN2', desc: 'k-mer based taxonomic classification' },
      { icon: '📉', name: 'BRACKEN_BRACKEN', desc: 'Bayesian abundance re-estimation' },
      { icon: '🦠', name: 'METAPHLAN_METAPHLAN', desc: 'Marker-gene species profiling' },
      { icon: '☀️', name: 'KRONA_KTIMPORTTAXONOMY', desc: 'Interactive taxonomy sunburst chart' },
    ],
    testCommand: 'nextflow run nf-core/taxprofiler -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/taxprofiler',
    githubUrl: 'https://github.com/nf-core/taxprofiler',
    organism: 'Environmental, clinical, or any metagenomic sample',
    citationCount: '400+',
  },
  single_cell: {
    tagline: 'Single-cell RNA-seq processing: demultiplexing, QC, clustering, and annotation',
    whatItDoes:
      'nf-core/scrnaseq aligns and quantifies single-cell RNA sequencing data using multiple aligners ' +
      '(Cell Ranger, STARsolo, Alevin), then performs Seurat QC, normalisation, UMAP, clustering, and marker gene identification.',
    whoUsesIt:
      'Researchers studying cell type heterogeneity, developmental trajectories, disease-specific cell states, ' +
      'or immune cell profiling.',
    keySteps: [
      { icon: '🔬', name: 'CELLRANGER_COUNT', desc: 'Cell barcode demultiplexing + alignment' },
      { icon: '🧹', name: 'SCQC subworkflow', desc: 'Empty droplet removal, doublet filtering' },
      { icon: '⚖️', name: 'SEURAT_NORMALIZE', desc: 'Library size normalisation or SCTransform' },
      { icon: '🗺️', name: 'SEURAT_DIM_REDUCTION', desc: 'PCA → UMAP dimensionality reduction' },
      { icon: '🎯', name: 'SEURAT_MARKERS', desc: 'Cluster marker gene identification' },
    ],
    testCommand: 'nextflow run nf-core/scrnaseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/scrnaseq',
    githubUrl: 'https://github.com/nf-core/scrnaseq',
    organism: 'Human, mouse, or any organism with a single-cell transcriptome',
    citationCount: '500+',
  },
  nfcore_tools: {
    tagline: 'Create, lint, and contribute nf-core modules and pipelines',
    whatItDoes:
      'nf-core/tools is the CLI that powers the nf-core ecosystem: scaffold new modules with ' +
      '`nf-core modules create`, validate pipelines with `nf-core lint`, and contribute to the community.',
    whoUsesIt: 'Bioinformaticians who want to contribute new tools to nf-core, maintain pipelines, or follow nf-core best practices.',
    keySteps: [
      { icon: '🌊', name: 'Channel.fromSamplesheet()', desc: 'Typed channel creation from CSV' },
      { icon: '📦', name: 'Subworkflows', desc: 'Reusable groups: BAM_SORT_STATS_SAMTOOLS etc.' },
      { icon: '🔨', name: 'nf-core modules create', desc: 'Scaffold a new nf-core module' },
      { icon: '✅', name: 'nf-core lint', desc: 'Validate pipeline against nf-core standards' },
      { icon: '📦', name: 'nf-core/test-datasets', desc: 'Tiny CI test files for every module' },
    ],
    testCommand: 'nf-core lint  # in your pipeline directory',
    docsUrl: 'https://nf-co.re/docs/nf-core-tools',
    githubUrl: 'https://github.com/nf-core/tools',
  },
  // Phase 8 packs
  chipseq: {
    tagline: 'ChIP-seq and ATAC-seq analysis with MACS3 peak calling',
    whatItDoes: 'nf-core/chipseq aligns reads with BWA-MEM2, calls peaks with MACS3, annotates peaks with HOMER, and reports FRiP and NSC/RSC ChIP-seq QC metrics.',
    whoUsesIt: 'Researchers studying transcription factor binding sites, histone modifications, chromatin accessibility (ATAC-seq), or open chromatin regions.',
    keySteps: [
      { icon: '📋', name: 'Samplesheet + controls', desc: 'Links each IP to its matched input/IgG control' },
      { icon: '🔍', name: 'BWAMEM2_MEM', desc: 'DNA alignment — not splice-aware unlike STAR' },
      { icon: '👥', name: 'PICARD_MARKDUPLICATES', desc: 'PCR duplicate removal — critical for ChIP-seq' },
      { icon: '📊', name: 'MACS3_CALLPEAK', desc: 'Peak calling vs input control' },
      { icon: '🏷️', name: 'HOMER_ANNOTATEPEAKS', desc: 'Nearest gene, TSS distance, genomic feature' },
    ],
    testCommand: 'nextflow run nf-core/chipseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/chipseq',
    githubUrl: 'https://github.com/nf-core/chipseq',
    organism: 'Human, mouse, or any organism with a reference genome',
    citationCount: '600+',
  },
  fetchngs: {
    tagline: 'Download raw sequencing data from SRA, ENA, DDBJ, and GEO',
    whatItDoes: 'nf-core/fetchngs takes a list of SRA/ENA/GEO accessions, downloads the associated FASTQ files, and automatically generates a ready-to-use nf-core samplesheet.',
    whoUsesIt: 'Anyone wanting to reproduce published analyses, download public datasets for meta-analysis, or start a new project from publicly available data.',
    keySteps: [
      { icon: '🔑', name: 'Accession IDs input', desc: 'SRR, SRX, SRS, SRP, GSE accessions accepted' },
      { icon: '⬇️', name: 'SRATOOLS_FASTERQDUMP', desc: 'Download FASTQ from NCBI SRA or ENA' },
      { icon: '📋', name: 'SRA_TO_SAMPLESHEET', desc: 'Auto-generate nf-core samplesheet from downloads' },
      { icon: '📊', name: 'Metadata summary', desc: 'Organism, library strategy, instrument, read length' },
    ],
    testCommand: 'nextflow run nf-core/fetchngs -profile test,docker --input ids.csv --outdir results',
    docsUrl: 'https://nf-co.re/fetchngs',
    githubUrl: 'https://github.com/nf-core/fetchngs',
    organism: 'Any public dataset on SRA, ENA, DDBJ, or GEO',
    citationCount: '400+',
  },
  ampliseq: {
    tagline: '16S, 18S, ITS, and CO1 amplicon sequencing community profiling',
    whatItDoes: 'nf-core/ampliseq processes amplicon sequencing data: primer removal with CUTADAPT, ASV inference with DADA2, taxonomic classification with SILVA/GTDB/UNITE, and diversity analysis with QIIME2.',
    whoUsesIt: 'Microbiome researchers studying 16S rRNA (bacteria), ITS (fungi), 18S (protists), or CO1 (metazoans) communities from environmental, clinical, or food samples.',
    keySteps: [
      { icon: '✂️', name: 'CUTADAPT', desc: 'Primer trimming — preserves variable region only' },
      { icon: '🧬', name: 'DADA2 denoising', desc: 'Error-corrected ASV inference (not OTUs)' },
      { icon: '🦠', name: 'DADA2_TAXONOMY / QIIME2', desc: 'SILVA 138, GTDB r214, or UNITE classification' },
      { icon: '🌈', name: 'QIIME2 diversity', desc: 'Alpha (Shannon, Simpson) + beta (Bray-Curtis, UniFrac)' },
    ],
    testCommand: 'nextflow run nf-core/ampliseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/ampliseq',
    githubUrl: 'https://github.com/nf-core/ampliseq',
    paperUrl: 'https://doi.org/10.3389/fmicb.2020.550420',
    organism: '16S (bacteria), ITS (fungi), 18S (protists), CO1 (metazoans)',
    citationCount: '700+',
  },
  methylseq: {
    tagline: 'Bisulfite sequencing methylation analysis with Bismark',
    whatItDoes: 'nf-core/methylseq aligns WGBS or RRBS reads with Bismark, extracts CpG methylation calls, and reports bisulfite conversion efficiency and M-bias statistics.',
    whoUsesIt: 'Epigenomics researchers studying DNA methylation patterns in cancer, development, aging, or environmental stress.',
    keySteps: [
      { icon: '✂️', name: 'TRIMGALORE', desc: 'Quality + adapter trimming (special RRBS mode available)' },
      { icon: '🎯', name: 'BISMARK_BISMARK', desc: 'Bisulfite-aware alignment (C→T conversion)' },
      { icon: '👥', name: 'PICARD_MARKDUPLICATES', desc: 'PCR duplicate removal' },
      { icon: '🧬', name: 'BISMARK_METHYLATIONEXTRACTOR', desc: 'Per-CpG methylation calls' },
    ],
    testCommand: 'nextflow run nf-core/methylseq -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/methylseq',
    githubUrl: 'https://github.com/nf-core/methylseq',
    organism: 'Human, mouse, plant, or any organism with known CpG sites',
    citationCount: '300+',
  },
  differentialabundance: {
    tagline: 'Standalone differential expression analysis from count matrices',
    whatItDoes: 'nf-core/differentialabundance takes count matrices from nf-core/rnaseq and runs DESeq2, producing volcano plots, heatmaps, PCA, pathway enrichment, and an interactive Shinyngs report.',
    whoUsesIt: 'Researchers who have already run nf-core/rnaseq and want to perform DE analysis, or anyone with a count matrix who wants a complete DE analysis pipeline.',
    keySteps: [
      { icon: '📊', name: 'Count matrix + metadata', desc: 'salmon.merged.gene_counts.tsv from nf-core/rnaseq' },
      { icon: '📈', name: 'DESEQ2_DIFFERENTIAL', desc: 'DESeq2 with apeglm fold-change shrinkage' },
      { icon: '🌋', name: 'CUSTOM_VOLCANOPLOT', desc: 'Interactive HTML volcano plot' },
      { icon: '🗺️', name: 'GPROFILER2_GOST', desc: 'GO, KEGG, Reactome pathway enrichment' },
    ],
    testCommand: 'nextflow run nf-core/differentialabundance -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/differentialabundance',
    githubUrl: 'https://github.com/nf-core/differentialabundance',
    organism: 'Any organism — works with any count matrix',
    citationCount: '200+',
  },
  spatialvi: {
    tagline: '10x Genomics Visium spatial transcriptomics analysis',
    whatItDoes: 'nf-core/spatialvi runs Space Ranger alignment, spatial QC, normalisation, clustering, and spatially variable gene detection — overlaying gene expression on tissue histology images.',
    whoUsesIt: 'Researchers studying spatial gene expression in tumours, brain tissue, embryonic development, or any tissue where spatial context matters.',
    keySteps: [
      { icon: '🗺️', name: 'SPACERANGER_COUNT', desc: 'Alignment to reference + tissue spot mapping' },
      { icon: '🧹', name: 'Spatial QC', desc: 'Spot filtering by gene/UMI count and mitochondrial %' },
      { icon: '🫧', name: 'Leiden clustering', desc: 'Spatially-aware cluster identification' },
      { icon: '🎨', name: 'SVG detection', desc: 'Spatially variable genes overlaid on histology' },
    ],
    testCommand: 'nextflow run nf-core/spatialvi -profile test,docker --outdir results',
    docsUrl: 'https://nf-co.re/spatialvi',
    githubUrl: 'https://github.com/nf-core/spatialvi',
    organism: 'Any tissue with 10x Genomics Visium library prep',
    citationCount: '100+',
  },
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function PackPage() {
  const params = useParams()
  const packId = params?.packId as PackId

  const pack = PACKS.find(p => p.id === packId)
  if (!pack) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-fg-primary mb-2">Pack not found</h1>
          <Link href="/packs" className="text-teal-500 hover:text-teal-600">← View all packs</Link>
        </div>
      </div>
    )
  }

  const info = PIPELINE_INFO[packId]
  const packBlocks = ALL_BLOCK_TYPES.filter(t => BLOCK_DEFINITIONS[t].pack === packId)
  const availableBlocks = packBlocks.filter(t => BLOCK_DEFINITIONS[t].status === 'available')
  const packMissions = MISSIONS.filter(m =>
    m.requiredBlockTypes.some(bt => BLOCK_DEFINITIONS[bt]?.pack === packId)
  )

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/bioflow-logo.svg" alt="" width={28} height={28} />
          <Link href="/" className="text-base font-bold text-fg-primary">BioFlow Blocks</Link>
          <span className="text-fg-muted">/</span>
          <Link href="/packs" className="text-sm text-fg-secondary hover:text-fg-primary transition-colors">Packs</Link>
          <span className="text-fg-muted">/</span>
          <span className="text-sm font-semibold text-fg-primary">{pack.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="light-surface" />
          <AuthButton variant="light-surface" />
          <Link href="/builder"
            className="text-sm font-bold px-5 py-2 rounded-lg text-block-text"
            style={{ background: 'var(--color-teal-500)', boxShadow: '0 3px 0 var(--color-teal-700)' }}>
            Open Builder →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{pack.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-4xl font-bold text-fg-primary">{pack.name}</h1>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full text-block-text"
                  style={{ background: pack.available ? pack.color : 'var(--color-fg-muted)' }}
                >
                  {pack.available ? 'Available now' : `Phase ${pack.phase}`}
                </span>
              </div>
              <p className="text-xl text-fg-secondary">{info?.tagline ?? pack.description}</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            {info?.docsUrl && (
              <a href={info.docsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-teal-500 hover:text-teal-600 transition-colors">
                📖 {pack.pipeline} docs ↗
              </a>
            )}
            {info?.githubUrl && (
              <a href={info.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-teal-500 hover:text-teal-600 transition-colors">
                ⬡ GitHub ↗
              </a>
            )}
            {info?.paperUrl && (
              <a href={info.paperUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-teal-500 hover:text-teal-600 transition-colors">
                📄 Publication ↗
              </a>
            )}
          </div>

          {/* Meta */}
          {(info?.organism || info?.citationCount) && (
            <div className="flex flex-wrap gap-4 text-sm text-fg-muted">
              {info.organism && <span>🌍 {info.organism}</span>}
              {info.citationCount && <span>📑 {info.citationCount} citations</span>}
              <span>🧩 {packBlocks.length} blocks total · {availableBlocks.length} available now</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="tablet:col-span-2 flex flex-col gap-8">
            {/* What it does */}
            {info?.whatItDoes && (
              <section>
                <h2 className="text-xl font-bold text-fg-primary mb-3">What nf-core/{packId === 'rnaseq_qc' || packId === 'rnaseq_full' ? 'rnaseq' : packId === 'fastq_basics' ? 'any pipeline' : packId === 'nfcore_tools' ? 'tools' : packId.replace('_', '')} does</h2>
                <p className="text-base text-fg-secondary leading-relaxed">{info.whatItDoes}</p>
              </section>
            )}

            {/* Who uses it */}
            {info?.whoUsesIt && (
              <section>
                <h2 className="text-xl font-bold text-fg-primary mb-3">Who uses it</h2>
                <p className="text-base text-fg-secondary leading-relaxed">{info.whoUsesIt}</p>
              </section>
            )}

            {/* Key pipeline steps */}
            {info?.keySteps && (
              <section>
                <h2 className="text-xl font-bold text-fg-primary mb-4">Key nf-core modules in this pipeline</h2>
                <div className="flex flex-col gap-3">
                  {info.keySteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-surface">
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                        style={{ background: pack.color + '22' }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-fg-primary font-mono">{step.name}</p>
                        <p className="text-sm text-fg-secondary">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Test command */}
            {info?.testCommand && (
              <section>
                <h2 className="text-xl font-bold text-fg-primary mb-3">Try it with the test profile</h2>
                <pre
                  className="text-sm font-mono p-4 rounded-xl overflow-x-auto"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg-secondary)' }}
                >
                  {info.testCommand}
                </pre>
                <p className="text-xs text-fg-muted mt-2">
                  The test profile uses a tiny curated dataset from nf-core/test-datasets so you can verify your setup in minutes.
                </p>
              </section>
            )}

            {/* Block catalog */}
            <section>
              <h2 className="text-xl font-bold text-fg-primary mb-3">
                Blocks in this pack ({packBlocks.length})
              </h2>
              <div className="flex flex-col gap-1.5">
                {packBlocks.map(blockType => {
                  const def = BLOCK_DEFINITIONS[blockType]
                  return (
                    <div
                      key={blockType}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-surface"
                      style={{ opacity: def.status !== 'available' ? 0.6 : 1 }}
                    >
                      <span className="text-base">{def.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-fg-primary">{def.displayName}</span>
                        <span className="text-xs text-fg-muted ml-2 font-mono truncate">{def.technicalConcept.split('—')[0].trim()}</span>
                      </div>
                      <span
                        className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full text-block-text"
                        style={{ background: def.status === 'available' ? pack.color : 'var(--color-fg-muted)', fontSize: 10 }}
                      >
                        {def.status === 'available' ? 'Available' : `Phase ${def.status.replace('phase', '')}`}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Link href={`/modules?pack=${packId}`}
                className="text-sm text-teal-500 hover:text-teal-600 mt-3 inline-block">
                View detailed module docs in Module Registry →
              </Link>
            </section>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Missions */}
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: pack.color + '44', background: pack.color + '0a' }}
            >
              <h3 className="text-base font-bold text-fg-primary mb-3">Learning missions</h3>
              {packMissions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {packMissions.map(mission => {
                    const badge = MISSION_BADGES[mission.id]
                    return (
                      <div key={mission.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{badge?.emoji ?? '🎯'}</span>
                          <span className="text-sm font-semibold text-fg-primary">{mission.title}</span>
                        </div>
                        <p className="text-xs text-fg-secondary leading-relaxed">{mission.description}</p>
                        <Link
                          href={`/builder?mission=${mission.id}`}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg self-start text-block-text mt-1"
                          style={{ background: pack.color }}
                        >
                          Start →
                        </Link>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-fg-muted">
                  <p>Missions for this pack are coming soon.</p>
                  <Link href="/missions" className="text-teal-500 hover:text-teal-600 text-xs mt-2 inline-block">
                    View all missions →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-fg-primary">Quick reference</h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-fg-muted">nf-core pipeline</span>
                  <a href={info?.docsUrl} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-teal-500 hover:text-teal-600">{pack.pipeline}</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Total blocks</span>
                  <span className="font-semibold text-fg-primary">{packBlocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Available now</span>
                  <span className="font-semibold" style={{ color: pack.color }}>{availableBlocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Status</span>
                  <span className="font-semibold" style={{ color: pack.available ? pack.color : 'var(--color-fg-muted)' }}>
                    {pack.available ? '✓ Available' : `Phase ${pack.phase}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-2">
              <Link href={`/modules?pack=${packId}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-surface hover:border-teal-500 transition-colors text-sm font-semibold text-fg-primary">
                <span>📚 Module registry</span>
                <span className="text-fg-muted">→</span>
              </Link>
              <Link href="/test-run"
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-surface hover:border-teal-500 transition-colors text-sm font-semibold text-fg-primary">
                <span>🧪 Test run</span>
                <span className="text-fg-muted">→</span>
              </Link>
              <Link href="/missions"
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-surface hover:border-teal-500 transition-colors text-sm font-semibold text-fg-primary">
                <span>🎯 All missions</span>
                <span className="text-fg-muted">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/packs" className="text-sm text-fg-muted hover:text-fg-primary transition-colors">
            ← Back to all packs
          </Link>
        </div>
      </div>
    </div>
  )
}
