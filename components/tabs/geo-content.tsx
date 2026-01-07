"use client"

import { useEffect, useRef, useState } from "react"
import { TransportistaDetailPanel } from "@/components/TransportistaDetailPanel"
import { cn } from "@/lib/utils"

// Coordinate dictionary
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

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

export function GeoContent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [transportistas, setTransportistas] = useState<any[]>([])
  const [selectedTransportista, setSelectedTransportista] = useState<any>(null)
  const [cargasRecomendadas, setCargasRecomendadas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [radioCircle, setRadioCircle] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Load Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const { loadTransportistasGeoData } = await import("@/app/actions/geo-actions")
      const data = await loadTransportistasGeoData()
      setTransportistas(data)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Init Map
  useEffect(() => {
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
      const map = L.map(mapRef.current, { zoomControl: false }).setView([-34.6037, -58.3816], 5)
      mapInstanceRef.current = map

      // Dark style
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      // Add Cities
      Object.entries(CIUDADES_ARGENTINA).forEach(([ciudad, coords]) => {
        L.circleMarker(coords as [number, number], {
          radius: 4,
          fillColor: "#3b82f6",
          color: "#1e40af",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8,
        }).addTo(map)
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || transportistas.length === 0) return
    
    // Clear existing layers if needed (implementation simplified for add-only)
    // Real implementation should track marker layers to clear them on updates if needed

    const L = window.L
    const map = mapInstanceRef.current

    transportistas.forEach((t) => {
      if (!t.centroide) return

      const marker = L.marker([t.centroide.lat, t.centroide.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${selectedTransportista?.id === t.telefono ? '#10b981' : '#3b82f6'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${selectedTransportista?.id === t.telefono ? '#10b981' : '#3b82f6'};"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
      }).addTo(map)

      marker.on('click', () => handleTransportistaClick(t))
    })
  }, [transportistas, selectedTransportista])

  async function handleTransportistaClick(transportista: any) {
    setSelectedTransportista(transportista)
    const { loadCargasDisponibles, loadRecomendacionesCargas } = await import("@/app/actions/geo-actions")
    const cargasDisp = await loadCargasDisponibles()
    const recomendaciones = await loadRecomendacionesCargas(transportista, cargasDisp)
    setCargasRecomendadas(recomendaciones)

    // Map interactions
    if (mapInstanceRef.current && window.L) {
      if (radioCircle) mapInstanceRef.current.removeLayer(radioCircle)
      
      const L = window.L
      const circle = L.circle([transportista.centroide.lat, transportista.centroide.lng], {
        radius: transportista.radioAccion * 1000,
        color: '#10b981',
        fillOpacity: 0.05,
        weight: 1,
        dashArray: '5, 5'
      }).addTo(mapInstanceRef.current)
      setRadioCircle(circle)
      
      mapInstanceRef.current.flyTo([transportista.centroide.lat, transportista.centroide.lng], 7, { duration: 1.5 })
    }
  }

  // Filter Transportistas
  const filteredTransportistas = transportistas.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      
      {/* 1. Sidebar List */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl flex flex-col overflow-hidden h-full">
         <div className="p-4 border-b border-zinc-800">
             <h3 className="text-sm font-bold text-white mb-2">Flota Activa ({transportistas.length})</h3>
             <input 
                type="text" 
                placeholder="Buscar chofer..." 
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
         </div>
         <div className="flex-1 overflow-y-auto">
             {filteredTransportistas.map(t => (
                 <div 
                    key={t.telefono}
                    onClick={() => handleTransportistaClick(t)}
                    className={cn(
                        "p-3 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-900 transition-colors flex items-center gap-3",
                        selectedTransportista?.telefono === t.telefono ? "bg-blue-900/10 border-l-2 border-l-blue-500" : ""
                    )}
                 >
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                        {t.nombre[0]}{t.apellido[0]}
                    </div>
                    <div>
                        <p className={cn("text-xs font-medium", selectedTransportista?.telefono === t.telefono ? "text-blue-400" : "text-zinc-300")}>
                            {t.nombre} {t.apellido}
                        </p>
                        <p className="text-[10px] text-zinc-500">{t.totalViajes} viajes • {t.tasaExito}% éxito</p>
                    </div>
                 </div>
             ))}
         </div>
      </div>

      {/* 2. Map Area */}
      <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 relative flex flex-col">
         {isLoading && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-blue-400 animate-pulse font-mono text-sm">Cargando flota satelital...</span>
            </div>
         )}
         
         <div ref={mapRef} className="flex-1 rounded-lg w-full h-full" style={{ background: "#111" }} />
         
         {/* Detail Overlay */}
         {selectedTransportista && (
            <div className="absolute top-6 right-6 z-[400] w-80">
                <TransportistaDetailPanel 
                    transportista={selectedTransportista}
                    cargas={cargasRecomendadas}
                    onClose={() => {
                        setSelectedTransportista(null)
                        if (radioCircle && mapInstanceRef.current) mapInstanceRef.current.removeLayer(radioCircle)
                        if (mapInstanceRef.current) mapInstanceRef.current.flyTo([-34.6037, -58.3816], 5)
                    }}
                />
            </div>
         )}
      </div>

    </div>
  )
}
