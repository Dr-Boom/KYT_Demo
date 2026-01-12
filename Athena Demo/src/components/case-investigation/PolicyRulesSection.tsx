"use client"

import { Card } from "@/components/ui/card"

interface PolicyRulesSectionProps {
  policyName?: string
  ruleName?: string
  riskDescription?: string
}

export function PolicyRulesSection({
  policyName = "Source of Funds",
  ruleName = "Sanctions",
  riskDescription = "This transaction has indirectly sent payments to the actor with type High Risk Organization for US$ 22.42 and has 0.06% taint",
}: PolicyRulesSectionProps) {
  return (
    <Card className="bg-slate-900/40 border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Risk Details
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            <span className="text-slate-400 font-medium min-w-[140px]">
              Policy Name:
            </span>
            <span className="text-slate-200">{policyName}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            <span className="text-slate-400 font-medium min-w-[140px]">
              Rule Name:
            </span>
            <span className="text-slate-200">{ruleName}</span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            <span className="text-slate-400 font-medium min-w-[140px]">
              Risk Descriptions:
            </span>
            <span className="text-slate-200 leading-relaxed">
              {riskDescription}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

