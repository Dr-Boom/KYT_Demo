"use client"

import { useAppStore } from "@/store"
import { CaseType, Transaction } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { truncateHash, formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface TransactionSummaryPanelProps {
  transaction: Transaction | undefined // Allow undefined for initial load/error
  caseType: CaseType
}

export function TransactionSummaryPanel({ transaction, caseType }: TransactionSummaryPanelProps) {
  const { toast } = useToast()

  if (!transaction) {
    return <div className="w-80 border-r border-slate-800 bg-slate-950 p-6">Loading...</div>
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Transaction hash copied to clipboard",
    })
  }

  return (
    <div className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-950/50 flex flex-col h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Transaction</span>
            <div className="flex items-center gap-2 group">
              <span className="font-mono text-sm text-slate-200 break-all leading-tight">
                {transaction.hash}
              </span>
              <button onClick={() => handleCopy(transaction.hash)} className="text-slate-500 hover:text-brand-cyan transition-colors">
                 <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 hidden">
            <Button className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
              Add to Case
            </Button>
            <Button variant="outline" size="icon" className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
               <Download className="w-4 h-4" />
            </Button>
             <Button variant="outline" size="icon" className="border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800 hover:border-red-900">
               <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="h-px bg-slate-800/50" />

        {/* Details List */}
        <dl className="space-y-4">
           <div className="flex justify-between items-center">
              <dt className="text-sm text-slate-500">Risk Level</dt>
              <dd>
                 <Badge variant={transaction.riskLevel.toLowerCase() as any} className="px-3">
                    {transaction.riskLevel}
                 </Badge>
              </dd>
           </div>

           <div className="flex justify-between items-center">
              <dt className="text-sm text-slate-500">Related Cases</dt>
              <dd className="font-mono font-medium text-white">{transaction.openAlertsCount}</dd>
           </div>

           <div className="flex justify-between items-center">
              <dt className="text-sm text-slate-500">Blockchain</dt>
              <dd className="flex items-center gap-2 text-sm text-slate-300">
                 <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {transaction.chain[0]}
                 </div>
                 {transaction.chain}
              </dd>
           </div>

           <div className="flex justify-between items-center">
              <dt className="text-sm text-slate-500">Digital Asset</dt>
              <dd className="flex items-center gap-2 text-sm text-slate-300">
                 <span className="font-medium text-white">{transaction.asset}</span>
              </dd>
           </div>

           <div>
              <dt className="text-sm text-slate-500 mb-1">Transaction Time</dt>
              <dd className="text-sm text-slate-300 font-mono">
                 {format(new Date(transaction.timestamp), "MMM d, yyyy HH:mm a")}
              </dd>
           </div>

           <div className="space-y-3 pt-2">
              <div>
                 <dt className="text-sm text-slate-500 mb-1">Value</dt>
                 <dd>
                    <div className="text-lg font-semibold text-white">
                       {transaction.amount} {transaction.asset}
                    </div>
                    <div className="text-sm text-slate-500">
                       {formatCurrency(transaction.usdValue)}
                    </div>
                 </dd>
              </div>

              <div>
                 <dt className="text-sm text-slate-500 mb-1">Fee</dt>
                 <dd>
                    <div className="text-sm text-slate-300">
                       {transaction.feeNative} {transaction.chain}
                    </div>
                    <div className="text-xs text-slate-500">
                       {formatCurrency(transaction.feeUsd)}
                    </div>
                 </dd>
              </div>
           </div>
        </dl>
        
        {/* removed: Add to a customer */}
      </div>
    </div>
  )
}

