"use client"

import { Transaction, Rule } from "@/types"
import { CustomDrawer } from "@/components/ui/custom-drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ArrowRightLeft, 
  User, 
  FileText, 
  Share2,
  CheckCircle,
  XCircle
} from "lucide-react"

interface TransactionDrawerProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  rules: Rule[]
}

export function TransactionDrawer({ transaction, isOpen, onClose, rules }: TransactionDrawerProps) {
  if (!transaction) return null

  const triggeredRules = rules.filter(r => transaction.rulesTriggered.includes(r.id))

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose} title="Transaction Details" width="w-[800px]">
      <div className="space-y-8">
        {/* Header Summary */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <div className="text-sm text-slate-400">Transaction Hash</div>
               <div className="font-mono text-sm text-brand-cyan select-all">{transaction.hash}</div>
            </div>
            <div className="text-right space-y-1">
               <div className="text-sm text-slate-400">Amount</div>
               <div className="text-2xl font-bold text-white">{transaction.amount} {transaction.asset}</div>
               <div className="text-sm text-slate-500">≈ {formatCurrency(transaction.usdValue)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase">Risk Score</span>
                <div className="flex items-center gap-2">
                   <div className="text-3xl font-black text-white">{transaction.riskScore}</div>
                   <div className="h-2 w-20 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${transaction.riskScore > 80 ? 'bg-red-500' : transaction.riskScore > 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                        style={{ width: `${transaction.riskScore}%` }}
                      />
                   </div>
                </div>
             </div>
             <div className="h-10 w-px bg-slate-800 mx-4"></div>
             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase">Status</span>
                <Badge variant={transaction.riskLevel.toLowerCase() as any} className="w-fit">
                   {transaction.status}
                </Badge>
             </div>
             <div className="h-10 w-px bg-slate-800 mx-4"></div>
             <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase">Time</span>
                <span className="text-sm text-slate-300 font-mono">
                  {format(new Date(transaction.timestamp), "yyyy-MM-dd HH:mm:ss")} UTC
                </span>
             </div>
          </div>
        </div>

        {/* Triggered Rules */}
        <div>
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
              Triggered Rules ({triggeredRules.length})
           </h3>
           <div className="space-y-3">
              {triggeredRules.length > 0 ? triggeredRules.map(rule => (
                <div key={rule.id} className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-colors">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-200">{rule.name}</span>
                      <Badge variant={rule.severity.toLowerCase() as any}>{rule.severity}</Badge>
                   </div>
                   <p className="text-sm text-slate-400">{rule.description}</p>
                   <div className="mt-2 text-xs font-mono text-slate-600">ID: {rule.id} • Category: {rule.category}</div>
                </div>
              )) : (
                 <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500">
                    No rules triggered for this transaction.
                 </div>
              )}
           </div>
        </div>

        {/* Entity Flow */}
        <div>
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-blue" />
              Entity Flow
           </h3>
           <div className="flex items-center gap-4 bg-slate-900/30 p-6 rounded-xl border border-slate-800">
              <div className="flex-1 p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="font-semibold text-white">{transaction.originator.name}</div>
                 <div className="text-xs text-slate-500 mt-1">{transaction.originator.type}</div>
                 <Badge variant="outline" className="mt-2 text-[10px]">{transaction.originator.id}</Badge>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative">
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -z-10"></div>
                 <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-slate-300 mb-2">
                    {transaction.amount} {transaction.asset}
                 </div>
                 <ArrowRightLeft className="w-6 h-6 text-slate-500 animate-pulse" />
              </div>

              <div className="flex-1 p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
                    <User className="w-6 h-6" />
                 </div>
                 <div className="font-semibold text-white">{transaction.beneficiary.name}</div>
                 <div className="text-xs text-slate-500 mt-1">{transaction.beneficiary.type}</div>
                 <Badge variant="outline" className="mt-2 text-[10px]">{transaction.beneficiary.id}</Badge>
              </div>
           </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-950 pb-2">
           <Button className="flex-1 bg-brand-purple hover:bg-brand-purple/90">
              <FileText className="w-4 h-4 mr-2" />
              Create Case
           </Button>
           <Button variant="secondary" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Reviewed
           </Button>
           <Button variant="outline" className="w-12 px-0">
              <Share2 className="w-4 h-4" />
           </Button>
        </div>
      </div>
    </CustomDrawer>
  )
}

