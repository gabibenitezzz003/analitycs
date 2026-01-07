import { getMetricas, getValorTotal } from "@/lib/queries"

// Iconos compactos
function SearchIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  )
}

function CheckIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

function XIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  )
}

function TargetIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </div>
  )
}

export async function ConversionContent({ range = "7d" }: { range?: string }) {
  const metricas = await getMetricas(range).catch(() => ({ 
    total_mensajes: 0, total_sesiones: 0, total_reservas: 0, valor_total: 0, tasa_conversion: 0 
  }))
  const valorTotalData = await getValorTotal(range).catch(() => ({ value: 0, trend: 0 }))
  const valorTotal = valorTotalData.value
  
  const totalConsultas = metricas?.total_sesiones || 0
  const totalReservas = metricas?.total_reservas || 0
  const totalRechazos = Math.max(0, totalConsultas - totalReservas)
  const tasaConversion = metricas?.tasa_conversion || 0

  // Datos del funnel para tabla Excel-style
  const funnelData = [
    { 
      etapa: "Consultas Recibidas", 
      cantidad: totalConsultas, 
      porcentaje: 100, 
      conversion: 100,
      color: "blue",
      icon: "search"
    },
    { 
      etapa: "Reservas Confirmadas", 
      cantidad: totalReservas, 
      porcentaje: totalConsultas > 0 ? (totalReservas / totalConsultas) * 100 : 0,
      conversion: tasaConversion,
      color: "emerald",
      icon: "check"
    },
    { 
      etapa: "Rechazos", 
      cantidad: totalRechazos, 
      porcentaje: totalConsultas > 0 ? (totalRechazos / totalConsultas) * 100 : 0,
      conversion: 100 - tasaConversion,
      color: "red",
      icon: "x"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Análisis Conversión</h2>
          <p className="text-sm text-zinc-500">Funnel de ventas y métricas de conversión</p>
        </div>
      </div>

      {/* KPIs Mini Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Consultas</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tabular-nums">{totalConsultas}</p>
            </div>
            <SearchIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Reservas</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{totalReservas}</p>
            </div>
            <CheckIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Rechazos</p>
              <p className="text-2xl font-bold text-red-400 mt-1 tabular-nums">{totalRechazos}</p>
            </div>
            <XIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Conversión</p>
              <p className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{tasaConversion.toFixed(1)}%</p>
            </div>
            <TargetIcon />
          </div>
        </div>
      </div>

      {/* Tabla Estilo Excel - Compacta y Profesional */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            Análisis Detallado de Conversión
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/[0.06]">
                <th className="text-left py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Etapa</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Cantidad</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">% del Total</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Tasa</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {funnelData.map((row, index) => (
                <tr 
                  key={row.etapa} 
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${row.color}-400`} />
                      <span className="text-sm font-medium text-white">{row.etapa}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className={`text-sm font-bold tabular-nums text-${row.color}-400`}>
                      {row.cantidad.toLocaleString()}
                    </span>
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className="text-sm font-semibold text-zinc-300 tabular-nums">
                      {row.porcentaje.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold
                      ${row.conversion >= 30 ? 'bg-emerald-500/10 text-emerald-400' : 
                        row.conversion >= 20 ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-zinc-500/10 text-zinc-400'}`}>
                      {row.conversion.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r from-${row.color}-500 to-${row.color}-400 h-2.5 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${Math.min(row.porcentaje, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 tabular-nums w-12 text-right">
                        {row.porcentaje.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer con métricas de negocio */}
        <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 px-6 py-4 border-t border-white/[0.06]">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Valor Total</p>
              <p className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                ${(valorTotal / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Valor Promedio/Reserva</p>
              <p className="text-xl font-bold text-blue-400 mt-1 tabular-nums">
                ${totalReservas > 0 ? ((valorTotal / totalReservas) / 1000).toFixed(0) : 0}K
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Eficiencia del Funnel</p>
              <p className="text-xl font-bold text-amber-400 mt-1 tabular-nums">
                {tasaConversion >= 30 ? 'Excelente' : tasaConversion >= 20 ? 'Buena' : 'Regular'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador visual compacto del embudo */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Visualización del Embudo</h3>
        <div className="space-y-3">
          {funnelData.map((stage, idx) => (
            <div key={stage.etapa} className="relative">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-zinc-400 w-40 truncate">{stage.etapa}</span>
                <span className={`text-xs font-bold text-${stage.color}-400 tabular-nums`}>
                  {stage.cantidad}
                </span>
              </div>
              <div 
                className={`h-8 bg-gradient-to-r from-${stage.color}-500/20 to-${stage.color}-500/5 border border-${stage.color}-500/20 rounded transition-all duration-700`}
                style={{ width: `${stage.porcentaje}%`, maxWidth: '100%' }}
              >
                <div className={`h-full bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-400 rounded opacity-70`} 
                     style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
