"use client"
import { useAppStore } from "@/store"
import { Badge } from "@/components/ui/badge"

export default function RulesPage() {
  const { rules } = useAppStore()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Rule Management</h1>
      <div className="grid gap-4">
        {rules.map(rule => (
          <div key={rule.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <span className="font-semibold text-white text-lg">{rule.name}</span>
                   <Badge variant={rule.severity.toLowerCase() as any}>{rule.severity}</Badge>
                </div>
                <p className="text-slate-400">{rule.description}</p>
             </div>
             <div className="text-right">
                <div className="text-xs text-slate-500 uppercase">Category</div>
                <div className="text-brand-cyan">{rule.category}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

