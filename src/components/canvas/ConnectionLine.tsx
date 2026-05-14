'use client'

import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react'

export function ConnectionLine({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? 'var(--color-teal-500)' : 'var(--color-border-strong)',
        strokeWidth: 2,
        transition: 'stroke 180ms ease',
      }}
    />
  )
}
