
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
  console.log("--- CHEQUEO DE TABLAS DERIVADAS ---")
  
  // 1. Raw Data
  const { count: rawCount } = await supabase.from("b41_interacciones").select("*", { count: "exact", head: true })
  console.log(`b41_interacciones (RAW): ${rawCount}`)

  // 2. Aggregated Data (Fuente de Overview)
  const { count: metricsCount } = await supabase.from("b41_metricas_diarias").select("*", { count: "exact", head: true })
  console.log(`b41_metricas_diarias (STATS): ${metricsCount}`)

  // 3. View: Interacciones (Fuente de Gráficos)
  const { count: viewInteraccionesCount } = await supabase.from("v_dashboard_interacciones").select("*", { count: "exact", head: true })
  console.log(`v_dashboard_interacciones (VIEW): ${viewInteraccionesCount}`)

  // 4. View: Rutas (Fuente de Ranking)
  const { count: viewRutasCount } = await supabase.from("v_dashboard_rutas").select("*", { count: "exact", head: true })
  console.log(`v_dashboard_rutas (VIEW): ${viewRutasCount}`)
}
check()
