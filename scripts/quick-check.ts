
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
  const { count } = await supabase.from("b41_interacciones").select("*", { count: "exact", head: true })
  console.log("COUNT_RAW:", count)
  
  if (count && count > 0) {
    const { data } = await supabase.from("b41_interacciones").select("created_at").order("created_at", { ascending: false }).limit(1)
    if (data && data[0]) {
      const date = new Date(data[0].created_at)
      console.log("DATA_YEAR:", date.getFullYear())
    }
  } else {
    console.log("NO_DATA_FOUND")
  }
}
check()
