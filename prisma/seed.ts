import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("Admin@123", 10)

  const adminUser = await prisma.user.upsert({
    where: { email: "rishbro2022@gmail.com" },
    update: {},
    create: {
      email: "rishbro2022@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  console.log({ adminUser })

  // Create a demo client user
  const clientPassword = await hash("Client@123", 10)

  const clientUser = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Demo Client",
      password: clientPassword,
      role: Role.CLIENT,
    },
  })

  console.log({ clientUser })

  // Create a demo project
  const demoProject = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: {
      id: "demo-project",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design and improved UX",
      status: "IN_PROGRESS",
      startDate: new Date("2025-01-15"),
      deadline: new Date("2025-05-15"),
    },
  })

  console.log({ demoProject })

  // Add users to the project
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: demoProject.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      projectId: demoProject.id,
      userId: adminUser.id,
      role: Role.ADMIN,
    },
  })

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: demoProject.id,
        userId: clientUser.id,
      },
    },
    update: {},
    create: {
      projectId: demoProject.id,
      userId: clientUser.id,
      role: Role.CLIENT,
    },
  })

  // Create some demo tasks
  await prisma.task.upsert({
    where: { id: "task-1" },
    update: {},
    create: {
      id: "task-1",
      projectId: demoProject.id,
      title: "Review homepage mockup",
      description: "Review the new homepage design and provide feedback",
      status: "COMPLETED",
      dueDate: new Date("2025-02-15"),
      assignedTo: clientUser.id,
      createdBy: adminUser.id,
    },
  })

  await prisma.task.upsert({
    where: { id: "task-2" },
    update: {},
    create: {
      id: "task-2",
      projectId: demoProject.id,
      title: "Provide feedback on color scheme",
      description: "Review the proposed color palette and provide feedback",
      status: "IN_PROGRESS",
      dueDate: new Date("2025-03-01"),
      assignedTo: clientUser.id,
      createdBy: adminUser.id,
    },
  })

  await prisma.task.upsert({
    where: { id: "task-3" },
    update: {},
    create: {
      id: "task-3",
      projectId: demoProject.id,
      title: "Approve final design",
      description: "Review and approve the final website design",
      status: "PENDING",
      dueDate: new Date("2025-03-15"),
      assignedTo: clientUser.id,
      createdBy: adminUser.id,
    },
  })

  // Create some demo messages
  await prisma.message.upsert({
    where: { id: "message-1" },
    update: {},
    create: {
      id: "message-1",
      projectId: demoProject.id,
      senderId: adminUser.id,
      content:
        "Hello! I've uploaded the latest design mockups for your website. Could you please review them and provide feedback?",
      isRead: true,
      createdAt: new Date("2025-02-10T10:30:00Z"),
    },
  })

  await prisma.message.upsert({
    where: { id: "message-2" },
    update: {},
    create: {
      id: "message-2",
      projectId: demoProject.id,
      senderId: clientUser.id,
      content: "Hi there! I'll take a look at them today and get back to you with my thoughts.",
      isRead: true,
      createdAt: new Date("2025-02-10T10:45:00Z"),
    },
  })

  await prisma.message.upsert({
    where: { id: "message-3" },
    update: {},
    create: {
      id: "message-3",
      projectId: demoProject.id,
      senderId: adminUser.id,
      content: "Great! I've also included some notes about the color scheme and typography choices.",
      isRead: true,
      createdAt: new Date("2025-02-10T11:00:00Z"),
    },
  })

  // Create a demo meeting
  await prisma.meeting.upsert({
    where: { id: "meeting-1" },
    update: {},
    create: {
      id: "meeting-1",
      projectId: demoProject.id,
      title: "Website Design Review",
      description: "Review the latest website design mockups and discuss feedback",
      meetingDate: new Date("2025-03-05T14:00:00Z"),
      duration: 60,
      meetingLink: "https://meet.google.com/demo-meeting",
      createdBy: adminUser.id,
    },
  })

  // Add attendees to the meeting
  await prisma.meetingAttendee.upsert({
    where: {
      meetingId_userId: {
        meetingId: "meeting-1",
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      meetingId: "meeting-1",
      userId: adminUser.id,
      status: "ACCEPTED",
    },
  })

  await prisma.meetingAttendee.upsert({
    where: {
      meetingId_userId: {
        meetingId: "meeting-1",
        userId: clientUser.id,
      },
    },
    update: {},
    create: {
      meetingId: "meeting-1",
      userId: clientUser.id,
      status: "PENDING",
    },
  })

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

