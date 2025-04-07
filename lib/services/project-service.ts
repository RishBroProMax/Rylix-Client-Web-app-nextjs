import prisma from "@/lib/prisma"
import type { ProjectStatus } from "@prisma/client"

export async function getProjects(userId: string, role: string) {
  try {
    if (role === "ADMIN") {
      // Admins can see all projects
      return await prisma.project.findMany({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
    } else {
      // Clients can only see projects they are members of
      return await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export async function getProjectById(projectId: string, userId: string, role: string) {
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

    return await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
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
        },
        updates: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            dueDate: "asc",
          },
        },
        meetings: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            attendees: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            meetingDate: "asc",
          },
          where: {
            meetingDate: {
              gte: new Date(),
            },
          },
        },
        files: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    throw error
  }
}

export async function createProject(data: {
  name: string
  description?: string
  status: ProjectStatus
  startDate?: Date
  deadline?: Date
  members: { userId: string; role: string }[]
}) {
  try {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        deadline: data.deadline,
        members: {
          create: data.members,
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string
    description?: string
    status?: ProjectStatus
    startDate?: Date
    deadline?: Date
  },
) {
  try {
    return await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    })
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export async function deleteProject(projectId: string) {
  try {
    return await prisma.project.delete({
      where: {
        id: projectId,
      },
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

