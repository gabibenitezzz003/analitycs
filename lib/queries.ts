import { createClient } from "./supabase/server"

export async function getMetricasDiarias() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("b41_metricas_diarias")
    .select("*")
    .gte("fecha", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("fecha", { ascending: true })

  if (error) throw error
  return data || []
}

export async function getMetricasHoy() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase.from("b41_metricas_diarias").select("*").eq("fecha", today).single()

  if (error) {
    // Return default values if no data for today
    return {
      total_mensajes: 0,
      total_sesiones: 0,
      total_reservas: 0,
      total_consultas: 0,
      tasa_conversion: 0,
      valor_total: 0,
    }
  }

  return data
}

export async function getInteraccionesHoy() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]

  const { count, error } = await supabase
    .from("b41_interacciones")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today)

  if (error) throw error
  return count || 0
}

export async function getSesionesActivas() {
  const supabase = await createClient()

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase.from("b41_interacciones").select("session_id").gte("created_at", oneDayAgo)

  if (error) throw error

  const uniqueSessions = new Set(data?.map((d) => d.session_id) || [])
  return uniqueSessions.size
}

export async function getValorTotalHoy() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("b41_ofertas")
    .select("valor_final")
    .eq("estado", "ACEPTADA")
    .gte("created_at", today)

  if (error) throw error

  const total = data?.reduce((sum, item) => sum + (item.valor_final || 0), 0) || 0
  return total
}

export async function getTopRutas(limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("b41_rutas_stats")
    .select("*")
    .order("valor_promedio", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getOfertasActivas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("b41_ofertas")
    .select("*")
    .in("estado", ["ENVIADA", "VISTA", "EN_NEGOCIACION"])
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function getEstadisticasConversion() {
  const supabase = await createClient()

  const { data: metricas, error } = await supabase
    .from("b41_metricas_diarias")
    .select("*")
    .gte("fecha", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("fecha", { ascending: true })

  if (error) throw error
  return metricas || []
}
