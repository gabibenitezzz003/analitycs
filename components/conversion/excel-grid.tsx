"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

interface ExcelGridProps {
  data: any[]
}

export function ExcelGrid({ data }: ExcelGridProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)

  // Columns definition
  const columns = [
    { key: 'created_at', label: 'FECHA', width: '150px' },
    { key: 'telefono', label: 'USUARIO', width: '120px' },
    { key: 'intencion', label: 'INTENCIÓN', width: '100px' },
    { key: 'accion', label: 'ACCIÓN IA', width: '100px' },
    { key: 'origen', label: 'ORIGEN', width: '140px' },
    { key: 'destino', label: 'DESTINO', width: '140px' },
    { key: 'es_exito', label: 'ESTADO', width: '100px' },
    { key: 'mensaje_usuario', label: 'ÚLT. MENSAJE', width: '300px' },
  ]

  // Filter & Sort Logic
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Filtering
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => 
          String(item[key] || '').toLowerCase().includes(filters[key].toLowerCase())
        )
      }
    })

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, filters, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Export CSV Function (Real Data)
  const handleExportCSV = () => {
    if (processedData.length === 0) return

    // 1. Headers
    const headers = columns.map(c => c.label).join(",")
    
    // 2. Rows
    const rows = processedData.map(row => {
        return columns.map(col => {
            const val = row[col.key]
            // Escape quotes and wrap in quotes if contains comma
            const str = String(val === null || val === undefined ? '' : val)
            return `"${str.replace(/"/g, '""')}"`
        }).join(",")
    }).join("\n")

    // 3. Blob & Download
    const csvContent = `${headers}\n${rows}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `conversion_report_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Visual helper for "Actions"
  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'RESERVAR': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'CONSULTAR': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'RECHAZAR': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'FALLBACK': return 'bg-red-500/10 text-red-500 border-red-500/30'
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#09090b] shadow-2xl">
      {/* Toolbar */}
      <div className="bg-zinc-900/50 p-2 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex gap-2 items-center">
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="h-4 w-[1px] bg-zinc-700 mx-2" />
            <span className="text-xs text-zinc-400 font-mono">b41_leads_live.csv</span>
        </div>
        <button 
            onClick={handleExportCSV}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded border border-zinc-700 transition-colors flex items-center gap-2"
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar Datos (.csv)
        </button>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto relative" style={{ maxHeight: '600px' }}>
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="sticky top-0 z-20 bg-zinc-900 shadow-sm">
             {/* Headers */}
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  className="border-r border-b border-zinc-800 p-2 font-medium text-zinc-400 cursor-pointer hover:bg-zinc-800/50 transition-colors select-none"
                  style={{ width: col.width, minWidth: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center justify-between">
                    {col.label}
                    {sortConfig?.key === col.key && (
                        <span className="text-blue-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            {/* Filters Row */}
            <tr className="bg-zinc-900/80">
              {columns.map(col => (
                 <th key={`${col.key}-filter`} className="border-r border-b border-zinc-800 p-1">
                    <input 
                        type="text" 
                        placeholder="Filtrar..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                        onChange={(e) => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                        value={filters[col.key] || ''}
                    />
                 </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {processedData.map((row, idx) => (
              <tr 
                key={row.id || idx} 
                className="group hover:bg-blue-500/5 transition-colors"
              >
                {columns.map(col => {
                  const isEditing = editingCell?.id === row.id && editingCell?.field === col.key
                  const value = row[col.key]

                  return (
                    <td 
                      key={`${row.id}-${col.key}`} 
                      className="border-r border-zinc-800/50 p-0 relative"
                      onClick={() => setEditingCell({ id: row.id, field: col.key })}
                    >
                        {/* Custom Renderers based on Key */}
                        {col.key === 'es_exito' ? (
                            <div className="p-2 flex justify-center">
                                {String(row.intencion) === 'fallback' ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-500">FALLO</span>
                                ) : value ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-900/30 text-green-400 border border-green-500/20">EXITO</span>
                                ) : (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-500">-</span>
                                )}
                            </div>
                        ) : col.key === 'created_at' ? (
                             <div className="p-2 text-zinc-500 whitespace-nowrap">
                                {new Date(value).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                             </div>
                        ) : col.key === 'accion' ? (
                            <div className="p-2">
                                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium border", getActionColor(value))}>
                                    {value || 'N/A'}
                                </span>
                            </div>
                        ) : (
                          // Default Text Cell
                          <div className={cn(
                              "p-2 w-full h-full truncate outline-none focus:bg-blue-900/20 focus:text-blue-200 transition-all",
                              isEditing && "bg-blue-500/10 text-white ring-1 ring-inset ring-blue-500"
                          )}>
                              {value}
                          </div>
                        )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {processedData.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
                No se encontraron datos.
            </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-2 text-xs text-zinc-500 flex justify-between items-center font-mono">
        <span>{processedData.length} registros encontrados</span>
        <div className="flex gap-2">
            <span>SYNC</span>
            <span className="text-green-500">ONLINE</span>
        </div>
      </div>
    </div>
  )
}
