const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log("Testing database connection...")

    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`

    if (result && result[0] && result[0].test === 1) {
      console.log("Database connection successful!")
    } else {
      console.error("Database connection failed: Unexpected response")
    }
  } catch (error) {
    console.error("Database connection failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

