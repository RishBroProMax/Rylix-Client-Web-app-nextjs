import prisma from "@/lib/prisma"
import { createServiceClient } from "@/lib/supabase"

export async function getMessages(projectId: string, userId: string, role: string) {
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

    return await prisma.message.findMany({
      where: {
        projectId,
      },
      include: {
        sender: {
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
        createdAt: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

export async function sendMessage(projectId: string, senderId: string, content: string) {
  try {
    const message = await prisma.message.create({
      data: {
        projectId,
        senderId,
        content,
      },
      include: {
        sender: {
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

    // Notify all project members about the new message
    const projectMembers = await prisma.projectMember.findMany({
      where: {
        projectId,
        userId: {
          not: senderId, // Don't notify the sender
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
        title: "New Message",
        content: `You have a new message in project`,
        type: "message",
        relatedId: projectId,
      })),
    })

    // Trigger a Supabase realtime event for instant updates
    const supabaseAdmin = createServiceClient()
    await supabaseAdmin.from("realtime_messages").insert({
      message_id: message.id,
      project_id: projectId,
      sender_id: senderId,
      content,
      created_at: message.createdAt,
    })

    return message
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function markMessagesAsRead(projectId: string, userId: string) {
  try {
    // Get all unread messages in this project that were not sent by the current user
    const unreadMessages = await prisma.message.findMany({
      where: {
        projectId,
        isRead: false,
        senderId: {
          not: userId,
        },
      },
      select: {
        id: true,
      },
    })

    if (unreadMessages.length === 0) {
      return { count: 0 }
    }

    // Mark all messages as read
    const result = await prisma.message.updateMany({
      where: {
        id: {
          in: unreadMessages.map((msg) => msg.id),
        },
      },
      data: {
        isRead: true,
      },
    })

    return { count: result.count }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

