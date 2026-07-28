import { useEffect, useRef, useState } from 'react'
import type { DimensionField } from '../App'
import {
  MAX_DIMENSION_CM,
  MAX_PRODUCT_BUFFER_MM,
  MIN_DIMENSION_CM,
  MIN_PRODUCT_BUFFER_MM,
} from '../three/dielineGeometry'

const DEBOUNCE_MS = 450

interface SizeSectionProps {
  sizeMode: 'external' | 'product'
  onSizeModeChange: (mode: 'external' | 'product') => void
  width: number
  length: number
  height: number
  onWidthChange: (value: number) => void
  onLengthChange: (value: number) => void
  onHeightChange: (value: number) => void
  productBufferMm: number
  onProductBufferIncrease: () => void
  onProductBufferDecrease: () => void
  focusedDimension: DimensionField | null
  onFocusDimension: (field: DimensionField | null) => void
}

/** Trims float addition artifacts (8 + 0.5 -> "8.5", not "8.500000000001"). */
function formatCm(value: number) {
  return Number(value.toFixed(2)).toString()
}

function NumberField({
  field,
  label,
  value,
  onChange,
  focused,
  onFocusDimension,
}: {
  field: DimensionField
  label: string
  value: number
  onChange: (value: number) => void
  focused: boolean
  onFocusDimension: (field: DimensionField | null) => void
}) {
  const [text, setText] = useState(String(value))
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const handleChange = (raw: string) => {
    setText(raw)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const parsed = Number(raw)
      if (raw.trim() === '' || Number.isNaN(parsed)) {
        setError(`Enter a value between ${MIN_DIMENSION_CM} and ${MAX_DIMENSION_CM} cm`)
        return
      }
      if (parsed < MIN_DIMENSION_CM || parsed > MAX_DIMENSION_CM) {
        setError(`Must be between ${MIN_DIMENSION_CM} and ${MAX_DIMENSION_CM} cm`)
        return
      }
      setError(null)
      onChange(parsed)
    }, DEBOUNCE_MS)
  }

  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-1">
      <span className="text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue">{label}</span>
      <div
        className={`flex h-12 w-full items-center justify-end gap-2 rounded-lg bg-white px-4 py-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)] ${
          focused
            ? 'border-2 border-dark-blue'
            : error
              ? 'border border-red-500'
              : 'border border-grey-400'
        }`}
      >
        <input
          type="number"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => onFocusDimension(field)}
          onBlur={() => onFocusDimension(null)}
          className="min-w-0 flex-1 bg-transparent text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="whitespace-nowrap text-right text-[15px] leading-[1.32] tracking-[-0.3px] text-grey-500">
          cm
        </span>
      </div>
      {error && (
        <span className="text-[11px] leading-[1.32] tracking-[-0.22px] text-red-500">{error}</span>
      )}
    </div>
  )
}

export default function SizeSection({
  sizeMode,
  onSizeModeChange,
  width,
  length,
  height,
  onWidthChange,
  onLengthChange,
  onHeightChange,
  productBufferMm,
  onProductBufferIncrease,
  onProductBufferDecrease,
  focusedDimension,
  onFocusDimension,
}: SizeSectionProps) {
  const bufferCm = productBufferMm / 10

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <h2 className="text-[20px] font-medium leading-[1.16] tracking-[-0.6px] text-richblue">
          Size
        </h2>
        <div className="flex items-start gap-1">
          <button
            type="button"
            onClick={() => onSizeModeChange('external')}
            className={`flex h-7 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-[13px] leading-[1.32] tracking-[-0.26px] transition-colors ${
              sizeMode === 'external'
                ? 'border border-grey-400 bg-white text-richblue shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
                : 'border border-grey-300 bg-grey-100 text-grey-600 hover:bg-grey-300'
            }`}
          >
            External size
          </button>
          <button
            type="button"
            onClick={() => onSizeModeChange('product')}
            className={`flex h-7 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-[13px] leading-[1.32] tracking-[-0.26px] transition-colors ${
              sizeMode === 'product'
                ? 'border border-grey-400 bg-white text-richblue shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
                : 'border border-grey-300 bg-grey-100 text-grey-600 hover:bg-grey-300'
            }`}
          >
            Size of my product
          </button>
        </div>
      </div>
      <div className="flex w-full items-start justify-end gap-2">
        <NumberField
          field="width"
          label="Width"
          value={width}
          onChange={onWidthChange}
          focused={focusedDimension === 'width'}
          onFocusDimension={onFocusDimension}
        />
        <NumberField
          field="length"
          label="Length"
          value={length}
          onChange={onLengthChange}
          focused={focusedDimension === 'length'}
          onFocusDimension={onFocusDimension}
        />
        <NumberField
          field="height"
          label="Height"
          value={height}
          onChange={onHeightChange}
          focused={focusedDimension === 'height'}
          onFocusDimension={onFocusDimension}
        />
      </div>
      {sizeMode === 'product' && (
        <div className="flex w-full flex-col items-start justify-center gap-2 rounded-lg bg-[#fff3d8] p-3">
          <p className="text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue">
            We automatically add a {productBufferMm} mm buffer on all sides to ensure your product
            fits. External size of the box: W {formatCm(width + bufferCm)} cm x L{' '}
            {formatCm(length + bufferCm)} cm x h {formatCm(height + bufferCm)} cm
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue">
              Buffer size:
            </span>
            <div className="flex h-8 items-center gap-2 rounded-full bg-richblue/[0.04] px-1">
              <button
                type="button"
                onClick={onProductBufferDecrease}
                disabled={productBufferMm <= MIN_PRODUCT_BUFFER_MM}
                className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-white to-grey-100 text-[15px] leading-none text-richblue shadow-[0_2px_2px_rgba(0,0,0,0.08)] transition-[filter] enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-[36px] text-center text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue">
                {productBufferMm} mm
              </span>
              <button
                type="button"
                onClick={onProductBufferIncrease}
                disabled={productBufferMm >= MAX_PRODUCT_BUFFER_MM}
                className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-white to-grey-100 text-[15px] leading-none text-richblue shadow-[0_2px_2px_rgba(0,0,0,0.08)] transition-[filter] enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
