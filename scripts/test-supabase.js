// This script tests the Supabase connection
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Missing Supabase environment variables")
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file")
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log("Testing Supabase connection...")

    // Try to get the Supabase service status
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    console.log("Supabase connection successful!")
    console.log("Session data:", data)

    return true
  } catch (error) {
    console.error("Supabase connection failed:")
    console.error(error)

    return false
  }
}

testConnection()
  .then((success) => {
    if (!success) {
      console.log("\nTroubleshooting tips:")
      console.log("1. Check your Supabase credentials in the .env file")
      console.log("2. Make sure your Supabase project is active")
      console.log("3. Check if your IP is allowed to access the Supabase API")
      process.exit(1)
    }

    process.exit(0)
  })
  .catch((error) => {
    console.error("Unexpected error:", error)
    process.exit(1)
  })

