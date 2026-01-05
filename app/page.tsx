import { Suspense } from "react"
import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import { ResumenContent } from "@/components/tabs/resumen-content"
import { ConversionContent } from "@/components/tabs/conversion-content"
import { IAContent } from "@/components/tabs/ia-content"
import { TransportistasContent } from "@/components/tabs/transportistas-content"
import { GeoContent } from "@/components/tabs/geo-content"

function LoadingState({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500">{text}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayoutClient
      resumenContent={
        <Suspense fallback={<LoadingState text="Cargando resumen..." />}>
          <ResumenContent />
        </Suspense>
      }
      conversionContent={
        <Suspense fallback={<LoadingState text="Cargando análisis de conversión..." />}>
          <ConversionContent />
        </Suspense>
      }
      iaContent={
        <Suspense fallback={<LoadingState text="Cargando métricas de IA..." />}>
          <IAContent />
        </Suspense>
      }
      transportistasContent={
        <Suspense fallback={<LoadingState text="Cargando datos de transportistas..." />}>
          <TransportistasContent />
        </Suspense>
      }
      geoContent={<GeoContent />}
    />
  )
}
