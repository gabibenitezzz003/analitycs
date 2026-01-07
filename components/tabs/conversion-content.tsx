"use client"

import { useState, useEffect, useMemo } from "react"
import { EditableCell, ReadOnlyCell } from "@/components/editable-cell"
import { getConversionData } from "@/app/actions/conversion-actions"

// Iconos compactos
function SearchIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  )
}

function CheckIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

function XIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  )
}

function TargetIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </div>
  )
}

interface ConversionData {
  consultas: number
  reservas: number
  rechazos: number
  valorTotal: number
}

interface ComputedMetrics {
  consultasPercent: number
  reservasPercent: number
  rechazosPercent: number
  tasaReserva: number
  tasaRechazo: number
  valorPromReserva: number
  eficienciaFunnel: number
  statusFunnel: 'Excelente' | 'Buena' | 'Regular' | 'Crítica'
  statusColor: string
}

function recalcularTodo(data: ConversionData): ComputedMetrics {
  const { consultas, reservas, rechazos, valorTotal } = data
  
  const totalInteracciones = consultas || 1 // Evitar división por cero
  
  const consultasPercent = (consultas / totalInteracciones) * 100
  const reservasPercent = (reservas / totalInteracciones) * 100
  const rechazosPercent = (rechazos / totalInteracciones) * 100
  
  const tasaReserva = consultas > 0 ? (reservas / consultas) * 100 : 0
  const tasaRechazo = consultas > 0 ? (rechazos / consultas) * 100 : 0
  
  const valorPromReserva = reservas > 0 ? valorTotal / reservas : 0
  const eficienciaFunnel = tasaReserva
  
  let statusFunnel: 'Excelente' | 'Buena' | 'Regular' | 'Crítica'
  let statusColor: string
  
  if (tasaReserva >= 40) {
    statusFunnel = 'Excelente'
    statusColor = 'text-emerald-400'
  } else if (tasaReserva >= 30) {
    statusFunnel = 'Buena'
    statusColor = 'text-blue-400'
  } else if (tasaReserva >= 20) {
    statusFunnel = 'Regular'
    statusColor = 'text-amber-400'
  } else {
    statusFunnel = 'Crítica'
    statusColor = 'text-red-400'
  }
  
  return {
    consultasPercent,
    reservasPercent,
    rechazosPercent,
    tasaReserva,
    tasaRechazo,
    valorPromReserva,
    eficienciaFunnel,
    statusFunnel,
    statusColor
  }
}

export function ConversionContent({ range = "7d" }: { range?: string }) {
  const [data, setData] = useState<ConversionData>({
    consultas: 0,
    reservas: 0,
    rechazos: 0,
    valorTotal: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true)
      const initial = await getConversionData(range)
      setData(initial)
      setIsLoading(false)
    }
    loadInitialData()
  }, [range])

  const computed = useMemo(() => recalcularTodo(data), [data])

  const handleCellChange = (field: keyof ConversionData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const funnelData = [
    { 
      etapa: 'Consultas Recibidas', 
      cantidad: data.consultas, 
      porcentaje: computed.consultasPercent,
      conversion: 100,
      color: 'blue',
      icon: <SearchIcon />
    },
    { 
      etapa: 'Reservas Confirmadas', 
      cantidad: data.reservas, 
      porcentaje: computed.reservasPercent,
      conversion: computed.tasaReserva,
      color: 'emerald',
      icon: <CheckIcon />
    },
    { 
      etapa: 'Rechazos', 
      cantidad: data.rechazos, 
      porcentaje: computed.rechazosPercent,
      conversion: computed.tasaRechazo,
      color: 'red',
      icon: <XIcon />
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con instrucción */}
      <div className="flex items-center gap-3">
        <TargetIcon />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Análisis de Conversión</h2>
          <p className="text-sm text-zinc-500">Haz click en cualquier número para editarlo en tiempo real</p>
        </div>
      </div>

      {/* KPIs Editables Compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">CONSULTAS</span>
            <SearchIcon />
          </div>
          <EditableCell
            value={data.consultas}
            onChange={(v) => handleCellChange('consultas', v)}
            format="number"
            min={0}
            max={10000}
            className="text-2xl text-blue-400"
          />
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">RESERVAS</span>
            <CheckIcon />
          </div>
          <EditableCell
            value={data.reservas}
            onChange={(v) => handleCellChange('reservas', Math.min(v, data.consultas))}
            format="number"
            min={0}
            max={data.consultas}
            className="text-2xl text-emerald-400"
          />
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">RECHAZOS</span>
            <XIcon />
          </div>
          <EditableCell
            value={data.rechazos}
            onChange={(v) => handleCellChange('rechazos', Math.min(v, data.consultas))}
            format="number"
            min={0}
            max={data.consultas}
            className="text-2xl text-red-400"
          />
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">CONVERSIÓN</span>
            <TargetIcon />
          </div>
          <ReadOnlyCell
            value={computed.tasaReserva}
            format="percentage"
            className="text-2xl"
            color="text-amber-400"
          />
        </div>
      </div>

      {/* Tabla Estilo Excel - Compacta y Editable */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            Análisis Detallado de Conversión
            <span className="ml-auto text-xs text-zinc-500 font-normal">✏️ Celdas editables</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/[0.06]">
                <th className="text-left py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Etapa</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Cantidad ✏️</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">% del Total</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Tasa</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {funnelData.map((row, index) => (
                <tr 
                  key={row.etapa} 
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {row.icon}
                      <span className="text-sm font-medium text-white">{row.etapa}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-6">
                    <EditableCell
                      value={row.cantidad}
                      onChange={(v) => {
                        const field = index === 0 ? 'consultas' : index === 1 ? 'reservas' : 'rechazos'
                        handleCellChange(field, v)
                      }}
                      format="number"
                      className={`text-sm font-bold text-${row.color}-400`}
                    />
                  </td>
                  <td className="text-right py-4 px-6">
                    <ReadOnlyCell
                      value={row.porcentaje}
                      format="percentage"
                      color="text-zinc-300"
                    />
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold
                      ${row.conversion >= 30 ? 'bg-emerald-500/10 text-emerald-400' : 
                        row.conversion >= 20 ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-zinc-500/10 text-zinc-400'}`}>
                      {row.conversion.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r from-${row.color}-500 to-${row.color}-400 h-2.5 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${Math.min(row.porcentaje, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 tabular-nums w-12 text-right">
                        {row.porcentaje.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-900/30 border-t-2 border-white/[0.08]">
                <td colSpan={5} className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-500">VALOR TOTAL ✏️</span>
                      <EditableCell
                        value={data.valorTotal}
                        onChange={(v) => handleCellChange('valorTotal', v)}
                        format="currency"
                        min={0}
                        max={10000000000}
                        className="text-emerald-400 text-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-500">PROMEDIO / RESERVA</span>
                      <ReadOnlyCell
                        value={computed.valorPromReserva}
                        format="currency"
                        color="text-blue-400"
                        className="text-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-500">EFICIENCIA DEL FUNNEL</span>
                      <div className="flex items-center gap-2">
                        <ReadOnlyCell
                          value={computed.eficienciaFunnel}
                          format="percentage"
                          color={computed.statusColor}
                          className="text-lg"
                        />
                        <span className={`text-sm font-semibold ${computed.statusColor}`}>
                          {computed.statusFunnel}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
