
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyLogin() {
  const email = "admin@follow.com"
  const password = "admin-password-123"

  console.log(`Intentando iniciar sesión con: ${email}...`)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("❌ Error de Login:", error.message)
    console.error("Detalles:", error)
    return
  }

  console.log("✅ LOGIN EXITOSO!")
  console.log("Usuario ID:", data.user.id)
  console.log("Email:", data.user.email)
}

verifyLogin()
