import { Search, Filter, Plus } from "lucide-react"
import { Input } from "../input"
import { Button } from "../button"

export interface DataTableToolbarProps {
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  searchPlaceholder?: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  onAdvancedFilterClick?: () => void
  children?: React.ReactNode // For additional custom filters like Select dropdowns
}

export function DataTableToolbar({
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = "Buscar...",
  primaryAction,
  onAdvancedFilterClick,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-background border border-border rounded-xl shadow-sm">
      <div className="flex flex-1 items-center w-full">
        {onGlobalFilterChange !== undefined && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => onGlobalFilterChange(event.target.value)}
              className="pl-9 bg-transparent border-0 shadow-none focus-visible:ring-0 w-full"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
        {children}
        
        {onAdvancedFilterClick && (
          <Button variant="outline" onClick={onAdvancedFilterClick} className="font-medium text-slate-600">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        )}
        
        {primaryAction && (
          <Button onClick={primaryAction.onClick} className="font-medium shadow-sm">
            {primaryAction.icon || <Plus className="mr-2 h-4 w-4" />}
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
