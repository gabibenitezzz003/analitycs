"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { TrendChart } from "@/components/charts/trend-chart"
import { DistributionChart, ChartLegend } from "@/components/charts/distribution-chart"

interface ChartsInteractiveProps {
    trendData: any[]
    distributionData: any[]
    range: string
}

export function ChartsInteractive({ trendData, distributionData, range }: ChartsInteractiveProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleTrendClick = (point: any) => {
        if (!point || !point.fullDate) return
        
        const params = new URLSearchParams(searchParams.toString())
        params.set("drillType", "date")
        // Enforce ISO date part YYYY-MM-DD. Assumes fullDate is ISO string.
        params.set("drillValue", point.fullDate.split('T')[0]) 
        
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleDistributionClick = (item: any) => {
        if (!item || !item.name) return

        const params = new URLSearchParams(searchParams.toString())
        params.set("drillType", "intention")
        params.set("drillValue", item.name) // "Cotizar", "Soporte", etc.

        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tendencia Semanal */}
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Tendencia {range === 'today' ? 'Hoy' : 'Diaria'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-zinc-400">Interacciones</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-zinc-400">Reservas</span>
                        </div>
                    </div>
                </div>
                <div className="cursor-pointer">
                     <TrendChart 
                        data={trendData} 
                        dataKey="interacciones" 
                        height={250} 
                        onValueClick={handleTrendClick}
                     />
                </div>
            </div>

            {/* Distribución por Intención */}
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 card-animate stagger-2">
                <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                    Distribución por Intención
                </h3>
                {distributionData.length > 0 ? (
                    <>
                        <div className="cursor-pointer">
                            <DistributionChart 
                                data={distributionData} 
                                height={180} 
                                onValueClick={handleDistributionClick}
                            />
                        </div>
                        <div className="mt-4">
                            <ChartLegend data={distributionData} />
                        </div>
                    </>
                ) : (
                    <div className="h-[180px] flex items-center justify-center text-zinc-500 text-sm">
                        No hay datos para este periodo
                    </div>
                )}
            </div>
        </div>
    )
}
