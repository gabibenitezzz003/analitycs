"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type DateRange = "today" | "7d" | "30d" | "90d" | "custom"

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const ranges: { id: DateRange; label: string }[] = [
  { id: "today", label: "Hoy" },
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "90d", label: "90 días" },
]

export function DateRangeSelector({ value, onChange, className }: DateRangeSelectorProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-1", className)}>
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onChange(range.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
            value === range.id
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

// Utility function to get date range
export function getDateRangeFilter(range: DateRange): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  switch (range) {
    case "today":
      break
    case "7d":
      start.setDate(start.getDate() - 7)
      break
    case "30d":
      start.setDate(start.getDate() - 30)
      break
    case "90d":
      start.setDate(start.getDate() - 90)
      break
    default:
      break
  }

  return { start, end }
}
