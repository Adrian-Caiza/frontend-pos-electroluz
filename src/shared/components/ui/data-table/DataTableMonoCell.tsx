interface DataTableMonoCellProps {
  value: string | number
  subtitle?: string | number
}

export function DataTableMonoCell({ value, subtitle }: DataTableMonoCellProps) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-sm">{value}</span>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  )
}
