"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { getDrillDownDetails } from "@/lib/queries" // We'll need to call this via Server Action wrapper or move it to a client-callable file if extracting to pure client. 
// Actually, since queries.ts uses 'supabase/server', it can't be imported directly in client.
// We'll create a Server Action bridge in app/actions.ts correctly, OR just fetch comfortably if we change queries.ts logic. 
// For now, let's assume we pass the data OR we fetch via API. 
// Better approach: Server Component passes data to Client Component. 
// BUT, Sheet needs to be global.
// Let's make this component a "Client wrapper that calls a Server Action".

// We need a server action file first.
import { fetchDrillDown } from "@/app/actions" 

export function DrillDownSheet() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("drillType")
  const value = searchParams.get("drillValue")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (type && value) {
      setIsOpen(true)
      setLoading(true)
      fetchDrillDown(type as any, value).then((res) => {
        setData(res)
        setLoading(false)
      })
    } else {
      setIsOpen(false)
    }
  }, [type, value])

  const handleClose = () => {
    setIsOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("drillType")
    params.delete("drillValue")
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="w-[800px] bg-black border-l border-white/10 sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-white">
            Detalle: {type === 'date' ? 'Actividad del Día' : 'Intención'} {value}
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            Mostrando las últimas 50 interacciones.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
             <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {data.length === 0 ? (
               <p className="text-zinc-500">No se encontraron registros.</p>
            ) : (
                data.map((item, i) => (
                    <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-emerald-400 font-mono text-xs">{item.telefono?.slice(0,4)}...</span>
                            <span className="text-zinc-500 text-xs">{new Date(item.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-zinc-300 text-sm mb-2">"{item.mensaje_usuario}"</p>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">
                                {item.intencion}
                             </span>
                             {item.es_reserva && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                                    RESERVA
                                </span>
                             )}
                        </div>
                    </div>
                ))
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
