const deliveryOptions = [
  { date: '20 April', price: 'Free' },
  { date: '24 April', price: '+ €12.80' },
  { date: '28 April', price: '+ €32.50' },
]

export default function SummarySection({ quantity, total }: { quantity: number; total: string }) {
  return (
    <section className="flex w-full flex-col items-start gap-6 border-t border-grey-300 pt-6">
      <div className="flex w-full items-end justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start gap-1">
            <span className="text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue">
              Delivery to:
            </span>
            <a
              href="#"
              className="border-b border-richblue/25 pb-px text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue"
            >
              Norway, 05-800
            </a>
          </div>
          <ul className="flex flex-col gap-1 text-[15px] tracking-[-0.3px]">
            {deliveryOptions.map((option) => (
              <li key={option.date} className="flex list-none items-center gap-1">
                <span className="relative flex items-center gap-1 pl-[18px] leading-[1.32] text-richblue before:absolute before:left-0 before:top-1/2 before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-richblue">
                  {option.date}
                </span>
                <span className="leading-[1.32] text-grey-600">{option.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-end justify-center gap-1 whitespace-nowrap text-right">
          <span className="text-[15px] leading-[1.32] tracking-[-0.3px] text-grey-600">
            Netto / {quantity} pieces
          </span>
          <span className="text-[32px] font-medium leading-[1.08] tracking-[-1.6px] text-richblue">
            {total}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2">
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-ph-blue px-4 text-[15px] font-normal leading-[1.32] tracking-[-0.3px] text-white transition-colors hover:bg-dark-blue"
        >
          Customize design
        </button>
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-grey-200 px-4 text-[15px] font-normal leading-[1.32] tracking-[-0.3px] text-richblue transition-colors hover:bg-grey-300"
        >
          Skip design for now
        </button>
      </div>
    </section>
  )
}
