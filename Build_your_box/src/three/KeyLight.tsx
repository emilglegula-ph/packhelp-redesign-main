import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface KeyLightProps {
  boundingRadius: number
}

/**
 * The scene's single directional key light. Configured imperatively because
 * DirectionalLightShadow's camera frustum (left/right/top/bottom/near/far)
 * needs an explicit `updateProjectionMatrix()` call after being resized --
 * setting those as plain JSX props doesn't trigger it, so the shadow camera
 * would keep three's default -5..5 frustum, far too small at our scale.
 */
export default function KeyLight({ boundingRadius }: KeyLightProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    const light = lightRef.current
    if (!light) return

    const extent = boundingRadius * 1.4
    const cam = light.shadow.camera
    cam.left = -extent
    cam.right = extent
    cam.top = extent
    cam.bottom = -extent
    cam.near = 1
    cam.far = boundingRadius * 5
    cam.updateProjectionMatrix()

    light.shadow.mapSize.set(2048, 2048)
    light.shadow.radius = 10
    light.shadow.bias = -0.0005
    light.shadow.needsUpdate = true
  }, [boundingRadius])

  return <directionalLight ref={lightRef} position={[180, 320, 220]} intensity={0.4} castShadow />
}
