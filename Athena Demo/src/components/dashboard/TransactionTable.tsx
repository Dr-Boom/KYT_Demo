"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types"
import { formatCurrency, truncateHash } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowUpDown, Copy, MoreHorizontal, AlertCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TransactionTableProps {
  data: Transaction[]
  onRowClick: (transaction: Transaction) => void
}

export function TransactionTable({ data, onRowClick }: TransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "hash",
      header: "Tx Hash",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 group">
          <span className="font-mono text-xs text-slate-300 group-hover:text-brand-cyan transition-colors">
            {truncateHash(row.getValue("hash"), 8, 8)}
          </span>
          <Button variant="ghost" size="icon" className="h-4 w-4 opacity-0 group-hover:opacity-100" onClick={(e) => {
             e.stopPropagation();
             // Copy logic would go here
          }}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "chain",
      header: "Chain",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] border-slate-700 bg-slate-900/50">
          {row.getValue("chain")}
        </Badge>
      ),
    },
    {
      accessorKey: "usdValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            USD Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-slate-200">{formatCurrency(row.getValue("usdValue"))}</div>,
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => {
        const risk = row.getValue("riskLevel") as string;
        const variant = risk.toLowerCase() as any;
        return (
          <Badge variant={variant} className="capitalize min-w-[80px] justify-center">
            {risk === 'CRITICAL' && <AlertCircle className="w-3 h-3 mr-1" />}
            {risk}
          </Badge>
        )
      },
    },
    {
      accessorKey: "originator",
      header: "Originator / Beneficiary",
      cell: ({ row }) => {
        const originator = row.original.originator;
        const beneficiary = row.original.beneficiary;
        return (
           <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1">
                 <span className="text-slate-500 w-8">From:</span>
                 <span className={cn(originator.riskScore > 70 ? "text-red-400" : "text-slate-300")}>
                    {originator.name}
                 </span>
              </div>
              <div className="flex items-center gap-1">
                 <span className="text-slate-500 w-8">To:</span>
                 <span className={cn(beneficiary.riskScore > 70 ? "text-red-400" : "text-slate-300")}>
                    {beneficiary.name}
                 </span>
              </div>
           </div>
        )
      }
    },
    {
      accessorKey: "timestamp",
      header: "Date",
      cell: ({ row }) => <div className="text-xs text-slate-400 whitespace-nowrap">{format(new Date(row.getValue("timestamp")), "MMM d, HH:mm:ss")}</div>,
    },
    {
        accessorKey: "rulesTriggered",
        header: "Rules",
        cell: ({ row }) => {
            const count = (row.getValue("rulesTriggered") as any[]).length;
            return count > 0 ? (
                <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-400">
                    {count} Rule{count !== 1 ? 's' : ''}
                </Badge>
            ) : <span className="text-slate-600 text-xs">-</span>
        }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
             e.stopPropagation();
             onRowClick(row.original);
          }}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border border-slate-800 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900/80 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-slate-400 text-xs uppercase tracking-wider h-10">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t border-slate-800 bg-slate-900/40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-slate-800 bg-slate-900 text-slate-400"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-slate-800 bg-slate-900 text-slate-400"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

