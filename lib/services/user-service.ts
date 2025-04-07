import prisma from "@/lib/prisma"
import type { Role } from "@prisma/client"
import { hash } from "bcrypt"

export async function getUsers(role?: Role) {
  try {
    return await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function getUserById(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: Role
  image?: string
}) {
  try {
    const hashedPassword = await hash(data.password, 10)

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        image: data.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(
  userId: string,
  data: {
    name?: string
    email?: string
    password?: string
    role?: Role
    image?: string
  },
) {
  try {
    const updateData: any = { ...data }

    if (data.password) {
      updateData.password = await hash(data.password, 10)
    }

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

