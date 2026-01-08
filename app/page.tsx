import { Suspense } from "react"
import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import { ResumenContent } from "@/components/tabs/resumen-content"
import { ConversionContent } from "@/components/tabs/conversion-content"
import { IAContent } from "@/components/tabs/ia-content"
import { TransportistasContent } from "@/components/tabs/transportistas-content"
import { GeoContent } from "@/components/tabs/geo-content"
import { getGeoStats } from "@/lib/queries"

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const range = (resolvedParams.range as string) || "7d"
  const geoStats = await getGeoStats(range)

  return (
    <Suspense fallback={<LoadingState text="Cargando dashboard..." />}>
      <DashboardLayoutClient
        range={range}
        resumenContent={
          <Suspense fallback={<LoadingState text="Cargando resumen..." />}>
            <ResumenContent range={range} />
          </Suspense>
        }
        conversionContent={
          <Suspense fallback={<LoadingState text="Cargando análisis de conversión..." />}>
            <ConversionContent range={range} />
          </Suspense>
        }
        iaContent={
          <Suspense fallback={<LoadingState text="Cargando métricas de IA..." />}>
            <IAContent range={range} />
          </Suspense>
        }
        transportistasContent={
          <Suspense fallback={<LoadingState text="Cargando datos de transportistas..." />}>
            <TransportistasContent range={range} />
          </Suspense>
        }
        geoContent={<GeoContent />}
      />
    </Suspense>
  )
}
