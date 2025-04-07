"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { File, FileText, ImageIcon, FileArchive, Download, Eye, Upload, Search, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for files
const files = [
  {
    id: 1,
    name: "Website Mockup.pdf",
    project: "Website Redesign",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Admin",
    uploadedAt: "Apr 3, 2025",
    icon: FileText,
  },
  {
    id: 2,
    name: "Logo Design.png",
    project: "Brand Identity",
    type: "image",
    size: "1.2 MB",
    uploadedBy: "Admin",
    uploadedAt: "Apr 2, 2025",
    icon: ImageIcon,
  },
  {
    id: 3,
    name: "Project Requirements.docx",
    project: "Mobile App Development",
    type: "document",
    size: "540 KB",
    uploadedBy: "Admin",
    uploadedAt: "Mar 30, 2025",
    icon: FileText,
  },
  {
    id: 4,
    name: "Design Assets.zip",
    project: "Website Redesign",
    type: "archive",
    size: "15.8 MB",
    uploadedBy: "Admin",
    uploadedAt: "Mar 28, 2025",
    icon: FileArchive,
  },
  {
    id: 5,
    name: "Meeting Notes.pdf",
    project: "Mobile App Development",
    type: "pdf",
    size: "320 KB",
    uploadedBy: "Client",
    uploadedAt: "Mar 25, 2025",
    icon: FileText,
  },
]

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = selectedProject ? file.project === selectedProject : true
    return matchesSearch && matchesProject
  })

  const projects = Array.from(new Set(files.map((file) => file.project)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Files</h2>
        <p className="text-muted-foreground">Access and manage your project files</p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="project-filter" className="sr-only">
              Filter by Project
            </Label>
            <select
              id="project-filter"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value || null)}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>Upload a file to share with the project team.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <select
                  id="project"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="Brief description of the file" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded by Me</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>All files shared across your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => {
                    const FileIcon = file.icon
                    return (
                      <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            <FileIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{file.project}</Badge>
                              <span>•</span>
                              <span>{file.size}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {file.uploadedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
                    <File className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">No files found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared with Me</CardTitle>
              <CardDescription>Files shared with you by the project team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFiles
                  .filter((file) => file.uploadedBy === "Admin")
                  .map((file) => {
                    const FileIcon = file.icon
                    return (
                      <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            <FileIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{file.project}</Badge>
                              <span>•</span>
                              <span>{file.size}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {file.uploadedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="uploaded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded by Me</CardTitle>
              <CardDescription>Files you've uploaded to projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFiles
                  .filter((file) => file.uploadedBy === "Client")
                  .map((file) => {
                    const FileIcon = file.icon
                    return (
                      <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            <FileIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{file.project}</Badge>
                              <span>•</span>
                              <span>{file.size}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {file.uploadedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

