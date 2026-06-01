import * as React from "react"
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  OnChangeFn,
  Row,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableToolbar, type DataTableToolbarProps } from "./DataTableToolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pageCount?: number
  rowCount?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  toolbar?: DataTableToolbarProps
  meta?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  toolbar,
  meta,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: pagination || { pageIndex: 0, pageSize: 10 },
      rowSelection,
    },
    onPaginationChange: (updater) => {
      if (onPaginationChange && pagination) {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater
        onPaginationChange(newPagination)
      }
    },
    onRowSelectionChange,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    // If not controlled externally, uncomment below line
    // getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    manualPagination: !!pagination,
    meta,
  })

  return (
    <div className="space-y-4 font-geist">
      {toolbar && <DataTableToolbar {...toolbar} />}
      
      <div className="w-full">
        <Table className="border-0 border-collapse">
          <TableHeader className="border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 px-1 py-2 align-middle">
                      <div className="h-full w-full bg-slate-100 rounded-lg flex items-center px-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-0">
            {isLoading ? (
              // Skeleton Rows
              Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-slate-200 hover:bg-transparent">
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-cell-${i}-${j}`} className="py-4 px-4">
                      <div className="h-5 bg-slate-100 rounded animate-pulse w-3/4"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 transition-colors border-b border-slate-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">No hay resultados.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPaginationChange && (
        <DataTablePagination
          pageIndex={table.getState().pagination.pageIndex + 1}
          pageSize={table.getState().pagination.pageSize}
          pageCount={table.getPageCount()}
          rowCount={rowCount ?? table.getFilteredRowModel().rows.length}
          currentRows={table.getRowModel().rows.length}
          onPageChange={(page) => {
            onPaginationChange({ ...table.getState().pagination, pageIndex: page - 1 })
          }}
          onPageSizeChange={(pageSize) => {
            onPaginationChange({ ...table.getState().pagination, pageSize, pageIndex: 0 })
          }}
        />
      )}
    </div>
  )
}
