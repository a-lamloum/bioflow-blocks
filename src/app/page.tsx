'use client'

import { useState, useCallback, useEffect } from 'react'
import { PipelineCanvas } from '@/components/canvas/PipelineCanvas'
import { BlockLibrary } from '@/components/blocks/BlockLibrary'
import { BlockInspector } from '@/components/inspector/BlockInspector'
import { MissionPanel } from '@/components/mission/MissionPanel'
import { RunPanel } from '@/components/run/RunPanel'
import { compile } from '@/lib/compiler/compile'
import { validate } from '@/lib/validator/validate'
import { simulate } from '@/lib/simulator/simulate'
import { checkCompletion, getCurrentStepIndex, FIRST_QC_MISSION } from '@/lib/mission/missions'
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
} from '@/types'

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

export default function BuilderPage() {
  const [nodes, setNodes] = useState<PipelineNode[]>([])
  const [edges, setEdges] = useState<PipelineEdge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [currentIR, setCurrentIR] = useState<WorkflowIR | null>(null)
  const [missionState, setMissionState] = useState<MissionState>(INITIAL_MISSION)
  const [connectionRejectedMessage, setConnectionRejectedMessage] = useState<string | null>(null)

  // Recompile IR and advance mission step whenever nodes/edges change
  useEffect(() => {
    if (nodes.length === 0) { setCurrentIR(null); return }
    const ir = compile(nodes, edges)
    setCurrentIR(ir)

    const stepIdx = getCurrentStepIndex(nodes)
    setMissionState(prev => {
      if (prev.completed) return prev
      const completedIds = FIRST_QC_MISSION.steps.slice(0, stepIdx).map(s => s.id)
      return { ...prev, currentStepIndex: stepIdx, completedStepIds: completedIds }
    })
  }, [nodes, edges])

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

  const handleConnectionRejected = useCallback(
    (sourceType: DataType, targetType: DataType) => {
      setConnectionRejectedMessage(buildRejectionMessage(sourceType, targetType))
    },
    []
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

    if (checkCompletion(nodes, result)) {
      setMissionState(prev => ({
        ...prev,
        completed: true,
        completedStepIds: FIRST_QC_MISSION.steps.map(s => s.id),
        currentStepIndex: FIRST_QC_MISSION.steps.length - 1,
      }))
    }
  }, [currentIR, nodes])

  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const selectedBlockType = selectedNode?.data.blockType ?? null

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-canvas">
      <div className="flex flex-1 overflow-hidden">
        {/* Block library */}
        <BlockLibrary onAddToCanvas={handleAddToCanvas} />

        {/* Center: mission strip + canvas */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <MissionPanel missionState={missionState} />
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
        connectionRejectedMessage={connectionRejectedMessage}
        onSimulate={handleSimulate}
      />
    </main>
  )
}
