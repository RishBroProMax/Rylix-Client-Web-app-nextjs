// This script generates a random secret for NEXTAUTH_SECRET
const crypto = require("crypto")
const fs = require("fs")

// Generate a random secret
const secret = crypto.randomBytes(32).toString("base64")

console.log("Generated NEXTAUTH_SECRET:", secret)

// Check if .env file exists
if (fs.existsSync(".env")) {
  // Read the .env file
  let envContent = fs.readFileSync(".env", "utf8")

  // Check if NEXTAUTH_SECRET already exists
  if (envContent.includes("NEXTAUTH_SECRET=")) {
    // Replace the existing NEXTAUTH_SECRET
    envContent = envContent.replace(/NEXTAUTH_SECRET=.*$/m, `NEXTAUTH_SECRET=${secret}`)
  } else {
    // Add NEXTAUTH_SECRET to the end of the file
    envContent += `\nNEXTAUTH_SECRET=${secret}`
  }

  // Write the updated content back to the .env file
  fs.writeFileSync(".env", envContent)

  console.log("Updated NEXTAUTH_SECRET in .env file.")
} else {
  console.log("No .env file found. Create one and add:")
  console.log(`NEXTAUTH_SECRET=${secret}`)
}

