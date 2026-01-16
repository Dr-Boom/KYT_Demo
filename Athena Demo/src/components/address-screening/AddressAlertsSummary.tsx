"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export type AddressAlertStatus = "Open" | "In Progress" | "Closed" | "Unassigned"
export type AddressAlertDirection = "Incoming" | "Outgoing" | "Incoming/Outgoing"
export type AddressAlertLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface AddressAlert {
  id: string
  title: string
  policyName: string
  ruleName: string
  direction: AddressAlertDirection
  status: AddressAlertStatus
  level: AddressAlertLevel
  description: string
  openedAt: string
}

function levelTone(level: AddressAlertLevel) {
  if (level === "LOW") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
  if (level === "MEDIUM") return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  if (level === "HIGH") return "bg-orange-500/10 text-orange-400 border border-orange-500/20"
  return "bg-purple-500/10 text-purple-400 border border-purple-500/20"
}

export function AddressAlertsSummary({ alerts }: { alerts: AddressAlert[] }) {
  const rows = useMemo(() => alerts, [alerts])

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Alerts Summary
        </h3>
        <div className="text-xs text-slate-500">{rows.length} alerts</div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {rows.map((a) => (
          <div
            key={a.id}
            className="p-4 hover:bg-slate-900/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "h-6 px-3 text-[11px] font-semibold flex-shrink-0",
                      levelTone(a.level)
                    )}
                  >
                    {a.level}
                  </Badge>
                  <div className="text-sm font-semibold text-slate-100">
                    {a.ruleName}
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {a.policyName} ・ {a.direction} ・{" "}
                  {format(new Date(a.openedAt), "MMM d, yyyy h:mm a")} ・ Alert ID:{" "}
                  <span className="font-mono text-slate-400">{a.id}</span>
                </div>

                <div className="mt-2 text-sm text-slate-200 leading-relaxed">
                  {a.description}
                </div>
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            No alerts found for this address.
          </div>
        )}
      </div>
    </div>
  )
}


