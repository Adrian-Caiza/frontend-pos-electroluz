import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "../button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"

import { cn } from "../../../lib/utils"

interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  rowCount: number
  currentRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  currentRows,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, pageIndex - 2);
    const endPage = Math.min(pageCount || 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === pageIndex;
      pages.push(
        <Button
          key={i}
          variant={isActive ? "default" : "outline"}
          className={cn(
            "h-9 w-9 p-0 rounded-lg transition-colors font-semibold",
            isActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-sm"
              : "text-muted-foreground border-border hover:bg-muted bg-background"
          )}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 mt-2 border-t border-border gap-4">
      {/* Left side */}
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <p>Mostrar</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            onPageSizeChange(Number(value))
          }}
        >
          <SelectTrigger className="h-9 w-[70px] bg-background border-border rounded-lg">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p>por página</p>
      </div>

      {/* Center */}
      <div className="text-sm text-muted-foreground font-medium hidden md:block">
        Mostrando {currentRows} de {rowCount} registros
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-1.5">
        <Button
          variant="outline"
          className="h-9 px-4 text-sm font-semibold text-muted-foreground border-border rounded-lg bg-background hover:bg-muted"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex <= 1}
        >
          Anterior
        </Button>

        {renderPageNumbers()}

        <Button
          variant="outline"
          className="h-9 px-4 text-sm font-semibold text-muted-foreground border-border rounded-lg bg-background hover:bg-muted"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
