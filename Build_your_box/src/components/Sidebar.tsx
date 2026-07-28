import { useEffect, useRef, useState } from 'react'
import OptionGroup from './OptionGroup'
import Chip from './Chip'
import SizeSection from './SizeSection'
import FinishSection from './FinishSection'
import QuantitySection from './QuantitySection'
import SummarySection from './SummarySection'
import StickyDeliveryBar from './StickyDeliveryBar'
import type { DimensionField } from '../App'
import {
  boxTypeOptions,
  constructionOptions,
  closureOptions,
  windowsOptions,
  materialColorOptions,
  printOptions,
  printCoverageOptions,
} from '../data/optionsData'

interface SidebarProps {
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
  onClosureClick: () => void
}

export default function Sidebar({
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
  onClosureClick,
}: SidebarProps) {
  const [boxType, setBoxType] = useState('folding')
  const [construction, setConstruction] = useState('hanging')
  const [closure, setClosure] = useState('snap-lock')
  const [windows, setWindows] = useState('kraft')
  const [materialColor, setMaterialColor] = useState('kraft')
  const [print, setPrint] = useState('custom')
  const [printCoverage, setPrintCoverage] = useState('outside')
  const [finish, setFinish] = useState('goss')

  const [quantity, setQuantity] = useState(30)
  const [pricePerPiece, setPricePerPiece] = useState(0.92)
  const total = `€${(quantity * pricePerPiece).toFixed(2)}`

  const scrollRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [summaryVisible, setSummaryVisible] = useState(false)

  useEffect(() => {
    const root = scrollRef.current
    const target = summaryRef.current
    if (!root || !target) return

    const observer = new IntersectionObserver(([entry]) => setSummaryVisible(entry.isIntersecting), {
      root,
      threshold: 0,
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={scrollRef} className="h-full w-[540px] shrink-0 overflow-y-auto bg-white">
      <div className="flex flex-col items-start gap-14 pb-14 pl-11 pr-14 pt-14">
        <header className="flex w-full flex-col items-start gap-2">
          <h1 className="text-[40px] font-medium leading-[1.08] tracking-[-2px] text-richblue">
            Build your box
          </h1>
          <p className="w-full text-[17px] leading-[1.32] tracking-[-0.34px] text-grey-600">
            Quickly configure the exact box type you need
          </p>
        </header>

        <OptionGroup title="Box type" showLearnMore>
          {boxTypeOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={boxType === option.id}
              onSelect={() => setBoxType(option.id)}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Construction" showLearnMore scrollable>
          {constructionOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={construction === option.id}
              onSelect={() => setConstruction(option.id)}
            />
          ))}
        </OptionGroup>

        <SizeSection
          sizeMode={sizeMode}
          onSizeModeChange={onSizeModeChange}
          width={width}
          length={length}
          height={height}
          onWidthChange={onWidthChange}
          onLengthChange={onLengthChange}
          onHeightChange={onHeightChange}
          productBufferMm={productBufferMm}
          onProductBufferIncrease={onProductBufferIncrease}
          onProductBufferDecrease={onProductBufferDecrease}
          focusedDimension={focusedDimension}
          onFocusDimension={onFocusDimension}
        />

        <OptionGroup title="Closure">
          {closureOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={closure === option.id}
              onSelect={() => {
                setClosure(option.id)
                onClosureClick()
              }}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Windows and cutouts">
          {windowsOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={windows === option.id}
              onSelect={() => setWindows(option.id)}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Material color">
          {materialColorOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={materialColor === option.id}
              onSelect={() => setMaterialColor(option.id)}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Print">
          {printOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={print === option.id}
              onSelect={() => setPrint(option.id)}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Print coverage">
          {printCoverageOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              selected={printCoverage === option.id}
              onSelect={() => setPrintCoverage(option.id)}
            />
          ))}
        </OptionGroup>

        <FinishSection selected={finish} onSelect={setFinish} />

        <QuantitySection
          quantity={quantity}
          onQuantityChange={(nextQuantity, nextPricePerPiece) => {
            setQuantity(nextQuantity)
            setPricePerPiece(nextPricePerPiece)
          }}
        />

        <div ref={summaryRef} className="w-full">
          <SummarySection quantity={quantity} total={total} />
        </div>
      </div>

      <StickyDeliveryBar visible={!summaryVisible} quantity={quantity} total={total} />
    </div>
  )
}
