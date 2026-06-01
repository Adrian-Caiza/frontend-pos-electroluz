import { MoreHorizontal } from "lucide-react"

import { Button } from "../button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import { cn } from "../../../lib/utils"
import { DropdownMenuLabel } from "../dropdown-menu"

export interface DataTableRowActionItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  separatorAbove?: boolean
}

interface DataTableRowActionsProps {
  actions: DataTableRowActionItem[]
  title?: string
}

export function DataTableRowActions({ actions, title }: DataTableRowActionsProps) {
  if (!actions.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px] p-2 rounded-xl border border-slate-200 shadow-lg">
        {title && (
          <>
            <DropdownMenuLabel className="px-3 py-2.5 text-[15px] font-semibold text-slate-400/80">
              {title}
            </DropdownMenuLabel>
          </>
        )}
        {actions.map((action, index) => (
          <div key={index}>
            {action.separatorAbove && <DropdownMenuSeparator className="-mx-2 my-1 bg-slate-100" />}
            <DropdownMenuItem 
              onClick={action.onClick}
              className={cn(
                "px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                action.variant === 'danger' 
                  ? "text-rose-600 focus:text-rose-700 focus:bg-rose-50" 
                  : "text-slate-700 focus:bg-slate-100"
              )}
            >
              {action.icon && (
                <span className={cn(
                  "mr-3 flex items-center justify-center",
                  action.variant === 'danger' ? "text-rose-500" : "text-slate-400",
                  "[&>svg]:h-5 [&>svg]:w-5"
                )}>
                  {action.icon}
                </span>
              )}
              <span className="font-medium text-[14px]">{action.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
