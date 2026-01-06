"use server"

import { getTransportistasGeoData, getCargasDisponibles, getRecomendacionesCargas } from "@/lib/queries"

export async function loadTransportistasGeoData() {
  return await getTransportistasGeoData()
}

export async function loadCargasDisponibles() {
  return await getCargasDisponibles()
}

export async function loadRecomendacionesCargas(transportista: any, cargas: any[]) {
  return await getRecomendacionesCargas(transportista, cargas)
}
