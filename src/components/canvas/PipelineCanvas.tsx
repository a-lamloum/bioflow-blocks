'use client'

import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import { PipelineNode } from './PipelineNode'
import { ConnectionLine } from './ConnectionLine'
import { BLOCK_DEFINITIONS, DATA_TYPE_COMPATIBILITY } from '@/lib/blocks/definitions'
import type { PipelineNode as PipelineNodeType, PipelineEdge, BlockType, DataType } from '@/types'

const nodeTypes: NodeTypes = { pipelineBlock: PipelineNode as never }
const edgeTypes: EdgeTypes = { default: ConnectionLine as never }

interface PipelineCanvasProps {
  onSelectNode: (nodeId: string | null) => void
  onNodesChange: (nodes: PipelineNodeType[]) => void
  onEdgesChange: (edges: PipelineEdge[]) => void
  onConnectionRejected: (sourceType: DataType, targetType: DataType) => void
}

export function PipelineCanvas({
  onSelectNode,
  onNodesChange,
  onEdgesChange,
  onConnectionRejected,
}: PipelineCanvasProps) {
  const [nodes, setNodes, handleNodesChange] = useNodesState<PipelineNodeType>([])
  const [edges, setEdges, handleEdgesChange] = useEdgesState<PipelineEdge>([])
  const rfInstance = useRef<ReactFlowInstance<PipelineNodeType, PipelineEdge> | null>(null)

  // Propagate state changes upward for compile/IR
  const handleNodesChangeAndPropagate = useCallback(
    (changes: Parameters<typeof handleNodesChange>[0]) => {
      handleNodesChange(changes)
      setNodes(nds => {
        onNodesChange(nds)
        return nds
      })
    },
    [handleNodesChange, setNodes, onNodesChange]
  )

  const handleEdgesChangeAndPropagate = useCallback(
    (changes: Parameters<typeof handleEdgesChange>[0]) => {
      handleEdgesChange(changes)
      setEdges(eds => {
        onEdgesChange(eds)
        return eds
      })
    },
    [handleEdgesChange, setEdges, onEdgesChange]
  )

  const isValidConnection = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (connection: any): boolean => {
      const sourceNode = nodes.find(n => n.id === connection.source)
      const targetNode = nodes.find(n => n.id === connection.target)
      if (!sourceNode || !targetNode) return false

      const sourceDef = BLOCK_DEFINITIONS[sourceNode.data.blockType]
      const targetDef = BLOCK_DEFINITIONS[targetNode.data.blockType]
      if (!sourceDef || !targetDef) return false

      const sourcePort = sourceDef.outputPorts.find(p => p.id === connection.sourceHandle)
      const targetPort = targetDef.inputPorts.find(p => p.id === connection.targetHandle)
      if (!sourcePort || !targetPort) return false

      const allowed = DATA_TYPE_COMPATIBILITY[sourcePort.dataType] ?? []
      const valid = allowed.includes(targetPort.dataType)
      if (!valid) {
        onConnectionRejected(sourcePort.dataType, targetPort.dataType)
      }
      return valid
    },
    [nodes, onConnectionRejected]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find(n => n.id === connection.source)
      const sourceDef = sourceNode ? BLOCK_DEFINITIONS[sourceNode.data.blockType] : null
      const sourcePort = sourceDef?.outputPorts.find(p => p.id === connection.sourceHandle)

      setEdges(eds => {
        const newEdges = addEdge(
          {
            ...connection,
            type: 'default',
            data: {
              dataType: sourcePort?.dataType ?? 'pipeline_context',
              label: sourcePort?.dataType ?? '',
            },
          },
          eds
        )
        onEdgesChange(newEdges)
        return newEdges
      })
    },
    [nodes, setEdges, onEdgesChange]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const blockType = event.dataTransfer.getData('blockType') as BlockType
      if (!blockType || !BLOCK_DEFINITIONS[blockType]) return

      const rf = rfInstance.current
      if (!rf) return

      const position = rf.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: PipelineNodeType = {
        id: uuidv4(),
        type: 'pipelineBlock',
        position,
        data: {
          blockType,
          config: {},
          hasError: false,
        },
      }

      setNodes(nds => {
        const updated = [...nds, newNode]
        onNodesChange(updated)
        return updated
      })
    },
    [setNodes, onNodesChange]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: PipelineNodeType) => {
      onSelectNode(node.id)
    },
    [onSelectNode]
  )

  const onPaneClick = useCallback(() => {
    onSelectNode(null)
  }, [onSelectNode])

  return (
    <div className="flex-1 w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChangeAndPropagate}
        onEdgesChange={handleEdgesChangeAndPropagate}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={(instance: ReactFlowInstance<PipelineNodeType, PipelineEdge>) => { rfInstance.current = instance }}
        fitView
        style={{ background: 'var(--color-canvas)' }}
        deleteKeyCode="Delete"
      >
        <Background color="var(--color-border)" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
