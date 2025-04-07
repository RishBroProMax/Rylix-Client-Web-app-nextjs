// This script sets up the database
const { execSync } = require("child_process")
const fs = require("fs")

// Check if .env file exists
if (!fs.existsSync(".env")) {
  console.error("Error: .env file not found")
  console.error("Please create a .env file with your database credentials")
  process.exit(1)
}

// Run database migrations
console.log("Running database migrations...")
try {
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" })
} catch (error) {
  console.error("Error running database migrations:", error)
  process.exit(1)
}

// Seed the database
console.log("Seeding the database...")
try {
  execSync("npx prisma db seed", { stdio: "inherit" })
} catch (error) {
  console.error("Error seeding the database:", error)
  process.exit(1)
}

console.log("Database setup completed successfully!")

