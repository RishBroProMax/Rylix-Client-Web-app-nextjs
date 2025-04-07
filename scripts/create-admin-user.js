const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const readline = require("readline")

const prisma = new PrismaClient()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function createAdminUser() {
  try {
    console.log("Create a new admin user")

    // Prompt for user details
    const name = await question("Enter name: ")
    const email = await question("Enter email: ")
    const password = await question("Enter password: ")

    // Validate input
    if (!name || !email || !password) {
      console.error("Error: All fields are required")
      process.exit(1)
    }

    if (password.length < 8) {
      console.error("Error: Password must be at least 8 characters long")
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.error("Error: A user with this email already exists")
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log(`Admin user created successfully: ${user.name} (${user.email})`)
    process.exit(0)
  } catch (error) {
    console.error("Error creating admin user:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

createAdminUser()

