import { useMemo } from 'react'
import * as THREE from 'three'

interface BlobShadowProps {
  width: number
  depth: number
  opacity?: number
  y?: number
}

/**
 * A small, sharp contact shadow directly under the box's base: a dark radial
 * gradient fading to fully transparent at its edge, alpha-blended over the
 * (transparent) canvas.
 *
 * Note: true GL MultiplyBlending was tried here first (per spec), but it
 * requires real opaque pixels behind it to darken -- against our
 * intentionally transparent canvas (so the panel's own background shows
 * through) those pixels are alpha=0, so multiplying leaves them alpha=0
 * regardless of the RGB math, i.e. invisible. Normal alpha blending gives
 * the same "small, dark, sharp" look and composites correctly either way.
 */
export default function BlobShadow({ width, depth, opacity = 0.4, y = -0.05 }: BlobShadowProps) {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)

    gradient.addColorStop(0, 'rgba(35, 26, 18, 1)')
    gradient.addColorStop(0.32, 'rgba(35, 26, 18, 0.9)')
    gradient.addColorStop(0.62, 'rgba(35, 26, 18, 0.35)')
    gradient.addColorStop(1, 'rgba(35, 26, 18, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
