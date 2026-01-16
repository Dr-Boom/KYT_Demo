import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/layout/AppShell"

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
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  )
}
