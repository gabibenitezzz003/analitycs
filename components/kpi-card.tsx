import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    label: string
  }
  glowColor?: "blue" | "green" | "amber" | "purple"
  valueColor?: string
}

export function KPICard({ title, value, icon, trend, glowColor, valueColor = "text-blue-400" }: KPICardProps) {
  const glowClasses = {
    blue: "shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_2px_8px_rgba(59,130,246,0.05)]",
    green: "shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_2px_8px_rgba(16,185,129,0.05)]",
    amber: "shadow-[0_0_0_1px_rgba(245,158,11,0.1),0_2px_8px_rgba(245,158,11,0.05)]",
    purple: "shadow-[0_0_0_1px_rgba(168,85,247,0.1),0_2px_8px_rgba(168,85,247,0.05)]",
  }

  return (
    <div
      className={cn(
        "bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 transition-all duration-200 hover:border-white/[0.08] hover:-translate-y-0.5",
        glowColor && glowClasses[glowColor],
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</p>
          <p className={cn("text-3xl font-bold mt-2 tabular-nums tracking-tight", valueColor)}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-10">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className={cn("font-semibold", trend.value > 0 ? "text-emerald-400" : "text-red-400")}>
            {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-zinc-500">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
