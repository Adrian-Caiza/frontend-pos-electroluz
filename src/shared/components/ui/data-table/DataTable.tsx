import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { 
  tableBodyVariants, 
  tableRowVariants, 
  tableHeaderVariants, 
  tableHeadVariants 
} from "./table-animations"

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
  disableAnimations?: boolean
  meta?: any
  onRowClick?: (row: Row<TData>) => void
  selectedRowId?: string
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
  disableAnimations = false,
  meta,
  onRowClick,
  selectedRowId,
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
          {disableAnimations ? (
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
          ) : (
            <motion.thead 
              className="[&_tr]:border-b border-0"
              variants={tableHeaderVariants}
              initial="hidden"
              animate="visible"
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-transparent border-0">
                  {headerGroup.headers.map((header) => {
                    return (
                      <motion.th 
                        key={header.id} 
                        variants={tableHeadVariants}
                        className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 h-12 py-2"
                      >
                        <div className="h-full w-full bg-slate-100 rounded-lg flex items-center px-3">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </motion.th>
                    )
                  })}
                </tr>
              ))}
            </motion.thead>
          )}

          {disableAnimations ? (
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
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-slate-50 transition-colors border-b border-slate-200 ${onRowClick ? "cursor-pointer" : ""} ${selectedRowId === row.id ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary" : ""}`}
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
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.tbody 
                className="[&_tr:last-child]:border-0 border-0"
                key={`page-${table.getState().pagination.pageIndex}`}
                variants={tableBodyVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {isLoading ? (
                  // Skeleton Rows
                  Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
                    <motion.tr 
                      key={`skeleton-${i}`} 
                      variants={tableRowVariants}
                      className="border-b transition-colors hover:bg-transparent border-slate-200"
                    >
                      {columns.map((_, j) => (
                        <td key={`skeleton-cell-${i}-${j}`} className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 py-4 px-4">
                          <div className="h-5 bg-slate-100 rounded animate-pulse w-3/4"></div>
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      layout
                      variants={tableRowVariants}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row)}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className={`border-b transition-colors has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted hover:bg-slate-50 border-slate-200 ${onRowClick ? "cursor-pointer" : ""} ${selectedRowId === row.id ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary" : ""}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 py-4 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr 
                    key="empty-state"
                    variants={tableRowVariants}
                    className="border-b transition-colors hover:bg-transparent border-slate-200"
                  >
                    <td colSpan={columns.length} className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-sm">No hay resultados.</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </motion.tbody>
            </AnimatePresence>
          )}
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
