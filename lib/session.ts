import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  return session.user
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getCurrentUser()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}

export async function requireAdmin(redirectTo = "/login") {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect(redirectTo)
  }

  return user
}

