"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Calendar, Download, RefreshCw, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onClear: () => void;
  onExport: () => void;
}

export function FilterBar({ onSearch, onFilterChange, onClear, onExport }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState(0);

  return (
    <div className="flex flex-col gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
             <Filter className="w-4 h-4 text-brand-cyan mr-2" />
             <span className="text-sm font-medium text-slate-300">Filters:</span>
          </div>
          
          <Select onValueChange={(val) => onFilterChange({ chain: val })}>
            <SelectTrigger className="w-[120px] h-9 bg-slate-950/50 border-slate-800 text-xs">
              <SelectValue placeholder="Chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="BTC">Bitcoin</SelectItem>
              <SelectItem value="ETH">Ethereum</SelectItem>
              <SelectItem value="TRX">Tron</SelectItem>
              <SelectItem value="BSC">BSC</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => onFilterChange({ asset: val })}>
            <SelectTrigger className="w-[120px] h-9 bg-slate-950/50 border-slate-800 text-xs">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => onFilterChange({ risk: val })}>
            <SelectTrigger className="w-[120px] h-9 bg-slate-950/50 border-slate-800 text-xs">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="CRITICAL" className="text-purple-500">Critical</SelectItem>
              <SelectItem value="HIGH" className="text-red-500">High</SelectItem>
              <SelectItem value="MEDIUM" className="text-orange-500">Medium</SelectItem>
              <SelectItem value="LOW" className="text-green-500">Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-9 w-px bg-slate-800 mx-2"></div>

          <Button variant="outline" size="sm" className="h-9 border-slate-800 bg-slate-950/50 text-slate-400 text-xs hover:text-white">
             <Calendar className="w-3 h-3 mr-2" />
             Date Range
          </Button>
          
          <Button variant="outline" size="sm" className="h-9 border-slate-800 bg-slate-950/50 text-slate-400 text-xs hover:text-white">
             Amount Range
          </Button>

          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="h-9 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30">
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-9 border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white">
              <RefreshCw className="w-3 h-3 mr-2" /> Refresh
           </Button>
           <Button variant="brand" size="sm" className="h-9" onClick={onExport}>
              <Download className="w-3 h-3 mr-2" /> Export CSV
           </Button>
        </div>
      </div>
    </div>
  )
}

