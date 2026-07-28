import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { computeBoxSize, computeTag, hangHole } from './dielineGeometry'
import { createSlotPath, createTagShape } from './shapeHelpers'
import { imgKraftTexture } from '../assets/figma'

interface BoxModelProps {
  width: number
  length: number
  height: number
  /** Bumped to trigger a fresh tumble-flip revealing the box's underside. */
  flipTrigger: number
  /** "Size of my product" mode, focused on a dimension field: ghost the walls
   *  and reveal the product placeholder sized to fit inside them. */
  showProduct: boolean
}

const PRODUCT_COLOR = '#7c8f5f'
// Purely illustrative -- exaggerated well past the real (often just a few
// mm) construction buffer so the placeholder actually reads as "a smaller
// product inside the box" instead of disappearing into it.
const PRODUCT_VISUAL_SCALE = 0.82

// The box's width axis, level (no diagonal/vertical component so left-right
// and front-back stay put -- only pitch changes). A partial (not full 180
// degree) forward tip around it swings the front face down and the
// underside up into view, while the top stays visible too, rather than
// fully inverting the box (and, with it, the hang tag, which would
// otherwise swing underneath like a broken leg).
const FLIP_AXIS = new THREE.Vector3(-1, 0, 0).normalize()
const FLIP_ANGLE = THREE.MathUtils.degToRad(125)
const FLIPPED_QUAT = new THREE.Quaternion().setFromAxisAngle(FLIP_AXIS, FLIP_ANGLE)
const IDLE_QUAT = new THREE.Quaternion()

const FLIP_DURATION = 0.9
const HOLD_DURATION = 1.4
const RETURN_DURATION = 0.9

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

type FlipPhase = 'idle' | 'toFlipped' | 'holding' | 'toIdle'

export default function BoxModel({ width, length, height, flipTrigger, showProduct }: BoxModelProps) {
  const kraftMap = useTexture(imgKraftTexture)
  kraftMap.colorSpace = THREE.SRGBColorSpace
  kraftMap.anisotropy = 8

  const boxSize = useMemo(() => computeBoxSize(width, length, height), [width, length, height])
  const productSize = useMemo(
    () => ({
      x: boxSize.x * PRODUCT_VISUAL_SCALE,
      y: boxSize.y * PRODUCT_VISUAL_SCALE,
      z: boxSize.z * PRODUCT_VISUAL_SCALE,
    }),
    [boxSize],
  )
  const tag = useMemo(() => computeTag(boxSize.x), [boxSize.x])
  const pivotY = (boxSize.y + tag.height) / 2

  const pivotRef = useRef<THREE.Group>(null)
  const flip = useRef<{
    phase: FlipPhase
    t: number
    from: THREE.Quaternion
    to: THREE.Quaternion
  }>({ phase: 'idle', t: 0, from: IDLE_QUAT.clone(), to: IDLE_QUAT.clone() })
  const lastTrigger = useRef(flipTrigger)

  if (flipTrigger !== lastTrigger.current) {
    lastTrigger.current = flipTrigger
    const group = pivotRef.current
    flip.current = {
      phase: 'toFlipped',
      t: 0,
      from: group ? group.quaternion.clone() : IDLE_QUAT.clone(),
      to: FLIPPED_QUAT.clone(),
    }
  }

  useFrame((_, rawDelta) => {
    const group = pivotRef.current
    const state = flip.current
    if (!group || state.phase === 'idle') return

    // Clamp only truly pathological stalls (tab backgrounded for a while) so
    // the animation can't visibly teleport -- a low but sustained frame rate
    // should still drive it at roughly correct wall-clock speed.
    const delta = Math.min(rawDelta, 0.25)

    if (state.phase === 'holding') {
      state.t += delta
      if (state.t >= HOLD_DURATION) {
        state.phase = 'toIdle'
        state.t = 0
        state.from = group.quaternion.clone()
        state.to = IDLE_QUAT.clone()
      }
      return
    }

    const duration = state.phase === 'toFlipped' ? FLIP_DURATION : RETURN_DURATION
    state.t += delta
    const eased = easeInOutCubic(Math.min(1, state.t / duration))
    group.quaternion.slerpQuaternions(state.from, state.to, eased)

    if (state.t >= duration) {
      if (state.phase === 'toFlipped') {
        state.phase = 'holding'
        state.t = 0
      } else {
        state.phase = 'idle'
        state.t = 0
      }
    }
  })

  const tagGeometry = useMemo(() => {
    const shape = createTagShape(tag.width, tag.bodyHeight, tag.capHeight, tag.cornerRadius)
    const holePath = createSlotPath(
      hangHole.width,
      hangHole.height,
      tag.width / 2,
      tag.height - hangHole.offsetFromTop,
    )
    shape.holes.push(holePath)

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: tag.thickness,
      bevelEnabled: false,
      curveSegments: 24,
    })

    // ExtrudeGeometry's default UV generator uses raw shape-space vertex
    // coordinates as UVs (not normalized to 0-1), which leaves texture
    // coordinates far outside the usual range and clamps to a single edge
    // pixel. Normalize them against the tag's own bounding box instead, so
    // the same texture is mapped across it like it is on the box faces.
    const uv = geometry.attributes.uv
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, uv.getX(i) / tag.width, uv.getY(i) / tag.height)
    }
    uv.needsUpdate = true

    geometry.translate(-tag.width / 2, 0, -tag.thickness / 2)
    return geometry
  }, [tag])

  return (
    // Rotate around the box's vertical center (not its base) so the tumble
    // stays roughly in place instead of swinging the tag off-frame.
    <group position={[0, pivotY, 0]} ref={pivotRef}>
      <group position={[0, -pivotY, 0]}>
        {/* Box body */}
        <mesh key={`body-${showProduct}`} position={[0, boxSize.y / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[boxSize.x, boxSize.y, boxSize.z]} />
          <meshStandardMaterial
            map={kraftMap}
            roughness={0.92}
            metalness={0}
            toneMapped={false}
            transparent={showProduct}
            opacity={showProduct ? 0.5 : 1}
            depthWrite={!showProduct}
          />
        </mesh>

        {/* Hang tag, standing up from the back top edge */}
        <mesh
          key={`tag-${showProduct}`}
          position={[0, boxSize.y, -boxSize.z / 2]}
          geometry={tagGeometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={kraftMap}
            roughness={0.92}
            metalness={0}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent={showProduct}
            opacity={showProduct ? 0.5 : 1}
            depthWrite={!showProduct}
          />
        </mesh>

        {/* Product placeholder -- sized to what was typed, resting on the
            box floor, revealed only while the walls are ghosted. */}
        {showProduct && (
          <mesh position={[0, productSize.y / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[productSize.x, productSize.y, productSize.z]} />
            <meshStandardMaterial color={PRODUCT_COLOR} roughness={0.75} metalness={0} />
          </mesh>
        )}
      </group>
    </group>
  )
}
