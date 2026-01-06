
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!supabaseUrl || !serviceRoleKey) {
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, serviceRoleKey)

async function checkDates() {
  console.log("--- CHEQUEO DE FECHAS ---")

  // Obtener la interacción más reciente y la más antigua
  const { data: latest, error: err1 } = await adminClient
    .from("b41_interacciones")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)

  const { data: oldest, error: err2 } = await adminClient
    .from("b41_interacciones")
    .select("created_at")
    .order("created_at", { ascending: true })
    .limit(1)

  const { count } = await adminClient
    .from("b41_interacciones")
    .select("*", { count: "exact", head: true })

  console.log(`Total interacciones: ${count}`)
  
  if (latest && latest.length > 0) {
    console.log(`Más reciente: ${latest[0].created_at}`)
    console.log(`Más antigua: ${oldest?.[0]?.created_at}`)
    
    // Check if recent enough for views (usually last 7-30 days)
    const lastDate = new Date(latest[0].created_at)
    const now = new Date()
    const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    console.log(`Días desde la última interacción: ${diffDays.toFixed(1)}`)
  } else {
    console.log("⚠️ No hay datos en b41_interacciones.")
  }

  // Check view content again
  const { data: viewData } = await adminClient.from("v_dashboard_overview").select("*")
  console.log(`Filas en v_dashboard_overview (Admin): ${viewData?.length || 0}`)
}

checkDates()
