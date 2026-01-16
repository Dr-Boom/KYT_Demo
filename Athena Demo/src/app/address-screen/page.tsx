"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { truncateHash } from "@/lib/utils"
import { Scan, Search, Clock, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store"

type Chain = "BTC" | "ETH" | "TRX" | "BSC" | "SOL"

const CHAINS: { value: Chain; label: string }[] = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "TRX", label: "TRON (TRX)" },
  { value: "BSC", label: "BNB Chain (BSC)" },
  { value: "SOL", label: "Solana (SOL)" },
]

type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

// (risk calculation happens on the results page)

export default function AddressScreenPage() {
  const { toast } = useToast()
  const router = useRouter()
  const addAddressScreening = useAppStore((s) => s.addAddressScreening)
  const history = useAppStore((s) => s.addressScreeningHistory)
  const [address, setAddress] = useState("")
  const [chain, setChain] = useState<Chain>("ETH")
  const [isScreening, setIsScreening] = useState(false)

  const canScreen = address.trim().length >= 6

  const onScreen = async () => {
    const trimmed = address.trim()
    if (trimmed.length < 6) return
    setIsScreening(true)
    // demo delay
    await new Promise((r) => setTimeout(r, 550))
    const id = `AS-${Math.random().toString(16).slice(2, 10)}`
    const screenedAt = new Date().toISOString()
    addAddressScreening({ id, address: trimmed, chain, screenedAt })

    toast({
      title: "Screening complete",
      description: `${chain} address screened successfully`,
    })
    setIsScreening(false)

    router.push(
      `/address-screen/results?address=${encodeURIComponent(trimmed)}&chain=${chain}&ts=${encodeURIComponent(
        screenedAt
      )}`
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
              <Scan className="w-4.5 h-4.5 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white leading-tight">
                Address Screening
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Screen a wallet address on a selected blockchain and review the latest results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screening Form */}
      <Card className="bg-slate-900/55 border-slate-700/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_200px] gap-4 items-end">
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-400">Wallet address</div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste wallet address (0x…, bc1…, T…) "
                  className="h-10 pl-9 bg-slate-950/25 border-slate-700/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-brand-blue/35"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-400">Blockchain</div>
              <Select value={chain} onValueChange={(v) => setChain(v as Chain)}>
                <SelectTrigger className="h-10 bg-slate-950/25 border-slate-700/70 text-slate-100 focus:ring-brand-blue/35">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800">
                  {CHAINS.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-slate-200">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="h-10 bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20"
              disabled={!canScreen || isScreening}
              onClick={onScreen}
            >
              {isScreening ? "Screening…" : "Start screening"}
            </Button>
          </div>

          {/* Helper line (kept separate so it doesn't break control alignment) */}
          {!canScreen && address.length > 0 ? (
            <div className="text-xs text-slate-500">
              Enter at least 6 characters to start screening.
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Tip: paste from clipboard for fastest screening.
            </div>
          )}
        </div>
      </Card>

      {/* Screening History */}
      <Card className="bg-slate-900/40 border-slate-800">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Screening History
            </h3>
            <div className="text-xs text-slate-500">Most recent screenings</div>
          </div>

          {history.length === 0 ? (
            <div className="text-sm text-slate-400 border border-slate-800/60 rounded-lg p-5 bg-slate-950/35">
              No history yet. Run your first screening above.
            </div>
          ) : (
            <div className="rounded-lg border border-slate-800/60 bg-slate-950/20 overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs text-slate-500 border-b border-slate-800/60 bg-slate-900/20">
                <div className="col-span-7">Address</div>
                <div className="col-span-2 text-right">Blockchain</div>
                <div className="col-span-3 text-right flex items-center justify-end gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Screened
                </div>
              </div>

              <div className="divide-y divide-slate-800/60">
                {history.map((h) => (
                  <button
                    key={h.id}
                    className="w-full text-left px-4 py-3 hover:bg-slate-900/40 transition-colors"
                    onClick={() =>
                      router.push(
                        `/address-screen/results?address=${encodeURIComponent(
                          h.address
                        )}&chain=${h.chain}&ts=${encodeURIComponent(h.screenedAt)}`
                      )
                    }
                  >
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-7 min-w-0">
                        <div className="font-mono text-sm text-slate-100 truncate">
                          {truncateHash(h.address, 22, 12)}
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm text-slate-200">{h.chain}</span>
                      </div>
                      <div className="col-span-3 text-right flex items-center justify-end gap-2">
                        <span className="text-sm text-slate-300 font-mono">
                          {format(new Date(h.screenedAt), "MMM d, yyyy, h:mm a")}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}


