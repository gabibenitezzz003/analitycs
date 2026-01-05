import { getOfertasActivas } from "@/lib/queries"

const ESTADO_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ENVIADA: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Enviada" },
  VISTA: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Vista" },
  EN_NEGOCIACION: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Negociando" },
  ACEPTADA: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Aceptada" },
  RECHAZADA: { bg: "bg-red-500/10", text: "text-red-400", label: "Rechazada" },
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `Hace ${diffMins}m`
  if (diffHours < 24) return `Hace ${diffHours}h`
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export async function OfertasActivasTable() {
  const ofertas = await getOfertasActivas()

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Ofertas Activas
          </h3>
          <span className="text-xs text-zinc-500">{ofertas.length} ofertas</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#0a0a0a]">
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Carga
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Ruta
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Tiempo
              </th>
            </tr>
          </thead>
          <tbody>
            {ofertas.length > 0 ? (
              ofertas.map((oferta, index) => {
                const estadoStyle = ESTADO_COLORS[oferta.estado] || ESTADO_COLORS.ENVIADA
                return (
                  <tr 
                    key={oferta.id} 
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-zinc-300">
                        {oferta.nro_carga || oferta.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-blue-400 font-medium">
                        {oferta.origen} → {oferta.destino}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="text-sm font-bold text-emerald-400">
                        {formatCurrency(oferta.valor_final || oferta.valor_original)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoStyle.bg} ${estadoStyle.text}`}>
                        {estadoStyle.label}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="text-xs text-zinc-500">
                        {formatTime(oferta.created_at)}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>No hay ofertas activas</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
