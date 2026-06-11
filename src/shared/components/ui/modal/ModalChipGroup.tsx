export interface ModalChipOption<T> {
  label: string;
  value: T;
}

export interface ModalChipGroupProps<T> {
  options: ModalChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ModalChipGroup<T extends string | number>({ options, value, onChange }: ModalChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-[#00e676] text-[#0d1b2a] shadow-sm ring-1 ring-[#00e676]/50'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent dark:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
