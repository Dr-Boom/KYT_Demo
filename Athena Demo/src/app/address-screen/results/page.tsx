"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Scan } from "lucide-react"
import { AddressSummaryPanel } from "@/components/address-screening/AddressSummaryPanel"
import { AddressAlertsSummary, AddressAlert } from "@/components/address-screening/AddressAlertsSummary"
import { CounterpartyExposures } from "@/components/case-investigation/CounterpartyExposures"
import { format } from "date-fns"

type Chain = "BTC" | "ETH" | "TRX" | "BSC" | "SOL"
type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

function seededNumber(seedStr: string, min: number, max: number) {
  const seed = seedStr.split("").reduce((a, c) => a + c.charCodeAt(0) * 17, 0)
  const n = (seed % 1000) / 1000
  return min + (max - min) * n
}

function seededDate(seedStr: string, daysBackMin: number, daysBackMax: number) {
  const days = Math.round(seededNumber(seedStr, daysBackMin, daysBackMax))
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function chainAsset(chain: Chain) {
  if (chain === "BTC") return "BTC"
  if (chain === "SOL") return "SOL"
  return "ETH"
}

function buildDigitalAssets(address: string, chain: Chain) {
  const pool = [
    "BTC","ETH","USDT","USDC","DAI","WBTC","WETH","BNB","SOL","TRX",
    "PYUSD","LINK","UNI","AAVE","MATIC","SUSHI","ARB","OP","SHIB","PEPE",
    "LDO","ENA","GALA","RNDR","INJ","PAXG","TUSD","FDUSD","BUSD","ATOM",
    "AVAX","NEAR","FTM","XRP","ADA","DOT","LTC","BCH","ETC","XLM",
    "CRV","CVX","COMP","MKR","SNX","1INCH","APECOIN","RUNE","JUP","JTO",
    "ONDO","KISHU","CRO","FIL","NEXO","QNT","RPL","ZRX","LRC","WOO",
  ]
  const base = `${chain}:${address}`
  const count = Math.max(6, Math.min(40, Math.round(seededNumber(`${base}:assets`, 8, 34))))
  const start = Math.abs(base.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % pool.length
  const list: string[] = []
  for (let i = 0; i < count; i++) {
    list.push(pool[(start + i * 3) % pool.length]!)
  }
  // ensure primary asset first
  const primary = chainAsset(chain)
  const dedup = [primary, ...list.filter((s) => s !== primary)]
  return dedup
}

function buildAlerts(address: string, chain: Chain): AddressAlert[] {
  const base = `${chain}:${address}`
  const mkId = (i: number) => Math.abs((base + i).split("").reduce((a, c) => a + c.charCodeAt(0), 0)).toString().slice(0, 8)
  const levels: AddressAlert["level"][] = ["CRITICAL", "CRITICAL", "HIGH", "MEDIUM"]
  const ruleNames = [
    "M4 - FATF Rule - 11.5 - Wallet owned by illicit entity",
    "M2 - FATF Rule - 11.5, 13.7, 13.12, 15.1, 15.2 - Exposure to illicit entity",
    "FATF - 11.5 - Wallet owned by illicit entity",
    "FATF - 11.5, 13.7 - Indirect Exposure to illicit entity",
  ]
  const dirs: AddressAlert["direction"][] = ["Incoming", "Incoming/Outgoing", "Incoming", "Incoming/Outgoing"]
  const statuses: AddressAlert["status"][] = ["Open", "Open", "Open", "Open"]
  const policyName = "Addresses - FATF Rules - AML and CTF"
  const description =
    "This address has directly received payments from the actor with type High Risk Organization: High Risk Jurisdictions for US$ 6.03 and has 0.00% taint."

  return ruleNames.map((ruleName, i) => ({
    id: mkId(i),
    title: ruleName,
    policyName,
    ruleName,
    direction: dirs[i] ?? "Incoming",
    status: statuses[i] ?? "Open",
    level: levels[i] ?? "MEDIUM",
    description,
    openedAt: new Date(Date.now() - (i + 1) * 36e5).toISOString(),
  }))
}

export default function AddressScreeningResultsPage() {
  const router = useRouter()
  const sp = useSearchParams()

  const address = (sp.get("address") ?? "").trim()
  const chain = (sp.get("chain") ?? "ETH") as Chain
  const screenedAt = sp.get("ts") ?? new Date().toISOString()

  const result = useMemo(() => {
    if (!address) return null
    // Demo default: show the address as Critical to emphasize a high-risk screening flow.
    const risk: Risk = "CRITICAL"
    const asset = chainAsset(chain)
    const digitalAssets = buildDigitalAssets(address, chain)
    const openAlerts = 4
    const balanceNative = seededNumber(`${address}:${chain}:bal`, 0, risk === "CRITICAL" ? 4.2 : 1.4)
    const balanceUsd = seededNumber(`${address}:${chain}:usd`, 0, risk === "CRITICAL" ? 950000 : 120000)
    const ownerName = risk === "CRITICAL" ? "Poloniex" : risk === "HIGH" ? "Binance" : "Unknown"
    const ownerType = ownerName === "Unknown" ? "—" : "Exchange ・ Mandatory KYC and AML"
    const userLabel = risk === "CRITICAL" ? "Stolen Funds" : risk === "HIGH" ? "High Risk Funds" : "—"
    const userType = risk === "CRITICAL" ? "Theft ・ Hack" : risk === "HIGH" ? "Fraud" : "—"

    const earliestTx = seededDate(`${address}:${chain}:earliest`, 1200, 2400)
    const latestTx = seededDate(`${address}:${chain}:latest`, 1, 120)

    return {
      address,
      chain,
      screenedAt,
      risk,
      asset,
      digitalAssets,
      openAlerts,
      balanceNative,
      balanceUsd,
      ownerName,
      ownerType,
      userLabel,
      userType,
      earliestTx,
      latestTx,
      alerts: buildAlerts(address, chain),
    }
  }, [address, chain, screenedAt])

  if (!result) {
    return (
      <div className="p-10 text-center text-slate-500">
        Missing address.{" "}
        <button className="text-brand-cyan underline" onClick={() => router.push("/address-screen")}>
          Back to Address Screening
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Left Sticky Panel */}
      <AddressSummaryPanel
        address={result.address}
        chain={result.chain}
        risk={result.risk}
        openAlerts={result.openAlerts}
        screenedAt={result.screenedAt}
        assetSymbol={result.asset}
        digitalAssets={result.digitalAssets}
        balanceNative={result.balanceNative}
        balanceUsd={result.balanceUsd}
        ownerName={result.ownerName}
        ownerType={result.ownerType}
        userLabel={result.userLabel}
        userType={result.userType}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/address-screen")}
                className="text-slate-400 hover:text-white pl-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Address Screening
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
                  <Scan className="w-4.5 h-4.5 text-brand-blue" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white leading-tight">
                    Address Investigation
                  </h1>
                  <div className="text-sm text-slate-400 font-mono mt-0.5">
                    {result.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-slate-800 mb-6">
              <TabsList className="bg-transparent h-12 p-0 space-x-6">
                <TabsTrigger
                  value="overview"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="exposures"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2"
                >
                  Exposures by CounterParty
                </TabsTrigger>
                <TabsTrigger
                  value="audit"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2"
                >
                  Audit Logs
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Address Summary (table header in screenshot) */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Address Summary
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Value in Digital Asset
                  </Button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-12 gap-3 text-xs text-slate-500 pb-3 border-b border-slate-800/60">
                    <div className="col-span-2">Token</div>
                    <div className="col-span-2">Balance</div>
                    <div className="col-span-3">Total Incoming Value</div>
                    <div className="col-span-3">Total Outgoing Value</div>
                    <div className="col-span-2 text-right">Earliest / Latest</div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 py-3 text-sm text-slate-200 items-center">
                    <div className="col-span-2 font-medium">{result.asset}</div>
                    <div className="col-span-2">
                      {result.balanceNative.toFixed(4)} {result.asset}
                    </div>
                    <div className="col-span-3">
                      {(result.balanceNative * 0.6).toFixed(4)} {result.asset}
                    </div>
                    <div className="col-span-3">
                      {(result.balanceNative * 0.6).toFixed(4)} {result.asset}
                    </div>
                    <div className="col-span-2 text-right text-xs text-slate-400 font-mono">
                      {format(new Date(result.earliestTx), "MMM d, yyyy")}
                      <span className="text-slate-700 mx-2">/</span>
                      {format(new Date(result.latestTx), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </div>

              <AddressAlertsSummary alerts={result.alerts} />
            </TabsContent>

            <TabsContent value="exposures" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Reuse existing exposure UI shell for now; wiring to API-specific aggregation can be done next */}
              <CounterpartyExposures />
            </TabsContent>

            <TabsContent value="audit" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-slate-500">
                Audit logs (demo placeholder)
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


