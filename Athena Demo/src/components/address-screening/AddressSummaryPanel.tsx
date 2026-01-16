"use client"

import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { formatCurrency, truncateHash } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Chain = "BTC" | "ETH" | "TRX" | "BSC" | "SOL"
type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

interface AddressSummaryPanelProps {
  address: string
  chain: Chain
  risk: Risk
  openAlerts: number
  screenedAt: string
  assetSymbol: string
  digitalAssets?: string[]
  balanceNative: number
  balanceUsd: number
  ownerName: string
  ownerType: string
  userLabel: string
  userType: string
}

export function AddressSummaryPanel(props: AddressSummaryPanelProps) {
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Address copied to clipboard" })
  }

  const riskBadge =
    props.risk === "LOW"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : props.risk === "MEDIUM"
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        : props.risk === "HIGH"
          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"

  return (
    <div className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-950/50 flex flex-col h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Address
            </span>
            <div className="flex items-start gap-2 group">
              <span className="font-mono text-sm text-slate-200 break-all leading-tight">
                {props.address}
              </span>
              <button
                onClick={() => handleCopy(props.address)}
                className="text-slate-500 hover:text-brand-cyan transition-colors mt-0.5"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {truncateHash(props.address, 18, 10)}
            </div>
          </div>

          {/* removed: Add to Case / actions */}
        </div>

        <div className="h-px bg-slate-800/50" />

        {/* Details */}
        <dl className="space-y-4">
          <div className="flex justify-between items-center">
            <dt className="text-sm text-slate-500">Risk Level</dt>
            <dd>
              <Badge className={"h-6 px-3 text-[11px] font-semibold " + riskBadge}>
                {props.risk}
              </Badge>
            </dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-sm text-slate-500">Open Alerts</dt>
            <dd className="font-mono font-medium text-white">{props.openAlerts}</dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-sm text-slate-500">Blockchain</dt>
            <dd className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-[10px] font-bold">
                {props.chain[0]}
              </div>
              {props.chain}
            </dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-sm text-slate-500">Digital Asset</dt>
            <dd className="flex items-center gap-2">
              <span className="text-sm text-white font-medium">{props.assetSymbol}</span>
              {props.digitalAssets && props.digitalAssets.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-6 px-2 rounded-full border border-slate-800 bg-slate-950/20 text-xs text-slate-200 hover:bg-slate-800/60 transition-colors">
                      +{props.digitalAssets.length - 1}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[340px] bg-slate-950 border-slate-800 p-3"
                  >
                    <div className="text-xs text-slate-400 mb-2">
                      Digital Assets:
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {props.digitalAssets.map((sym) => (
                        <div
                          key={sym}
                          className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/30 px-2 py-1 text-xs text-slate-200"
                        >
                          <span className="h-4 w-4 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-[10px] text-brand-purple">
                            ◇
                          </span>
                          <span className="truncate">{sym}</span>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500 mb-1">Screened Time</dt>
            <dd className="text-sm text-slate-300 font-mono">
              {format(new Date(props.screenedAt), "MMM d, yyyy  HH:mm a")}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500 mb-1">Balance</dt>
            <dd>
              <div className="text-sm text-slate-200 font-mono">
                {props.balanceNative.toFixed(4)} {props.assetSymbol}
              </div>
              <div className="text-xs text-slate-500">{formatCurrency(props.balanceUsd)}</div>
            </dd>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">Owner</dt>
              <dd className="text-slate-200 font-medium">{props.ownerName}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">Owner Type</dt>
              <dd className="text-slate-300">{props.ownerType}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">User</dt>
              <dd className="text-slate-200 font-medium">{props.userLabel}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">User Type</dt>
              <dd className="text-slate-300">{props.userType}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  )
}


