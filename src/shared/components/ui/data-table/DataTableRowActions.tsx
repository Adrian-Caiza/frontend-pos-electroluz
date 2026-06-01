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

export interface DataTableRowActionItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  separatorAbove?: boolean
}

interface DataTableRowActionsProps {
  actions: DataTableRowActionItem[]
}

export function DataTableRowActions({ actions }: DataTableRowActionsProps) {
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
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <div key={index}>
            {action.separatorAbove && <DropdownMenuSeparator />}
            <DropdownMenuItem 
              onClick={action.onClick}
              className={cn(action.variant === 'danger' && "text-rose-600 focus:text-rose-700")}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
