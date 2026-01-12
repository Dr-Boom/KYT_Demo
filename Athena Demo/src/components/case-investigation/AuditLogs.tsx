"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface AuditLogEntry {
  id: string
  action: string
  user: string
  role: string
  timestamp: Date
  details: string
  type: 'status_change' | 'comment' | 'assignment' | 'alert'
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: '1',
    action: 'Case Status Updated',
    user: 'Diana Prince',
    role: 'Senior Analyst',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    details: 'Changed status from "New" to "Investigating"',
    type: 'status_change'
  },
  {
    id: '2',
    action: 'Assignee Changed',
    user: 'System',
    role: 'Automation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    details: 'Case assigned to Diana Prince based on workload balancing',
    type: 'assignment'
  },
  {
    id: '3',
    action: 'Comment Added',
    user: 'Evan Wright',
    role: 'Compliance Officer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    details: 'Flagged High Risk Organization interaction for review.',
    type: 'comment'
  },
  {
    id: '4',
    action: 'Case Created',
    user: 'System',
    role: 'Rule Engine',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    details: 'Case created automatically by Rule: Indirect High Risk Activity',
    type: 'alert'
  }
]

export function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Case Audit History</h3>
      </div>

      <Card className="bg-slate-900/40 border border-slate-800">
         <div className="grid grid-cols-[1fr,1fr,1fr,2fr] gap-4 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs font-medium text-slate-400 uppercase">
            <div>Timestamp</div>
            <div>User</div>
            <div>Action</div>
            <div>Details</div>
         </div>

         <div className="divide-y divide-slate-800/50">
            {MOCK_AUDIT_LOGS.map((log) => (
               <div key={log.id} className="grid grid-cols-[1fr,1fr,1fr,2fr] gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                     <Clock className="w-3 h-3" />
                     {format(log.timestamp, "MMM d, HH:mm")}
                  </div>
                  
                  <div className="flex flex-col">
                     <span className="text-sm text-slate-200">{log.user}</span>
                     <span className="text-[10px] text-slate-500">{log.role}</span>
                  </div>

                  <div>
                     <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-slate-300 font-normal">
                        {log.action}
                     </Badge>
                  </div>

                  <div className="text-sm text-slate-400 leading-relaxed">
                     {log.details}
                  </div>
               </div>
            ))}
         </div>
      </Card>
    </div>
  )
}

