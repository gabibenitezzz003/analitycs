
export const CIUDADES_LATAM: Record<string, [number, number]> = {
    "buenos aires": [-34.6037, -58.3816],
    "cordoba": [-31.4201, -64.1888],
    "rosario": [-32.9442, -60.6505],
    "mendoza": [-32.8895, -68.8458],
    "san miguel de tucuman": [-26.8083, -65.2176],
    "tucuman": [-26.8083, -65.2176],
    "mar del plata": [-38.0055, -57.5426],
    "salta": [-24.7821, -65.4232],
    "santa fe": [-31.6107, -60.6973],
    "san juan": [-31.5375, -68.5364],
    "resistencia": [-27.4606, -58.9839],
    "neuquen": [-38.9516, -68.0591],
    "santiago": [-33.4489, -70.6693],
    "montevideo": [-34.9011, -56.1645],
    "sao paulo": [-23.5505, -46.6333],
    "lima": [-12.0464, -77.0428],
    "bogota": [4.7110, -74.0721],
    "asuncion": [-25.2637, -57.5759],
    "la paz": [-16.5000, -68.1193],
    "bahia blanca": [-38.7183, -62.2662], // Añadido
    "rio cuarto": [-33.1232, -64.3475], // Añadido
    "san rafael": [-34.6177, -68.3301],
    "posadas": [-27.3671, -55.8961],
    "corrientes": [-27.4692, -58.8306],
    "san luis": [-33.2950, -66.3356],
    "parana": [-31.7319, -60.5238],
    "formosa": [-26.1849, -58.1731],
    "san salvador de jujuy": [-24.1858, -65.2995],
    "quilmes": [-34.7290, -58.2637],
    "lanus": [-34.7000, -58.4000],
    "la plata": [-34.9214, -57.9545],
    "general roca": [-39.0333, -67.5833],
    "cipolletti": [-38.9333, -67.9833],
    "concordia": [-31.3929, -58.0209],
    "comodoro rivadavia": [-45.8667, -67.5000],
    "rawson": [-43.3002, -65.1023],
    "ushuaia": [-54.8019, -68.3030],
    "rio gallegos": [-51.6226, -69.2181],
    "santa rosa": [-36.6167, -64.2833],
    "viedma": [-40.8135, -62.9967],
    "san martin de los andes": [-40.1601, -71.3533],
    "bariloche": [-41.1335, -71.3103],
    "trelew": [-43.2533, -65.3093],
    "puerto madryn": [-42.7692, -65.0385]
}

export function distanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
}
