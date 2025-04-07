// This script helps set up the local development environment
const fs = require("fs")
const { execSync } = require("child_process")

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

console.log("\nSetup completed successfully!")
console.log("\nNext steps:")
console.log("1. Update your .env file with your actual values")
console.log("2. Run database migrations: npm run db:migrate")
console.log("3. Seed the database: npm run db:seed")
console.log("4. Start the development server: npm run dev")

