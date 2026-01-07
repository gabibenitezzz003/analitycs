"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Helper component for star rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`}
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export function TransportistasList({ ranking }: { ranking: any[] }) {
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null)

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold">
            <tr>
              <th className="px-6 py-3">Transportista</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-right">Interacciones</th>
              <th className="px-6 py-3 text-right">Reservas</th>
              <th className="px-6 py-3 text-right">Tasa Conv.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {ranking.map((driver) => {
              return (
                <tr 
                  key={driver.id} 
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => setSelectedDriver(driver)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover:scale-110 transition-transform duration-300 border-2 border-transparent group-hover:border-blue-500">
                        {driver.nombre.split(' ').map((n:string) => n[0]).join('').substring(0,2)}
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{driver.nombre}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <StarRating rating={Math.round(driver.ranking)} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", 
                        driver.estado === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        driver.estado === 'INACTIVO' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    )}>
                      {driver.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-zinc-400">{driver.mensajes}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-emerald-400 font-bold">{driver.reservas}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                         <span className="text-xs font-mono text-zinc-300">{driver.tasa}%</span>
                         <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${driver.tasa > 20 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(driver.tasa, 100)}%` }}
                            />
                         </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
        <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white sm:max-w-md">
           {selectedDriver && (
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400 border-2 border-zinc-700">
                            {selectedDriver.nombre.split(' ').map((n:string) => n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold">{selectedDriver.nombre}</DialogTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={Math.round(selectedDriver.ranking)} />
                            <span className="text-xs text-zinc-500">({selectedDriver.ranking.toFixed(1)})</span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">
                            Transportista {selectedDriver.estado}
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                         <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Tasa de Respuesta</p>
                         <p className="text-xl font-bold text-white">~ 22s</p>
                         <p className="text-[10px] text-zinc-600 mt-1">Promedio últimos 7 días</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                         <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Efectividad de Cierre</p>
                         <p className="text-xl font-bold text-emerald-400">{selectedDriver.tasa}%</p>
                         <p className="text-[10px] text-zinc-600 mt-1">Reservas vs Interacciones</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                         <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Reservas</p>
                         <p className="text-xl font-bold text-white">{selectedDriver.reservas}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                         <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Mensajes</p>
                         <p className="text-xl font-bold text-blue-400">{selectedDriver.mensajes}</p>
                    </div>
                </div>

                <div className="bg-blue-900/5 border border-blue-500/10 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Análisis de IA</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedDriver.tasa > 30 
                            ? "Chofer de alto rendimiento. " 
                            : selectedDriver.tasa > 15 
                            ? "Desempeño consistente. " 
                            : "Requiere monitoreo de conversión. "}
                        
                        Su tiempo de respuesta promedio de ~22s es {selectedDriver.ranking >= 4.5 ? "excelente" : "adecuado"}.
                        {selectedDriver.ranking >= 4.8 
                            ? " Altamente recomendado para asignaciones prioritarias." 
                            : selectedDriver.reservas > 50 
                            ? " Muestra gran experiencia en rutas frecuentes."
                            : " Se sugiere asignar rutas cortas para validar fidelización."}
                    </p>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </>
  )
}
