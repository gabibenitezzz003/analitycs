"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: "resumen",
    label: "Resumen",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "conversion",
    label: "Análisis Conversión",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "ia",
    label: "Performance IA",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: "transportistas",
    label: "Transportistas & Rutas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "geo",
    label: "Mapa Interactivo",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

interface DashboardTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <nav className="mt-8 border-b border-zinc-800/50">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200",
              activeTab === tab.id
                ? "text-white bg-white/5"
                : "text-zinc-500 hover:text-white"
            )}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
