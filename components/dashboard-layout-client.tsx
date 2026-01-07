"use client"

import { useState, type ReactNode } from "react"
import { DashboardTabs } from "./dashboard-tabs"
import { LastUpdated } from "./last-updated"
import { DateRangeSelector, type DateRange } from "./date-range-selector"
import { ExportButtons } from "./export-buttons"
import { DrillDownSheet } from "@/components/drill-down-sheet"

function TruckIcon({ color = "#ffffff" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

interface DashboardLayoutClientProps {
  resumenContent: ReactNode
  conversionContent: ReactNode
  iaContent: ReactNode
  transportistasContent: ReactNode
  geoContent: ReactNode
}

export function DashboardLayoutClient({
  resumenContent,
  conversionContent,
  iaContent,
  transportistasContent,
  geoContent,
  range = "7d" 
}: DashboardLayoutClientProps & { range?: string }) {
  const [activeTab, setActiveTab] = useState("resumen")

  return (
    <div className="min-h-screen bg-black">
      <DrillDownSheet />
      <div className="max-w-[1920px] mx-auto p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-glow-pulse">
                <TruckIcon />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Analytics B.4.1
                </h1>
                <p className="text-sm text-zinc-500 mt-1 font-medium">
                  Follow Hub · Dashboard Analítico en Tiempo Real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range Selector */}
              <DateRangeSelector />
              
              {/* Export Buttons */}
              <ExportButtons />
              
              {/* Status Badge */}
              <div className="px-4 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Sistema Operativo</span>
              </div>
              
              {/* Last Updated */}
              <LastUpdated />
            </div>
          </div>

          {/* Navigation Tabs */}
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </header>

        {/* Tab Content */}
        <main className="animate-fade-in" key={activeTab}>
          {activeTab === "resumen" && resumenContent}
          {activeTab === "conversion" && conversionContent}
          {activeTab === "ia" && iaContent}
          {activeTab === "transportistas" && transportistasContent}
          {activeTab === "geo" && geoContent}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-800/50 no-print">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <span>Follow Hub © 2026 · Analytics B.4.1</span>
            <span>Realizado por el equipo de IA follow</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
