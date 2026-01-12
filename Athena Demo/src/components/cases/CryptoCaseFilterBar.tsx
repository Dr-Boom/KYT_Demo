"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, Search, ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export type CryptoCaseSortKey =
  | "caseId"
  | "txHash"
  | "blockchain"
  | "policy"
  | "ruleName"
  | "customerName"
  | "transactionDate"
  | "riskLevel"
  | "caseStatus"
  | "assignee"

export type SortDirection = "asc" | "desc"

export interface SortItem {
  key: CryptoCaseSortKey
  dir: SortDirection
}

export interface DateRange {
  from?: string // yyyy-MM-dd
  to?: string // yyyy-MM-dd
}

interface CryptoCaseFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  sort: SortItem[]
  onSortChange: (next: SortItem[]) => void
  dateRange: DateRange
  onDateRangeChange: (next: DateRange) => void
  onClearAll: () => void
}

const SORT_OPTIONS: { key: CryptoCaseSortKey; label: string }[] = [
  { key: "caseId", label: "Case ID" },
  { key: "txHash", label: "Transaction Hash" },
  { key: "blockchain", label: "Blockchain" },
  { key: "policy", label: "Policy" },
  { key: "ruleName", label: "Rule Name" },
  { key: "customerName", label: "Customer Name" },
  { key: "transactionDate", label: "Transaction Date" },
  { key: "riskLevel", label: "Risk Level" },
  { key: "caseStatus", label: "Case Status" },
  { key: "assignee", label: "Assignee" },
]

function formatRange(from?: string, to?: string) {
  const fmt = (d: string) => format(new Date(d), "dd/MM/yyyy")
  if (from && to) return `${fmt(from)} - ${fmt(to)}`
  if (from && !to) return `${fmt(from)} - …`
  if (!from && to) return `… - ${fmt(to)}`
  return "Select range"
}

export function CryptoCaseFilterBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  dateRange,
  onDateRangeChange,
  onClearAll,
}: CryptoCaseFilterBarProps) {
  const sortLabel = useMemo(() => {
    if (sort.length === 0) return "None"
    return sort
      .map((s) => SORT_OPTIONS.find((o) => o.key === s.key)?.label)
      .filter(Boolean)
      .join(", ")
  }, [sort])

  const toggleSortKey = (key: CryptoCaseSortKey) => {
    const idx = sort.findIndex((s) => s.key === key)
    if (idx === -1) onSortChange([...sort, { key, dir: "desc" }])
    else onSortChange(sort.filter((s) => s.key !== key))
  }

  const toggleSortDir = (key: CryptoCaseSortKey) => {
    onSortChange(
      sort.map((s) =>
        s.key === key ? { ...s, dir: s.dir === "asc" ? "desc" : "asc" } : s
      )
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Transaction ID search */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-r border-slate-800 flex items-center gap-2">
              Transaction ID
              <ChevronDown className="w-3 h-3 opacity-60" />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search transaction hash / case ID..."
                className="h-12 border-0 bg-transparent pl-10 pr-3 text-slate-200 placeholder:text-slate-600 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="min-w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 h-12 hover:bg-slate-900/60 transition-colors">
                <div className="text-left">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Sort By
                  </div>
                  <div className="text-sm text-slate-200 truncate max-w-[200px]">
                    {sortLabel}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] bg-slate-950 border-slate-800"
            >
              <DropdownMenuLabel className="text-xs text-slate-500">
                In order by
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {SORT_OPTIONS.map((opt) => {
                const idx = sort.findIndex((s) => s.key === opt.key)
                const selected = idx !== -1
                const dir = selected ? sort[idx].dir : "desc"
                return (
                  <DropdownMenuItem
                    key={opt.key}
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleSortKey(opt.key)
                    }}
                    className="cursor-pointer focus:bg-slate-800 focus:text-white"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold",
                            selected
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-900 text-slate-600 border border-slate-800"
                          )}
                        >
                          {selected ? idx + 1 : ""}
                        </div>
                        <span className="text-sm text-slate-200">
                          {opt.label}
                        </span>
                      </div>

                      {selected && (
                        <button
                          className="ml-2 h-7 w-7 rounded-md border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSortDir(opt.key)
                          }}
                          title="Toggle sort direction"
                        >
                          {dir === "desc" ? (
                            <ArrowDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date Range */}
        <div className="min-w-[260px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 h-12 hover:bg-slate-900/60 transition-colors">
                <div className="text-left">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Date Range
                  </div>
                  <div className="text-sm text-slate-200">
                    {formatRange(dateRange.from, dateRange.to)}
                  </div>
                </div>
                <Calendar className="w-4 h-4 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] bg-slate-950 border-slate-800 p-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">From</div>
                  <input
                    type="date"
                    value={dateRange.from || ""}
                    onChange={(e) =>
                      onDateRangeChange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">To</div>
                  <input
                    type="date"
                    value={dateRange.to || ""}
                    onChange={(e) =>
                      onDateRangeChange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-200"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-800 bg-slate-900 text-slate-300"
                  onClick={() => onDateRangeChange({})}
                >
                  Clear
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Clear All */}
        <div className="flex justify-end">
          <Button
            className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-600/90"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}


