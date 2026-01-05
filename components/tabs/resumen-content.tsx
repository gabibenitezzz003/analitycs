import { Suspense } from "react"
import { getMetricasHoy, getInteraccionesHoy, getSesionesActivas, getValorTotalHoy, getTopRutas } from "@/lib/queries"
import { ChartsSection, ActivitySection } from "./charts-section"
import { OfertasActivasTable } from "@/components/ofertas-activas-table"
import { KPIsSection } from "./kpis-section"

async function KPIsWrapper() {
  const [interacciones, sesiones, metricasHoy, valorTotal] = await Promise.all([
    getInteraccionesHoy(),
    getSesionesActivas(),
    getMetricasHoy(),
    getValorTotalHoy(),
  ])

  return (
    <KPIsSection 
      initialInteracciones={interacciones}
      initialSesiones={sesiones}
      initialMetricas={metricasHoy}
      initialValorTotal={valorTotal}
    />
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
              rutas.map((ruta: any, index: number) => (
                <tr 
                  key={index} 
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
                      ${(ruta.total_valor || ruta.valor_total || 0 / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-sm text-zinc-300">{ruta.total_consultas}</span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-sm text-zinc-400">{ruta.tasa_conversion ? Number(ruta.tasa_conversion).toFixed(1) : 0}%</span>
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
        <KPIsWrapper />
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
