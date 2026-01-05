"use client"

import { useEffect, useState } from "react"

export function LastUpdated() {
  const [dateStr, setDateStr] = useState<string>("")

  useEffect(() => {
    const updateDate = () => {
      setDateStr(
        new Date().toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) + " hs"
      )
    }
    
    updateDate()
    // Actualizar cada minuto
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
