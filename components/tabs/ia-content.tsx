import { getMetricas, getAnalisisSentimiento, getIAMetrics } from "@/lib/queries"

export async function IAContent({ range = "7d" }: { range?: string }) {
  const [metricas, sentimiento, iaMetrics] = await Promise.all([
    getMetricas(range),
    getAnalisisSentimiento(range),
    getIAMetrics(range)
  ])
  
  const tasaFallback = metricas.tasa_fallback || 0
  const tasaExito = 100 - tasaFallback
  const { tiempo_respuesta, extraccion, coherencia } = iaMetrics
  
  // Si no hay mensajes, la comprensión es 0 (no hay datos), no 100.
  const hasData = metricas.total_mensajes > 0
  const comprension = hasData ? Math.min(100, Math.max(0, 100 - tasaFallback)) : 0

  // Overall health - weighted average, zero if no metrics
  const healthScore = (comprension + extraccion + coherencia) > 0 
    ? Math.round((comprension + extraccion + coherencia) / 3)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Performance del Motor IA</h2>
          <p className="text-sm text-zinc-500">Métricas de rendimiento del sistema de negociación automática</p>
        </div>
      </div>

      {/* KPIs IA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tasa Éxito */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Tasa de Éxito</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-400 tabular-nums">{tasaExito.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${tasaExito}%` }} 
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mensajes procesados correctamente</p>
        </div>

        {/* Tasa Fallback */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Tasa de Fallback</span>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-red-400 tabular-nums">{tasaFallback.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(tasaFallback * 5, 100)}%` }} 
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">Derivados a humano</p>
        </div>

        {/* Tiempo Respuesta */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Tiempo Promedio</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-400 tabular-nums">{tiempo_respuesta}s</p>
          <div className="mt-4 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(tiempo_respuesta * 30, 100)}%` }} 
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">Tiempo de respuesta promedio</p>
        </div>
      </div>

      {/* Health Score */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Health Score del Motor IA
        </h3>
        
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
              <circle 
                cx="18" 
                cy="18" 
                r="15.9" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="3"
                strokeDasharray={`${healthScore}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">{healthScore}%</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Comprensión de Intención</span>
                <span className="text-emerald-400 font-semibold">{comprension.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${comprension}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Extracción de Datos</span>
                <span className="text-blue-400 font-semibold">{extraccion}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${extraccion}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Respuestas Coherentes</span>
                <span className="text-purple-400 font-semibold">{coherencia}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${coherencia}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de Sentimiento */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          Análisis de Sentimiento
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <span className="text-4xl mb-2 block">😊</span>
            <p className="text-2xl font-bold text-emerald-400">{sentimiento.positivo.toFixed(1)}%</p>
            <p className="text-xs text-zinc-500 mt-1">Positivo</p>
          </div>
          <div className="text-center p-4 bg-zinc-700/20 rounded-xl border border-zinc-700/30">
            <span className="text-4xl mb-2 block">😐</span>
            <p className="text-2xl font-bold text-zinc-400">{sentimiento.neutro.toFixed(1)}%</p>
            <p className="text-xs text-zinc-500 mt-1">Neutro</p>
          </div>
          <div className="text-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
            <span className="text-4xl mb-2 block">😞</span>
            <p className="text-2xl font-bold text-red-400">{sentimiento.negativo.toFixed(1)}%</p>
            <p className="text-xs text-zinc-500 mt-1">Negativo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
