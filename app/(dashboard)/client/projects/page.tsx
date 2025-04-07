import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    status: "In Progress",
    progress: 65,
    deadline: "2025-05-15",
    updates: 3,
    tasks: [
      { id: 1, name: "Review homepage mockup", status: "Completed", dueDate: "2025-03-30" },
      { id: 2, name: "Provide feedback on color scheme", status: "In Progress", dueDate: "2025-04-10" },
      { id: 3, name: "Approve final design", status: "Pending", dueDate: "2025-04-20" },
    ],
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    status: "Planning",
    progress: 20,
    deadline: "2025-07-30",
    updates: 1,
    tasks: [
      { id: 1, name: "Review requirements document", status: "Completed", dueDate: "2025-03-25" },
      { id: 2, name: "Approve wireframes", status: "Pending", dueDate: "2025-04-15" },
    ],
  },
  {
    id: 3,
    name: "Brand Identity",
    description: "Development of new brand identity including logo, color palette, and style guide",
    status: "Review",
    progress: 90,
    deadline: "2025-04-20",
    updates: 5,
    tasks: [
      { id: 1, name: "Review logo concepts", status: "Completed", dueDate: "2025-03-10" },
      { id: 2, name: "Provide feedback on color palette", status: "Completed", dueDate: "2025-03-20" },
      { id: 3, name: "Approve final brand guide", status: "In Progress", dueDate: "2025-04-10" },
    ],
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">View and manage your ongoing projects</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/40 p-4">
                <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        project.status === "In Progress"
                          ? "default"
                          : project.status === "Planning"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/client/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Progress</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Timeline</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Activity</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      <span>{project.updates} new updates</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tasks</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-1 h-4 w-4" />
                      <span>
                        {project.tasks.filter((t) => t.status === "Completed").length} of {project.tasks.length}{" "}
                        completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Upcoming Tasks</h4>
                  <div className="space-y-2">
                    {project.tasks
                      .filter((task) => task.status !== "Completed")
                      .map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-lg border p-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={task.status === "In Progress" ? "default" : "secondary"}>
                              {task.status}
                            </Badge>
                            <span>{task.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {projects
            .filter((project) => project.status === "In Progress" || project.status === "Planning")
            .map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/40 p-4">
                  <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          project.status === "In Progress"
                            ? "default"
                            : project.status === "Planning"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/client/projects/${project.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Progress</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Timeline</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Activity</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>{project.updates} new updates</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tasks</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        <span>
                          {project.tasks.filter((t) => t.status === "Completed").length} of {project.tasks.length}{" "}
                          completed
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {projects.filter((project) => project.status === "Completed").length > 0 ? (
            projects
              .filter((project) => project.status === "Completed")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/40 p-4">
                    <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Completed</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/client/projects/${project.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Progress</h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <Progress value={100} />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Timeline</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>Completed: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center p-6">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-center text-lg font-medium">No completed projects yet</p>
                <p className="text-center text-sm text-muted-foreground">Your completed projects will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

