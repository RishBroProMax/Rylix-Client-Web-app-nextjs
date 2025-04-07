// This script runs all setup scripts
const { execSync } = require("child_process")
const fs = require("fs")

// Check if .env file exists
if (!fs.existsSync(".env")) {
  console.log("Creating .env file from .env.example...")

  if (fs.existsSync(".env.example")) {
    fs.copyFileSync(".env.example", ".env")
    console.log("Created .env file. Please update it with your actual values.")
  } else {
    console.error("Error: .env.example file not found.")
    process.exit(1)
  }
}

// Generate NEXTAUTH_SECRET
console.log("Generating NEXTAUTH_SECRET...")
try {
  execSync("node scripts/generate-secret.js", { stdio: "inherit" })
} catch (error) {
  console.error("Error generating NEXTAUTH_SECRET:", error)
}

// Install dependencies
console.log("Installing dependencies...")
try {
  execSync("npm install", { stdio: "inherit" })
} catch (error) {
  console.error("Error installing dependencies:", error)
  process.exit(1)
}

// Generate Prisma client
console.log("Generating Prisma client...")
try {
  execSync("npx prisma generate", { stdio: "inherit" })
} catch (error) {
  console.error("Error generating Prisma client:", error)
  process.exit(1)
}

// Test database connection
console.log("Testing database connection...")
try {
  execSync("node scripts/test-db-connection.js", { stdio: "inherit" })
} catch (error) {
  console.error("Database connection test failed. Please check your database configuration.")
  process.exit(1)
}

// Set up database
console.log("Setting up database...")
try {
  execSync("node scripts/setup-db.js", { stdio: "inherit" })
} catch (error) {
  console.error("Error setting up database:", error)
  process.exit(1)
}

// Test Supabase connection
console.log("Testing Supabase connection...")
try {
  execSync("node scripts/test-supabase.js", { stdio: "inherit" })
} catch (error) {
  console.error("Supabase connection test failed. Please check your Supabase configuration.")
  process.exit(1)
}

// Set up Supabase storage
console.log("Setting up Supabase storage...")
try {
  execSync("node scripts/setup-supabase-simplified.js", { stdio: "inherit" })
} catch (error) {
  console.error("Error setting up Supabase storage:", error)
  process.exit(1)
}

console.log("\nSetup completed successfully!")
console.log("\nYou can now start the development server:")
console.log("npm run dev")

