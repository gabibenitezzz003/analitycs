import { getTopRutas, getSesionesActivas } from "@/lib/queries"

export async function TransportistasContent({ range = "7d" }: { range?: string }) {
  const rutas = await getTopRutas(10, range)
  const sesionesActivasData = await getSesionesActivas(range)
  const sesionesActivas = sesionesActivasData.value

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Transportistas & Rutas</h2>
          <p className="text-sm text-zinc-500">Análisis de transportistas activos y rutas más frecuentes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Transportistas Activos</p>
          <p className="text-4xl font-bold text-purple-400 mt-2 tabular-nums">{sesionesActivas}</p>
          <p className="text-xs text-zinc-500 mt-2">Últimas 24 horas</p>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rutas Activas</p>
          <p className="text-4xl font-bold text-blue-400 mt-2 tabular-nums">{rutas.length}</p>
          <p className="text-xs text-zinc-500 mt-2">Rutas con actividad</p>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Valor Promedio</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2 tabular-nums">
            ${rutas.length > 0 ? (rutas.reduce((sum, r) => sum + r.valor_promedio, 0) / rutas.length / 1000).toFixed(0) : 0}K
          </p>
          <p className="text-xs text-zinc-500 mt-2">Por ruta</p>
        </div>
      </div>

      {/* Tabla de Rutas */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Rutas por Rendimiento
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ruta</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Valor Total</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Consultas</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reservas</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conversión</th>
              </tr>
            </thead>
            <tbody>
              {rutas.length > 0 ? (
                rutas.map((ruta) => (
                  <tr key={ruta.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
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
                      <span className="text-sm text-zinc-300">{ruta.total_reservas}</span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`text-sm font-semibold ${ruta.tasa_conversion > 15 ? 'text-emerald-400' : ruta.tasa_conversion > 10 ? 'text-amber-400' : 'text-zinc-400'}`}>
                        {ruta.tasa_conversion.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500">
                    No hay datos de rutas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Rutas Visual */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6">Top 5 Rutas por Volumen</h3>
        
        <div className="space-y-4">
          {rutas.slice(0, 5).map((ruta, index) => {
            const maxConsultas = Math.max(...rutas.map(r => r.total_consultas))
            const percentage = maxConsultas > 0 ? (ruta.total_consultas / maxConsultas) * 100 : 0
            
            return (
              <div key={ruta.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white font-medium">
                    {index + 1}. {ruta.origen} → {ruta.destino}
                  </span>
                  <span className="text-sm text-zinc-400">{ruta.total_consultas} consultas</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
          
          {rutas.length === 0 && (
            <p className="text-center text-zinc-500 py-4">No hay datos disponibles</p>
          )}
        </div>
      </div>
    </div>
  )
}
