"use client"

import { Alert, CaseStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  UserPlus,
  RefreshCw,
  Bell,
  ChevronDown,
  User,
  UserX,
} from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const ASSIGNEES = ["Alice Chen", "Bob Smith", "Charlie Kim", "Diana Prince", "Evan Wright"]
// Bulk options intentionally exclude "New" (default/no-decision-yet state)
const ACTION_OPTIONS: CaseStatus[] = ["Recommended Changes", "True Hit", "False Hit"]

type RelatedCaseRow = Alert & { action: CaseStatus }

function defaultActionFor(alert: Alert): CaseStatus {
  // Default is "New" to indicate no changes/decision yet.
  return "New"
}

interface AlertsSummarySectionProps {
  alerts: Alert[]
}

export function AlertsSummarySection({ alerts }: AlertsSummarySectionProps) {
  const { toast } = useToast()
  const MAX_LEN = 500
  const [filter, setFilter] = React.useState("All")
  const [items, setItems] = React.useState<RelatedCaseRow[]>(
    alerts.map((a) => ({ ...a, action: defaultActionFor(a) }))
  )
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [bulkCommentDraft, setBulkCommentDraft] = React.useState("")

  React.useEffect(() => {
    setItems(alerts.map((a) => ({ ...a, action: defaultActionFor(a) })))
    setSelectedIds(new Set())
    setBulkCommentDraft("")
  }, [alerts])

  // Mock filtering
  const filteredAlerts =
    filter === "All"
      ? items
      : items.filter((a) => {
          if (filter === "Assigned to me") return a.assignee === "Me" // Mock 'Me'
          if (filter === "Unassigned") return !a.assignee
          return a.action === filter
        })

  const counts = {
     all: items.length,
     assignedToMe: 0,
     new: items.filter(a => a.action === 'New').length,
     recommended: items.filter(a => a.action === 'Recommended Changes').length,
     trueHit: items.filter(a => a.action === 'True Hit').length,
     falseHit: items.filter(a => a.action === 'False Hit').length,
     unassigned: items.filter(a => !a.assignee).length,
  };

  const chips = [
     { label: 'Assigned to me', count: counts.assignedToMe, id: 'Assigned to me' },
     { label: 'New', count: counts.new, id: 'New' },
     { label: 'Recommended Changes', count: counts.recommended, id: 'Recommended Changes' },
     { label: 'True Hit', count: counts.trueHit, id: 'True Hit' },
     { label: 'False Hit', count: counts.falseHit, id: 'False Hit' },
     { label: 'Unassigned', count: counts.unassigned, id: 'Unassigned' },
     { label: 'All', count: counts.all, id: 'All' },
  ];

  const selectedCount = selectedIds.size
  const visibleIds = React.useMemo(
    () => new Set(filteredAlerts.map((a) => a.id)),
    [filteredAlerts]
  )
  const visibleSelectedCount = React.useMemo(() => {
    let n = 0
    selectedIds.forEach((id) => {
      if (visibleIds.has(id)) n++
    })
    return n
  }, [selectedIds, visibleIds])

  const allVisibleSelected =
    filteredAlerts.length > 0 && visibleSelectedCount === filteredAlerts.length
  const someVisibleSelected =
    visibleSelectedCount > 0 && visibleSelectedCount < filteredAlerts.length

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        // unselect all visible only
        filteredAlerts.forEach((a) => next.delete(a.id))
      } else {
        // select all visible
        filteredAlerts.forEach((a) => next.add(a.id))
      }
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const bulkAssign = (assignee: string | null) => {
    setItems((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, assignee } : a))
    )
  }

  const bulkAction = (action: CaseStatus) => {
    setItems((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, action } : a))
    )
  }

  const applyBulkComment = () => {
    const text = bulkCommentDraft.trim()
    if (!text || selectedIds.size === 0) return
    // Demo-only: we don't persist comments per related case yet; just acknowledge the action.
    toast({
      title: "Bulk comment added",
      description: `Applied to ${selectedIds.size} related case(s)`,
    })
    setBulkCommentDraft("")
  }

  return (
    <div className="space-y-4">
       <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Related Cases
            </h3>

            {/* Select All (visible) */}
            <label className="flex items-center gap-2 text-xs text-slate-500 select-none">
              <input
                type="checkbox"
                className="rounded border-slate-700 bg-slate-900 text-brand-blue focus:ring-0"
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someVisibleSelected
                }}
                onChange={toggleSelectAllVisible}
              />
              Select all
              {filteredAlerts.length > 0 ? (
                <span className="text-slate-600">({filteredAlerts.length})</span>
              ) : null}
            </label>

            {selectedCount > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">
                  Selected:{" "}
                  <span className="text-slate-200 font-semibold">
                    {selectedCount}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-slate-400 hover:text-white"
                  onClick={clearSelection}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                {/* Bulk Action */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                    >
                      Bulk Action
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[180px] bg-slate-950 border-slate-800"
                  >
                    <DropdownMenuLabel className="text-xs text-slate-500">
                      Set action for selected
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    {ACTION_OPTIONS.map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => bulkAction(s)}
                        className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Bulk Comment */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                    >
                      Bulk Comment
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[420px] bg-slate-950 border-slate-800 p-0"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-slate-300">
                            Bulk comment
                            <span className="ml-2 rounded-full border border-slate-800 bg-slate-900/40 px-2 py-0.5 text-[10px] text-slate-400">
                              {selectedCount} selected
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Same as Findings, applied to all selected related cases.
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {bulkCommentDraft.length}/{MAX_LEN}
                        </div>
                      </div>

                      <textarea
                        value={bulkCommentDraft}
                        onChange={(e) =>
                          setBulkCommentDraft(e.target.value.slice(0, MAX_LEN))
                        }
                        rows={4}
                        placeholder='Write a note… e.g., “Exposure is indirect but policy hit is Sanctions, recommend to freeze this wallet.”'
                        className="w-full rounded-lg border border-slate-700/70 bg-slate-950/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-blue/35 focus:border-brand-blue/50 shadow-inner shadow-black/20"
                      />

                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-slate-400 hover:text-white"
                          onClick={() => setBulkCommentDraft("")}
                          disabled={bulkCommentDraft.length === 0}
                        >
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-brand-blue hover:bg-brand-blue/90 text-white disabled:opacity-50"
                          disabled={bulkCommentDraft.trim().length === 0}
                          onClick={applyBulkComment}
                        >
                          Apply to selected
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Bulk Assignee */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                    >
                      Bulk Assignee
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] bg-slate-950 border-slate-800"
                  >
                    <DropdownMenuLabel className="text-xs text-slate-500">
                      Assign selected to
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      onClick={() => bulkAssign(null)}
                      className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5 mr-2" />
                      Unassigned
                    </DropdownMenuItem>
                    {ASSIGNEES.map((name) => (
                      <DropdownMenuItem
                        key={name}
                        onClick={() => bulkAssign(name)}
                        className="text-xs focus:bg-slate-800 focus:text-white cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 mr-2" />
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500"
              onClick={() => {
                // Demo refresh: clear selection and keep current items
                clearSelection()
              }}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
       </div>

       {/* Filter Chips */}
       <div className="flex flex-wrap gap-2">
          {chips.map(chip => (
             <button
               key={chip.id}
               onClick={() => setFilter(chip.id)}
               className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  filter === chip.id 
                    ? "bg-brand-blue/10 border-brand-blue text-brand-blue" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
               )}
             >
                {chip.label}
                <span className={cn(
                   "px-1.5 rounded-full text-[10px]",
                   filter === chip.id ? "bg-brand-blue text-white" : "bg-slate-800 text-slate-500"
                )}>
                   {chip.count}
                </span>
             </button>
          ))}
       </div>

       {/* Alerts List */}
       <div className="space-y-2">
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
             <div key={alert.id} className="group bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <input
                           type="checkbox"
                           checked={selectedIds.has(alert.id)}
                           onChange={() => toggleRow(alert.id)}
                           className="rounded border-slate-700 bg-slate-900 text-brand-blue focus:ring-0"
                         />
                         <span className="font-medium text-slate-200 text-sm">{alert.title}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 pl-5">
                         <span>{alert.policyCategory}</span>
                         <span className="text-slate-700">•</span>
                         <span className={cn(alert.direction === 'Incoming' ? "text-green-400" : "text-red-400")}>{alert.direction}</span>
                         <span className="text-slate-700">•</span>
                         <span>{format(new Date(alert.createdAt), "MMM d, yyyy")}</span>
                         <span className="text-slate-700">•</span>
                         <span className="font-mono">Case ID: {alert.id}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-5 mt-2">
                         <Badge variant={alert.riskLevel.toLowerCase() as any} className="h-5 text-[10px] px-2">
                            {alert.riskLevel}
                         </Badge>
                         <Badge
                           variant="outline"
                           className={cn(
                             "h-5 text-[10px] px-2 border-none",
                             alert.action === "New" && "bg-slate-800 text-slate-300",
                             alert.action === "Recommended Changes" &&
                               "bg-blue-500/10 text-blue-400",
                             alert.action === "True Hit" && "bg-red-500/10 text-red-400",
                             alert.action === "False Hit" &&
                               "bg-green-500/10 text-green-400"
                           )}
                         >
                           {alert.action}
                         </Badge>
                         <Badge variant="secondary" className="h-5 text-[10px] px-2 bg-slate-800 text-slate-400 hover:bg-slate-800">
                            {alert.assignee || "Unassigned"}
                         </Badge>
                      </div>
                   </div>

                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white relative">
                         <MessageSquare className="w-4 h-4" />
                         <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                         <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300">
                         Update Action
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                         <Bell className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </div>
          )) : (
             <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
                No alerts found matching this filter.
             </div>
          )}
       </div>
    </div>
  )
}

