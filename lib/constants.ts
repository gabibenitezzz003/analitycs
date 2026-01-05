// Cities coordinates for future map integration
export const CIUDADES_ARGENTINA = {
  "Buenos Aires": [-34.6037, -58.3816],
  Córdoba: [-31.4201, -64.1888],
  Rosario: [-32.9468, -60.6393],
  Mendoza: [-32.8908, -68.8272],
  Tucumán: [-26.8083, -65.2176],
  "Mar del Plata": [-38.0055, -57.5426],
  Salta: [-24.7821, -65.4232],
  "San Juan": [-31.5375, -68.5364],
  Neuquén: [-38.9516, -68.0591],
  "Bahía Blanca": [-38.7196, -62.2724],
  "San Luis": [-33.3017, -66.3378],
  "La Plata": [-34.9205, -57.9536],
} as const

// Estado colors for offers
export const ESTADO_COLORS = {
  ENVIADA: "text-blue-400",
  VISTA: "text-amber-400",
  EN_NEGOCIACION: "text-purple-400",
  ACEPTADA: "text-emerald-400",
  RECHAZADA: "text-red-400",
} as const

// Format currency
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
