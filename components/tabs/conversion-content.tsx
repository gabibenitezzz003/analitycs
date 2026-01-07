import { Suspense } from "react"
import { getConversionesDetalladas } from "@/lib/queries"
import { ExcelGrid } from "@/components/conversion/excel-grid"

export async function ConversionContent({ range }: { range: string }) {
  const data = await getConversionesDetalladas(range)

  // Transform data if needed, or pass directly
  // We might want to simulate some missing fields like names if strictly using 'interacciones' view

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between mb-4">
         <div>
            <h2 className="text-xl font-semibold text-white">Registro de Conversiones y Leads</h2>
            <p className="text-sm text-zinc-500">Base de datos en tiempo real de interacciones</p>
         </div>
         {/* Buttons removed as requested. Export is now inside the Grid. */}
      </div>
      
      <Suspense fallback={<div className="h-[600px] w-full bg-zinc-900/20 animate-pulse rounded-lg" />}>
         <ExcelGrid data={data} />
      </Suspense>
    </div>
  )
}
