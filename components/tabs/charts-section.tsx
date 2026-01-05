"use client"

import { TrendChart } from "@/components/charts/trend-chart"
import { DistributionChart, ChartLegend } from "@/components/charts/distribution-chart"
import { HourlyChart } from "@/components/charts/hourly-chart"

// Datos de ejemplo para tendencia semanal
const mockTrendData = [
  { fecha: "Lun", interacciones: 320, reservas: 45 },
  { fecha: "Mar", interacciones: 450, reservas: 62 },
  { fecha: "Mié", interacciones: 380, reservas: 51 },
  { fecha: "Jue", interacciones: 520, reservas: 78 },
  { fecha: "Vie", interacciones: 610, reservas: 89 },
  { fecha: "Sáb", interacciones: 380, reservas: 42 },
  { fecha: "Dom", interacciones: 187, reservas: 23 },
]

// Datos para distribución por intención
const distributionData = [
  { name: "Consultar", value: 45.2, color: "#3b82f6" },
  { name: "Reservar", value: 28.7, color: "#10b981" },
  { name: "Rechazar", value: 16.4, color: "#ef4444" },
  { name: "Contraoferta", value: 9.7, color: "#f59e0b" },
]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tendencia Semanal */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Tendencia Semanal
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-zinc-400">Interacciones</span>
            </div>
          </div>
        </div>
        <TrendChart data={mockTrendData} dataKey="interacciones" height={250} />
      </div>

      {/* Distribución por Intención */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-2">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          Distribución por Intención
        </h3>
        <DistributionChart data={distributionData} height={180} />
        <div className="mt-4">
          <ChartLegend data={distributionData} />
        </div>
      </div>
    </div>
  )
}

export function ActivitySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Actividad por Hora */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-3">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Actividad por Hora
        </h3>
        <HourlyChart height={200} />
      </div>

      {/* Métricas de IA */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-4">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Métricas IA
        </h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Tasa Éxito</span>
              <span className="text-sm font-bold text-emerald-400">87.3%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: "87.3%" }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Tasa Fallback</span>
              <span className="text-sm font-bold text-red-400">4.2%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: "21%" }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Tiempo Respuesta</span>
              <span className="text-sm font-bold text-blue-400">1.25s</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: "65%" }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
