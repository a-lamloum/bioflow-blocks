'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback, useEffect, useRef } from 'react'
import { PipelineCanvas } from '@/components/canvas/PipelineCanvas'
import { BlockLibrary } from '@/components/blocks/BlockLibrary'
import { BlockInspector } from '@/components/inspector/BlockInspector'
import { MissionPanel } from '@/components/mission/MissionPanel'
import { RunPanel } from '@/components/run/RunPanel'
import Link from 'next/link'
// useSearchParams removed — read via window.location.search in useEffect to avoid SSR issues
import { ToastContainer } from '@/components/ui/Toast'
import { TutorialWizard } from '@/components/tutorial/TutorialWizard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CompletionBadge } from '@/components/mission/CompletionBadge'
import { ProjectsPanel } from '@/components/projects/ProjectsPanel'
import { AuthButton } from '@/components/auth/AuthButton'
import type { ToastItem } from '@/components/ui/Toast'
import { compile } from '@/lib/compiler/compile'
import { validate } from '@/lib/validator/validate'
import { simulate } from '@/lib/simulator/simulate'
import {
  checkMissionCompletion,
  getCurrentStepIndex,
  MISSIONS,
  MISSION_1,
  saveMissionComplete,
} from '@/lib/mission/missions'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type {
  PipelineNode,
  PipelineEdge,
  SimulationResult,
  ValidationResult,
  WorkflowIR,
  MissionState,
  BlockType,
  DataType,
  Mission,
} from '@/types'

let toastCounter = 0

const CONNECTION_REJECTION_MESSAGES: Partial<Record<DataType, string>> = {
  pipeline_context: 'Start Pipeline can only connect to a Samplesheet block.',
  sample_records:   'Samplesheet output can only connect to an Input FASTQ block.',
  fastq_reads:      'FASTQ reads can connect to QC Step or Trim Reads — not directly to a report or output.',
  qc_output:        'QC output can only connect to Generate Report.',
  trimmed_reads:    'Trimmed reads can only connect to Generate Report.',
  report_data:      'Report data can only connect to Output Results.',
  final_output:     'Output Results has no outgoing connections — it is the final step.',
}

function buildRejectionMessage(sourceType: DataType, _targetType: DataType): string {
  return (
    CONNECTION_REJECTION_MESSAGES[sourceType] ??
    "These blocks can't connect in this order. Check the data types and try a different combination."
  )
}

const INITIAL_MISSION: MissionState = {
  currentStepIndex: 0,
  completedStepIds: [],
  completed: false,
}

// Pre-built demo IR — shown on first load so learners see a completed run immediately
const DEMO_IR: WorkflowIR = {
  schema_version: '0.1',
  project_id: 'demo',
  name: 'Demo QC Pipeline',
  execution_mode: 'simulated',
  blocks: [
    { id: 'd1', type: 'start_pipeline',  config: {} },
    { id: 'd2', type: 'samplesheet',     config: {} },
    { id: 'd3', type: 'input_fastq',     config: {} },
    { id: 'd4', type: 'qc_step',         config: {} },
    { id: 'd5', type: 'generate_report', config: {} },
    { id: 'd6', type: 'output_results',  config: {} },
  ],
  edges: [
    { from: 'd1', to: 'd2', dataType: 'pipeline_context' },
    { from: 'd2', to: 'd3', dataType: 'sample_records' },
    { from: 'd3', to: 'd4', dataType: 'fastq_reads' },
    { from: 'd4', to: 'd5', dataType: 'qc_output' },
    { from: 'd5', to: 'd6', dataType: 'report_data' },
  ],
}

function BuilderPageContent() {
  // Read ?mission= param client-side only — avoids useSearchParams SSR error on Vercel
  const [activeMission, setActiveMission] = useState<Mission>(MISSION_1)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('mission')
    if (id) {
      const found = MISSIONS.find(m => m.id === id)
      if (found) setActiveMission(found)
    }
  }, [])

  const [nodes, setNodes] = useState<PipelineNode[]>([])
  const [edges, setEdges] = useState<PipelineEdge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [currentIR, setCurrentIR] = useState<WorkflowIR | null>(null)
  const [missionState, setMissionState] = useState<MissionState>(INITIAL_MISSION)
  const [showProjects, setShowProjects] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const [demoResult] = useState<SimulationResult>(() => simulate(DEMO_IR))
  const [toasts, setToasts] = useState<ToastItem[]>([])
  // Track last toast to deduplicate: isValidConnection fires on every mouse-move during drag
  const lastToastRef = useRef<{ message: string; time: number } | null>(null)

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'warning') => {
    const now = Date.now()
    // Suppress if the exact same message fired within the last 6 seconds
    if (lastToastRef.current?.message === message && now - lastToastRef.current.time < 6000) return
    lastToastRef.current = { message, time: now }
    const id = String(++toastCounter)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  // Recompile IR and advance mission step whenever nodes/edges change
  useEffect(() => {
    if (nodes.length === 0) { setCurrentIR(null); return }
    const ir = compile(nodes, edges)
    setCurrentIR(ir)

    const stepIdx = getCurrentStepIndex(nodes, activeMission)
    setMissionState(prev => {
      if (prev.completed) return prev
      const completedIds = activeMission.steps.slice(0, stepIdx).map(s => s.id)
      return { ...prev, currentStepIndex: stepIdx, completedStepIds: completedIds }
    })
  }, [nodes, edges, activeMission])

  const handleNodesChange = useCallback((updated: PipelineNode[]) => setNodes(updated), [])
  const handleEdgesChange = useCallback((updated: PipelineEdge[]) => setEdges(updated), [])

  const handleAddToCanvas = useCallback(
    (blockType: BlockType, position?: { x: number; y: number }) => {
      if (!BLOCK_DEFINITIONS[blockType]) return
      const newNode: PipelineNode = {
        id: `${blockType}-${Date.now()}`,
        type: 'pipelineBlock',
        position: position ?? { x: 300, y: 200 },
        data: { blockType, config: {}, hasError: false },
      }
      setNodes(prev => [...prev, newNode])
    },
    []
  )

  const handleLoadProject = useCallback(
    (loadedNodes: PipelineNode[], loadedEdges: PipelineEdge[]) => {
      setNodes(loadedNodes)
      setEdges(loadedEdges)
      setSimulationResult(null)
      setValidationResult(null)
      setSelectedNodeId(null)
      setMissionState(INITIAL_MISSION)
    },
    []
  )

  const handleConnectionRejected = useCallback(
    (sourceType: DataType, targetType: DataType) => {
      addToast(buildRejectionMessage(sourceType, targetType), 'warning')
    },
    [addToast]
  )

  const handleSimulate = useCallback(() => {
    if (!currentIR || currentIR.blocks.length === 0) {
      setValidationResult({
        valid: false,
        errors: [{
          blockId: null,
          code: 'MISSING_START',
          message: 'Add some blocks first.',
          fix: 'Drag blocks from the library on the left and connect them.',
        }],
        warnings: [],
      })
      return
    }
    const vr = validate(currentIR)
    setValidationResult(vr)
    if (!vr.valid) { setSimulationResult(null); return }

    const result = simulate(currentIR)
    setSimulationResult(result)

    if (checkMissionCompletion(activeMission, nodes, result)) {
      setMissionState(prev => ({
        ...prev,
        completed: true,
        completedStepIds: activeMission.steps.map(s => s.id),
        currentStepIndex: activeMission.steps.length - 1,
      }))
      saveMissionComplete(activeMission.id)
      setShowBadge(true)
    }
  }, [currentIR, nodes, activeMission])

  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const selectedBlockType = selectedNode?.data.blockType ?? null

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-canvas">
      <TutorialWizard />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} durationMs={5000} />
      {showBadge && (
        <CompletionBadge
          missionId={activeMission.id}
          onDismiss={() => setShowBadge(false)}
        />
      )}
      {showProjects && (
        <ProjectsPanel
          currentNodes={nodes}
          currentEdges={edges}
          activeMission={activeMission}
          onLoad={handleLoadProject}
          onClose={() => setShowProjects(false)}
        />
      )}

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-border bg-surface z-30">
        {/* Left: brand + links */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bioflow-logo.svg" alt="" width={22} height={22} />
            <span className="text-sm font-bold text-fg-primary">BioFlow Blocks</span>
          </Link>

          <span className="text-border-strong text-xs mx-1">/</span>

          <Link href="/missions" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            Missions
          </Link>
          <Link href="/modules" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            Modules
          </Link>
          <Link href="/packs" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            Packs
          </Link>
          <Link href="/dsl2" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            DSL2
          </Link>
          <Link href="/developer" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            Developer
          </Link>
          <Link href="/seqera" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            🔷 Seqera
          </Link>
          <Link href="/troubleshoot" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            🔧 Troubleshoot
          </Link>
          <Link href="/test-run" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-fg-secondary hover:text-teal-500 hover:bg-teal-50 transition-colors">
            🧪 Test Run
          </Link>

          {/* Active mission chip */}
          <div
            className="hidden tablet:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'var(--color-teal-50)', color: 'var(--color-teal-700)' }}
          >
            <span>🎯</span>
            <span className="truncate max-w-40">{activeMission.title}</span>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProjects(v => !v)}
            className={[
              'hidden tablet:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              showProjects
                ? 'bg-teal-50 text-teal-600'
                : 'text-fg-secondary hover:text-fg-primary hover:bg-surface-2',
            ].join(' ')}
          >
            📂 Projects
          </button>
          <ThemeToggle variant="light-surface" />
          <AuthButton variant="light-surface" />
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Block library */}
        <BlockLibrary onAddToCanvas={handleAddToCanvas} />

        {/* Center: mission strip + canvas */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <MissionPanel missionState={missionState} mission={activeMission} />
          <PipelineCanvas
            onSelectNode={setSelectedNodeId}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnectionRejected={handleConnectionRejected}
          />
        </div>

        {/* Inspector slide-over */}
        <BlockInspector
          selectedBlockType={selectedBlockType}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>

      {/* Run panel */}
      <RunPanel
        simulationResult={simulationResult}
        validationResult={validationResult}
        currentIR={currentIR}
        demoResult={demoResult}
        onSimulate={handleSimulate}
      />
    </main>
  )
}

export default function BuilderPage() {
  return <BuilderPageContent />
}
