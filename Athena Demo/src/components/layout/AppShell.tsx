"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

const FULL_WIDTH_ROUTES = ["/address-screen/results"]

function isFullWidth(pathname: string) {
  return FULL_WIDTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const fullWidth = isFullWidth(pathname)

  return (
    <div className="h-screen flex">
      {!fullWidth && (
        <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
      )}

      <main
        className={[
          "flex-1 flex flex-col h-full overflow-hidden relative",
          fullWidth ? "md:pl-0" : "md:pl-72",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05] pointer-events-none"></div>
        <Header />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">{children}</div>
      </main>
    </div>
  )
}


