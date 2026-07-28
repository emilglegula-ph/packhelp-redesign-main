import { useState } from 'react'
import PreviewPanel from './components/PreviewPanel'
import Sidebar from './components/Sidebar'
import {
  DEFAULT_PRODUCT_BUFFER_MM,
  MAX_PRODUCT_BUFFER_MM,
  MIN_PRODUCT_BUFFER_MM,
} from './three/dielineGeometry'

export type DimensionField = 'width' | 'length' | 'height'

function App() {
  const [sizeMode, setSizeMode] = useState<'external' | 'product'>('external')
  const [width, setWidth] = useState(8)
  const [length, setLength] = useState(8)
  const [height, setHeight] = useState(12)
  const [productBufferMm, setProductBufferMm] = useState(DEFAULT_PRODUCT_BUFFER_MM)
  const [focusedDimension, setFocusedDimension] = useState<DimensionField | null>(null)
  const [flipTrigger, setFlipTrigger] = useState(0)

  const changeProductBuffer = (delta: number) =>
    setProductBufferMm((mm) =>
      Math.min(MAX_PRODUCT_BUFFER_MM, Math.max(MIN_PRODUCT_BUFFER_MM, mm + delta)),
    )

  return (
    <div className="flex h-screen w-screen items-start gap-3 bg-white">
      <PreviewPanel
        width={width}
        length={length}
        height={height}
        sizeMode={sizeMode}
        productBufferMm={productBufferMm}
        focusedDimension={focusedDimension}
        onInteractionStart={() => setFocusedDimension(null)}
        flipTrigger={flipTrigger}
      />
      <Sidebar
        sizeMode={sizeMode}
        onSizeModeChange={setSizeMode}
        width={width}
        length={length}
        height={height}
        onWidthChange={setWidth}
        onLengthChange={setLength}
        onHeightChange={setHeight}
        productBufferMm={productBufferMm}
        onProductBufferIncrease={() => changeProductBuffer(1)}
        onProductBufferDecrease={() => changeProductBuffer(-1)}
        focusedDimension={focusedDimension}
        onFocusDimension={setFocusedDimension}
        onClosureClick={() => setFlipTrigger((n) => n + 1)}
      />
    </div>
  )
}

export default App
