import { useState } from 'react'
import { imgChevron, imgSamples } from '../assets/figma'

interface QuantityTier {
  quantity: number
  pricePerPiece: number
  badge?: string
}

const TIERS: QuantityTier[] = [
  { quantity: 1, pricePerPiece: 17.13, badge: 'Prototype' },
  { quantity: 30, pricePerPiece: 0.92 },
  { quantity: 120, pricePerPiece: 0.6 },
  { quantity: 500, pricePerPiece: 0.38 },
  { quantity: 2000, pricePerPiece: 0.28 },
]

/** Off-tier quantities (from "Choose other value") get a rate linearly
 *  interpolated between the two tiers they fall between. */
function rateForQuantity(qty: number) {
  if (qty <= TIERS[0].quantity) return TIERS[0].pricePerPiece
  const last = TIERS[TIERS.length - 1]
  if (qty >= last.quantity) return last.pricePerPiece
  for (let i = 0; i < TIERS.length - 1; i++) {
    const a = TIERS[i]
    const b = TIERS[i + 1]
    if (qty >= a.quantity && qty <= b.quantity) {
      const t = (qty - a.quantity) / (b.quantity - a.quantity)
      return a.pricePerPiece + (b.pricePerPiece - a.pricePerPiece) * t
    }
  }
  return last.pricePerPiece
}

interface QuantitySectionProps {
  quantity: number
  onQuantityChange: (quantity: number, pricePerPiece: number) => void
}

export default function QuantitySection({ quantity, onQuantityChange }: QuantitySectionProps) {
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const isTierSelected = TIERS.some((tier) => tier.quantity === quantity)

  const submitCustomValue = () => {
    const parsed = Math.round(Number(customValue))
    if (!Number.isFinite(parsed) || parsed <= 0) return
    onQuantityChange(parsed, rateForQuantity(parsed))
  }

  return (
    <section className="flex w-full flex-col items-start gap-3">
      <h2 className="text-[20px] font-medium leading-[1.16] tracking-[-0.6px] text-richblue">
        Quantity
      </h2>
      <div className="flex w-full flex-col gap-2">
        {TIERS.map((tier) => {
          const isSelected = isTierSelected && tier.quantity === quantity
          return (
            <button
              key={tier.quantity}
              type="button"
              onClick={() => onQuantityChange(tier.quantity, tier.pricePerPiece)}
              className={`flex w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-left transition-colors ${
                isSelected
                  ? 'border border-grey-400 bg-white shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
                  : 'border border-transparent bg-preview-bg hover:bg-grey-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue">
                  {tier.quantity}
                </span>
                {tier.badge && (
                  <span className="rounded bg-grey-200 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-grey-600">
                    {tier.badge}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-3 whitespace-nowrap text-right text-[15px]">
                <span className="leading-[1.32] tracking-[-0.3px] text-grey-500">
                  €{tier.pricePerPiece.toFixed(2)}/piece
                </span>
                <span className="font-medium leading-[1.16] tracking-[-0.3px] text-richblue">
                  €{(tier.quantity * tier.pricePerPiece).toFixed(2)}
                </span>
              </span>
            </button>
          )
        })}

        <div
          className={`rounded-lg transition-colors ${
            !isTierSelected
              ? 'border border-grey-400 bg-white shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
              : 'border border-transparent bg-preview-bg hover:bg-grey-300'
          }`}
        >
          <button
            type="button"
            onClick={() => setCustomOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <span className="text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue">
              Choose other value
            </span>
            <img
              src={imgChevron}
              alt=""
              className={`size-4 transition-transform ${customOpen ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
          {customOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitCustomValue()
              }}
              className="flex items-center gap-2 px-4 pb-4"
            >
              <input
                type="number"
                min={1}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Quantity"
                autoFocus
                className="h-10 flex-1 rounded-lg border border-grey-400 bg-white px-3 text-[15px] text-richblue outline-none focus:border-2 focus:border-dark-blue [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="submit"
                className="h-10 shrink-0 cursor-pointer rounded-lg bg-richblue/[0.04] px-4 text-[13px] font-medium text-richblue transition-colors hover:bg-richblue/[0.08]"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="flex items-center pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] leading-[1.32] tracking-[-0.26px] text-grey-600">
            Bigger needs?
          </span>
          <div className="flex items-center gap-1">
            <img src={imgSamples} alt="" className="size-3" />
            <a
              href="#"
              className="border-b border-richblue/25 pb-px text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue"
            >
              Let's talk
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
