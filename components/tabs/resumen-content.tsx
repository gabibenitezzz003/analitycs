import { Suspense } from "react"
import { getMetricas, getMetricasDiarias, getActividadPorHora } from "@/lib/queries"
import { PremiumTrendChart } from "@/components/charts/premium-trend-chart"
import { PremiumActivityHeatmap } from "@/components/charts/premium-activity-heatmap"
import { KPICard } from "@/components/ui/kpi-card"

// Icons
const MessageIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
const CheckIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
const DollarIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const TrendIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>

export async function ResumenContent({ range }: { range: string }) {
  const [metricas, historial, actividadHora] = await Promise.all([
    getMetricas(range),
    getMetricasDiarias(range),
    getActividadPorHora(range)
  ])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. KPIs Section - Premium Glow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Interacciones Totales"
          value={metricas.total_mensajes.toLocaleString()}
          trend={{ value: metricas.trends.total_mensajes, label: "vs periodo anterior" }}
          icon={MessageIcon}
          color="blue"
          glow
        />
        <KPICard
          title="Reservas Confirmadas"
          value={metricas.total_reservas.toLocaleString()}
          trend={{ value: metricas.trends.total_reservas, label: "vs periodo anterior" }}
          icon={CheckIcon}
          color="emerald"
          glow
        />
        <KPICard
          title="Valor Total Procesado"
          value={metricas.valor_total > 1000000 
            ? `$${(metricas.valor_total / 1000000).toFixed(1)}M`
            : `$${(metricas.valor_total / 1000).toFixed(0)}k`
          }
          trend={{ value: metricas.trends.valor_total, label: "vs periodo anterior" }}
          icon={DollarIcon}
          color="amber"
          glow
        />
        <KPICard
          title="Tasa Conversión"
          value={`${(metricas.tasa_conversion).toFixed(1)}%`}
          trend={{ value: metricas.trends.tasa_conversion, label: "vs periodo anterior" }}
          icon={TrendIcon}
          color="cyan"
          glow
        />
      </div>

      {/* 2. Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div>
               <h3 className="text-lg font-bold text-white tracking-tight">Tendencia de Volumen</h3>
               <p className="text-sm text-zinc-500">Interacciones vs Reservas (Últimos {range})</p>
            </div>
            {/* Legend */}
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-zinc-400">Mensajes</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-400">Reservas</span>
                </div>
            </div>
          </div>
          <div className="relative z-10">
             <PremiumTrendChart 
                data={historial} 
                categories={["total_mensajes", "total_reservas"]} 
                colors={["#3b82f6", "#10b981"]} 
             />
          </div>
        </div>

        {/* 3. Heatmap Section */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden group h-full">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div>
               <h3 className="text-lg font-bold text-white tracking-tight">Actividad Horaria</h3>
               <p className="text-sm text-zinc-500">Distribución de tráfico</p>
            </div>
          </div>
          <div className="relative z-10 h-[calc(100%-2rem)] flex flex-col justify-center">
            <PremiumActivityHeatmap data={actividadHora} />
          </div>
        </div>
      </div>
    </div>
  )
}
