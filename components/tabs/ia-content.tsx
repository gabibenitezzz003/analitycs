import { getMetricas, getAnalisisSentimiento, getIAMetrics, getAdvancedIAMetrics, getFallbacks } from "@/lib/queries"

export async function IAContent({ range = "7d" }: { range?: string }) {
  const [metricas, sentimiento, iaMetrics, advancedAI, fallbacks] = await Promise.all([
    getMetricas(range),
    getAnalisisSentimiento(range),
    getIAMetrics(range),
    getAdvancedIAMetrics(range),
    getFallbacks()
  ])
  
  const tasaFallback = metricas.tasa_fallback || 0
  const tasaExito = 100 - tasaFallback
  const { tiempo_respuesta, extraccion, coherencia } = iaMetrics
  
  // Si no hay mensajes, la comprensión es 0 (no hay datos), no 100.
  const hasData = metricas.total_mensajes > 0
  const comprension = hasData ? Math.min(100, Math.max(0, 100 - tasaFallback)) : 0

  // Overall health calculation includes friction now
  const friccionScore = Math.max(0, 100 - (advancedAI.friccion * 5)) 
  
  // Weights: Comprension (40%), Coherencia (30%), Friccion (20%), Extraccion (10%)
  const healthScore = hasData 
    ? Math.round(
        (comprension * 0.4) + 
        (coherencia * 0.3) + 
        (friccionScore * 0.2) + 
        (extraccion * 0.1)
      ) 
    : 100

  // Costo (Gemini Flash: ~$0.15 per 1M tokens blended)
  const costoTotal = ((advancedAI.total_tokens || 0) / 1_000_000) * 0.15

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
          <p className="text-sm text-zinc-500">Métricas de rendimiento e inteligencia artificial</p>
        </div>
      </div>

      {/* KPIs IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <p className="text-3xl font-bold text-emerald-400 tabular-nums">{tasaExito.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full duration-1000" style={{ width: `${tasaExito}%` }} />
          </div>
        </div>

        {/* Tasa Fallback */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Tasa de Fallback</span>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400 tabular-nums">{tasaFallback.toFixed(1)}%</p>
          <div className="mt-4 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-red-500 h-1.5 rounded-full duration-1000" style={{ width: `${Math.min(tasaFallback * 5, 100)}%` }} />
          </div>
        </div>

        {/* Tiempo Respuesta */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Tiempo Respuesta</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-400 tabular-nums">{tiempo_respuesta}s</p>
          <p className="text-xs text-zinc-500 mt-2">Promedio por sesión</p>
        </div>

        {/* Tokens / Costo */}
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400">Costo Estimado</span>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-purple-400 tabular-nums">${costoTotal.toFixed(3)}</p>
              <span className="text-xs text-zinc-500">USD</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{(advancedAI.total_tokens || 0).toLocaleString()} tokens usados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Causas de Error (Top Fallbacks) */}
         <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-6">Top Causas de Fallo (Pareto)</h3>
            {fallbacks.length > 0 ? (
                <div className="space-y-4">
                    {fallbacks.map((f: any, i: number) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-300">{f.motivo_fallback || "Sin motivo especificado"}</span>
                                <span className="text-zinc-500">{f.porcentaje}% ({f.cantidad})</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                <div className="bg-red-500/70 h-1.5 rounded-full" style={{ width: `${f.porcentaje}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">
                    No hay fallos registrados. ¡Excelente!
                </div>
            )}
         </div>

         {/* Health Score Detallado */}
         <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-6">Health Score IA</h3>
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
                
                <div className="flex-1 space-y-3">
                    <MetricBar label="Comprensión" value={comprension} color="bg-emerald-500" />
                    <MetricBar label="Extracción Datos" value={extraccion} color="bg-blue-500" />
                    <MetricBar label="Coherencia" value={coherencia} color="bg-purple-500" />
                    <MetricBar label="Baja Fricción" value={Math.max(0, 100 - (advancedAI.friccion * 2))} color="bg-orange-500" />
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-white font-mono">{value.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    )
}
