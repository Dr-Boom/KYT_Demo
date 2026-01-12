"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  width?: string
}

export function CustomDrawer({ isOpen, onClose, children, title, width = "w-[600px]" }: DrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setVisible(true)
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  // If not open and animation finished (not visible), don't render
  if (!isOpen && !visible) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          `relative h-full ${width} bg-slate-950 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col`,
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white tracking-tight">{title || "Details"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

