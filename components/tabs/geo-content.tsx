"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    L: any
  }
}

// Mock Data for Demo
const MOCK_DRIVERS = [
  { id: 1, name: "Juan Perez", lat: -34.6037, lng: -58.3816, location: "Buenos Aires", status: "Disponible" },
  { id: 2, name: "Carlos Gomez", lat: -31.4201, lng: -64.1888, location: "Córdoba", status: "En Viaje" },
  { id: 3, name: "Miguel Rodriguez", lat: -32.9468, lng: -60.6393, location: "Rosario", status: "Disponible" },
]

const MOCK_LOADS = [
  { id: 101, origen: "Buenos Aires", destino: "Mendoza", tarifa: "$1.2M", distancia: "1050 km" },
  { id: 102, origen: "Rosario", destino: "Córdoba", tarifa: "$600k", distancia: "400 km" },
  { id: 103, origen: "Córdoba", destino: "Tucumán", tarifa: "$950k", distancia: "550 km" },
]

interface GeoContentProps {
  stats?: {
    ciudades: number
    rutas: number
    distancia: number
  }
}

export function GeoContent({ stats = { ciudades: 12, rutas: 8, distancia: 4500 } }: GeoContentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix marker icon issues in Next.js
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapRef.current) return
      if ((mapRef.current as any)._leaflet_id) return // Map already initialized

      const map = L.map(mapRef.current).setView([-34.6, -58.4], 5)

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map)

      // Add Driver Markers
      MOCK_DRIVERS.forEach(driver => {
        const marker = L.marker([driver.lat, driver.lng])
          .addTo(map)
          .bindPopup(`<b>${driver.name}</b><br>${driver.status}`)
        
        marker.on('click', () => {
          handleDriverSelect(driver)
        })
      })
    })
  }, [])

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver)
    setIsCalculating(true)
    setRecommendations([])

    // Simulate "Promediando viajes..." calculation
    setTimeout(() => {
        setIsCalculating(false)
        // Filter loads "near" the driver (mock logic)
        const nearby = MOCK_LOADS.filter(l => l.origen === driver.location || Math.random() > 0.5)
        setRecommendations(nearby)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Mapa Interactivo</h2>
          <p className="text-sm text-zinc-500">Geolocalización de flota y oportunidades de carga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAPA */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden h-[500px] relative">
            <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }} />
            
            {/* Overlay Info */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/10 text-xs z-[400]">
                <p className="font-bold text-white mb-2">Transportistas en Mapa</p>
                {MOCK_DRIVERS.map(d => (
                    <div key={d.id} className="flex items-center gap-2 mb-1 cursor-pointer hover:text-blue-400" onClick={() => handleDriverSelect(d)}>
                        <div className={`w-2 h-2 rounded-full ${d.status === 'Disponible' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-zinc-300">{d.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* SIDEBAR RECOMENDACIONES */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Detalle de Operación</h3>
            
            {!selectedDriver ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-center p-4">
                    <svg className="w-12 h-12 mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                    </svg>
                    <p>Selecciona un transportista en el mapa para analizar oportunidades.</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            {selectedDriver.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-white">{selectedDriver.name}</p>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {selectedDriver.status} • {selectedDriver.location}
                            </p>
                        </div>
                    </div>

                    {isCalculating ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-blue-400 animate-pulse">Promediando viajes históricos...</p>
                            <p className="text-xs text-zinc-500">Analizando rutas frecuentes</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cargas Recomendadas (IA)</p>
                            {recommendations.length > 0 ? (
                                recommendations.map(load => (
                                    <div key={load.id} className="p-3 bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-white/5 rounded-lg cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{load.origen} → {load.destino}</span>
                                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{load.tarifa}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                                                Match 90%
                                            </span>
                                            <span>{load.distancia}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500 text-center py-4">No hay cargas cercanas disponibles.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
