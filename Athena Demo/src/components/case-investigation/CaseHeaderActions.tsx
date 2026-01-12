"use client"

import * as React from "react"
import { Check, ChevronDown, User, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store"
import { CaseStatus } from "@/types"

interface CaseHeaderActionsProps {
  caseId: string
  currentStatus: CaseStatus
  currentAssignee: string | null
}

const STATUS_COLORS: Record<CaseStatus, string> = {
  "New": "bg-blue-500",
  "Recommended Changes": "bg-blue-500",
  "True Hit": "bg-red-500",
  "False Hit": "bg-green-500",
}

// Menu options intentionally exclude "New" (default/no-decision-yet state)
const STATUS_OPTIONS: CaseStatus[] = ["Recommended Changes", "True Hit", "False Hit"]

const ASSIGNEES = ['Alice Chen', 'Bob Smith', 'Charlie Kim', 'Diana Prince', 'Evan Wright'];

export function CaseHeaderActions({ caseId, currentStatus, currentAssignee }: CaseHeaderActionsProps) {
  const { updateCaseStatus, updateCaseAssignee } = useAppStore()

  const currentStatusColor = STATUS_COLORS[currentStatus] ?? "bg-slate-500"

  return (
    <div className="flex items-center gap-4">
      {/* Status Dropdown */}
      <div className="flex items-center gap-2">
         <span className="text-xs text-slate-500 font-medium uppercase">Action</span>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white min-w-[120px] justify-between">
                  <div className="flex items-center gap-2">
                     <div className={cn("w-2 h-2 rounded-full", currentStatusColor)}></div>
                     <span>{currentStatus}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[140px] bg-slate-950 border-slate-800">
               {STATUS_OPTIONS.map((status) => (
                  <DropdownMenuItem 
                     key={status}
                     onClick={() => updateCaseStatus(caseId, status)}
                     className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                  >
                     <div className={cn("w-2 h-2 rounded-full mr-2", STATUS_COLORS[status])}></div>
                     {status}
                     {currentStatus === status && <Check className="w-3 h-3 ml-auto text-slate-400" />}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>

      {/* Assignee Dropdown */}
      <div className="flex items-center gap-2">
         <span className="text-xs text-slate-500 font-medium uppercase">Assigned To</span>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white min-w-[140px] justify-between">
                  <div className="flex items-center gap-2">
                     {currentAssignee ? (
                        <>
                           <div className="w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center text-[10px] text-brand-blue border border-brand-blue/30">
                              {currentAssignee.charAt(0)}
                           </div>
                           <span className="truncate max-w-[80px]">{currentAssignee}</span>
                        </>
                     ) : (
                        <>
                           <UserX className="w-3.5 h-3.5 text-slate-500" />
                           <span className="text-slate-500 italic">Unassigned</span>
                        </>
                     )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px] bg-slate-950 border-slate-800">
               <DropdownMenuLabel className="text-xs text-slate-500">Select Assignee</DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-slate-800" />
               <DropdownMenuItem 
                  onClick={() => updateCaseAssignee(caseId, null)}
                  className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
               >
                  <UserX className="w-3.5 h-3.5 mr-2" />
                  Unassigned
                  {!currentAssignee && <Check className="w-3 h-3 ml-auto text-slate-400" />}
               </DropdownMenuItem>
               {ASSIGNEES.map(name => (
                  <DropdownMenuItem 
                     key={name}
                     onClick={() => updateCaseAssignee(caseId, name)}
                     className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                  >
                     <User className="w-3.5 h-3.5 mr-2" />
                     {name}
                     {currentAssignee === name && <Check className="w-3 h-3 ml-auto text-slate-400" />}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  )
}

