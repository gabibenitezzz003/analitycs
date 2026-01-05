import { Suspense } from "react"
import { getMetricasHoy, getInteraccionesHoy, getSesionesActivas, getValorTotalHoy, getTopRutas } from "@/lib/queries"
import { KPICard } from "@/components/kpi-card"
import { ChartsSection, ActivitySection } from "./charts-section"
import { OfertasActivasTable } from "@/components/ofertas-activas-table"

function MessageIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  )
}

function TruckIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
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

function TargetIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  )
}

function DollarIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  )
}

function BrainIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  )
}

async function KPIsSection() {
  const [interacciones, sesiones, metricasHoy, valorTotal] = await Promise.all([
    getInteraccionesHoy(),
    getSesionesActivas(),
    getMetricasHoy(),
    getValorTotalHoy(),
  ])

  const tasaConversion = metricasHoy?.tasa_conversion || 0
  const healthScore = metricasHoy?.tasa_exito_ia || 82

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="card-animate stagger-1">
        <KPICard
          title="Interacciones"
          value={interacciones.toLocaleString()}
          icon={<MessageIcon />}
          glowColor="blue"
          valueColor="text-blue-400"
          trend={{ value: 12.4, label: "vs semana anterior" }}
        />
      </div>

      <div className="card-animate stagger-2">
        <KPICard
          title="Sesiones Activas"
          value={sesiones}
          icon={<TruckIcon />}
          valueColor="text-purple-400"
          trend={{ value: 8.2, label: "vs semana anterior" }}
        />
      </div>

      <div className="card-animate stagger-3">
        <KPICard
          title="Reservas"
          value={metricasHoy?.total_reservas || 0}
          icon={<CheckIcon />}
          glowColor="green"
          valueColor="text-emerald-400"
          trend={{ value: 15.7, label: "vs semana anterior" }}
        />
      </div>

      <div className="card-animate stagger-4">
        <KPICard
          title="Tasa Conversión"
          value={`${tasaConversion.toFixed(1)}%`}
          icon={<TargetIcon />}
          glowColor="amber"
          valueColor="text-amber-400"
          trend={{ value: 2.3, label: "vs semana anterior" }}
        />
      </div>

      <div className="card-animate stagger-5">
        <KPICard
          title="Valor Total"
          value={`$${(valorTotal / 1000000).toFixed(1)}M`}
          icon={<DollarIcon />}
          glowColor="green"
          valueColor="text-emerald-400"
          trend={{ value: 18.9, label: "vs semana anterior" }}
        />
      </div>

      <div className="card-animate stagger-6">
        <KPICard
          title="Health Score IA"
          value={`${healthScore}%`}
          icon={<BrainIcon />}
          glowColor="blue"
          valueColor="text-cyan-400"
          trend={{ value: 5.1, label: "vs semana anterior" }}
        />
      </div>
    </div>
  )
}

async function TopRutasSection() {
  const rutas = await getTopRutas(5)

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Top 5 Rutas por Valor
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ruta</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Consultas
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Conversión
              </th>
            </tr>
          </thead>
          <tbody>
            {rutas.length > 0 ? (
              rutas.map((ruta, index) => (
                <tr 
                  key={ruta.id} 
                  className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-blue-400">
                      {ruta.origen} → {ruta.destino}
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-sm font-bold text-emerald-400">
                      ${(ruta.valor_total / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-sm text-zinc-300">{ruta.total_consultas}</span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-sm text-zinc-400">{ruta.tasa_conversion.toFixed(1)}%</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-zinc-500">
                  No hay datos de rutas disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-zinc-800/50 rounded-xl" />
    </div>
  )
}

export async function ResumenContent() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <Suspense fallback={<LoadingSkeleton />}>
        <KPIsSection />
      </Suspense>

      {/* Gráficos */}
      <ChartsSection />

      {/* Actividad y Métricas */}
      <ActivitySection />

      {/* Bottom Row: Rutas + Ofertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingSkeleton />}>
          <TopRutasSection />
        </Suspense>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <OfertasActivasTable />
        </Suspense>
      </div>
    </div>
  )
}
