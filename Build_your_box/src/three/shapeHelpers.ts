import * as THREE from 'three'

/** A capsule/stadium-shaped path (fully rounded short ends) used for the hang hole. */
export function createSlotPath(width: number, height: number, cx = 0, cy = 0) {
  const path = new THREE.Path()
  const r = height / 2
  const hw = width / 2

  path.moveTo(cx - hw + r, cy - r)
  path.lineTo(cx + hw - r, cy - r)
  path.absarc(cx + hw - r, cy, r, -Math.PI / 2, Math.PI / 2, false)
  path.lineTo(cx - hw + r, cy + r)
  path.absarc(cx - hw + r, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false)

  return path
}

/**
 * A rectangle (origin at bottom-left, width x bodyHeight) topped with a cap of
 * `capHeight` whose top-left/top-right corners are rounded by `cornerRadius`,
 * matching the hang-tag silhouette described in the dieline.
 */
export function createTagShape(
  width: number,
  bodyHeight: number,
  capHeight: number,
  cornerRadius: number,
) {
  const shape = new THREE.Shape()
  const totalHeight = bodyHeight + capHeight

  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width, bodyHeight)
  shape.quadraticCurveTo(width, totalHeight, width - cornerRadius, totalHeight)
  shape.lineTo(cornerRadius, totalHeight)
  shape.quadraticCurveTo(0, totalHeight, 0, bodyHeight)
  shape.lineTo(0, 0)

  return shape
}
