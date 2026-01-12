"use client"

import { Bell, Search, Globe, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl h-16 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center w-full max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
             placeholder="Search address / tx hash / customer / case..." 
             className="pl-10 bg-slate-900/50 border-slate-800 text-slate-200 focus-visible:ring-brand-cyan/50 placeholder:text-slate-600 rounded-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-medium text-slate-400">
           <Globe className="w-3 h-3 text-brand-cyan" />
           <span>Environment:</span>
           <span className="text-white">Production (Standard)</span>
           <ChevronDown className="w-3 h-3 ml-1" />
        </div>

        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-white/5">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </Button>
      </div>
    </div>
  )
}

