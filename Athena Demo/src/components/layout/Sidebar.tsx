"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  AlertTriangle,
  Briefcase,
  ShieldAlert,
  Users,
  Network,
  LogOut,
  Settings,
  Menu
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-brand-cyan",
  },
  {
    label: "Alerts",
    icon: AlertTriangle,
    href: "/alerts",
    color: "text-red-500",
  },
  {
    label: "Cases",
    icon: Briefcase,
    href: "/cases",
    color: "text-brand-purple",
  },
  {
    label: "Rules",
    icon: ShieldAlert,
    href: "/rules",
    color: "text-green-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-orange-500",
  },
  {
    label: "Network",
    icon: Network,
    href: "/network",
    color: "text-brand-blue",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-950/50 border-r border-slate-800/50 backdrop-blur-xl text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             <div className="absolute inset-0 bg-brand-cyan rounded-full blur-[10px] opacity-50 animate-pulse"></div>
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-8 h-8 text-white">
               <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ATHENA
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300",
                pathname === route.href ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] border-l-2 border-brand-cyan" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <div className="flex items-center p-3 mb-2 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-blue mr-3 flex items-center justify-center font-bold text-xs">
              HN
            </div>
            <div className="flex-1">
               <div className="text-sm font-medium">Haonan</div>
               <div className="text-xs text-slate-500">Senior Analyst</div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white"/>
         </div>
      </div>
    </div>
  )
}

