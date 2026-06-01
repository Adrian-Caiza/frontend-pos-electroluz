import { cn } from "../../../lib/utils"

interface DataTableRowIndicatorProps {
  status: string
  colorMap?: Record<string, string>
}

const defaultIndicatorMap: Record<string, string> = {
  activo: "bg-emerald-500",
  inactivo: "bg-amber-500",
  eliminado: "bg-rose-500",
}

export function DataTableRowIndicator({ status, colorMap }: DataTableRowIndicatorProps) {
  const normalizedStatus = status.toLowerCase()
  const indicatorColor = (colorMap && colorMap[normalizedStatus]) || defaultIndicatorMap[normalizedStatus] || "bg-slate-300"
  
  return (
    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", indicatorColor)} />
  )
}
