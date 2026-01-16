"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink } from "lucide-react"
import { useState } from "react"
import { cn, formatCurrency } from "@/lib/utils"

interface ExposureRow {
  type: string
  color: string
  incoming: {
    direct: number
    directPct: number
    indirect: number
    indirectPct: number
  }
  outgoing: {
    direct: number
    directPct: number
    indirect: number
    indirectPct: number
  }
}

interface ExposureEntityRow extends ExposureRow {
  entityName: string
  entityType: string
  entitySubtype: string
}

interface ExposureSubtypeRow extends ExposureRow {
  subtypeLabel: string
}

const MOCK_BY_TYPE: ExposureRow[] = [
  {
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 5656.94, indirectPct: 15.5 },
    outgoing: { direct: 0, directPct: 0, indirect: 127.65, indirectPct: 0.3 }
  },
  {
    type: "DeFi",
    color: "bg-blue-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 50.70, indirectPct: 0.1 }
  },
  {
    type: "High Risk Organization",
    color: "bg-red-600",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 22.42, indirectPct: 0.1 }
  },
  {
    type: "Others",
    color: "bg-slate-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 12.55, indirectPct: 0.0 }
  }
]

const MOCK_BY_ENTITY: ExposureEntityRow[] = [
  {
    entityName: "Bybit.com",
    entityType: "Exchange",
    entitySubtype: "Mandatory KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 5656.94, indirectPct: 15.5 },
    outgoing: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
  },
  {
    entityName: "Sun.io",
    entityType: "DeFi",
    entitySubtype: "Decentralized Exchange - AMM",
    type: "DeFi",
    color: "bg-blue-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 0.36, indirectPct: 0.0 },
  },
  {
    entityName: "Huionepay.com",
    entityType: "High Risk Organization",
    entitySubtype: "High Risk Exchanges",
    type: "High Risk Organization",
    color: "bg-red-600",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 22.42, indirectPct: 0.1 },
  },
  {
    entityName: "Binance.com",
    entityType: "Exchange",
    entitySubtype: "Mandatory KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 101.09, indirectPct: 0.3 },
  },
  {
    entityName: "Okx.com",
    entityType: "Exchange",
    entitySubtype: "Mandatory KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 16.6, indirectPct: 0.0 },
  },
  {
    entityName: "USDD MultiSig Signer",
    entityType: "Others",
    entitySubtype: "Others",
    type: "Others",
    color: "bg-slate-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 2.98, indirectPct: 0.0 },
  },
  {
    entityName: "BTSE",
    entityType: "Exchange",
    entitySubtype: "Optional KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 9.52, indirectPct: 0.0 },
  },
  {
    entityName: "Bridgers.xyz",
    entityType: "DeFi",
    entitySubtype: "Bridges",
    type: "DeFi",
    color: "bg-blue-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 0.34, indirectPct: 0.0 },
  },
  {
    entityName: "Gate.io",
    entityType: "Exchange",
    entitySubtype: "Mandatory KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 0.44, indirectPct: 0.0 },
  },
]

const MOCK_BY_SUBTYPE: ExposureSubtypeRow[] = [
  {
    subtypeLabel: "Exchange > Mandatory KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 5656.94, indirectPct: 15.5 },
    outgoing: { direct: 0, directPct: 0, indirect: 118.13, indirectPct: 0.3 },
  },
  {
    subtypeLabel: "DeFi > Decentralized Exchange - AMM",
    type: "DeFi",
    color: "bg-blue-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 0.36, indirectPct: 0.0 },
  },
  {
    subtypeLabel: "High Risk Organization > High Risk Exchanges",
    type: "High Risk Organization",
    color: "bg-red-600",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 22.42, indirectPct: 0.1 },
  },
  {
    subtypeLabel: "Others > Others",
    type: "Others",
    color: "bg-slate-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 2.98, indirectPct: 0.0 },
  },
  {
    subtypeLabel: "Exchange > Optional KYC and AML",
    type: "Exchange",
    color: "bg-purple-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 9.52, indirectPct: 0.0 },
  },
  {
    subtypeLabel: "DeFi > Bridges",
    type: "DeFi",
    color: "bg-blue-500",
    incoming: { direct: 0, directPct: 0, indirect: 0, indirectPct: 0 },
    outgoing: { direct: 0, directPct: 0, indirect: 0.34, indirectPct: 0.0 },
  },
]

export function CounterpartyExposures() {
  const [activeTab, setActiveTab] = useState('By Entity Type')

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Counterparty Exposures</h3>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
         {/* Sub-tabs */}
         <div className="flex border-b border-slate-800 p-2 gap-2">
            {['By Entity Type', 'By Entity', 'By Entity Subtype'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={cn(
                    "px-4 py-2 text-sm rounded-lg transition-colors",
                    activeTab === tab ? "bg-slate-800 text-white font-medium" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                 )}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* Stats Row */}
         <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/20">
            <div className="flex gap-8">
               <div>
                  <div className="text-xs text-slate-500 mb-1">Total Incoming</div>
                  <div className="text-lg font-bold text-white">$36,491.50</div>
               </div>
               <div>
                  <div className="text-xs text-slate-500 mb-1">Total Outgoing</div>
                  <div className="text-lg font-bold text-white">$36,491.50</div>
               </div>
            </div>
            
            <div className="relative w-72">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
               <Input 
                  placeholder={
                    activeTab === 'By Entity'
                      ? 'Search by entity name, type or subtype'
                      : activeTab === 'By Entity Subtype'
                        ? 'Search by entity type or subtype'
                        : 'Search by entity type'
                  }
                  className="pl-10 bg-slate-950 border-slate-800 h-9 text-sm"
               />
            </div>
         </div>

         {/* Table */}
         {activeTab === 'By Entity Type' && (
           <>
         <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs font-medium text-slate-400 uppercase">
            <div>Entity Type</div>
            <div className="text-right">Incoming Direct</div>
            <div className="text-right">Incoming Indirect</div>
            <div className="text-right">Outgoing Direct</div>
            <div className="text-right">Outgoing Indirect</div>
         </div>

         <div className="divide-y divide-slate-800/50">
                {MOCK_BY_TYPE.map((row) => (
               <div key={row.type} className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors group">
                  <div className="flex items-center gap-2">
                     <Badge className={cn("text-white font-medium px-3 py-0.5 rounded-full border-0", row.color)}>
                        {row.type}
                     </Badge>
                  </div>
                  
                  <div className="text-right text-sm">
                     <span className="text-slate-300">{formatCurrency(row.incoming.direct)}</span>
                     <span className="text-slate-600 text-xs ml-1">({row.incoming.directPct.toFixed(1)}%)</span>
                  </div>
                  
                  <div className="text-right text-sm">
                     <span className="text-slate-300">{formatCurrency(row.incoming.indirect)}</span>
                     <span className="text-slate-600 text-xs ml-1">({row.incoming.indirectPct.toFixed(1)}%)</span>
                  </div>

                  <div className="text-right text-sm">
                     <span className="text-slate-300">{formatCurrency(row.outgoing.direct)}</span>
                     <span className="text-slate-600 text-xs ml-1">({row.outgoing.directPct.toFixed(1)}%)</span>
                  </div>

                  <div className="text-right text-sm">
                     <span className="text-slate-300">{formatCurrency(row.outgoing.indirect)}</span>
                     <span className="text-slate-600 text-xs ml-1">({row.outgoing.indirectPct.toFixed(1)}%)</span>
                  </div>
               </div>
            ))}
         </div>
           </>
         )}

         {activeTab === 'By Entity' && (
           <>
             <div className="grid grid-cols-[2fr,2.5fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs font-medium text-slate-400 uppercase">
                <div>Entity Name</div>
                <div>Entity Type</div>
                <div className="text-right">Incoming Direct</div>
                <div className="text-right">Incoming Indirect</div>
                <div className="text-right">Outgoing Direct</div>
                <div className="text-right">Outgoing Indirect</div>
             </div>

             <div className="divide-y divide-slate-800/50">
                {MOCK_BY_ENTITY.map((row) => (
                   <div key={row.entityName} className="grid grid-cols-[2fr,2.5fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors group">
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-slate-200">{row.entityName}</span>
                         <button className="h-6 w-6 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center">
                           <ExternalLink className="w-3 h-3" />
                         </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                         <Badge className={cn("text-white font-medium px-3 py-0.5 rounded-full border-0", row.color)}>
                           {row.entityType}
                         </Badge>
                         <span className="text-slate-600 text-xs">›</span>
                         <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-normal">
                           {row.entitySubtype}
                         </Badge>
                      </div>

                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.incoming.direct)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.incoming.directPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.incoming.indirect)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.incoming.indirectPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.outgoing.direct)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.outgoing.directPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.outgoing.indirect)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.outgoing.indirectPct.toFixed(1)}%)</span>
                      </div>
                   </div>
                ))}
             </div>
           </>
         )}

         {activeTab === 'By Entity Subtype' && (
           <>
             <div className="grid grid-cols-[3.5fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs font-medium text-slate-400 uppercase">
                <div>Entity Subtype</div>
                <div className="text-right">Incoming Direct</div>
                <div className="text-right">Incoming Indirect</div>
                <div className="text-right">Outgoing Direct</div>
                <div className="text-right">Outgoing Indirect</div>
             </div>

             <div className="divide-y divide-slate-800/50">
                {MOCK_BY_SUBTYPE.map((row) => (
                   <div key={row.subtypeLabel} className="grid grid-cols-[3.5fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors group">
                      <div className="flex items-center gap-2 flex-wrap">
                         <Badge className={cn("text-white font-medium px-3 py-0.5 rounded-full border-0", row.color)}>
                           {row.subtypeLabel}
                         </Badge>
                         <button className="h-6 w-6 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center">
                           <ExternalLink className="w-3 h-3" />
                         </button>
                      </div>
                      
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.incoming.direct)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.incoming.directPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.incoming.indirect)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.incoming.indirectPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.outgoing.direct)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.outgoing.directPct.toFixed(1)}%)</span>
                      </div>
                      <div className="text-right text-sm">
                         <span className="text-slate-300">{formatCurrency(row.outgoing.indirect)}</span>
                         <span className="text-slate-600 text-xs ml-1">({row.outgoing.indirectPct.toFixed(1)}%)</span>
                      </div>
                   </div>
                ))}
             </div>
           </>
         )}
      </div>
    </div>
  )
}

