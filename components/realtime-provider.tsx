"use client"

import type React from "react"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "b41_interacciones" }, () => {
        console.log("[v0] New interaction detected, refreshing...")
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "b41_ofertas" }, () => {
        console.log("[v0] Offer updated, refreshing...")
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "b41_metricas_diarias" }, () => {
        console.log("[v0] Daily metrics updated, refreshing...")
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return <>{children}</>
}
