import { useMemo } from 'react'
import * as THREE from 'three'
import { Html, Line } from '@react-three/drei'
import { computeBoxSize } from './dielineGeometry'
import type { DimensionField } from '../App'

const ACTIVE_COLOR = '#2757ff'
const INACTIVE_LINE_COLOR = '#8a8a8a'
const INACTIVE_BADGE_BG = '#cfcfcf'

// How far the dimension lines are pulled away from the model's surface, and
// how much further beyond that the badges sit, offset to the side of the line.
const LINE_OFFSET = 5
const BADGE_SIDE_OFFSET = 24

// Each edge is shared by two faces; pulling away means moving diagonally off
// both of them (e.g. the bottom-front edge moves down and forward).
const widthAwayDir = new THREE.Vector3(0, -1, 1).normalize()
const lengthAwayDir = new THREE.Vector3(1, -1, 0).normalize()
const heightAwayDir = new THREE.Vector3(1, 0, 1).normalize()

function buildDimension(from: THREE.Vector3, to: THREE.Vector3, awayDir: THREE.Vector3) {
  const offset = awayDir.clone().multiplyScalar(LINE_OFFSET)
  const start = from.clone().add(offset)
  const end = to.clone().add(offset)
  const badgePosition = start
    .clone()
    .lerp(end, 0.5)
    .add(awayDir.clone().multiplyScalar(BADGE_SIDE_OFFSET))
  return { points: [start, end] as [THREE.Vector3, THREE.Vector3], badgePosition }
}

interface DimensionLineProps {
  points: [THREE.Vector3, THREE.Vector3]
  active: boolean
}

function DimensionLine({ points, active }: DimensionLineProps) {
  return <Line points={points} color={active ? ACTIVE_COLOR : INACTIVE_LINE_COLOR} lineWidth={3.5} />
}

interface DimensionBadgeProps {
  position: THREE.Vector3
  label: string
  value: number
  active: boolean
}

function DimensionBadge({ position, label, value, active }: DimensionBadgeProps) {
  return (
    <Html position={position} center zIndexRange={[10, 0]} pointerEvents="none">
      <div
        className="whitespace-nowrap rounded-full px-2 py-1 text-[11px] leading-[1.32] tracking-[-0.22px]"
        style={{
          background: active ? ACTIVE_COLOR : INACTIVE_BADGE_BG,
          color: active ? '#ffffff' : '#00061a',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}: {value} cm
      </div>
    </Html>
  )
}

interface DimensionOverlayProps {
  visible: boolean
  activeField: DimensionField | null
  width: number
  length: number
  height: number
}

export default function DimensionOverlay({
  visible,
  activeField,
  width,
  length,
  height,
}: DimensionOverlayProps) {
  const dims = useMemo(() => {
    const boxSize = computeBoxSize(width, length, height)
    const corner = new THREE.Vector3(boxSize.x / 2, 0, boxSize.z / 2)
    const widthEnd = new THREE.Vector3(-boxSize.x / 2, 0, boxSize.z / 2)
    const lengthEnd = new THREE.Vector3(boxSize.x / 2, 0, -boxSize.z / 2)
    const heightEnd = new THREE.Vector3(boxSize.x / 2, boxSize.y, boxSize.z / 2)

    return {
      width: buildDimension(corner, widthEnd, widthAwayDir),
      length: buildDimension(corner, lengthEnd, lengthAwayDir),
      height: buildDimension(corner, heightEnd, heightAwayDir),
    }
  }, [width, length, height])

  if (!visible) return null

  return (
    <group>
      <DimensionLine points={dims.width.points} active={activeField === 'width'} />
      <DimensionLine points={dims.length.points} active={activeField === 'length'} />
      <DimensionLine points={dims.height.points} active={activeField === 'height'} />

      <DimensionBadge
        position={dims.width.badgePosition}
        label="Width"
        value={width}
        active={activeField === 'width'}
      />
      <DimensionBadge
        position={dims.length.badgePosition}
        label="Length"
        value={length}
        active={activeField === 'length'}
      />
      <DimensionBadge
        position={dims.height.badgePosition}
        label="Height"
        value={height}
        active={activeField === 'height'}
      />
    </group>
  )
}
