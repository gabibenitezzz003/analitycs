import { ChartsInteractive } from "./charts-interactive"
import { HourlyChart } from "@/components/charts/hourly-chart"
import { getMetricasDiarias, getDistribucionIntencion, getActividadPorHora, getMetricas } from "@/lib/queries"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export async function ChartsSection({ range = "7d" }: { range?: string }) {
  const [metricasData, distributionData] = await Promise.all([
    getMetricasDiarias(range),
    getDistribucionIntencion(range)
  ])

  // Format trend data for chart
  const trendData = metricasData.map(m => ({
    fecha: format(new Date(m.fecha), "eee", { locale: es }),
    fullDate: m.fecha,
    interacciones: m.total_mensajes,
    reservas: m.total_reservas
  }))

  return (
    <ChartsInteractive 
        trendData={trendData} 
        distributionData={distributionData} 
        range={range} 
    />
  )
}

export async function ActivitySection({ range = "7d" }: { range?: string }) {
  const [hourlyData, metricas] = await Promise.all([
    getActividadPorHora(range),
    getMetricas(range)
  ])
  
  // Safe defaults
  const tasaFallback = metricas?.tasa_fallback || 0
  const tasaExito = 100 - tasaFallback
  
  // Note: tiempo_respuesta isn't in aggregated metricas yet unless we add it, defaulting to 0 or mock
  const tiempoRespuesta = 0 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Actividad por Hora */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-3">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Actividad por Hora {range === 'today' ? '(Hoy)' : ''}
        </h3>
        <HourlyChart data={hourlyData} height={200} />
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
              <span className="text-sm text-zinc-400">Tasa Éxito (Est.)</span>
              <span className="text-sm font-bold text-emerald-400">{((1 - (tasaFallback/100)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(1 - (tasaFallback/100)) * 100}%` }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Tasa Fallback</span>
              <span className="text-sm font-bold text-red-400">{Number(tasaFallback).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(tasaFallback * 5, 100)}%` }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Tiempo Respuesta</span>
              <span className="text-sm font-bold text-blue-400">{tiempoRespuesta}ms</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(tiempoRespuesta / 20, 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
