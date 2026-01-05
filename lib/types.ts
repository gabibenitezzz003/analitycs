export type MetricaDiaria = {
  id: string
  fecha: string
  total_mensajes: number
  total_sesiones: number
  total_interacciones: number
  total_consultas: number
  total_ofertas_enviadas: number
  total_reservas: number
  total_rechazos: number
  tasa_conversion: number
  valor_total: number
  valor_promedio: number
  tiempo_respuesta_promedio: number
  tasa_exito_ia: number
  tasa_fallback: number
  created_at: string
}

export type RutaStat = {
  id: string
  origen: string
  destino: string
  origen_provincia: string | null
  destino_provincia: string | null
  total_consultas: number
  total_reservas: number
  total_rechazos: number
  valor_promedio: number
  valor_total: number
  tasa_conversion: number
  distancia_promedio_km: number | null
  created_at: string
  updated_at: string
}

export type Oferta = {
  id: string
  nro_carga: string
  id_carga: string | null
  origen: string
  destino: string
  valor_original: number
  valor_final: number | null
  estado: string
  tipo_carga: string | null
  peso_kg: number | null
  volumen_m3: number | null
  tiempo_hasta_decision_min: number | null
  created_at: string
  updated_at: string
}
