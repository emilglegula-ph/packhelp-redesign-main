import { finishOptions } from '../data/optionsData'

interface FinishSectionProps {
  selected: string
  onSelect: (id: string) => void
}

export default function FinishSection({ selected, onSelect }: FinishSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="w-full text-[20px] font-medium leading-[1.16] tracking-[-0.4px] text-richblue">
        Finish
      </h2>
      <div className="flex items-start gap-2">
        {finishOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`flex cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-[15px] leading-[1.32] tracking-[-0.3px] text-richblue transition-colors ${
              selected === option.id
                ? 'border border-grey-400 bg-white shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
                : 'border border-transparent bg-preview-bg hover:bg-grey-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  )
}
