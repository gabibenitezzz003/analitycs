"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"

interface PremiumActivityHeatmapProps {
  data: any[]
}

export function PremiumActivityHeatmap({ data }: PremiumActivityHeatmapProps) {
  // Find max value for dynamic coloring
  const maxValue = Math.max(...data.map(d => d.mensajes))

  const getColor = (value: number) => {
    const intensity = value / maxValue
    if (intensity > 0.8) return "#3b82f6" // High traffic - Blue
    if (intensity > 0.5) return "#60a5fa" // Medium - Lighter Blue
    return "#1e3a8a" // Low - Dark Blue
  }

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="hora" 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `${val}hs`}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-zinc-400 text-xs mb-1">Horario: {label}:00 hs</p>
                    <div className="flex items-center gap-2">
                       <span className="text-blue-400 font-bold text-xl">{payload[0].value}</span>
                       <span className="text-zinc-500 text-sm">mensajes</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="mensajes" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.mensajes)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
