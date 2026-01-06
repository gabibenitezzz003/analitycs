"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

const CIUDADES_ARGENTINA: Record<string, [number, number]> = {
  "Buenos Aires": [-34.6037, -58.3816],
  "Córdoba": [-31.4201, -64.1888],
  "Rosario": [-32.9468, -60.6393],
  "Mendoza": [-32.8908, -68.8272],
  "Tucumán": [-26.8083, -65.2176],
  "Mar del Plata": [-38.0055, -57.5426],
  "Salta": [-24.7821, -65.4232],
  "San Juan": [-31.5375, -68.5364],
  "Neuquén": [-38.9516, -68.0591],
  "Bahía Blanca": [-38.7196, -62.2724],
}

interface GeoContentProps {
  stats?: {
    ciudades: number
    rutas: number
    distancia: number
  }
}

export function GeoContent({ stats = { ciudades: 0, rutas: 0, distancia: 0 } }: GeoContentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  
  // ... (useRef/useEffect logic remains same, but we can potentially center map based on data if we had coords)

  // ... (useEffect content omitted for brevity, it's fine)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {/* ... */}
      </div>

      {/* Mapa */}
      {/* ... */}

      {/* Leyenda */}
      {/* ... */}

      {/* Info adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-blue-400">{stats.ciudades}</p>
          <p className="text-sm text-zinc-500 mt-1">Ciudades Conectadas</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-emerald-400">{stats.rutas}</p>
          <p className="text-sm text-zinc-500 mt-1">Rutas Activas</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-purple-400">{stats.distancia} km</p>
          <p className="text-sm text-zinc-500 mt-1">Distancia Promedio</p>
        </div>
      </div>
    </div>
  )
}
