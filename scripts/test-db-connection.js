// This script tests the database connection
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log("Testing database connection...")

    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`

    console.log("Database connection successful!")
    console.log("Result:", result)

    return true
  } catch (error) {
    console.error("Database connection failed:")
    console.error(error)

    return false
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .then((success) => {
    if (!success) {
      console.log("\nTroubleshooting tips:")
      console.log("1. Make sure your PostgreSQL server is running")
      console.log("2. Check your database credentials in the .env file")
      console.log("3. Make sure the database exists")
      console.log("4. Check if your firewall is blocking the connection")
      process.exit(1)
    }

    process.exit(0)
  })
  .catch((error) => {
    console.error("Unexpected error:", error)
    process.exit(1)
  })

