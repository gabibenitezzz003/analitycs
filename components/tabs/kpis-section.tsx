"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { KPICard } from "@/components/kpi-card"

// Icons
function MessageIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  )
}

function TruckIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
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

function TargetIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  )
}

function DollarIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  )
}

function BrainIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  )
}

interface KPIsSectionProps {
  initialInteracciones: { value: number; trend: number }
  initialSesiones: { value: number; trend: number }
  initialMetricas: any
  initialValorTotal: { value: number; trend: number }
}

export function KPIsSection({ 
  initialInteracciones, 
  initialSesiones, 
  initialMetricas, 
  initialValorTotal 
}: KPIsSectionProps) {
  const [interacciones, setInteracciones] = useState(initialInteracciones.value)
  const [sesiones, setSesiones] = useState(initialSesiones.value)
  const [reservas, setReservas] = useState(initialMetricas.total_reservas || 0)
  const [tasaConversion, setTasaConversion] = useState(initialMetricas.tasa_conversion || 0)
  const [valorTotal, setValorTotal] = useState(initialValorTotal.value)
  
  // Trends are derived from initial load (realtime updates usually don't recalc trends instantly to avoid jumping UI)
  const trends = initialMetricas.trends || {}

  const supabase = createClient()

  useEffect(() => {
    // Escuchar nuevas interacciones
    const interaccionesChannel = supabase
      .channel('realtime-interacciones')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'b41_interacciones' },
        (payload) => {
          setInteracciones((prev) => prev + 1)
        }
      )
      .subscribe()

    // Escuchar cambios en métricas diarias (reservas, conversion, etc)
    const metricasChannel = supabase
      .channel('realtime-metricas')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'b41_metricas_diarias' },
        (payload: any) => {
          const today = new Date().toISOString().split("T")[0]
          if (payload.new.fecha === today) {
            setReservas(payload.new.total_reservas)
            setTasaConversion(payload.new.tasa_conversion)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(interaccionesChannel)
      supabase.removeChannel(metricasChannel)
    }
  }, [supabase])

  // TODO: Implement real Health Score calculation based on fallback rate + latency + sentiment
  // For now, let's infer it from fallback rate (inverse)
  const healthScore = Math.max(0, Math.min(100, 100 - (initialMetricas.tasa_fallback || 0) * 2))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="card-animate stagger-1">
        <KPICard
          title="Interacciones"
          value={interacciones.toLocaleString()}
          icon={<MessageIcon />}
          glowColor="blue"
          valueColor="text-blue-400"
          trend={{ value: initialInteracciones.trend, label: "vs periodo anterior" }}
        />
      </div>

      <div className="card-animate stagger-2">
        <KPICard
          title="Sesiones Activas"
          value={sesiones}
          icon={<TruckIcon />}
          valueColor="text-purple-400"
          trend={{ value: initialSesiones.trend, label: "vs periodo anterior" }}
        />
      </div>

      <div className="card-animate stagger-3">
        <KPICard
          title="Reservas"
          value={reservas}
          icon={<CheckIcon />}
          glowColor="green"
          valueColor="text-emerald-400"
          trend={{ value: trends.total_reservas || 0, label: "vs periodo anterior" }}
        />
      </div>

      <div className="card-animate stagger-4">
        <KPICard
          title="Tasa Conversión"
          value={`${Number(tasaConversion).toFixed(1)}%`}
          icon={<TargetIcon />}
          glowColor="amber"
          valueColor="text-amber-400"
          trend={{ value: trends.tasa_conversion || 0, label: "vs periodo anterior" }}
        />
      </div>

      <div className="card-animate stagger-5">
        <KPICard
          title="Valor Total"
          value={`$${(valorTotal / 1000000).toFixed(1)}M`}
          icon={<DollarIcon />}
          glowColor="green"
          valueColor="text-emerald-400"
          trend={{ value: initialValorTotal.trend, label: "vs periodo anterior" }}
        />
      </div>

      <div className="card-animate stagger-6">
        <KPICard
          title="Health Score IA"
          value={`${healthScore.toFixed(0)}%`}
          icon={<BrainIcon />}
          glowColor="blue"
          valueColor="text-cyan-400"
          trend={{ value: trends.tasa_fallback ? -trends.tasa_fallback : 0, label: "vs periodo anterior" }} // Invert fallback trend for health
        />
      </div>
    </div>
  )
}
