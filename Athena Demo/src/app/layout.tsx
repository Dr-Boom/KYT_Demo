import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Athena - Transaction Monitoring',
  description: 'Next-gen Transaction Monitoring for Crypto',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-slate-950 text-slate-50 overflow-hidden")}>
        <div className="h-screen flex">
          <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
             <Sidebar />
          </div>
          <main className="md:pl-72 flex-1 flex flex-col h-full overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05] pointer-events-none"></div>
             <Header />
             <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {children}
             </div>
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
