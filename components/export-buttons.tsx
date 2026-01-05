"use client"

import { useState } from "react"

interface ExportButtonsProps {
  onExportCSV?: () => void
  onExportPDF?: () => void
}

export function ExportButtons({ onExportCSV, onExportPDF }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    // Simular exportación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Crear CSV de ejemplo
    const csvContent = `Fecha,Interacciones,Reservas,Valor Total,Tasa Conversión
${new Date().toLocaleDateString()},24,0,$0,0%
`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `dashboard-b41-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    
    setIsExporting(false)
    if (onExportCSV) onExportCSV()
  }

  const handlePrint = () => {
    window.print()
    if (onExportPDF) onExportPDF()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportCSV}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-[#0a0a0a] border border-white/[0.06] rounded-lg hover:border-white/[0.1] transition-all disabled:opacity-50"
      >
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        <span>CSV</span>
      </button>
      
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-[#0a0a0a] border border-white/[0.06] rounded-lg hover:border-white/[0.1] transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        <span>Imprimir</span>
      </button>
    </div>
  )
}
