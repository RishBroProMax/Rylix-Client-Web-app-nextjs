import prisma from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/file-upload"

export async function getFiles(projectId: string, userId: string, role: string) {
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

    return await prisma.file.findMany({
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
    console.error("Error fetching files:", error)
    throw error
  }
}

export async function uploadProjectFile(file: File, projectId: string, userId: string, description?: string) {
  try {
    // Upload file to Supabase Storage
    const fileData = await uploadFile(file, projectId, userId)

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        projectId,
        uploadedBy: userId,
        name: file.name,
        filePath: fileData.filePath,
        fileType: file.type,
        fileSize: file.size,
        description,
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

    // Create a project update about the file upload
    await prisma.projectUpdate.create({
      data: {
        projectId,
        userId,
        content: `Uploaded a new file: ${file.name}`,
      },
    })

    // Notify project members about the new file
    const projectMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
        userId: {
          not: userId, // Don't notify the uploader
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
        title: "New File",
        content: `A new file has been uploaded to the project`,
        type: "file",
        relatedId: projectId,
      })),
    })

    return fileRecord
  } catch (error) {
    console.error("Error uploading project file:", error)
    throw error
  }
}

export async function deleteProjectFile(fileId: string, userId: string, role: string) {
  try {
    // Get the file
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      throw new Error("File not found")
    }

    // Check if user has permission to delete the file
    const hasPermission = role === "ADMIN" || file.uploadedBy === userId

    if (!hasPermission) {
      throw new Error("Unauthorized")
    }

    // Delete file from storage
    await deleteFile(file.filePath)

    // Delete file record from database
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting project file:", error)
    throw error
  }
}

