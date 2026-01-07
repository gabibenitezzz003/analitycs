import { Suspense } from "react"
import { getTransportistasRanking, getTopRutas } from "@/lib/queries"

export async function TransportistasContent({ range = "7d" }: { range?: string }) {
  const [ranking, rutas] = await Promise.all([
    getTransportistasRanking(range),
    getTopRutas(5, range)
  ])

  // Helper for badges
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'PENDIENTE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'INACTIVO': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      case 'BLOQUEADO': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Total Choferes</p>
                <p className="text-2xl font-bold text-white">{ranking.length}</p>
            </div>
         </div>
         <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Tasa Aceptación</p>
                <p className="text-2xl font-bold text-white">
                    {ranking.length > 0 ? (ranking.reduce((acc, curr) => acc + curr.tasa, 0) / ranking.length).toFixed(0) : 0}%
                </p>
            </div>
         </div>
         <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 md:col-span-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
             <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Top Chofer</p>
                {ranking.length > 0 && (
                     <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-white">{ranking[0].nombre}</p>
                        <span className="text-amber-400 text-sm">★ {ranking[0].ranking.toFixed(1)}</span>
                     </div>
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Main List - Ranking de Choferes */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Ranking de Desempeño</h3>
                <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">Top 10 Global</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold">
                        <tr>
                            <th className="px-6 py-3">Transportista</th>
                            <th className="px-6 py-3 text-center">Estado</th>
                            <th className="px-6 py-3 text-right">Interacciones</th>
                            <th className="px-6 py-3 text-right">Reservas</th>
                            <th className="px-6 py-3 text-right">Conversión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {ranking.map((driver) => (
                            <tr key={driver.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                            {driver.nombre.split(' ').map((n:string) => n[0]).join('').substring(0,2)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{driver.nombre}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-amber-400 text-xs">★ {driver.ranking.toFixed(1)}</span>
                                                <span className="text-zinc-600 text-[10px]">•</span>
                                                <span className="text-zinc-500 text-xs">{driver.id.replace(/(\d{3})(\d{4})/, '$1-****')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(driver.estado)}`}>
                                        {driver.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-zinc-400 text-sm">
                                    {driver.mensajes} Msgs
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <span className="text-emerald-400 font-bold">{driver.reservas}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${driver.tasa > 20 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                style={{ width: `${Math.min(driver.tasa, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-300 w-8">{driver.tasa}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {ranking.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No hay datos suficientes</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 3. Small Side Panel - Top Rutas */}
        <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Rutas Más Solicitadas</h3>
                <div className="space-y-4">
                     {rutas.map((ruta, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-zinc-500">#{i+1}</span>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">{ruta.origen} → {ruta.destino}</p>
                                    <p className="text-xs text-zinc-500">{ruta.total_consultas} consultas</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                ${(ruta.valor_total/1000).toFixed(0)}k
                            </span>
                        </div>
                     ))}
                </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-center">
                <p className="text-sm text-blue-200 font-medium">✨ IA Tip</p>
                <p className="text-xs text-blue-300/80 mt-1">
                    Los choferes con ranking superior a 4.5 tienen una tasa de conversión 20% mayor. Prioriza asignarles cargas premium.
                </p>
            </div>
        </div>

      </div>
    </div>
  )
}
