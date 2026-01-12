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
import { Case, CaseType } from "@/types"
import { useState, useMemo } from "react"
import { MoreHorizontal, ChevronDown, User, UserX } from "lucide-react"
import { truncateHash } from "@/lib/utils"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/store"

interface CaseTableProps {
  data: Case[]
  type: CaseType
}

// Define assignees locally since they are not exported as constant from data file in a reusable way for components
// In a real app, this would come from an API
const ASSIGNEES = ['Alice Chen', 'Bob Smith', 'Charlie Kim', 'Diana Prince', 'Evan Wright'];

import { useRouter } from "next/navigation"

export function CaseTable({ data, type }: CaseTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const updateCaseAssignee = useAppStore(state => state.updateCaseAssignee)
  const router = useRouter()

  // Default Fiat Columns
  const fiatColumns: ColumnDef<Case>[] = [
    {
        accessorKey: "id",
        header: "Case ID",
        cell: ({ row }) => (
          <span 
             className="font-mono text-brand-cyan hover:underline cursor-pointer"
             onClick={(e) => {
                e.stopPropagation();
                router.push(`/cases/${row.getValue("id")}`)
             }}
          >
             {row.getValue("id")}
          </span>
        ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "bucket",
      header: "Bucket",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("bucket")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Case Status",
      cell: ({ row }) => {
         const status = row.getValue("status") as string;
         let color = "bg-slate-500";
         if (status === 'New') color = "bg-blue-500";
         if (status === 'Recommended Changes') color = "bg-blue-500";
         if (status === 'True Hit') color = "bg-red-500";
         if (status === 'False Hit') color = "bg-green-500";
         
         return (
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${color}`}></div>
               <span className="text-xs font-medium">{status}</span>
            </div>
         )
      }
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <Badge variant={row.getValue("priority") as any}>{row.getValue("priority")}</Badge>,
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => {
         const assignee = row.getValue("assignee") as string;
         const caseId = row.original.id;

         return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 pl-2 pr-1 gap-2 border border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800">
                  {assignee ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center text-[10px] text-brand-blue border border-brand-blue/30">
                          {assignee.charAt(0)}
                      </div>
                      <span className="text-xs">{assignee}</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-500 text-xs italic">Unassigned</span>
                    </>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px] bg-slate-950 border-slate-800">
                <DropdownMenuLabel className="text-xs text-slate-500">Select Assignee</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem 
                  onClick={() => updateCaseAssignee(caseId, null)}
                  className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5 mr-2" />
                  Unassigned
                </DropdownMenuItem>
                {ASSIGNEES.map(name => (
                  <DropdownMenuItem 
                    key={name}
                    onClick={() => updateCaseAssignee(caseId, name)}
                    className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 mr-2" />
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
         )
      }
    },
    {
      accessorKey: "ageing",
      header: "Ageing",
      cell: ({ row }) => <span>T + {row.getValue("ageing")} days</span>,
    },
  ]

  // Crypto Specific Columns
  const cryptoColumns: ColumnDef<Case>[] = [
    {
        accessorKey: "id",
        header: "Case ID",
        cell: ({ row }) => (
            <span 
                className="font-mono text-brand-cyan hover:underline cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/cases/${row.getValue("id")}`)
                }}
            >
                {row.getValue("id")}
            </span>
        ),
    },
    {
        accessorKey: "txHash",
        header: "Transaction Hash",
        cell: ({ row }) => <span className="font-mono text-xs text-slate-300">{truncateHash(row.getValue("txHash") || "", 8, 8)}</span>
    },
    {
        accessorKey: "chain",
        header: "Blockchain",
        cell: ({ row }) => <Badge variant="outline" className="font-mono text-[10px]">{row.getValue("chain")}</Badge>
    },
    {
        accessorKey: "policy",
        header: "Policy",
        cell: ({ row }) => <span className="text-slate-300">{row.getValue("policy")}</span>
    },
    {
        accessorKey: "ruleName",
        header: "Rule Name",
        cell: ({ row }) => <span className="text-slate-300">{row.getValue("ruleName")}</span>
    },
    {
        accessorKey: "customerName",
        header: "Customer Name",
    },
    {
        accessorKey: "createdDate", // Using createdDate as proxy for Transaction Date in mock
        header: "Transaction Date",
        cell: ({ row }) => <span className="text-xs text-slate-400 whitespace-nowrap">{format(new Date(row.getValue("createdDate")), "MMM d, yyyy")}</span>
    },
    {
        accessorKey: "riskLevel",
        header: "Risk Level",
        cell: ({ row }) => {
            const risk = row.getValue("riskLevel") as string;
            return <Badge variant={risk?.toLowerCase() as any}>{risk}</Badge>
        }
    },
    {
        accessorKey: "status",
        header: "Case Status",
        cell: ({ row }) => {
             const status = row.getValue("status") as string;
             let color = "bg-slate-500";
             if (status === 'New') color = "bg-blue-500";
             if (status === 'Recommended Changes') color = "bg-blue-500";
             if (status === 'True Hit') color = "bg-red-500";
             if (status === 'False Hit') color = "bg-green-500";
             
             return (
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${color}`}></div>
                   <span className="text-xs font-medium">{status}</span>
                </div>
             )
        }
    },
    {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) => {
             const assignee = row.getValue("assignee") as string;
             const caseId = row.original.id;

             return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 pl-2 pr-1 gap-2 border border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800">
                      {assignee ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center text-[10px] text-brand-blue border border-brand-blue/30">
                              {assignee.charAt(0)}
                          </div>
                          <span className="text-xs">{assignee}</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-500 text-xs italic">Unassigned</span>
                        </>
                      )}
                      <ChevronDown className="w-3 h-3 text-slate-500 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px] bg-slate-950 border-slate-800">
                    <DropdownMenuLabel className="text-xs text-slate-500">Select Assignee</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem 
                      onClick={() => updateCaseAssignee(caseId, null)}
                      className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5 mr-2" />
                      Unassigned
                    </DropdownMenuItem>
                    {ASSIGNEES.map(name => (
                      <DropdownMenuItem 
                        key={name}
                        onClick={() => updateCaseAssignee(caseId, name)}
                        className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 mr-2" />
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
             )
        }
    },
  ];

  const columns = useMemo(() => type === 'CRYPTO' ? cryptoColumns : fiatColumns, [type, updateCaseAssignee]); // Added updateCaseAssignee dependency

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
        <TableHeader className="bg-slate-900/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-slate-800">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-slate-400 text-xs uppercase tracking-wider h-10 whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
