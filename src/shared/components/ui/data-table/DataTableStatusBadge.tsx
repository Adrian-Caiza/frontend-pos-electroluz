import { Badge } from "../badge"
import { cn } from "../../../lib/utils"

export interface DataTableStatusBadgeProps {
  status: string
  colorMap?: Record<string, { bg: string, text: string, dot: string }>
}

const defaultColorMap: Record<string, { bg: string, text: string, dot: string }> = {
  activo: { 
    bg: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20", 
    text: "text-emerald-700 dark:text-emerald-400", 
    dot: "bg-emerald-500" 
  },
  inactivo: { 
    bg: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20", 
    text: "text-amber-700 dark:text-amber-400", 
    dot: "bg-amber-500" 
  },
  eliminado: { 
    bg: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20", 
    text: "text-rose-700 dark:text-rose-400", 
    dot: "bg-rose-500" 
  },
}

const defaultStyle = {
  bg: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
  text: "text-slate-700 dark:text-slate-300",
  dot: "bg-slate-500"
}

export function DataTableStatusBadge({ status, colorMap }: DataTableStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  
  const style = (colorMap && colorMap[normalizedStatus]) || defaultColorMap[normalizedStatus] || defaultStyle

  return (
    <Badge 
      className={cn(
        "border-transparent font-medium rounded-full px-3 py-1 flex items-center gap-2 w-fit transition-colors", 
        style.bg,
        style.text
      )} 
      variant="outline"
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      <span className="capitalize text-[13px]">{status}</span>
    </Badge>
  )
}
