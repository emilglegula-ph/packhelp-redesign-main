import type { ReactNode } from 'react'

interface OptionGroupProps {
  title: string
  showLearnMore?: boolean
  scrollable?: boolean
  children: ReactNode
}

export default function OptionGroup({
  title,
  showLearnMore = false,
  scrollable = false,
  children,
}: OptionGroupProps) {
  return (
    <section className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.16] tracking-[-0.6px] text-richblue">
          {title}
        </h2>
        {showLearnMore && (
          <a
            href="#"
            className="border-b border-richblue/25 pb-px text-[13px] leading-[1.32] tracking-[-0.26px] text-richblue"
          >
            Learn more
          </a>
        )}
      </div>
      <div
        className={
          scrollable
            ? 'no-scrollbar flex w-[calc(100%+56px)] items-start gap-2 overflow-x-auto pr-14'
            : 'flex items-start gap-2'
        }
      >
        {children}
      </div>
    </section>
  )
}
