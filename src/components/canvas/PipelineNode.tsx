'use client'

import { memo } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { DEMO_SAMPLES } from '@/data/demo-samplesheet'
import type { PipelineNodeData } from '@/types'

// ─── Scratch-inspired color palette ─────────────────────────────────────────
// Each block has a vivid fill and a darker shadow for the 3D push effect.

const BLOCK_PALETTE: Record<string, { fill: string; shadow: string }> = {
  start_pipeline:  { fill: 'oklch(68% 0.23 38)',  shadow: 'oklch(46% 0.23 38)'  },
  samplesheet:     { fill: 'oklch(50% 0.22 258)', shadow: 'oklch(33% 0.22 258)' },
  input_fastq:     { fill: 'oklch(58% 0.20 212)', shadow: 'oklch(40% 0.20 212)' },
  qc_step:         { fill: 'oklch(50% 0.25 302)', shadow: 'oklch(33% 0.25 302)' },
  trim_reads:      { fill: 'oklch(66% 0.22 24)',  shadow: 'oklch(46% 0.22 24)'  },
  generate_report: { fill: 'oklch(52% 0.22 152)', shadow: 'oklch(35% 0.22 152)' },
  output_results:  { fill: 'oklch(52% 0.20 232)', shadow: 'oklch(35% 0.20 232)' },
}

// ─── SVG puzzle-block path builder ──────────────────────────────────────────
// Generates a Scratch-style horizontal block path:
//   left side  = concave notch  (input connector)
//   right side = convex bump    (output connector)
//   corners    = rounded (radius = cr)
//
// The SVG viewBox is (0 0 W H). The bump protrudes 14px beyond W on the right.
// Input nodes (no output) get a flat right edge.
// Output nodes (no input) get a flat left edge.

const CR = 10   // corner radius
const TR = 12   // connector tab radius
const TY = 20   // connector tab half-height (24px total tab)

function blockPath(W: number, H: number, hasInput: boolean, hasOutput: boolean): string {
  const MID = H / 2

  // Right side — convex bump or flat
  const rightTop    = hasOutput ? `L ${W},${MID - TY}  A ${TR},${TR} 0 0 1 ${W},${MID + TY}` : ''
  const rightFlat   = hasOutput ? '' : `L ${W},${H - CR}`
  const rightAfter  = `L ${W},${H - CR}`

  // Left side — concave notch or flat
  const leftNotch = hasInput
    ? `L 0,${MID + TY}  A ${TR},${TR} 0 0 0 0,${MID - TY}  L 0,${CR}`
    : `L 0,${CR}`

  if (hasOutput && hasInput) {
    return [
      `M ${CR},0`,
      `L ${W - CR},0  Q ${W},0 ${W},${CR}`,
      `L ${W},${MID - TY}  A ${TR},${TR} 0 0 1 ${W},${MID + TY}`,
      `L ${W},${H - CR}  Q ${W},${H} ${W - CR},${H}`,
      `L ${CR},${H}     Q 0,${H} 0,${H - CR}`,
      `L 0,${MID + TY}  A ${TR},${TR} 0 0 0 0,${MID - TY}`,
      `L 0,${CR}        Q 0,0 ${CR},0  Z`,
    ].join(' ')
  }

  if (hasOutput && !hasInput) {
    return [
      `M ${CR},0`,
      `L ${W - CR},0  Q ${W},0 ${W},${CR}`,
      `L ${W},${MID - TY}  A ${TR},${TR} 0 0 1 ${W},${MID + TY}`,
      `L ${W},${H - CR}  Q ${W},${H} ${W - CR},${H}`,
      `L ${CR},${H}     Q 0,${H} 0,${H - CR}`,
      `L 0,${CR}        Q 0,0 ${CR},0  Z`,
    ].join(' ')
  }

  if (!hasOutput && hasInput) {
    return [
      `M ${CR},0`,
      `L ${W - CR},0  Q ${W},0 ${W},${CR}`,
      `L ${W},${H - CR}  Q ${W},${H} ${W - CR},${H}`,
      `L ${CR},${H}     Q 0,${H} 0,${H - CR}`,
      `L 0,${MID + TY}  A ${TR},${TR} 0 0 0 0,${MID - TY}`,
      `L 0,${CR}        Q 0,0 ${CR},0  Z`,
    ].join(' ')
  }

  // No connectors (shouldn't happen in practice)
  return `M ${CR},0 L ${W-CR},0 Q ${W},0 ${W},${CR} L ${W},${H-CR} Q ${W},${H} ${W-CR},${H} L ${CR},${H} Q 0,${H} 0,${H-CR} L 0,${CR} Q 0,0 ${CR},0 Z`
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PipelineNode = memo(function PipelineNode({
  id,
  data: rawData,
  selected,
}: NodeProps) {
  const data = rawData as unknown as PipelineNodeData
  const def = BLOCK_DEFINITIONS[data.blockType]
  const { deleteElements } = useReactFlow()

  if (!def) return null

  const palette = BLOCK_PALETTE[data.blockType] ?? { fill: 'oklch(52% 0.18 255)', shadow: 'oklch(35% 0.18 255)' }
  const hasInput  = def.inputPorts.length > 0
  const hasOutput = def.outputPorts.length > 0
  const isSamplesheet = data.blockType === 'samplesheet'

  const W = isSamplesheet ? 280 : 200
  const H = isSamplesheet ? 100 : 68

  const path = blockPath(W, H, hasInput, hasOutput)

  // The SVG viewBox is W wide but the RIGHT bump extends ~14px beyond.
  // We extend the foreignObject / SVG width to accommodate.
  const svgW = hasOutput ? W + TR + 2 : W
  const svgH = H + 6   // extra height for 3D shadow

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${def.displayName} block`}
      style={{ width: svgW, height: svgH, position: 'relative' }}
      className="group focus-visible:outline-none"
    >
      {/* ── SVG block body ── */}
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {/* 3D shadow layer — same path, shifted 5px down, darker */}
        <path d={path} fill={palette.shadow} transform="translate(0, 5)" />
        {/* Main block face */}
        <path
          d={path}
          fill={palette.fill}
          stroke={selected ? 'white' : 'transparent'}
          strokeWidth={selected ? 3 : 0}
          style={{
            filter: selected ? 'brightness(1.10)' : undefined,
            transition: 'filter 120ms ease',
          }}
        />
        {/* Subtle top highlight for depth */}
        <path
          d={`M ${CR + 2},2 L ${W - CR - 2},2`}
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.25"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Port indicator circles — visible drag handles ── */}
        {/* Input port(s): white circle with colored ring at the notch opening */}
        {def.inputPorts.map((port, i) => {
          const cy = H / 2 + (def.inputPorts.length > 1 ? (i === 0 ? -TY : TY) : 0)
          return (
            <g key={port.id}>
              {/* Outer glow ring */}
              <circle cx={0} cy={cy} r={11} fill={palette.fill} opacity={0.25} />
              {/* Main circle */}
              <circle cx={0} cy={cy} r={8} fill="white" stroke={palette.fill} strokeWidth={3} />
              {/* Inner dot */}
              <circle cx={0} cy={cy} r={3} fill={palette.fill} />
            </g>
          )
        })}

        {/* Output port(s): white circle with colored ring at the bump tip */}
        {def.outputPorts.map((port, i) => {
          const cy = H / 2 + (def.outputPorts.length > 1 ? (i === 0 ? -TY : TY) : 0)
          const cx = W + TR  // tip of the right bump
          return (
            <g key={port.id}>
              {/* Outer glow ring */}
              <circle cx={cx} cy={cy} r={11} fill={palette.fill} opacity={0.25} />
              {/* Main circle */}
              <circle cx={cx} cy={cy} r={8} fill="white" stroke={palette.fill} strokeWidth={3} />
              {/* Inner dot */}
              <circle cx={cx} cy={cy} r={3} fill={palette.fill} />
            </g>
          )
        })}
      </svg>

      {/* ── Delete button ── */}
      <button
        aria-label={`Remove ${def.displayName} block`}
        onClick={handleDelete}
        className={[
          'absolute -top-3 -right-3 z-20',
          'w-6 h-6 rounded-full flex items-center justify-center',
          'text-xs font-bold bg-white shadow-md',
          'transition-opacity duration-fast',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ].join(' ')}
        style={{ color: palette.fill }}
      >
        ✕
      </button>

      {/* ── Block content ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
          padding: '8px 14px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{def.icon}</span>
          <span style={{
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            textShadow: `0 1px 2px ${palette.shadow}`,
          }}>
            {def.displayName}
          </span>
        </div>

        {/* Samplesheet: demo table */}
        {isSamplesheet && (
          <div style={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.25)',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'white',
          }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(0,0,0,0.25)' }}>
              {['sample', 'fastq_1', 'fastq_2'].map(col => (
                <div key={col} style={{ padding: '2px 4px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col}</div>
              ))}
            </div>
            {/* Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(0,0,0,0.12)' }}>
              {['sample', 'fastq_1', 'fastq_2'].map(col => (
                <div key={col} style={{ padding: '2px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {String(DEMO_SAMPLES[0][col as keyof typeof DEMO_SAMPLES[0]])}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── React Flow handles — invisible click targets positioned at notch / bump ── */}
      {def.inputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="target"
          position={Position.Left}
          id={port.id}
          style={{
            left: -12,     // aligned to circle center at x=0 in SVG
            top: H / 2 + (def.inputPorts.length > 1 ? (i === 0 ? -TY : TY) : 0),
            width: 24,     // generous hit area matching the circle
            height: 24,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            cursor: 'crosshair',
          }}
        />
      ))}

      {def.outputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="source"
          position={Position.Right}
          id={port.id}
          style={{
            right: -TR - 2,  // aligned to circle center at x=W+TR in SVG
            top: H / 2 + (def.outputPorts.length > 1 ? (i === 0 ? -TY : TY) : 0),
            width: 24,
            height: 24,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            cursor: 'grab',
          }}
        />
      ))}
    </div>
  )
})
