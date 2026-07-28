interface StickyDeliveryBarProps {
  visible: boolean
  quantity: number
  total: string
}

export default function StickyDeliveryBar({ visible, quantity, total }: StickyDeliveryBarProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-0 right-0 z-20 w-[540px] pl-11 pr-14 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="pointer-events-auto flex h-[72px] w-full flex-col items-start justify-center gap-2 rounded-t-2xl border-x border-t border-grey-300 bg-white/80 px-4 py-3 shadow-[0_-5px_16px_rgba(47,47,47,0.06)] backdrop-blur-[4px]">
        <div className="flex w-full items-center gap-4">
          <div className="flex flex-1 items-center">
            <div className="flex flex-col items-start justify-center gap-1">
              <span className="whitespace-nowrap text-[13px] leading-[1.32] tracking-[-0.26px] text-grey-600">
                Delivery
              </span>
              <a
                href="#"
                className="cursor-pointer whitespace-nowrap border-b border-richblue/25 pb-px text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue"
              >
                20-28 April
              </a>
            </div>
            <div className="flex flex-1 flex-col items-end justify-center gap-1 whitespace-nowrap text-right">
              <span className="text-[13px] leading-[1.32] tracking-[-0.26px] text-grey-600">
                Netto / {quantity} pieces
              </span>
              <span className="text-[17px] font-medium leading-[1.16] tracking-[-0.34px] text-richblue">
                {total}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ph-blue px-5 text-[15px] font-normal leading-[1.32] tracking-[-0.3px] text-white transition-colors hover:bg-dark-blue"
          >
            Customize design
          </button>
        </div>
      </div>
    </div>
  )
}
