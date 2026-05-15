'use client'

import { useState } from 'react'

const TEST_CONCEPTS = [
  {
    id: 'structure',
    label: 'Test structure',
    icon: '🏗️',
    code: `nextflow_process {
    name "Test Process FASTQC"     // Human-readable test suite name
    script "../main.nf"            // Path to module's main.nf
    process "FASTQC"               // Process name to test

    test("Paired-end reads") { ... }   // One scenario
    test("Single-end reads") { ... }   // Another scenario
    test("Empty input")      { ... }   // Edge case
}`,
    explanation: 'Every nf-test file has a nextflow_process block wrapping one or more test() scenarios. Each test() is independent — it creates its own work directory and does not share state with other tests.',
  },
  {
    id: 'when',
    label: 'when {} block',
    icon: '⬅️',
    code: `when {
    process {
        """
        // input[0] = first channel in the process input block
        // input[1] = second channel, and so on

        input[0] = [
            [ id:'test', single_end:false ],
            [
                file(params.modules_testdata_base_path +
                     'genomics/sarscov2/illumina/fastq/test_1.fastq.gz',
                     checkIfExists: true),
                file(params.modules_testdata_base_path +
                     'genomics/sarscov2/illumina/fastq/test_2.fastq.gz',
                     checkIfExists: true)
            ]
        ]
        """
    }
}`,
    explanation: 'The when{} block sets up inputs using a Nextflow script block. input[0] maps to the first input channel in your process. Always use params.modules_testdata_base_path + file path to reference nf-core/test-datasets files.',
  },
  {
    id: 'then',
    label: 'then {} block',
    icon: '✅',
    code: `then {
    assertAll(
        // Basic: did the process succeed?
        { assert process.success },

        // Did it produce any output files?
        { assert process.out.html.size() == 1 },

        // Snapshot test: captures ALL outputs on first run,
        // then compares on every subsequent run
        { assert snapshot(process.out).match() },

        // Check a specific output value
        { assert process.out.versions != null },
    )
}`,
    explanation: 'The then{} block contains assertions. assert process.success checks exit code 0. snapshot(process.out).match() is the most powerful assertion — it creates a .snap file on first run capturing all output hashes, filenames, and values. Future runs fail if anything changes.',
  },
  {
    id: 'snapshot',
    label: 'Snapshot files',
    icon: '📸',
    code: `// tests/main.nf.test.snap (auto-generated on first run)
{
    "Should run without failures": {
        "content": [
            {
                "0": [
                    [ { "id": "test", "single_end": false },
                      "test_fastqc.html:md5,abc123..." ]
                ],
                "1": [
                    [ { "id": "test", "single_end": false },
                      "test_fastqc.zip:md5,def456..." ]
                ],
                "versions": "versions.yml:md5,789abc..."
            }
        ],
        "timestamp": "2024-05-14T09:00:00"
    }
}`,
    explanation: "Snapshot files capture MD5 checksums of all output files plus channel content. They're committed to git. If a module change causes output to differ, the snapshot test fails, alerting reviewers to verify the change is intentional.",
  },
  {
    id: 'run',
    label: 'Running tests',
    icon: '▶️',
    code: `# Install nf-test
pip install nf-test
# or
conda install -c bioconda nf-test

# Run all tests for a module
nf-test test modules/nf-core/fastqc/tests/main.nf.test

# Update snapshots after an intentional change
nf-test test --update-snapshot modules/nf-core/fastqc/tests/main.nf.test

# Run with a specific profile
nf-test test --profile docker modules/nf-core/fastqc/tests/main.nf.test

# Run in CI (GitHub Actions) — same command
nf-test test modules/nf-core/fastqc/tests/main.nf.test`,
    explanation: 'nf-test is the official testing framework for nf-core modules. It runs each test() block in an isolated Nextflow work directory. GitHub Actions CI runs these automatically on every PR to nf-core/modules. All tests must pass before a PR can be merged.',
  },
]

export function NfTestExplorer() {
  const [active, setActive] = useState('structure')
  const concept = TEST_CONCEPTS.find(c => c.id === active) ?? TEST_CONCEPTS[0]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-fg-primary mb-1">nf-test Framework</h3>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Every nf-core module must have nf-test tests before a PR can be merged.
          nf-test is the official testing framework — it runs Nextflow processes
          in isolation and captures outputs as snapshot files.
          Aligned with{' '}
          <a href="https://www.nf-test.com/" target="_blank" rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-600">nf-test.com</a> and the
          official{' '}
          <a href="https://training.nextflow.io/latest/side_quests/" target="_blank" rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-600">Nextflow Training side quest</a>.
        </p>
      </div>

      {/* Concept tabs */}
      <div className="flex flex-wrap gap-2">
        {TEST_CONCEPTS.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border"
            style={{
              background: active === c.id ? 'var(--color-teal-500)' : 'var(--color-surface-2)',
              color: active === c.id ? 'white' : 'var(--color-fg-secondary)',
              borderColor: active === c.id ? 'var(--color-teal-500)' : 'var(--color-border)',
              boxShadow: active === c.id ? '0 3px 0 var(--color-teal-700)' : 'none',
            }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Code + explanation */}
      <div className="flex flex-col gap-3">
        <pre
          className="text-xs font-mono p-4 rounded-xl overflow-x-auto"
          style={{ background: 'oklch(14% 0.02 220)', color: 'oklch(72% 0.14 195)', border: '1px solid oklch(28% 0.02 220)' }}
        >
          {concept.code}
        </pre>

        <div
          className="px-4 py-3 rounded-xl text-sm leading-relaxed"
          style={{ background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', color: 'var(--color-teal-700)' }}
        >
          {concept.explanation}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <a href="https://www.nf-test.com/docs/getting-started/" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          nf-test getting started ↗
        </a>
        <a href="https://nf-co.re/docs/contributing/modules#unit-testing" target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-teal-500 hover:text-teal-600">
          nf-core module testing guide ↗
        </a>
      </div>
    </div>
  )
}
