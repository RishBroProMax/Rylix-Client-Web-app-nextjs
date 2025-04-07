import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MessageSquare, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { requireAuth } from "@/lib/session"
import prisma from "@/lib/prisma"
import { formatDistanceToNow, format } from "date-fns"

export default async function ClientDashboard() {
  const user = await requireAuth()

  // Fetch projects the user is a member of
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      tasks: true,
      updates: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
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
      messages: {
        where: {
          senderId: {
            not: user.id,
          },
          isRead: false,
        },
      },
      files: {
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
      },
      meetings: {
        where: {
          meetingDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          meetingDate: "asc",
        },
        take: 3,
      },
    },
  })

  // Calculate project progress
  const projectsWithProgress = projects.map((project) => {
    const completedTasks = project.tasks.filter((task) => task.status === "COMPLETED").length
    const totalTasks = project.tasks.length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      ...project,
      progress,
    }
  })

  // Get upcoming deadlines
  const upcomingTasks = await prisma.task.findMany({
    where: {
      assignedTo: user.id,
      status: {
        not: "COMPLETED",
      },
      dueDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
    include: {
      project: true,
    },
  })

  // Get recent activities
  const recentActivities = [
    ...projects.flatMap((project) =>
      project.updates.map((update) => ({
        id: update.id,
        type: "update",
        project: project.name,
        projectId: project.id,
        content: update.content,
        time: update.createdAt,
        user: update.user,
      })),
    ),
    ...projects.flatMap((project) =>
      project.files.map((file) => ({
        id: file.id,
        type: "file",
        project: project.name,
        projectId: project.id,
        content: `New file uploaded: ${file.name}`,
        time: file.createdAt,
      })),
    ),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here's an overview of your projects.</p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsWithProgress.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                  <Badge
                    variant={
                      project.status === "IN_PROGRESS"
                        ? "default"
                        : project.status === "PLANNING"
                          ? "secondary"
                          : project.status === "REVIEW"
                            ? "outline"
                            : "success"
                    }
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                    {project.deadline && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Deadline: {format(new Date(project.deadline), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm">
                        <span className="font-medium">{project.messages.length}</span> unread messages
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/client/projects/${project.id}`}>
                          <span>View Details</span>
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button asChild>
            <Link href="/client/projects">View All Projects</Link>
          </Button>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest project updates and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.type === "update" ? MessageSquare : FileText
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.project}</p>
                        <p className="text-sm text-muted-foreground">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/client/projects/${activity.projectId}`}>View</Link>
                      </Button>
                    </div>
                  )
                })}

                {recentActivities.length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm font-medium">No recent activity</p>
                    <p className="text-xs text-muted-foreground">Activity will appear here as you work on projects</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks and deliverables due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => {
                  const daysLeft = Math.ceil(
                    (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <div key={task.id} className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {task.project.name}: {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due on {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </p>
                        <Badge variant={daysLeft <= 3 ? "destructive" : "outline"}>{daysLeft} days left</Badge>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/client/projects/${task.projectId}?tab=tasks`}>View</Link>
                      </Button>
                    </div>
                  )
                })}

                {upcomingTasks.length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm font-medium">No upcoming deadlines</p>
                    <p className="text-xs text-muted-foreground">You're all caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

