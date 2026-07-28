import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

// The box lives on a ~50-500 world-unit scale (1 unit = 1mm), well beyond
// GTAOShader's default radius (tuned for a ~1 unit scene) -- scaled up here
// so occlusion actually shows up in the corners and at the tag seam.
const AO_RADIUS = 18

interface AmbientOcclusionProps {
  /** AABB (min/max) tightly bounding just the box+tag, in world units. */
  clipBox: THREE.Box3
}

export default function AmbientOcclusion({ clipBox }: AmbientOcclusionProps) {
  const { gl, scene, camera, size } = useThree()

  const { composer, gtaoPass } = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
    })
    const composer = new EffectComposer(gl, renderTarget)
    composer.addPass(new RenderPass(scene, camera))

    const gtaoPass = new GTAOPass(scene, camera, size.width, size.height)
    gtaoPass.output = GTAOPass.OUTPUT.Default
    gtaoPass.updateGtaoMaterial({
      radius: AO_RADIUS,
      distanceExponent: 1,
      thickness: AO_RADIUS * 2,
    })
    gtaoPass.blendIntensity = 0.7
    composer.addPass(gtaoPass)

    composer.addPass(new OutputPass())

    return { composer, gtaoPass }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene])

  useEffect(() => {
    composer.setSize(size.width, size.height)
    gtaoPass.setSize(size.width, size.height)
  }, [composer, gtaoPass, size])

  useEffect(() => {
    gtaoPass.setSceneClipBox(clipBox)
  }, [gtaoPass, clipBox])

  useEffect(() => composer.dispose, [composer])

  useFrame((_, delta) => {
    composer.render(delta)
  }, 1)

  return null
}
