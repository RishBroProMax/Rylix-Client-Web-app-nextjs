const { createClient } = require("@supabase/supabase-js")

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log("Testing Supabase connection...")

    // Try to get the Supabase service status
    const { data, error } = await supabase.from("_realtime").select("*").limit(1)

    if (error) {
      throw error
    }

    console.log("Supabase connection successful!")
  } catch (error) {
    console.error("Supabase connection failed:", error)
  }
}

testConnection()

