import { Suspense } from "react"
import { getConversionesDetalladas } from "@/lib/queries"
import { ExcelGrid } from "@/components/conversion/excel-grid"

export async function ConversionContent({ range }: { range: string }) {
  const data = await getConversionesDetalladas(range)

  // Transform data if needed, or pass directly
  // We might want to simulate some missing fields like names if strictly using 'interacciones' view

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-white">Registro de Conversiones y Leads</h2>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded transition-colors border border-zinc-700">
                Exportar CSV
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded transition-colors border border-zinc-700">
                Configurar Columnas
            </button>
         </div>
      </div>
      
      <Suspense fallback={<div className="h-[600px] w-full bg-zinc-900/20 animate-pulse rounded-lg" />}>
         <ExcelGrid data={data} />
      </Suspense>
    </div>
  )
}
