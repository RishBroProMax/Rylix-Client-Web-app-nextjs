import prisma from "@/lib/prisma"

export async function getProjectUpdates(projectId: string, userId: string, role: string) {
  try {
    // Check if user has access to this project
    const hasAccess =
      role === "ADMIN" ||
      (await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId,
        },
      }))

    if (!hasAccess) {
      throw new Error("Unauthorized")
    }

    return await prisma.projectUpdate.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Error fetching project updates:", error)
    throw error
  }
}

export async function createProjectUpdate(projectId: string, userId: string, content: string) {
  try {
    const update = await prisma.projectUpdate.create({
      data: {
        projectId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    })

    // Notify all project members about the update
    const projectMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
        userId: {
          not: userId, // Don't notify the creator
        },
      },
      select: {
        userId: true,
      },
    })

    // Create notifications for all project members
    await prisma.notification.createMany({
      data: projectMembers.map((member) => ({
        userId: member.userId,
        title: "Project Update",
        content: `There is a new update in the project`,
        type: "update",
        relatedId: projectId,
      })),
    })

    return update
  } catch (error) {
    console.error("Error creating project update:", error)
    throw error
  }
}

