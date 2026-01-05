"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HourlyChartProps {
  data?: Array<{
    hora: string
    mensajes: number
  }>
  height?: number
  color?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">{label}:00 hs</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value} mensajes
        </p>
      </div>
    )
  }
  return null
}

// Datos de ejemplo para actividad por hora
export const mockHourlyData = [
  { hora: "06", mensajes: 12 },
  { hora: "07", mensajes: 45 },
  { hora: "08", mensajes: 89 },
  { hora: "09", mensajes: 156 },
  { hora: "10", mensajes: 189 },
  { hora: "11", mensajes: 167 },
  { hora: "12", mensajes: 134 },
  { hora: "13", mensajes: 98 },
  { hora: "14", mensajes: 145 },
  { hora: "15", mensajes: 178 },
  { hora: "16", mensajes: 198 },
  { hora: "17", mensajes: 156 },
  { hora: "18", mensajes: 123 },
  { hora: "19", mensajes: 89 },
  { hora: "20", mensajes: 56 },
  { hora: "21", mensajes: 34 },
]

export function HourlyChart({
  data = mockHourlyData,
  height = 200,
  color = "#3b82f6",
}: HourlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.05)" 
          vertical={false} 
        />
        <XAxis
          dataKey="hora"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 10 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          dx={-10}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="mensajes" 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
