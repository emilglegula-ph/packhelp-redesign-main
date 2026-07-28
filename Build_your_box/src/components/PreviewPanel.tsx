import { useRef, useState } from 'react'
import { imgLogo, imgZoomIn, imgZoomOut } from '../assets/figma'
import Scene, { type SceneApi } from '../three/Scene'
import type { DimensionField } from '../App'

interface PreviewPanelProps {
  width: number
  length: number
  height: number
  sizeMode: 'external' | 'product'
  productBufferMm: number
  focusedDimension: DimensionField | null
  onInteractionStart: () => void
  flipTrigger: number
}

export default function PreviewPanel({
  width,
  length,
  height,
  sizeMode,
  productBufferMm,
  focusedDimension,
  onInteractionStart,
  flipTrigger,
}: PreviewPanelProps) {
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [openness, setOpenness] = useState(0)
  const [zoom, setZoom] = useState(100)
  const sceneApiRef = useRef<SceneApi | null>(null)

  return (
    <div className="relative ml-3 my-3 flex h-[calc(100%-24px)] flex-1 items-center justify-center overflow-hidden rounded-[32px] bg-preview-bg">
      <a href="../../index.html" className="absolute left-8 top-8 z-10">
        <img src={imgLogo} alt="Packhelp" className="h-[28px] w-[145px]" />
      </a>

      <Scene
        apiRef={sceneApiRef}
        onZoomChange={setZoom}
        className="size-full"
        width={width}
        length={length}
        height={height}
        sizeMode={sizeMode}
        productBufferMm={productBufferMm}
        focusedDimension={focusedDimension}
        onInteractionStart={onInteractionStart}
        flipTrigger={flipTrigger}
      />

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6">
        <div className="flex h-9 items-center rounded-full bg-black/[0.04] backdrop-blur-[5px]">
          <div className="flex h-8 flex-col items-center justify-center rounded-full pl-1">
            <button
              type="button"
              onClick={() => setSide('front')}
              className={`flex h-7 w-[55px] cursor-pointer items-center justify-center rounded-full text-[13px] leading-[1.32] tracking-[-0.26px] transition-colors ${
                side === 'front'
                  ? 'bg-gradient-to-b from-white to-grey-100 text-richblue shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
                  : 'text-grey-600 hover:text-richblue'
              }`}
            >
              Front
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSide('back')}
            className={`flex h-9 cursor-pointer items-center justify-center rounded-full pl-3 pr-4 text-[13px] leading-[1.32] tracking-[-0.26px] transition-colors ${
              side === 'back' ? 'text-richblue' : 'text-grey-600 hover:text-richblue'
            }`}
          >
            Back
          </button>
        </div>

        <div className="flex h-9 items-center rounded-full bg-black/[0.04] backdrop-blur-[5px]">
          <button
            type="button"
            onClick={() => setOpenness(0)}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full pl-[18px] pr-4 text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue transition-colors hover:text-grey-600"
          >
            Close
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={openness}
            onChange={(e) => setOpenness(Number(e.target.value))}
            aria-label="Box openness"
            className="open-slider w-[100px]"
            style={{ '--slider-fill': `${openness}%` } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={() => setOpenness(100)}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full pl-4 pr-[18px] text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue transition-colors hover:text-grey-600"
          >
            Open
          </button>
        </div>

        <div className="flex h-9 items-center rounded-full bg-richblue/[0.04]">
          <button
            type="button"
            onClick={() => sceneApiRef.current?.zoomOut()}
            className="m-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-white to-grey-100 shadow-[0_2px_2px_rgba(0,0,0,0.08)] transition-[filter] hover:brightness-95"
          >
            <img src={imgZoomOut} alt="Zoom out" className="size-4" />
          </button>
          <span className="w-12 shrink-0 text-center text-[13px] leading-[1.32] tracking-[-0.26px] text-grey-600">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => sceneApiRef.current?.zoomIn()}
            className="m-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-white to-grey-100 shadow-[0_2px_2px_rgba(0,0,0,0.08)] transition-[filter] hover:brightness-95"
          >
            <img src={imgZoomIn} alt="Zoom in" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
