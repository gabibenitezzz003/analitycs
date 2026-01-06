"use client"

import type React from "react"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Canal único optimizado
    const channel = supabase
      .channel("dashboard-updates-v2")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "b41_interacciones" }, () => {
        console.log("⚡ Realtime: New interaction detected")
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "b41_ofertas" }, () => {
        console.log("⚡ Realtime: Offer updated")
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "b41_metricas_diarias" }, () => {
        console.log("⚡ Realtime: Daily metrics updated")
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "b41_sesiones" }, () => {
        console.log("⚡ Realtime: Session status updated")
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return <>{children}</>
}
