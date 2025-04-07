import prisma from "@/lib/prisma"
import type { TaskStatus } from "@prisma/client"

export async function getTasks(projectId: string, userId: string, role: string) {
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

    return await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          dueDate: "asc",
        },
      ],
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export async function createTask(data: {
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: Date
  assignedTo?: string
  createdBy: string
}) {
  try {
    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        assignedTo: data.assignedTo,
        createdBy: data.createdBy,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Create a project update about the task
    await prisma.projectUpdate.create({
      data: {
        projectId: data.projectId,
        userId: data.createdBy,
        content: `Created a new task: ${data.title}`,
      },
    })

    // If the task is assigned to someone, create a notification
    if (data.assignedTo) {
      await prisma.notification.create({
        data: {
          userId: data.assignedTo,
          title: "Task Assignment",
          content: `You have been assigned a new task: ${data.title}`,
          type: "task",
          relatedId: task.id,
        },
      })
    }

    return task
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus, userId: string) {
  try {
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    })

    // Create a project update about the task status change
    await prisma.projectUpdate.create({
      data: {
        projectId: task.projectId,
        userId,
        content: `Updated task status to ${status}: ${task.title}`,
      },
    })

    return task
  } catch (error) {
    console.error("Error updating task status:", error)
    throw error
  }
}

