"use client"

import { useEffect, useRef, useState } from "react"
import { TransportistaDetailPanel } from "@/components/TransportistaDetailPanel"

// Datos de ciudades argentinas (movido del módulo servidor)
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

  // Cargar datos de transportistas
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

  // Inicializar mapa Leaflet
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
      const map = L.map(mapRef.current).setView([-34.6037, -58.3816], 5)
      mapInstanceRef.current = map

      // Usar estilo oscuro de CartoDB
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Agregar marcadores de ciudades
      Object.entries(CIUDADES_ARGENTINA).forEach(([ciudad, coords]) => {
        L.circleMarker(coords as [number, number], {
          radius: 6,
          fillColor: "#3b82f6",
          color: "#60a5fa",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.5,
        }).addTo(map).bindPopup(`
          <div style="background: #0a0a0a; color: white; padding: 8px; border-radius: 8px;">
            <strong>${ciudad}</strong>
          </div>
        `)
      })

      // Dibujar líneas de conexión
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
            opacity: 0.3,
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

  // Actualizar marcadores de transportistas cuando se cargan
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || transportistas.length === 0) return

    const L = window.L
    const map = mapInstanceRef.current

    // Agregar marcadores de transportistas
    transportistas.forEach((t) => {
      if (!t.centroide) return

      const marker = L.marker([t.centroide.lat, t.centroide.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
              cursor: pointer;
              font-size: 16px;
            ">
              🚛
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
      }).addTo(map)

      marker.on('click', async () => {
        handleTransportistaClick(t)
      })

      marker.bindPopup(`
        <div style="background: #0a0a0a; color: white; padding: 12px; border-radius: 8px; min-width: 200px;">
          <strong style="font-size: 14px;">${t.nombre} ${t.apellido}</strong>
          <div style="margin-top: 8px; font-size: 12px; color: #a1a1aa;">
            <div>📊 ${t.totalViajes} viajes</div>
            <div>✅ ${t.tasaExito}% éxito</div>
            <div>📍 ${t.radioAccion} km radio</div>
          </div>
          <button style="
            margin-top: 8px;
            width: 100%;
            background: #3b82f6;
            color: white;
            padding: 6px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          ">
            Ver Detalles →
          </button>
        </div>
      `)
    })
  }, [transportistas])

  // Manejar clic en transportista
  async function handleTransportistaClick(transportista: any) {
    setSelectedTransportista(transportista)

    // Obtener cargas disponibles
    const { loadCargasDisponibles, loadRecomendacionesCargas } = await import("@/app/actions/geo-actions")
    const cargasDisp = await loadCargasDisponibles()
    const recomendaciones = await loadRecomendacionesCargas(transportista, cargasDisp)
    setCargasRecomendadas(recomendaciones)

    // Dibujar círculo de radio de acción
    if (mapInstanceRef.current && window.L) {
      // Remover círculo anterior si existe
      if (radioCircle) {
        mapInstanceRef.current.removeLayer(radioCircle)
      }

      const L = window.L
      const circle = L.circle([transportista.centroide.lat, transportista.centroide.lng], {
        radius: transportista.radioAccion * 1000, // convertir a metros
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '10, 10',
      }).addTo(mapInstanceRef.current)

      setRadioCircle(circle)

      // Centrar mapa en el transportista
      mapInstanceRef.current.setView([transportista.centroide.lat, transportista.centroide.lng], 6)
    }
  }

  function handleClosePanel() {
    setSelectedTransportista(null)
    setCargasRecomendadas([])
    
    // Remover círculo de radio
    if (radioCircle && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(radioCircle)
      setRadioCircle(null)
    }
  }

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
          <h2 className="text-xl font-bold text-white">Mapa Interactivo con Análisis Geográfico</h2>
          <p className="text-sm text-zinc-500">
            Visualización de flota y recomendaciones inteligentes por zona
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 relative">
        {isLoading && (
          <div className="absolute top-4 right-4 z-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold">
            🔄 Cargando transportistas...
          </div>
        )}
        <div 
          ref={mapRef} 
          className="h-[500px] rounded-lg overflow-hidden"
          style={{ background: "#111" }}
        />
        
        {/* Leyenda flotante */}
        <div className="absolute bottom-8 left-8 bg-[#0a0a0a]/95 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4 z-10">
          <h4 className="text-xs font-bold text-white mb-3">Leyenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-xs">
                🚛
              </div>
              <span className="text-xs text-zinc-300">Transportista activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-zinc-300">Ciudad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-500/50" style={{ borderTop: '2px dashed #3b82f6' }} />
              <span className="text-xs text-zinc-300">Ruta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-emerald-400">{transportistas.length}</p>
          <p className="text-sm text-zinc-500 mt-1">Transportistas Analizados</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-blue-400">{Object.keys(CIUDADES_ARGENTINA).length}</p>
          <p className="text-sm text-zinc-500 mt-1">Ciudades Conectadas</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-purple-400">
            {transportistas.length > 0 
              ? Math.round(transportistas.reduce((acc, t) => acc + t.radioAccion, 0) / transportistas.length)
              : 0}
          </p>
          <p className="text-sm text-zinc-500 mt-1">Radio Promedio (km)</p>
        </div>
      </div>

      {/* Panel lateral */}
      {selectedTransportista && (
        <TransportistaDetailPanel
          transportista={selectedTransportista}
          cargas={cargasRecomendadas}
          onClose={handleClosePanel}
        />
      )}
    </div>
  )
}
