"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DistributionChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  height?: number
  innerRadius?: number
  outerRadius?: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value.toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

export function DistributionChart({
  data,
  height = 200,
  innerRadius = 50,
  outerRadius = 80,
}: DistributionChartProps) {
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Leyenda separada para más control
interface ChartLegendProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function ChartLegend({ data }: ChartLegendProps) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-zinc-400">{item.name}</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {item.value.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
