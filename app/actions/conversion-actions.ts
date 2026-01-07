"use server"

import { getConversion } from "@/lib/queries"

export async function getConversionData(range: string = "7d") {
  const data = await getConversion(range).catch(() => ({
    consultas: 0,
    reservas: 0,
    rechazos: 0,
    valor_total: 0
  }))
  
  return {
    consultas: data.consultas || 0,
    reservas: data.reservas || 0,
    rechazos: data.rechazos || 0,
    valorTotal: data.valor_total || 0
  }
}
