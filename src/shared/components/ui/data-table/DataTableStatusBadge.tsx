import { Badge } from "../badge"
import { cn } from "../../../lib/utils"

export interface DataTableStatusBadgeProps {
  status: string
  variant?: 'dot' | 'soft'
  colorMap?: Record<string, string>
}

const defaultColorMap: Record<string, string> = {
  activo: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  inactivo: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  eliminado: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
}

const defaultDotColorMap: Record<string, string> = {
  activo: "bg-emerald-500",
  inactivo: "bg-amber-500",
  eliminado: "bg-rose-500",
}

export function DataTableStatusBadge({ status, variant = 'soft', colorMap }: DataTableStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()
  
  if (variant === 'dot') {
    const dotColor = (colorMap && colorMap[normalizedStatus]) || defaultDotColorMap[normalizedStatus] || "bg-slate-400"
    return (
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", dotColor)} />
        <span className="capitalize text-sm text-muted-foreground">{status}</span>
      </div>
    )
  }

  const badgeColor = (colorMap && colorMap[normalizedStatus]) || defaultColorMap[normalizedStatus] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"

  return (
    <Badge className={cn("border-transparent hover:border-transparent font-medium", badgeColor)} variant="outline">
      <span className="capitalize">{status}</span>
    </Badge>
  )
}
