"use client"

import { Transaction } from "@/types"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Copy } from "lucide-react"
import { formatCurrency, truncateHash } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface TransactionOverviewProps {
  transaction: Transaction
}

export function TransactionOverview({ transaction }: TransactionOverviewProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"transaction" | "internal">(
    "transaction"
  )

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    })
  }

  const fromLabel = useMemo(
    () => truncateHash(transaction.originator.id, 16, 8),
    [transaction.originator.id]
  )
  const toLabel = useMemo(
    () => truncateHash(transaction.beneficiary.id, 16, 8),
    [transaction.beneficiary.id]
  )

  const internalRows = useMemo(() => {
    // Demo rows shaped like the reference screenshot: multiple internal transfers
    // Each row shows: from address + (native amount | usd) OR token info line.
    const chainSymbol = transaction.chain
    const txUsdSmall = Math.max(0.1, Math.min(2, transaction.feeUsd || 0.29))
    return [
      {
        from: transaction.originator.id,
        fromNative: 0.9903,
        fromUsd: txUsdSmall,
        tokenName: null as string | null,
        to: transaction.beneficiary.id,
        toNative: 0.0,
        toUsd: 0.0,
        showTokenMeta: false,
      },
      {
        from: transaction.beneficiary.id,
        fromNative: 0.0,
        fromUsd: 0.0,
        tokenName: "UpgradeableBeaconProxy",
        to: transaction.beneficiary.id,
        toNative: 0.0,
        toUsd: 0.0,
        showTokenMeta: true,
      },
      {
        from: transaction.originator.id,
        fromNative: 0.0,
        fromUsd: 0.0,
        tokenName: "UpgradeableBeaconProxy",
        to: transaction.beneficiary.id,
        toNative: 0.0,
        toUsd: 0.0,
        showTokenMeta: true,
      },
      {
        from: transaction.originator.id,
        fromNative: Number((transaction.feeNative || 0.4366363).toFixed(4)),
        fromUsd: Number((transaction.feeUsd || 127.66).toFixed(2)),
        tokenName: null as string | null,
        to: transaction.originator.id,
        toNative: Number((transaction.feeNative || 0.4366363).toFixed(4)),
        toUsd: Number((transaction.feeUsd || 127.66).toFixed(2)),
        showTokenMeta: false,
      },
    ].map((r) => ({
      ...r,
      fromDisplay: truncateHash(r.from, 18, 10),
      toDisplay: truncateHash(r.to, 18, 10),
      chainSymbol,
    }))
  }, [transaction])

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden mb-6">
      {/* Pills Header (match reference layout) */}
      <div className="px-6 pt-4 pb-3 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab("transaction")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              activeTab === "transaction"
                ? "bg-brand-blue text-white"
                : "text-slate-300 hover:bg-slate-800/60"
            )}
          >
            Transaction
          </button>
          <button
            onClick={() => setActiveTab("internal")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              activeTab === "internal"
                ? "bg-brand-blue text-white"
                : "text-slate-300 hover:bg-slate-800/60"
            )}
          >
            Internal Transactions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "transaction" ? (
          <div className="flex items-center justify-between gap-8 animate-in fade-in duration-300">
            {/* From */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-200 truncate">
                  {fromLabel}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-white"
                  onClick={() => handleCopy(transaction.originator.id)}
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm">
                <span className="text-slate-200">
                  {transaction.amount} {transaction.asset}
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400">
                  {formatCurrency(transaction.usdValue)}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-slate-600">
              <ArrowRight className="w-7 h-7" />
            </div>

            {/* To */}
            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="font-mono text-sm text-slate-200 truncate">
                  {toLabel}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-white"
                  onClick={() => handleCopy(transaction.beneficiary.id)}
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="mt-1 flex items-center justify-end gap-3 text-sm">
                <span className="text-slate-200">
                  0.00 {transaction.asset}
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400">$0.00</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="divide-y divide-slate-800/60">
              {internalRows.map((row, idx) => (
                <div
                  key={idx}
                  className="py-4 flex items-center justify-between gap-8"
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-slate-200 truncate">
                        {row.fromDisplay}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-500 hover:text-white"
                        onClick={() => handleCopy(row.from)}
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="text-slate-200">
                        {row.fromNative.toFixed(4)} {row.chainSymbol}
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-400">
                        {formatCurrency(row.fromUsd)}
                      </span>
                    </div>

                    {row.showTokenMeta && row.tokenName && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {row.tokenName}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-normal hover:bg-slate-700 px-2 h-5"
                        >
                          Smart Contract Platform &gt; Token
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-slate-600">
                    <ArrowRight className="w-7 h-7" />
                  </div>

                  {/* Right */}
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-sm text-slate-200 truncate">
                        {row.toDisplay}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-500 hover:text-white"
                        onClick={() => handleCopy(row.to)}
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-3 text-sm">
                      <span className="text-slate-200">
                        {row.toNative.toFixed(4)} {row.chainSymbol}
                      </span>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-400">
                        {formatCurrency(row.toUsd)}
                      </span>
                    </div>

                    {row.showTokenMeta && row.tokenName && (
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-400">
                          {row.tokenName}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-normal hover:bg-slate-700 px-2 h-5"
                        >
                          Smart Contract Platform &gt; Token
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
