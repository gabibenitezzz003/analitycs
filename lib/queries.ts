import { createClient } from "./supabase/server"

// Helper to getting date ranges (current and previous)
export function getDateRanges(range: string = "7d") {
  const now = new Date()
  const currentStart = new Date(now)
  const previousStart = new Date(now)
  const previousEnd = new Date(now)
  
  let days = 7
  switch (range) {
    case "today":
      days = 1
      break
    case "7d":
      days = 7
      break
    case "30d":
      days = 30
      break
    case "90d":
      days = 90
      break
    default:
      days = 7
  }

  // Current period: [now - days, now]
  currentStart.setDate(now.getDate() - days)
  
  // Previous period: [now - 2*days, now - days]
  previousStart.setDate(now.getDate() - (2 * days))
  previousEnd.setDate(now.getDate() - days)

  return {
    current: { start: currentStart.toISOString(), end: now.toISOString() },
    previous: { start: previousStart.toISOString(), end: previousEnd.toISOString() }
  }
}

export function getStartDate(range: string = "7d") {
  return getDateRanges(range).current.start
}

export async function getMetricasDiarias(range: string = "7d") {
  const supabase = await createClient()
  const startDate = getStartDate(range)

  const { data, error } = await supabase
    .from("v_dashboard_overview")
    .select("*")
    .gte("fecha", startDate)
    .order("fecha", { ascending: true })

  if (error) throw error
  return data || []
}

// Helper to calculate percentage change
function calculateTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export async function getMetricas(range: string = "7d") {
  const supabase = await createClient()
  const { current, previous } = getDateRanges(range)

  // Fetch current and previous separately to calculate trends accurately
  const [currData, prevData] = await Promise.all([
    supabase.from("v_dashboard_overview").select("*").gte("fecha", current.start).lte("fecha", current.end),
    supabase.from("v_dashboard_overview").select("*").gte("fecha", previous.start).lte("fecha", previous.end)
  ])

  if (currData.error) console.error("Error fetching current metrics:", currData.error)
  
  // Helper to aggregate data
  const aggregate = (data: any[]) => {
    return data?.reduce((acc, curr) => ({
      total_mensajes: acc.total_mensajes + (curr.total_mensajes || 0),
      total_sesiones: acc.total_sesiones + (curr.total_sesiones || 0),
      total_reservas: acc.total_reservas + (curr.total_reservas || 0),
      valor_total: acc.valor_total + (curr.valor_total || 0),
      tasa_fallback_sum: acc.tasa_fallback_sum + (curr.tasa_fallback || 0),
      count: acc.count + 1
    }), { 
      total_mensajes: 0, total_sesiones: 0, total_reservas: 0, valor_total: 0, tasa_fallback_sum: 0, count: 0
    }) || { total_mensajes: 0, total_sesiones: 0, total_reservas: 0, valor_total: 0, tasa_fallback_sum: 0, count: 0 }
  }

  const currAgg = aggregate(currData.data || [])
  const prevAgg = aggregate(prevData.data || [])

  // Calculate rates
  const calculateRates = (agg: any) => ({
    ...agg,
    tasa_conversion: agg.total_sesiones > 0 ? (agg.total_reservas / agg.total_sesiones) * 100 : 0,
    tasa_fallback: agg.count > 0 ? agg.tasa_fallback_sum / agg.count : 0
  })

  const currentMetrics = calculateRates(currAgg)
  const previousMetrics = calculateRates(prevAgg)

  return {
    ...currentMetrics,
    trends: {
      total_mensajes: calculateTrend(currentMetrics.total_mensajes, previousMetrics.total_mensajes),
      total_sesiones: calculateTrend(currentMetrics.total_sesiones, previousMetrics.total_sesiones),
      total_reservas: calculateTrend(currentMetrics.total_reservas, previousMetrics.total_reservas),
      tasa_conversion: calculateTrend(currentMetrics.tasa_conversion, previousMetrics.tasa_conversion),
      valor_total: calculateTrend(currentMetrics.valor_total, previousMetrics.valor_total),
      tasa_fallback: calculateTrend(currentMetrics.tasa_fallback, previousMetrics.tasa_fallback)
    }
  }
}

export async function getInteracciones(range: string = "7d") {
  const supabase = await createClient()
  const { current, previous } = getDateRanges(range)

  const [curr, prev] = await Promise.all([
    supabase.from("v_dashboard_interacciones").select("*", { count: "exact", head: true }).gte("created_at", current.start).lte("created_at", current.end),
    supabase.from("v_dashboard_interacciones").select("*", { count: "exact", head: true }).gte("created_at", previous.start).lte("created_at", previous.end)
  ])

  return {
    value: curr.count || 0,
    trend: calculateTrend(curr.count || 0, prev.count || 0)
  }
}

export async function getSesionesActivas(range: string = "7d") {
    // Note: Active sessions are usually instantaneous, but for trend we can compare unique sessions active in current period vs previous period
    const supabase = await createClient()
    const { current, previous } = getDateRanges(range)
  
    // Using v_dashboard_sesiones (assuming it has 'inicio' or 'ultima_actividad')
    // We count sessions that started or were active in the range
    const [curr, prev] = await Promise.all([
        supabase.from("v_dashboard_sesiones").select("*", { count: "exact", head: true }).gte("ultima_actividad", current.start).lte("ultima_actividad", current.end),
        supabase.from("v_dashboard_sesiones").select("*", { count: "exact", head: true }).gte("ultima_actividad", previous.start).lte("ultima_actividad", previous.end)
    ])
  
    return {
        value: curr.count || 0,
        trend: calculateTrend(curr.count || 0, prev.count || 0)
    }
}

export async function getValorTotal(range: string = "7d") {
  const supabase = await createClient()
  const { current, previous } = getDateRanges(range)

  const fetchTotal = async (start: string, end: string) => {
    const { data } = await supabase
      .from("v_dashboard_ofertas")
      .select("valor_final")
      .eq("estado", "ACEPTADA")
      .gte("created_at", start)
      .lte("created_at", end)
    
    return data?.reduce((sum, item) => sum + (item.valor_final || 0), 0) || 0
  }

  const [currTotal, prevTotal] = await Promise.all([
    fetchTotal(current.start, current.end),
    fetchTotal(previous.start, previous.end)
  ])

  return {
    value: currTotal,
    trend: calculateTrend(currTotal, prevTotal)
  }
}

export async function getAnalisisSentimiento(range: string = "7d") {
  const supabase = await createClient()
  const startDate = getStartDate(range)

  const { data, error } = await supabase
    .from("v_dashboard_interacciones")
    .select("sentimiento") // Assuming column exists as per user request context (or we infer from intent/mock if missing)
    .gte("created_at", startDate)

  if (error) return { positivo: 0, neutro: 0, negativo: 0 }

  const counts = { positivo: 0, neutro: 0, negativo: 0, total: 0 }
  
  data?.forEach((row: any) => {
      // Sentimiento might be null or string. Normalize.
      // Assuming values: 'POSITIVO', 'NEUTRO', 'NEGATIVO' or variants
      const s = String(row.sentimiento).toLowerCase()
      if (s.includes('pos')) counts.positivo++
      else if (s.includes('neg')) counts.negativo++
      else counts.neutro++ // Default to neutral if undefined/other
      counts.total++
  })

  const calculatePct = (val: number) => counts.total > 0 ? (val / counts.total) * 100 : 0

  return {
    positivo: calculatePct(counts.positivo),
    neutro: calculatePct(counts.neutro),
    negativo: calculatePct(counts.negativo),
    count: counts.total
  }
}



export async function getTopRutas(limit = 5, range: string = "7d") {
  const supabase = await createClient()
  // Note: v_dashboard_rutas is an aggregated view. It usually contains LIFETIME stats unless filtered by update time?
  // If v_dashboard_rutas is a view over b41_rutas_stats, and b41_rutas_stats is cumulative, filtering by "ultima_actividad" is the best we can do without a history table.
  // Or we should build the ranking from v_dashboard_interacciones for the time range.
  // Using v_dashboard_rutas directly might be misleading for short ranges if it holds lifetime data.
  // For proper filtering, let's query v_dashboard_interacciones and aggregate locally or assume the user wants "active routes in period"
  
  
  const startDate = getStartDate(range)
  // Let's use v_dashboard_interacciones for accuracy
  const { data, error } = await supabase
    .from("v_dashboard_interacciones")
    .select("origen, destino, valor_oferta, es_reserva, es_consulta")
    .gte("created_at", startDate)
  
  if (error) throw error
  if (!data) return []

  const stats: Record<string, any> = {}
  
  data.forEach(row => {
      const key = `${row.origen}-${row.destino}`
      if (!stats[key]) {
          stats[key] = { 
              origen: row.origen, 
              destino: row.destino, 
              total_valor: 0, 
              total_consultas: 0, 
              reservas: 0 
          }
      }
      stats[key].total_valor += (row.valor_oferta || 0)
      stats[key].total_consultas += 1
      if (row.es_reserva) stats[key].reservas += 1
  })

  return Object.values(stats)
      .map(s => ({
          ...s,
          tasa_conversion: (s.reservas / s.total_consultas) * 100
      }))
      .sort((a, b) => b.total_valor - a.total_valor)
      .slice(0, limit)
}

export async function getOfertasActivas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("v_dashboard_ofertas")
    .select("*")
    .in("estado", ["ENVIADA", "VISTA", "EN_NEGOCIACION"])
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

// ... existing exports ...

export async function getEstadisticasConversion() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("v_dashboard_overview")
    .select("*")
    .limit(7)
    .order("fecha", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getDistribucionIntencion(range: string = "7d") {
  const supabase = await createClient() // Fix: Add supabase client initialization
  const startDate = getStartDate(range)

  // Fetch all interactions for range
  const { data, error } = await supabase
    .from("v_dashboard_interacciones")
    .select("intencion")
    .gte("created_at", startDate)

  if (error) throw error

  // Aggregate locally
  const acc: Record<string, number> = {}
  data?.forEach((row) => {
    const intencion = row.intencion || "Otras"
    acc[intencion] = (acc[intencion] || 0) + 1
  })

  // Format for Recharts
  const COLORS: Record<string, string> = {
    "cotizar": "#3b82f6", // blue
    "reservar": "#10b981", // green
    "rechazar": "#ef4444", // red
    "negociar": "#f59e0b", // amber
  }

  return Object.entries(acc).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[name.toLowerCase()] || "#9ca3af", // gray default
  })).sort((a, b) => b.value - a.value).slice(0, 5) // Top 5
}

export async function getActividadPorHora(range: string = "7d") {
  const supabase = await createClient()
  const startDate = getStartDate(range)

  const { data, error } = await supabase
    .from("v_dashboard_interacciones")
    .select("created_at")
    .gte("created_at", startDate)

  if (error) throw error

  // Initialize all hours with 0
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hora: `${i}:00`,
    mensajes: 0
  }))

  data?.forEach((row) => {
    const date = new Date(row.created_at)
    const hour = date.getHours()
    if (hours[hour]) {
      hours[hour].mensajes++
    }
  })

  return hours
}
