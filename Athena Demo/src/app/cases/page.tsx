"use client"

import { useAppStore } from "@/store"
import { CaseTable } from "@/components/dashboard/CaseTable"
import { Button } from "@/components/ui/button"
import { Plus, Bitcoin, Banknote } from "lucide-react"
import { useMemo, useState } from "react"
import { Case, CaseType } from "@/types"
import { cn } from "@/lib/utils"
import {
  CryptoCaseFilterBar,
  DateRange,
  SortItem,
  CryptoCaseSortKey,
} from "@/components/cases/CryptoCaseFilterBar"

export default function CasesPage() {
  const { cases } = useAppStore()
  const [caseType, setCaseType] = useState<CaseType>('FIAT')
  const [cryptoSearch, setCryptoSearch] = useState("")
  const [cryptoDateRange, setCryptoDateRange] = useState<DateRange>({})
  const [cryptoSort, setCryptoSort] = useState<SortItem[]>([
    { key: "caseId", dir: "desc" },
    { key: "caseStatus", dir: "desc" },
  ])

  // Filter cases based on selected type
  const filteredCases = useMemo(() => {
    let base = cases.filter((c) => c.type === caseType)

    if (caseType !== "CRYPTO") return base

    // Search: tx hash / case ID / customer
    const q = cryptoSearch.trim().toLowerCase()
    if (q) {
      base = base.filter((c) => {
        const hay = [
          c.id,
          c.txHash || "",
          c.customerName,
          c.customerId,
          c.ruleName || "",
          c.policy || "",
        ]
          .join(" ")
          .toLowerCase()
        return hay.includes(q)
      })
    }

    // Date range against createdDate (proxy for tx date)
    const from = cryptoDateRange.from ? new Date(cryptoDateRange.from) : null
    const to = cryptoDateRange.to ? new Date(cryptoDateRange.to) : null
    if (from || to) {
      base = base.filter((c) => {
        const d = new Date(c.createdDate)
        if (from && d < from) return false
        if (to) {
          // include end date whole day
          const end = new Date(to)
          end.setHours(23, 59, 59, 999)
          if (d > end) return false
        }
        return true
      })
    }

    // Multi-sort
    const getSortValue = (c: Case, key: CryptoCaseSortKey) => {
      switch (key) {
        case "caseId": {
          const n = parseInt((c.id || "").replace(/[^\d]/g, ""), 10)
          return Number.isFinite(n) ? n : c.id
        }
        case "txHash":
          return c.txHash || ""
        case "blockchain":
          return c.chain || ""
        case "policy":
          return c.policy || ""
        case "ruleName":
          return c.ruleName || ""
        case "customerName":
          return c.customerName || ""
        case "transactionDate":
          return new Date(c.createdDate).getTime()
        case "riskLevel":
          return c.riskLevel || ""
        case "caseStatus":
          return c.status || ""
        case "assignee":
          return c.assignee || ""
      }
    }

    const cmp = (a: unknown, b: unknown) => {
      if (typeof a === "number" && typeof b === "number") return a - b
      return String(a).localeCompare(String(b))
    }

    const sorted = [...base].sort((a, b) => {
      for (const s of cryptoSort) {
        const va = getSortValue(a, s.key)
        const vb = getSortValue(b, s.key)
        const delta = cmp(va, vb)
        if (delta !== 0) return s.dir === "asc" ? delta : -delta
      }
      return 0
    })

    return sorted
  }, [cases, caseType, cryptoSearch, cryptoDateRange, cryptoSort])

  const customerPendingCount = useMemo(() => {
    if (caseType !== "CRYPTO") return 0
    const pendingCustomers = new Set(
      filteredCases
        .filter((c) => c.status === "New")
        .map((c) => c.customerId)
        .filter(Boolean)
    )
    return pendingCustomers.size
  }, [caseType, filteredCases])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-white tracking-tight">Case Management</h1>
         <Button className="bg-brand-purple hover:bg-brand-purple/90">
            <Plus className="w-4 h-4 mr-2" /> Create Case
         </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-start gap-6">
        {/* Type Toggle */}
        <div className="bg-slate-900/50 p-1 rounded-lg border border-slate-800 flex items-center w-fit">
           <button
             onClick={() => setCaseType('FIAT')}
             className={cn(
               "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
               caseType === 'FIAT' 
                 ? "bg-brand-cyan/20 text-brand-cyan shadow-sm" 
                 : "text-slate-400 hover:text-white"
             )}
           >
             <Banknote className="w-4 h-4 mr-2" />
             Fiat Cases
           </button>
           <button
             onClick={() => setCaseType('CRYPTO')}
             className={cn(
               "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
               caseType === 'CRYPTO' 
                 ? "bg-brand-purple/20 text-brand-purple shadow-sm" 
                 : "text-slate-400 hover:text-white"
             )}
           >
             <Bitcoin className="w-4 h-4 mr-2" />
             Crypto Cases
           </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-1 rounded-lg w-fit border border-slate-800">
           <Button variant="ghost" className="bg-slate-800 text-white shadow-sm h-9 text-xs">Active Cases</Button>
           <Button variant="ghost" className="text-slate-400 hover:text-white h-9 text-xs">Closed Cases</Button>
           <Button variant="ghost" className="text-slate-400 hover:text-white h-9 text-xs">My Cases</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Summary Cards */}
         <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-sm text-slate-400 mb-1">Total {caseType === 'CRYPTO' ? 'Crypto' : 'Fiat'} Active</div>
            <div className="text-3xl font-bold text-white">{filteredCases.filter(c => c.status === 'New').length}</div>
         </div>
         <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-sm text-slate-400 mb-1">High Priority</div>
            <div className="text-3xl font-bold text-red-500">{filteredCases.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length}</div>
         </div>
         <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-sm text-slate-400 mb-1">Unassigned</div>
            <div className="text-3xl font-bold text-orange-500">{filteredCases.filter(c => !c.assignee).length}</div>
         </div>
         <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="text-sm text-slate-400 mb-1">
              {caseType === "CRYPTO" ? "Customer Pending" : "Avg Ageing"}
            </div>
            {caseType === "CRYPTO" ? (
              <div className="text-3xl font-bold text-brand-cyan">
                {customerPendingCount}{" "}
                <span className="text-sm font-normal text-slate-500">
                  customers
                </span>
              </div>
            ) : (
              <div className="text-3xl font-bold text-brand-cyan">
                3.2{" "}
                <span className="text-sm font-normal text-slate-500">days</span>
              </div>
            )}
         </div>
      </div>

      {caseType === "CRYPTO" && (
        <CryptoCaseFilterBar
          search={cryptoSearch}
          onSearchChange={setCryptoSearch}
          sort={cryptoSort}
          onSortChange={setCryptoSort}
          dateRange={cryptoDateRange}
          onDateRangeChange={setCryptoDateRange}
          onClearAll={() => {
            setCryptoSearch("")
            setCryptoDateRange({})
            setCryptoSort([])
          }}
        />
      )}

      <CaseTable data={filteredCases} type={caseType} />
    </div>
  )
}
