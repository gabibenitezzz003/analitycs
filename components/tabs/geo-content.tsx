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

export function GeoContent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    if (typeof window !== "undefined" && !window.L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initMap
      document.head.appendChild(script)
    } else if (window.L) {
      initMap()
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L
      const map = L.map(mapRef.current).setView([-34.6037, -58.3816], 5)
      mapInstanceRef.current = map

      // Usar estilo oscuro de CartoDB
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Agregar marcadores para cada ciudad
      Object.entries(CIUDADES_ARGENTINA).forEach(([ciudad, coords]) => {
        const marker = L.circleMarker(coords as [number, number], {
          radius: 8,
          fillColor: "#3b82f6",
          color: "#60a5fa",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map)

        marker.bindPopup(`
          <div style="background: #0a0a0a; color: white; padding: 8px; border-radius: 8px;">
            <strong>${ciudad}</strong>
          </div>
        `)
      })

      // Dibujar líneas de conexión entre ciudades principales
      const connections = [
        ["Buenos Aires", "Córdoba"],
        ["Buenos Aires", "Rosario"],
        ["Buenos Aires", "Mendoza"],
        ["Córdoba", "Tucumán"],
        ["Rosario", "Córdoba"],
        ["Mendoza", "San Juan"],
        ["Buenos Aires", "Mar del Plata"],
        ["Buenos Aires", "Bahía Blanca"],
        ["Córdoba", "Salta"],
        ["Neuquén", "Bahía Blanca"],
      ]

      connections.forEach(([from, to]) => {
        const fromCoords = CIUDADES_ARGENTINA[from]
        const toCoords = CIUDADES_ARGENTINA[to]
        if (fromCoords && toCoords) {
          L.polyline([fromCoords, toCoords], {
            color: "#3b82f6",
            weight: 2,
            opacity: 0.4,
            dashArray: "5, 10",
          }).addTo(map)
        }
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Mapa Interactivo de Rutas</h2>
          <p className="text-sm text-zinc-500">Visualización geográfica de operaciones en Argentina</p>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
        <div 
          ref={mapRef} 
          className="h-[500px] rounded-lg overflow-hidden"
          style={{ background: "#111" }}
        />
      </div>

      {/* Leyenda */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Ciudades Principales</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.keys(CIUDADES_ARGENTINA).map((ciudad) => (
            <div key={ciudad} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-zinc-400">{ciudad}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-blue-400">{Object.keys(CIUDADES_ARGENTINA).length}</p>
          <p className="text-sm text-zinc-500 mt-1">Ciudades Conectadas</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-emerald-400">10</p>
          <p className="text-sm text-zinc-500 mt-1">Rutas Activas</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-purple-400">1,200 km</p>
          <p className="text-sm text-zinc-500 mt-1">Distancia Promedio</p>
        </div>
      </div>
    </div>
  )
}
