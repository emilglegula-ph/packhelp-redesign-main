import { useEffect } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { useLoader, useThree } from '@react-three/fiber'
// ?inline (base64 data: URI baked into the JS bundle) rather than ?url (a
// separate emitted file): the HDR loader fetches this via fetch(), and
// Chrome refuses fetch() to file:// URLs outright, which breaks the
// double-click-to-open dist/index.html build. fetch() has no such
// restriction on data: URIs, so inlining is what makes that work.
import hdriUrl from '../assets/hdri/studio_small_03_1k.hdr?inline'

export default function HdriEnvironment() {
  const { gl, scene } = useThree()
  const hdrTexture = useLoader(RGBELoader, hdriUrl)

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    pmremGenerator.compileEquirectangularShader()

    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture
    scene.environment = envMap

    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.68

    return () => {
      scene.environment = null
      envMap.dispose()
      pmremGenerator.dispose()
    }
  }, [gl, scene, hdrTexture])

  return null
}
