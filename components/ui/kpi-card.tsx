
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  loading?: boolean
  className?: string
  glow?: boolean
  color?: "blue" | "emerald" | "amber" | "cyan" | "purple"
}

export function KPICard({ 
  title, 
  value, 
  trend, 
  icon, 
  loading, 
  className,
  glow = false,
  color = "blue"
}: KPICardProps) {
  
  const colorStyles = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-500",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-500",
    amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-500",
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-500",
    purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-500",
  }

  const baseColor = colorStyles[color]

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-[#0a0a0a] p-6 transition-all duration-300",
      glow ? `border-white/10 hover:border-white/20` : "border-border",
      className
    )}>
      {glow && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 hover:opacity-100",
          baseColor.split(" ")[0], baseColor.split(" ")[1] // Extract gradient parts
        )} />
      )}

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-zinc-800" />
            ) : (
              <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
            )}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={cn(
                "font-medium",
                trend.value > 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {trend.value > 0 ? "+" : ""}{trend.value.toFixed(1)}%
              </span>
              <span className="text-zinc-500">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "rounded-lg p-2 bg-white/5",
            color === "blue" && "text-blue-400",
            color === "emerald" && "text-emerald-400",
            color === "amber" && "text-amber-400",
            color === "cyan" && "text-cyan-400",
            color === "purple" && "text-purple-400",
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
