// This script sets up Supabase storage buckets
const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing Supabase environment variables")
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file")
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log("Setting up Supabase storage buckets...")

    // Create files bucket
    try {
      const { data: filesBucket, error: filesBucketError } = await supabase.storage.createBucket("files", {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      })

      if (filesBucketError) {
        if (filesBucketError.message.includes("already exists")) {
          console.log("Files bucket already exists")
        } else {
          throw filesBucketError
        }
      } else {
        console.log("Created files bucket successfully")
      }
    } catch (error) {
      console.error("Error creating files bucket:", error)
    }

    // Create avatars bucket
    try {
      const { data: avatarsBucket, error: avatarsBucketError } = await supabase.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 2097152, // 2MB
      })

      if (avatarsBucketError) {
        if (avatarsBucketError.message.includes("already exists")) {
          console.log("Avatars bucket already exists")
        } else {
          throw avatarsBucketError
        }
      } else {
        console.log("Created avatars bucket successfully")
      }
    } catch (error) {
      console.error("Error creating avatars bucket:", error)
    }

    console.log("Supabase storage setup completed")
    return true
  } catch (error) {
    console.error("Error setting up Supabase storage:", error)
    return false
  }
}

setupStorage()
  .then((success) => {
    if (!success) {
      console.log("\nTroubleshooting tips:")
      console.log("1. Check your Supabase credentials in the .env file")
      console.log("2. Make sure your Supabase project is active")
      console.log("3. Make sure you have the necessary permissions")
      process.exit(1)
    }

    process.exit(0)
  })
  .catch((error) => {
    console.error("Unexpected error:", error)
    process.exit(1)
  })

