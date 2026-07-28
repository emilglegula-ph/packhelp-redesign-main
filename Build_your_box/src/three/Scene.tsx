import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import BoxModel from './BoxModel'
import BlobShadow from './BlobShadow'
import ShadowFloor from './ShadowFloor'
import DimensionOverlay from './DimensionOverlay'
import HdriEnvironment from './HdriEnvironment'
import AmbientOcclusion from './AmbientOcclusion'
import KeyLight from './KeyLight'
import { computeBoxSize, computeTag } from './dielineGeometry'
import type { DimensionField } from '../App'

export interface SceneApi {
  zoomIn: () => void
  zoomOut: () => void
}

// Symmetric 3/4 angle used to showcase all three dimension callouts at once.
const DIMENSION_VIEW_PHI = THREE.MathUtils.degToRad(58)
const DIMENSION_VIEW_THETA = THREE.MathUtils.degToRad(45)
// Default, slightly elevated 3/4 angle used the rest of the time.
const DEFAULT_PHI = THREE.MathUtils.degToRad(80)
const DEFAULT_THETA = THREE.MathUtils.degToRad(18)

const FOV = 32
const FIT_MARGIN = 1.55

function computeFraming(width: number, length: number, height: number) {
  const boxSize = computeBoxSize(width, length, height)
  const tag = computeTag(boxSize.x)
  const totalHeight = boxSize.y + tag.height
  const target = new THREE.Vector3(0, totalHeight * 0.5, -boxSize.z * 0.1)
  const boundingRadius = Math.sqrt(
    (boxSize.x / 2) ** 2 + (totalHeight / 2) ** 2 + (boxSize.z / 2) ** 2,
  )
  const fitDistance =
    (boundingRadius * FIT_MARGIN) / Math.sin(THREE.MathUtils.degToRad(FOV) / 2)
  return {
    boxSize,
    tag,
    target,
    boundingRadius,
    fitDistance,
    minDistance: fitDistance * 0.45,
    maxDistance: fitDistance * 3.2,
  }
}

interface CameraTween {
  fromTarget: THREE.Vector3
  toTarget: THREE.Vector3
  fromSpherical: THREE.Spherical
  toSpherical: THREE.Spherical
  t: number
  duration: number
}

interface ControlsBridgeProps {
  apiRef: React.RefObject<SceneApi | null>
  onZoomChange?: (percent: number) => void
  focusedDimension: DimensionField | null
  onInteractionStart?: () => void
  target: THREE.Vector3
  fitDistance: number
  minDistance: number
  maxDistance: number
  flipTrigger: number
}

function ControlsBridge({
  apiRef,
  onZoomChange,
  focusedDimension,
  onInteractionStart,
  target,
  fitDistance,
  minDistance,
  maxDistance,
  flipTrigger,
}: ControlsBridgeProps) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const tween = useRef<CameraTween | null>(null)
  const wasFocused = useRef(false)
  const fitDistanceRef = useRef(fitDistance)
  const isFirstFit = useRef(true)
  const lastFlipTrigger = useRef(flipTrigger)

  fitDistanceRef.current = fitDistance

  const reportZoom = () => {
    if (!onZoomChange) return
    const distance = camera.position.distanceTo(controlsRef.current?.target ?? target)
    onZoomChange(Math.round((fitDistanceRef.current / distance) * 100))
  }

  const zoomBy = (factor: number) => {
    const t = controlsRef.current?.target ?? target
    const offset = camera.position.clone().sub(t).multiplyScalar(factor)
    camera.position.copy(t).add(offset)
    controlsRef.current?.update()
    reportZoom()
  }

  useEffect(() => {
    apiRef.current = {
      zoomIn: () => zoomBy(0.85),
      zoomOut: () => zoomBy(1 / 0.85),
    }
  })

  const startTween = (
    toTarget: THREE.Vector3,
    toPhi: number | undefined,
    toTheta: number | undefined,
    toRadius: number | undefined,
    duration: number,
  ) => {
    const controls = controlsRef.current
    const fromTarget = controls ? controls.target.clone() : target.clone()
    const fromOffset = camera.position.clone().sub(fromTarget)
    const fromSpherical = new THREE.Spherical().setFromVector3(fromOffset)
    const toSpherical = new THREE.Spherical(
      toRadius ?? fromSpherical.radius,
      toPhi ?? fromSpherical.phi,
      toTheta ?? fromSpherical.theta,
    )
    tween.current = { fromTarget, toTarget: toTarget.clone(), fromSpherical, toSpherical, t: 0, duration }
  }

  // Reframe (distance + vertical target) whenever the box is resized, keeping
  // whatever azimuth/polar angle the user currently has.
  useEffect(() => {
    if (isFirstFit.current) {
      isFirstFit.current = false
      return
    }
    startTween(target, undefined, undefined, fitDistance, 0.5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.z, fitDistance])

  // Snap to the dimension-callout angle whenever a size field gains focus,
  // and back to the default angle once it's no longer focused -- otherwise
  // the camera stays stuck in the steep callout view for everything that
  // happens afterwards (e.g. a closure flip would be viewed from the wrong
  // angle and look completely different than it should).
  useEffect(() => {
    const isFocused = focusedDimension !== null
    if (isFocused && !wasFocused.current) {
      startTween(
        controlsRef.current?.target.clone() ?? target,
        DIMENSION_VIEW_PHI,
        DIMENSION_VIEW_THETA,
        undefined,
        0.5,
      )
    } else if (!isFocused && wasFocused.current) {
      startTween(
        controlsRef.current?.target.clone() ?? target,
        DEFAULT_PHI,
        DEFAULT_THETA,
        undefined,
        0.5,
      )
    }
    wasFocused.current = isFocused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedDimension])

  // A closure flip always reveals the underside from the same default
  // angle -- so if the user has freely orbited the camera elsewhere first,
  // snap back to that angle rather than showing the (fixed, world-space)
  // flip pose from whatever odd angle they'd dragged to.
  useEffect(() => {
    if (flipTrigger !== lastFlipTrigger.current) {
      lastFlipTrigger.current = flipTrigger
      startTween(target, DEFAULT_PHI, DEFAULT_THETA, undefined, 0.6)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipTrigger])

  useFrame((_, delta) => {
    const anim = tween.current
    if (!anim) return
    anim.t = Math.min(1, anim.t + delta / anim.duration)
    const eased = 1 - Math.pow(1 - anim.t, 3)
    const phi = THREE.MathUtils.lerp(anim.fromSpherical.phi, anim.toSpherical.phi, eased)
    const theta = THREE.MathUtils.lerp(anim.fromSpherical.theta, anim.toSpherical.theta, eased)
    const radius = THREE.MathUtils.lerp(anim.fromSpherical.radius, anim.toSpherical.radius, eased)
    const interpTarget = anim.fromTarget.clone().lerp(anim.toTarget, eased)
    const offset = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta))
    camera.position.copy(interpTarget).add(offset)
    if (controlsRef.current) controlsRef.current.target.copy(interpTarget)
    controlsRef.current?.update()
    if (anim.t >= 1) tween.current = null
  })

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enablePan={false}
      enableDamping
      dampingFactor={0.12}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
      onChange={reportZoom}
      onStart={onInteractionStart}
    />
  )
}

interface SceneProps {
  apiRef: React.RefObject<SceneApi | null>
  onZoomChange?: (percent: number) => void
  className?: string
  width: number
  length: number
  height: number
  sizeMode: 'external' | 'product'
  productBufferMm: number
  focusedDimension: DimensionField | null
  onInteractionStart: () => void
  flipTrigger: number
}

export default function Scene({
  apiRef,
  onZoomChange,
  className,
  width,
  length,
  height,
  sizeMode,
  productBufferMm,
  focusedDimension,
  onInteractionStart,
  flipTrigger,
}: SceneProps) {
  // In "Size of my product" mode the typed W/L/H describe the product --
  // the box itself is grown by the buffer so the product actually fits.
  const bufferCm = sizeMode === 'product' ? productBufferMm / 10 : 0
  const boxWidth = width + bufferCm
  const boxLength = length + bufferCm
  const boxHeight = height + bufferCm
  const showProduct = sizeMode === 'product' && focusedDimension !== null

  const framing = useMemo(
    () => computeFraming(boxWidth, boxLength, boxHeight),
    [boxWidth, boxLength, boxHeight],
  )
  const aoClipBox = useMemo(() => {
    const { boxSize, tag } = framing
    const pad = Math.max(boxSize.x, boxSize.z) * 0.15
    return new THREE.Box3(
      new THREE.Vector3(-boxSize.x / 2 - pad, -pad, -boxSize.z / 2 - pad),
      new THREE.Vector3(boxSize.x / 2 + pad, boxSize.y + tag.height + pad, boxSize.z / 2 + pad),
    )
  }, [framing])
  const initialCameraOffset = useMemo(
    () =>
      new THREE.Vector3()
        .setFromSpherical(new THREE.Spherical(framing.fitDistance, DEFAULT_PHI, DEFAULT_THETA))
        .add(framing.target),
    // Only used for the very first mount -- intentionally not reactive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Canvas
      className={className}
      shadows="soft"
      gl={{ alpha: true, antialias: true }}
      camera={{ position: initialCameraOffset.toArray(), fov: FOV, near: 1, far: 3000 }}
    >
      {/* Key light only -- the HDRI environment map below provides the main
          (fill/ambient) illumination and reflections. */}
      <KeyLight boundingRadius={framing.boundingRadius} />
      <Suspense fallback={null}>
        <HdriEnvironment />
        <BoxModel
          width={boxWidth}
          length={boxLength}
          height={boxHeight}
          flipTrigger={flipTrigger}
          showProduct={showProduct}
        />
      </Suspense>
      <ShadowFloor size={framing.boundingRadius * 6} opacity={0.25} />
      <BlobShadow width={framing.boxSize.x * 1.3} depth={framing.boxSize.z * 1.25} opacity={0.4} />
      <DimensionOverlay
        visible={focusedDimension !== null}
        activeField={focusedDimension}
        width={width}
        length={length}
        height={height}
      />
      <AmbientOcclusion clipBox={aoClipBox} />
      <ControlsBridge
        apiRef={apiRef}
        onZoomChange={onZoomChange}
        focusedDimension={focusedDimension}
        onInteractionStart={onInteractionStart}
        target={framing.target}
        fitDistance={framing.fitDistance}
        minDistance={framing.minDistance}
        maxDistance={framing.maxDistance}
        flipTrigger={flipTrigger}
      />
    </Canvas>
  )
}
