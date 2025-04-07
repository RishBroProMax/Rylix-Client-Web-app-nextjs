const { createClient } = require("@supabase/supabase-js")

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log("Setting up Supabase storage buckets...")

    // Create files bucket
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
      console.log("Created files bucket:", filesBucket)
    }

    // Create avatars bucket
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
      console.log("Created avatars bucket:", avatarsBucket)
    }

    console.log("Setting up storage policies...")

    // Files bucket policy - only authenticated users can access their own files
    try {
      await supabase.storage.from("files").createPolicy("Files Access Policy", {
        name: "Files Access Policy",
        definition: `(bucket_id = 'files' AND auth.uid() = owner)`,
        type: "SELECT",
      })
      console.log("Set up files access policy")
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("Files access policy already exists")
      } else {
        console.error("Error setting up files access policy:", error)
      }
    }

    // Avatars bucket policy - anyone can read, only authenticated users can write their own avatars
    try {
      await supabase.storage.from("avatars").createPolicy("Avatars Read Policy", {
        name: "Avatars Read Policy",
        definition: `(bucket_id = 'avatars')`,
        type: "SELECT",
      })
      console.log("Set up avatars read policy")
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("Avatars read policy already exists")
      } else {
        console.error("Error setting up avatars read policy:", error)
      }
    }

    try {
      await supabase.storage.from("avatars").createPolicy("Avatars Write Policy", {
        name: "Avatars Write Policy",
        definition: `(bucket_id = 'avatars' AND auth.uid() = owner)`,
        type: "INSERT",
      })
      console.log("Set up avatars write policy")
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("Avatars write policy already exists")
      } else {
        console.error("Error setting up avatars write policy:", error)
      }
    }

    console.log("Supabase storage setup completed successfully")
  } catch (error) {
    console.error("Error setting up Supabase storage:", error)
    process.exit(1)
  }
}

setupStorage()
  .then(() => {
    console.log("Setup completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Setup failed:", error)
    process.exit(1)
  })

