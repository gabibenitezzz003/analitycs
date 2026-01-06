
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Faltan las variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createAdmin() {
  const email = "admin@follow.com"
  const password = "admin-password-123" // Contraseña segura por defecto

  console.log(`Creating user: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirmar email
  })

  if (error) {
    console.error("❌ Error creando usuario:", error.message)
    return
  }

  console.log("✅ Usuario creado exitosamente:")
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
  console.log("   ID:", data.user.id)
}

createAdmin()
