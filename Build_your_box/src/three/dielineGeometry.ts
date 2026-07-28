import dieline from '../data/dieline.json'

export const CM_TO_UNITS = 10
export const MIN_DIMENSION_CM = 5
export const MAX_DIMENSION_CM = 50

// "Size of my product" mode: the typed W/L/H describe the product, and the
// box is grown by this buffer so the product actually fits inside it.
export const MIN_PRODUCT_BUFFER_MM = 0
export const MAX_PRODUCT_BUFFER_MM = 20
export const DEFAULT_PRODUCT_BUFFER_MM = 5

export interface BoxSize {
  x: number
  y: number
  z: number
}

/** Box body world size, driven live by the Width/Length/Height form fields (in cm). */
export function computeBoxSize(widthCm: number, lengthCm: number, heightCm: number): BoxSize {
  return {
    x: widthCm * CM_TO_UNITS,
    y: heightCm * CM_TO_UNITS,
    z: lengthCm * CM_TO_UNITS,
  }
}

// The hang-tag's own proportions (cap height, corner radius, thickness) stay
// fixed regardless of box size -- only its width follows the box's front
// panel width, same as it's physically glued to that edge.
const TAG_HEIGHT_SCALE = 0.5
const TAG_BODY_HEIGHT = 124 * TAG_HEIGHT_SCALE
const TAG_CAP_HEIGHT = 15 * TAG_HEIGHT_SCALE
const TAG_CORNER_RADIUS = 14 * TAG_HEIGHT_SCALE
const TAG_THICKNESS = dieline.resolvedParams.thickness * 2

export interface TagSize {
  width: number
  bodyHeight: number
  capHeight: number
  height: number
  cornerRadius: number
  thickness: number
}

export function computeTag(boxWidthUnits: number): TagSize {
  return {
    width: boxWidthUnits,
    bodyHeight: TAG_BODY_HEIGHT,
    capHeight: TAG_CAP_HEIGHT,
    height: TAG_BODY_HEIGHT + TAG_CAP_HEIGHT,
    cornerRadius: TAG_CORNER_RADIUS,
    thickness: TAG_THICKNESS,
  }
}

const hole = dieline.holes[0].points
const holeMinX = Math.min(...hole.map((p) => p.x))
const holeMaxX = Math.max(...hole.map((p) => p.x))
const holeMinY = Math.min(...hole.map((p) => p.y))
const holeMaxY = Math.max(...hole.map((p) => p.y))

export const hangHole = {
  width: holeMaxX - holeMinX,
  height: holeMaxY - holeMinY,
  endRadius: 2.5,
  bumpRadius: 4,
  // distance from the top of the tag to the hole's vertical center
  offsetFromTop: 32 * TAG_HEIGHT_SCALE,
}
