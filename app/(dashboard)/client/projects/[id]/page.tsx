import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, MessageSquare, FileText, Users } from "lucide-react"
import { requireAuth } from "@/lib/session"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { MessageInterface } from "@/components/messaging/message-interface"
import { FileUpload } from "@/components/files/file-upload"
import { FileList } from "@/components/files/file-list"

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string }
}) {
  const user = await requireAuth()
  const projectId = params.id
  const activeTab = searchParams.tab || "overview"

  // Check if user has access to this project
  const projectMember = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: user.id,
    },
  })

  if (!projectMember && user.role !== "ADMIN") {
    notFound()
  }

  // Fetch project details
  const project = await prisma.project.findUnique({
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
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
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
        take: 10,
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
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
      meetings: {
        where: {
          meetingDate: {
            gte: new Date(),
          },
        },
        include: {
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
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          meetingDate: "asc",
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Calculate project progress
  const completedTasks = project.tasks.filter((task) => task.status === "COMPLETED").length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      projectId,
      senderId: {
        not: user.id,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description || "No description provided"}</p>
        </div>
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
          className="px-3 py-1 text-sm"
        >
          {project.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <Progress value={progress} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {project.startDate && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Started: {format(new Date(project.startDate), "MMM d, yyyy")}</span>
              </div>
            )}
            {project.deadline && (
              <div className="flex items-center mt-1">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Deadline: {format(new Date(project.deadline), "MMM d, yyyy")}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.members.length} team members</span>
            </div>
            <div className="mt-2 flex -space-x-2">
              {project.members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                  title={member.user.name}
                >
                  {member.user.image ? (
                    <img
                      src={member.user.image || "/placeholder.svg"}
                      alt={member.user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
              {project.members.length > 5 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.messages.length} messages</span>
            </div>
            <div className="flex items-center mt-1">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.files.length} files</span>
            </div>
            <div className="flex items-center mt-1">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.meetings.length} upcoming meetings</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Updates</CardTitle>
              <CardDescription>Recent updates and activity on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.updates.length > 0 ? (
                  project.updates.map((update) => (
                    <div key={update.id} className="flex items-start space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium">{update.user.name}</p>
                          <span className="mx-2 text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(update.createdAt), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                        <p className="text-sm">{update.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm font-medium">No updates yet</p>
                    <p className="text-xs text-muted-foreground">Updates will appear here as the project progresses</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need to be completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.tasks.filter((task) => task.status !== "COMPLETED").length > 0 ? (
                    project.tasks
                      .filter((task) => task.status !== "COMPLETED")
                      .slice(0, 5)
                      .map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.dueDate && (
                              <p className="text-sm text-muted-foreground">
                                Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                          <Badge variant={task.status === "IN_PROGRESS" ? "default" : "secondary"}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm font-medium">No pending tasks</p>
                      <p className="text-xs text-muted-foreground">All tasks have been completed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Scheduled meetings for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.meetings.length > 0 ? (
                    project.meetings.map((meeting) => (
                      <div key={meeting.id} className="rounded-lg border p-3">
                        <p className="font-medium">{meeting.title}</p>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{format(new Date(meeting.meetingDate), "MMM d, yyyy h:mm a")}</span>
                        </div>
                        {meeting.location && (
                          <p className="mt-1 text-sm text-muted-foreground">Location: {meeting.location}</p>
                        )}
                        {meeting.meetingLink && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            <a
                              href={meeting.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              Join Meeting
                            </a>
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm font-medium">No upcoming meetings</p>
                      <p className="text-xs text-muted-foreground">No meetings are currently scheduled</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with the project team</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <MessageInterface projectId={project.id} initialMessages={project.messages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Project documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="view">View Files</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="view">
                  <FileList
                    files={project.files}
                    currentUserId={user.id}
                    userRole={user.role}
                    onDeleteFile={async (fileId) => {
                      "use client"
                      // This will be handled client-side
                    }}
                  />
                </TabsContent>

                <TabsContent value="upload">
                  <FileUpload
                    projectId={project.id}
                    onUploadComplete={() => {
                      // This will be handled client-side
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Project tasks and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Pending</h3>
                      {project.tasks
                        .filter((task) => task.status === "PENDING")
                        .map((task) => (
                          <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                              {task.dueDate && (
                                <p className="text-sm text-muted-foreground">
                                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </p>
                              )}
                              {task.assignee && (
                                <p className="text-sm text-muted-foreground">Assigned to: {task.assignee.name}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" disabled={task.assignedTo !== user.id}>
                              Start Task
                            </Button>
                          </div>
                        ))}

                      {project.tasks.filter((task) => task.status === "PENDING").length === 0 && (
                        <p className="text-sm text-muted-foreground">No pending tasks</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">In Progress</h3>
                      {project.tasks
                        .filter((task) => task.status === "IN_PROGRESS")
                        .map((task) => (
                          <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                              {task.dueDate && (
                                <p className="text-sm text-muted-foreground">
                                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </p>
                              )}
                              {task.assignee && (
                                <p className="text-sm text-muted-foreground">Assigned to: {task.assignee.name}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" disabled={task.assignedTo !== user.id}>
                              Complete
                            </Button>
                          </div>
                        ))}

                      {project.tasks.filter((task) => task.status === "IN_PROGRESS").length === 0 && (
                        <p className="text-sm text-muted-foreground">No tasks in progress</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Completed</h3>
                      {project.tasks
                        .filter((task) => task.status === "COMPLETED")
                        .map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between rounded-lg border p-3 bg-muted/30"
                          >
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                              {task.assignee && (
                                <p className="text-sm text-muted-foreground">Completed by: {task.assignee.name}</p>
                              )}
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                        ))}

                      {project.tasks.filter((task) => task.status === "COMPLETED").length === 0 && (
                        <p className="text-sm text-muted-foreground">No completed tasks</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm font-medium">No tasks yet</p>
                    <p className="text-xs text-muted-foreground">Tasks will be added as the project progresses</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meetings</CardTitle>
              <CardDescription>Scheduled meetings for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.meetings.length > 0 ? (
                  project.meetings.map((meeting) => (
                    <div key={meeting.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{meeting.title}</h3>
                        <Badge variant="outline">{format(new Date(meeting.meetingDate), "MMM d, yyyy")}</Badge>
                      </div>

                      {meeting.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
                      )}

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium">Details</p>
                          <div className="mt-1 space-y-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{format(new Date(meeting.meetingDate), "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>
                                {format(new Date(meeting.meetingDate), "h:mm a")}
                                {meeting.duration && ` (${meeting.duration} minutes)`}
                              </span>
                            </div>
                            {meeting.location && <p className="text-muted-foreground">Location: {meeting.location}</p>}
                            {meeting.meetingLink && (
                              <p>
                                <a
                                  href={meeting.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline"
                                >
                                  Join Meeting
                                </a>
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Attendees</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {meeting.attendees.map((attendee) => (
                              <div
                                key={attendee.id}
                                className="flex items-center rounded-full bg-muted px-3 py-1 text-xs"
                              >
                                {attendee.user.image ? (
                                  <img
                                    src={attendee.user.image || "/placeholder.svg"}
                                    alt={attendee.user.name}
                                    className="mr-1 h-4 w-4 rounded-full"
                                  />
                                ) : (
                                  <div className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {attendee.user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span>{attendee.user.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm font-medium">No meetings scheduled</p>
                    <p className="text-xs text-muted-foreground">Meetings will appear here when scheduled</p>
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

