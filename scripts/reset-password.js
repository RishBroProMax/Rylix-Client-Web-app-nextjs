const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const readline = require("readline")

const prisma = new PrismaClient()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function resetPassword() {
  try {
    console.log("Reset user password")

    // Prompt for user email
    const email = await question("Enter user email: ")

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error("Error: User not found")
      process.exit(1)
    }

    // Prompt for new password
    const password = await question("Enter new password: ")

    // Validate password
    if (password.length < 8) {
      console.error("Error: Password must be at least 8 characters long")
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    console.log(`Password reset successfully for ${user.name} (${user.email})`)
    process.exit(0)
  } catch (error) {
    console.error("Error resetting password:", error)
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

resetPassword()

