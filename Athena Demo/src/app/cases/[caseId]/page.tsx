"use client"

import { useAppStore } from "@/store"
import { useParams, useRouter } from "next/navigation"
import { TransactionSummaryPanel } from "@/components/case-investigation/TransactionSummaryPanel"
import { AlertsSummarySection } from "@/components/case-investigation/AlertsSummarySection"
import { PolicyRulesSection } from "@/components/case-investigation/PolicyRulesSection"
import { FindingsSection } from "@/components/case-investigation/FindingsSection"
import { CounterpartyExposures } from "@/components/case-investigation/CounterpartyExposures"
import { AuditLogs } from "@/components/case-investigation/AuditLogs"
import { CaseHeaderActions } from "@/components/case-investigation/CaseHeaderActions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CaseInvestigationPage() {
  const params = useParams()
  const router = useRouter()
  const { cases, transactions } = useAppStore()
  
  const caseId = params.caseId as string
  const currentCase = cases.find(c => c.id === caseId)

  // Mock finding the primary linked transaction
  // In a real app, we'd fetch linkedTxIds. For demo, we just grab a random one or the first one if linked.
  const transaction = transactions.find(t => t.hash === currentCase?.txHash) || transactions[0];

  if (!currentCase) {
     return <div className="p-10 text-center text-slate-500">Case not found</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
       {/* Left Sticky Panel */}
       <TransactionSummaryPanel transaction={transaction} caseType={currentCase.type} />

       {/* Main Content Area */}
       <div className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6 space-y-6">
             
             {/* Header Row */}
             <div className="flex flex-wrap items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="text-slate-400 hover:text-white pl-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cases
                </Button>

                <div className="hidden sm:block h-4 w-px bg-slate-800" />

                <h1 className="text-lg font-semibold text-white whitespace-nowrap">
                  Case Investigation:{" "}
                  <span className="text-brand-cyan font-mono">{currentCase.id}</span>
                </h1>

                <CaseHeaderActions
                  caseId={currentCase.id}
                  currentStatus={currentCase.status}
                  currentAssignee={currentCase.assignee}
                />
             </div>

             {/* Top Tabs */}
             <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-slate-800 mb-6">
                   <TabsList className="bg-transparent h-12 p-0 space-x-6">
                      <TabsTrigger value="overview" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2">
                         Overview
                      </TabsTrigger>
                      <TabsTrigger value="exposures" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2">
                         Exposures by CounterParty
                      </TabsTrigger>
                      <TabsTrigger value="audit" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-transparent data-[state=active]:text-brand-blue text-slate-400 px-2">
                         Audit Logs
                      </TabsTrigger>
                   </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {/* Policy & Rules */}
                   <section>
                      <PolicyRulesSection
                        policyName={
                          currentCase.policy ||
                          transaction?.alerts?.[0]?.policyCategory ||
                          "Source of Funds"
                        }
                        ruleName={
                          currentCase.ruleName ||
                          transaction?.alerts?.[0]?.title ||
                          "Sanctions"
                        }
                      />
                   </section>

                   {/* Findings */}
                   <section>
                      <FindingsSection caseId={currentCase.id} />
                   </section>

                   {/* Alerts Summary */}
                   <section>
                      <AlertsSummarySection alerts={transaction?.alerts || []} />
                   </section>
                </TabsContent>

                <TabsContent value="exposures">
                   <CounterpartyExposures />
                </TabsContent>

                <TabsContent value="audit">
                   <AuditLogs />
                </TabsContent>
             </Tabs>
          </div>
       </div>
    </div>
  )
}
