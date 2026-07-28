interface ShadowFloorProps {
  size: number
  y?: number
  opacity?: number
}

/**
 * A shadow-catcher plane: fully transparent except where the directional
 * light's soft shadow falls, so it composites cleanly over the transparent
 * canvas background instead of drawing a visible floor.
 */
export default function ShadowFloor({ size, y = -0.2, opacity = 0.25 }: ShadowFloorProps) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow renderOrder={-3}>
      <planeGeometry args={[size, size]} />
      <shadowMaterial opacity={opacity} toneMapped={false} />
    </mesh>
  )
}
