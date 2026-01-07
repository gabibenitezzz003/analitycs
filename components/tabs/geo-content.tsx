"use client"

import { useEffect, useRef, useState } from "react"
import { TransportistaDetailPanel } from "@/components/TransportistaDetailPanel"
import { cn } from "@/lib/utils"

// Coordinate dictionary (Expanded LATAM)
const CIUDADES_LATAM: Record<string, [number, number]> = {
  // Argentina
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
  "Formosa": [-26.1775, -58.1781],
  "San Luis": [-33.2950, -66.3356],
  
  // Internacionales
  "Montevideo": [-34.9011, -56.1645], // Uruguay
  "Santiago": [-33.4489, -70.6693],   // Chile
  "São Paulo": [-23.5505, -46.6333],  // Brasil
  "Rio de Janeiro": [-22.9068, -43.1729], // Brasil
  "Asunción": [-25.2637, -57.5759],   // Paraguay
  "La Paz": [-16.5000, -68.1500],     // Bolivia
  "Lima": [-12.0464, -77.0428],       // Perú
  "Bogotá": [4.7110, -74.0721],       // Colombia
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
  const [routeLines, setRouteLines] = useState<any[]>([])
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
      Object.entries(CIUDADES_LATAM).forEach(([ciudad, coords]) => {
        L.circleMarker(coords as [number, number], {
          radius: 3,
          fillColor: "#3b82f6",
          color: "#1e40af",
          weight: 1,
          opacity: 0.6,
          fillOpacity: 0.6,
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
    
    const L = window.L
    const map = mapInstanceRef.current

    // Clear previous markers if we implemented a clear logic, but for now we append. 
    // In a real app we'd manage a LayerGroup.

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
      const L = window.L
      const map = mapInstanceRef.current

      // Clear previous overlays
      if (radioCircle) map.removeLayer(radioCircle)
      routeLines.forEach(line => {
        map.removeLayer(line)
        if ((line as any)._intervalId) clearInterval((line as any)._intervalId)
      })
      
      const newLines: any[] = []

      // 1. Draw Routes (Dotted Lines Animated - Professional Style)
      transportista.topRutas.forEach((rutaObj: any, idx: number) => {
          const [origen, destino] = rutaObj.ruta.split(' → ')
          const c1 = CIUDADES_LATAM[origen]
          const c2 = CIUDADES_LATAM[destino]

          if (c1 && c2 && idx === 0) { // Main Route Highlighting
             // Origin Marker (Green Pulse)
             const originIcon = L.divIcon({
                 className: 'custom-origin',
                 html: `<div style="display:flex; flex-direction:column; align-items:center;">
                          <div style="background:#10B981; width:12px; height:12px; border-radius:50%; box-shadow:0 0 0 4px rgba(16,185,129,0.3);"></div>
                          <div style="background:#064e3b; color:#34d399; font-size:10px; padding:2px 6px; border-radius:4px; margin-top:4px; font-weight:bold;">ORIGEN</div>
                        </div>`,
                 iconSize: [40, 40],
                 iconAnchor: [20, 8]
             })
             const m1 = L.marker(c1, { icon: originIcon }).addTo(map)
             newLines.push(m1)

             // Destination Marker (Red Pulse)
             const destIcon = L.divIcon({
                 className: 'custom-dest',
                 html: `<div style="display:flex; flex-direction:column; align-items:center;">
                          <div style="background:#EF4444; width:12px; height:12px; border-radius:50%; box-shadow:0 0 0 4px rgba(239,68,68,0.3);"></div>
                          <div style="background:#450a0a; color:#f87171; font-size:10px; padding:2px 6px; border-radius:4px; margin-top:4px; font-weight:bold;">DESTINO</div>
                        </div>`,
                 iconSize: [40, 40],
                 iconAnchor: [20, 8]
             })
             const m2 = L.marker(c2, { icon: destIcon }).addTo(map)
             newLines.push(m2)

             // Route Line (Amber Dashed Animated)
             const line = L.polyline([c1, c2], {
                 color: '#F59E0B',
                 weight: 4,
                 dashArray: '10, 15',
                 opacity: 0.9,
                 lineCap: 'round'
             }).addTo(map)
             newLines.push(line)

             // Animation
             let offset = 0
             const interval = setInterval(() => {
                 offset = (offset - 1) % 25
                 line.setStyle({ dashOffset: offset.toString() })
             }, 50)
             ;(line as any)._intervalId = interval

             // Midpoint Truck Icon
             const midPoint: [number, number] = [
                (c1[0] + c2[0]) / 2,
                (c1[1] + c2[1]) / 2
             ]
             
             const truckIcon = L.divIcon({
                 className: 'custom-truck',
                 html: `<div style="background:#F59E0B; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(245,158,11,0.5); border:2px solid white;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                 </div>`,
                 iconSize: [32, 32],
                 iconAnchor: [16, 16]
             })
             const truckMarker = L.marker(midPoint, { icon: truckIcon, zIndexOffset: 1000 }).addTo(map)
             newLines.push(truckMarker)

             // Smart Zoom
             map.fitBounds(L.latLngBounds([c1, c2]), { padding: [100, 100], maxZoom: 8 })

          } else if (c1 && c2) {
             // Secondary Routes (Ghost lines)
             const line = L.polyline([c1, c2], {
                 color: '#3b82f6',
                 weight: 1,
                 dashArray: '4, 8',
                 opacity: 0.3
             }).addTo(map)
             newLines.push(line)
          }
      })
      setRouteLines(newLines)

      // 2. Draw Radius Circle (Contextual)
      if (transportista.centroide) {
        const hasRoutes = transportista.topRutas && transportista.topRutas.length > 0
        const circle = L.circle([transportista.centroide.lat, transportista.centroide.lng], {
          radius: (transportista.radioAccion || 500) * 1000,
          color: '#10b981',
          fillOpacity: hasRoutes ? 0.05 : 0.1,
          weight: 1,
          dashArray: '4, 4'
        }).addTo(map)
        setRadioCircle(circle)
        
        if (!hasRoutes) {
            map.flyTo([transportista.centroide.lat, transportista.centroide.lng], 6)
        }
      }
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
                        if (routeLines.length && mapInstanceRef.current) routeLines.forEach(l => mapInstanceRef.current?.removeLayer(l))
                        if (mapInstanceRef.current) mapInstanceRef.current.flyTo([-34.6037, -58.3816], 5)
                    }}
                />
            </div>
         )}
      </div>

    </div>
  )
}
