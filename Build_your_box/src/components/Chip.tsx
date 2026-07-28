import type { ChipOption } from '../data/optionsData'

interface ChipProps {
  option: ChipOption
  selected: boolean
  onSelect: () => void
}

export default function Chip({ option, selected, onSelect }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-[133px] w-[104px] shrink-0 cursor-pointer flex-col items-center justify-start rounded-xl text-left ring-1 ring-inset transition-colors ${
        selected
          ? 'ring-grey-400 bg-white shadow-[0_2px_2px_rgba(0,0,0,0.08)]'
          : 'bg-preview-bg ring-transparent hover:bg-grey-300'
      }`}
    >
      <span className="relative flex size-[104px] shrink-0 items-center justify-center overflow-hidden rounded-t-xl">
        {option.fit === 'cover' && option.image && (
          <img src={option.image} alt="" className="size-full object-cover" />
        )}
        {option.fit === 'icon' && option.image && (
          <img src={option.image} alt="" className="h-auto w-16" />
        )}
      </span>
      <span
        className={`whitespace-nowrap pb-3 text-[13px] leading-[1.32] tracking-[-0.26px] ${
          selected ? 'text-richblue' : 'text-grey-600'
        }`}
      >
        {option.label}
      </span>
    </button>
  )
}
