
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const anonClient = createClient(supabaseUrl!, anonKey!)

async function checkRLS() {
  console.log("Checking RLS as Anon User...")
  
  // Try to read the View that we KNOW has data (44 rows for Admin)
  const { count, error } = await anonClient
    .from("v_dashboard_interacciones")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.log("ERROR:", error.message)
  } else {
    console.log("ANON_COUNT:", count)
  }
}
checkRLS()
