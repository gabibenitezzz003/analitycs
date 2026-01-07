import { Suspense } from "react"
import { getTransportistasRanking, getTopRutas } from "@/lib/queries"
import { TransportistasList } from "@/components/transportistas/transportistas-list"

// IMPORTANT: This file must NOT have "use client" so it can use server-only functions like getTransportistasRanking

export async function TransportistasContent({ range = "7d" }: { range?: string }) {
  const [ranking, rutas] = await Promise.all([
    getTransportistasRanking(range),
    getTopRutas(5, range)
  ])

  return (
    <div className="space-y-6">
      {/* 1. Header Stats (Server Rendered HTML) */}
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
      
      {/* 2. Main List with Client Interactivity */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Ranking de Desempeño</h3>
            </div>
            {/* Interactive Client Component */}
            <TransportistasList ranking={ranking} />
      </div>

    </div>
  )
}
