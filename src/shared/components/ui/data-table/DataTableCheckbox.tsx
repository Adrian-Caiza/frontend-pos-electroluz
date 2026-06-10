import { Checkbox } from "../checkbox"

interface DataTableCheckboxProps {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
  ariaLabel?: string
}

export function DataTableCheckbox({
  checked,
  onCheckedChange,
  ariaLabel,
}: DataTableCheckboxProps) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel}
        className="translate-y-[2px] border-slate-300 shadow-sm data-[state=checked]:border-primary"
      />
    </div>
  )
}
