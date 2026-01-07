"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface TrendChartProps {
  data: Array<{
    fecha: string
    interacciones?: number
    reservas?: number
    valor?: number
  }>
  dataKey?: "interacciones" | "reservas" | "valor"
  color?: string
  height?: number
  showArea?: boolean
  onValueClick?: (data: any) => void
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-3">
            <span className="text-xs text-zinc-400">{entry.name === 'interacciones' ? 'Interacciones' : 'Reservas'}:</span>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function TrendChart({
  data,
  dataKey = "interacciones",
  color = "#3b82f6",
  height = 200,
  showArea = true,
  onValueClick,
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-zinc-500 text-sm"
        style={{ height }}
      >
        No hay datos disponibles
      </div>
    )
  }

  // Si estamos mostrando tendencias principales, mostrar ambas líneas
  const showBothLines = dataKey === "interacciones" || dataKey === "reservas"

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        onClick={(data) => {
            if (onValueClick && data && data.activePayload && data.activePayload[0]) {
                onValueClick(data.activePayload[0].payload)
            }
        }}
        className={onValueClick ? "cursor-pointer" : ""}
      >
        <defs>
          <linearGradient id="gradient-interacciones" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradient-reservas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.05)" 
          vertical={false} 
        />
        <XAxis
          dataKey="fecha"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          dx={-10}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Línea de Interacciones (Azul) - always show if we have the data */}
        {dataKey === "interacciones" && (
          <Area
            type="monotone"
            dataKey="interacciones"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gradient-interacciones)"
            fillOpacity={0.4}
          />
        )}
        
        {/* Línea de Reservas (Verde) - show when we're showing trends */}
        {(dataKey === "interacciones" || dataKey === "reservas") && (
          <Line
            type="monotone"
            dataKey="reservas"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3, fill: "#10b981" }}
            activeDot={{ r: 5, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
          />
        )}

        {/* For other dataKeys (like valor), show single line */}
        {dataKey !== "interacciones" && dataKey !== "reservas" && showArea && (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
          />
        )}
        {dataKey !== "interacciones" && dataKey !== "reservas" && !showArea && (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#000", strokeWidth: 2 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
