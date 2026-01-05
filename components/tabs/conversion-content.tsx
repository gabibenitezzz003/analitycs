import { getMetricasHoy, getValorTotalHoy } from "@/lib/queries"

// Iconos
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

export async function ConversionContent() {
  const metricas = await getMetricasHoy()
  const valorTotal = await getValorTotalHoy()
  
  const totalConsultas = metricas?.total_consultas || 0
  const totalReservas = metricas?.total_reservas || 0
  const totalRechazos = metricas?.total_rechazos || 0
  const tasaConversion = metricas?.tasa_conversion || 0

  return (
    <div className="space-y-6">
      {/* KPIs Conversión */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Consultas</p>
              <p className="text-3xl font-bold text-blue-400 mt-2 tabular-nums">{totalConsultas.toLocaleString()}</p>
            </div>
            <SearchIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_2px_8px_rgba(16,185,129,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Reservas</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2 tabular-nums">{totalReservas}</p>
            </div>
            <CheckIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Rechazos</p>
              <p className="text-3xl font-bold text-red-400 mt-2 tabular-nums">{totalRechazos}</p>
            </div>
            <XIcon />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 shadow-[0_0_0_1px_rgba(245,158,11,0.1),0_2px_8px_rgba(245,158,11,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tasa Conversión</p>
              <p className="text-3xl font-bold text-amber-400 mt-2 tabular-nums">{tasaConversion.toFixed(1)}%</p>
            </div>
            <TargetIcon />
          </div>
        </div>
      </div>

      {/* Embudo de Conversión */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Embudo de Conversión
        </h3>
        
        <div className="space-y-4">
          {/* Consultas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Consultas Recibidas</span>
              <span className="text-sm font-bold text-blue-400">{totalConsultas}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Ofertas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Ofertas Enviadas</span>
              <span className="text-sm font-bold text-purple-400">{metricas?.total_ofertas_enviadas || 0}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: totalConsultas > 0 ? `${((metricas?.total_ofertas_enviadas || 0) / totalConsultas) * 100}%` : "0%" }} 
              />
            </div>
          </div>

          {/* Reservas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Reservas Confirmadas</span>
              <span className="text-sm font-bold text-emerald-400">{totalReservas}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: totalConsultas > 0 ? `${(totalReservas / totalConsultas) * 100}%` : "0%" }} 
              />
            </div>
          </div>

          {/* Rechazos */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Rechazos</span>
              <span className="text-sm font-bold text-red-400">{totalRechazos}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: totalConsultas > 0 ? `${(totalRechazos / totalConsultas) * 100}%` : "0%" }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Valor Total */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Valor Total Negociado</h3>
        <p className="text-5xl font-bold text-emerald-400 tabular-nums">${(valorTotal / 1000000).toFixed(2)}M</p>
        <p className="text-sm text-zinc-500 mt-2">Valor de reservas confirmadas hoy</p>
      </div>
    </div>
  )
}
