"use client"

import type { ReactNode } from "react"

interface ChartWrapperProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  actions?: ReactNode
}

export function ChartWrapper({ title, icon, children, actions }: ChartWrapperProps) {
  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {actions}
      </div>
      {children}
    </div>
  )
}
