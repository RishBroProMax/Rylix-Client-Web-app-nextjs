import prisma from "@/lib/prisma"
import { AttendeeStatus } from "@prisma/client"

export async function getMeetings(userId: string, role: string) {
  try {
    if (role === "ADMIN") {
      // Admins can see all meetings they created or are invited to
      return await prisma.meeting.findMany({
        where: {
          OR: [
            { createdBy: userId },
            {
              attendees: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: {
          project: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          attendees: {
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
          meetingDate: "asc",
        },
      })
    } else {
      // Clients can only see meetings they are invited to
      return await prisma.meeting.findMany({
        where: {
          attendees: {
            some: {
              userId,
            },
          },
        },
        include: {
          project: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          attendees: {
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
          meetingDate: "asc",
        },
      })
    }
  } catch (error) {
    console.error("Error fetching meetings:", error)
    throw error
  }
}

export async function createMeeting(data: {
  projectId: string
  title: string
  description?: string
  meetingDate: Date
  duration?: number
  location?: string
  meetingLink?: string
  createdBy: string
  attendees: string[]
}) {
  try {
    const meeting = await prisma.meeting.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        meetingDate: data.meetingDate,
        duration: data.duration,
        location: data.location,
        meetingLink: data.meetingLink,
        createdBy: data.createdBy,
        attendees: {
          create: data.attendees.map((userId) => ({
            userId,
            status: AttendeeStatus.PENDING,
          })),
        },
      },
      include: {
        project: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attendees: {
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

    // Create a project update about the meeting
    await prisma.projectUpdate.create({
      data: {
        projectId: data.projectId,
        userId: data.createdBy,
        content: `Scheduled a new meeting: ${data.title}`,
      },
    })

    // Create notifications for all attendees
    await prisma.notification.createMany({
      data: data.attendees.map((userId) => ({
        userId,
        title: "Meeting Invitation",
        content: `You have been invited to a meeting: ${data.title}`,
        type: "meeting",
        relatedId: meeting.id,
      })),
    })

    return meeting
  } catch (error) {
    console.error("Error creating meeting:", error)
    throw error
  }
}

export async function updateMeetingAttendeeStatus(meetingId: string, userId: string, status: AttendeeStatus) {
  try {
    return await prisma.meetingAttendee.update({
      where: {
        meetingId_userId: {
          meetingId,
          userId,
        },
      },
      data: {
        status,
      },
    })
  } catch (error) {
    console.error("Error updating meeting attendee status:", error)
    throw error
  }
}

