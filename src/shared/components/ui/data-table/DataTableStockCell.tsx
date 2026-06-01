import { cn } from "../../../lib/utils"

interface DataTableStockCellProps {
  stock: number
  minStock: number
  unit?: string
}

export function DataTableStockCell({ stock, minStock, unit = "u." }: DataTableStockCellProps) {
  let colorClass = "text-green-600 dark:text-green-500"
  let warningClass = ""
  
  if (stock <= 0) {
    colorClass = "text-rose-600 dark:text-rose-500"
    warningClass = "font-bold"
  } else if (stock <= minStock) {
    colorClass = "text-amber-500 dark:text-amber-400"
    warningClass = "font-bold"
  } else if (stock <= minStock * 1.5) {
    colorClass = "text-amber-500 dark:text-amber-400"
  }

  return (
    <div className="flex flex-col text-right">
      <span className={cn("text-sm font-medium", colorClass, warningClass)}>
        {stock} <span className="text-xs opacity-80 font-normal">{unit}</span>
      </span>
      <span className="text-xs text-muted-foreground">Min: {minStock}</span>
    </div>
  )
}
