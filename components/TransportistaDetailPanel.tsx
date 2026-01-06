"use client"

interface TransportistaDetailPanelProps {
  transportista: any
  cargas: any[]
  onClose: () => void
}

export function TransportistaDetailPanel({ 
  transportista, 
  cargas, 
  onClose 
}: TransportistaDetailPanelProps) {
  if (!transportista) return null

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-[#0a0a0a] border-l border-white/[0.06] shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-[#0a0a0a] to-transparent backdrop-blur-sm border-b border-white/[0.06] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-bold text-white">
                {transportista.nombre} {transportista.apellido}
              </h2>
            </div>
            <p className="text-sm text-zinc-500">📞 {transportista.telefono}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">📊 Estadísticas</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-lg p-4">
            <p className="text-xs text-zinc-500">Total Viajes</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{transportista.totalViajes}</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-lg p-4">
            <p className="text-xs text-zinc-500">Tasa Éxito</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{transportista.tasaExito}%</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-2">Especialización</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-zinc-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                style={{ width: `${Math.min(transportista.especializacion, 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-amber-400">{transportista.especializacion}%</span>
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            {transportista.especializacion < 30 ? '🎯 Muy especializado' : 
             transportista.especializacion < 70 ? '⚖️ Especialización media' : 
             '🌐 Generalista'}
          </p>
        </div>
      </div>

      {/* Análisis de Zonas */}
      <div className="p-6 space-y-4 border-t border-white/[0.04]">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">📍 Análisis de Zonas</h3>
        
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Centroide de Operación</span>
            <span className="text-sm font-semibold text-cyan-400">
              {transportista.centroide.lat.toFixed(2)}°, {transportista.centroide.lng.toFixed(2)}°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Radio de Acción</span>
            <span className="text-sm font-bold text-emerald-400">{transportista.radioAccion} km</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-3">Rutas Más Frecuentes</p>
          <div className="space-y-2">
            {transportista.topRutas.map((ruta: any, idx: number) => (
              <div key={idx} className="bg-zinc-900/30 border border-white/[0.04] rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-white">{ruta.ruta}</span>
                  <span className="text-xs font-bold text-blue-400">{ruta.frecuencia}x</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"
                    style={{ width: `${(ruta.frecuencia / transportista.totalViajes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cargas Recomendadas */}
      <div className="p-6 space-y-4 border-t border-white/[0.04]">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          💡 Cargas Recomendadas (IA)
        </h3>

        {cargas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-500">No hay cargas disponibles en su zona</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cargas.map((carga: any) => (
              <div 
                key={carga.id}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/[0.06] rounded-lg p-4 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                {/* Score Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold
                    ${carga.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 
                      carga.score >= 50 ? 'bg-amber-500/10 text-amber-400' : 
                      'bg-zinc-500/10 text-zinc-400'}`}>
                    🎯 {carga.score}% Match
                  </span>
                  {carga.esRutaFrecuente && (
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                      ⭐ Ruta familiar
                    </span>
                  )}
                </div>

                {/* Ruta */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-white mb-1">
                    {carga.origen} → {carga.destino}
                  </p>
                  <p className="text-xs text-zinc-500">
                    📍 A {carga.distanciaOrigen} km de tu zona
                  </p>
                </div>

                {/* Detalles */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">
                    ${(carga.valor / 1000).toFixed(0)}K
                  </span>
                  <span className="text-zinc-400">
                    {carga.pesoTn}TN • {carga.tipoCamion}
                  </span>
                </div>

                {/* Botón de acción (hover) */}
                <button className="mt-3 w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold py-2 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                  Ver Detalles →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
