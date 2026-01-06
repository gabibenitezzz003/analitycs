"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function LastUpdated() {
  const [dateStr, setDateStr] = useState<string>("")

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      // Formato: 05 Ene, 20:50
      const formatted = format(now, "dd MMM, HH:mm", { locale: es })
      // Capitalize first letter of month
      const capitalized = formatted.replace(
        /([0-9]{2} )([a-z]{3})(, [0-9]{2}:[0-9]{2})/,
        (_, d, m, t) => `${d}${m.charAt(0).toUpperCase() + m.slice(1)}${t}`
      )
      setDateStr(capitalized)
    }
    
    updateDate()
    const interval = setInterval(updateDate, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-5 py-3">
      <div className="text-xs text-zinc-500 font-medium">Última actualización</div>
      <div className="text-sm text-white font-semibold mt-0.5">
        {dateStr || "Cargando..."}
      </div>
    </div>
  )
}
