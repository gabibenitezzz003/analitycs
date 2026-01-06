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
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value?.toLocaleString()}
        </p>
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

  const gradientId = `gradient-${dataKey}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart 
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
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
        {showArea && (
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        )}
        {!showArea && (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#000", strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
