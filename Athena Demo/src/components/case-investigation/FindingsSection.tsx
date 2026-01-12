"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface FindingsSectionProps {
  caseId: string
}

export function FindingsSection({ caseId }: FindingsSectionProps) {
  const { toast } = useToast()
  const findings = useAppStore((s) => s.findingsByCaseId[caseId] ?? [])
  const addFinding = useAppStore((s) => s.addFinding)
  const deleteFinding = useAppStore((s) => s.deleteFinding)

  const [draft, setDraft] = useState("")

  const MAX_LEN = 500
  const canSubmit = draft.trim().length > 0

  const ordered = useMemo(() => findings, [findings])

  const onAdd = () => {
    const content = draft.trim()
    if (!content) return
    addFinding(caseId, content)
    setDraft("")
    toast({ title: "Finding added" })
  }

  return (
    <Card className="bg-slate-900/55 border-slate-700/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Findings
            </h3>
            <p className="text-xs text-slate-500">
              Capture analyst notes and evidence highlights for this case.
            </p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {ordered.length === 0 ? (
            <div className="text-sm text-slate-400 border border-slate-800/60 rounded-lg p-4 bg-slate-950/35">
              No findings yet. Add your first note below.
            </div>
          ) : (
            ordered.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-slate-800/60 bg-slate-950/35 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                        {f.author}
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(new Date(f.createdAt), "MMM d, yyyy, h:mm a")}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-100 break-words leading-relaxed">
                      {f.content}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-400"
                    onClick={() => deleteFinding(caseId, f.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-400">Add findings</div>
            <div className="text-xs text-slate-500">
              {draft.length}/{MAX_LEN}
            </div>
          </div>
          <textarea
            id="findings-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
            rows={4}
            placeholder='Write a note… e.g., “Originator has indirect exposure to OFAC cluster; 0.06% taint observed. Evidence screenshot added.”'
            className="w-full rounded-lg border border-slate-700/70 bg-slate-950/25 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brand-blue/35 focus:border-brand-blue/50 shadow-inner shadow-black/20"
          />
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-slate-400 hover:text-white"
              onClick={() => setDraft("")}
              disabled={draft.length === 0}
            >
              Clear
            </Button>
            <Button
              onClick={onAdd}
              disabled={!canSubmit}
              className="bg-emerald-600 hover:bg-emerald-600/90 text-white disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
              + Add Findings
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}


