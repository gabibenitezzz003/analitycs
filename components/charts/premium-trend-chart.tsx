"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PremiumTrendChartProps {
  data: any[]
  categories: string[] // e.g., ["total_mensajes", "total_reservas"]
  colors: string[]     // e.g., ["#3b82f6", "#10b981"]
}

export function PremiumTrendChart({ data, categories, colors }: PremiumTrendChartProps) {
  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="fecha" 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
          />
          <YAxis 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-zinc-400 text-xs mb-2">
                      {new Date(label).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-zinc-300 capitalize">
                          {entry.name.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-white ml-auto font-bold">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          {categories.map((category, index) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index]}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${index})`}
              animationDuration={1500}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
