"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, Eye, Search, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileIcon, defaultStyles } from "react-file-icon"

interface File {
  id: string
  name: string
  filePath: string
  fileType: string
  fileSize: number
  description: string
  createdAt: Date
  user: {
    id: string
    name: string
    image: string
  }
}

interface FileListProps {
  files: File[]
  currentUserId: string
  userRole: string
  onDeleteFile: (fileId: string) => Promise<void>
}

export function FileList({ files, currentUserId, userRole, onDeleteFile }: FileListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const { toast } = useToast()

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteFile = async (fileId: string) => {
    try {
      await onDeleteFile(fileId)
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file.",
        variant: "destructive",
      })
    }
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  const getFileIconProps = (file: File) => {
    const extension = getFileExtension(file.name)
    return {
      extension,
      type: extension,
      ...defaultStyles[extension as keyof typeof defaultStyles],
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search files..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFiles.length > 0 ? (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10">
                    <FileIcon {...getFileIconProps(file)} />
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>
                        Uploaded by {file.user.name}{" "}
                        {formatDistanceToNow(new Date(file.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(file.fileSize)}</span>
                    </div>
                    {file.description && <p className="mt-1 text-sm text-muted-foreground">{file.description}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setPreviewFile(file)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Preview</span>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`/api/files/download/${file.id}`} download={file.name}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </a>
                  </Button>
                  {(userRole === "ADMIN" || file.user.id === currentUserId) && (
                    <Button variant="outline" size="icon" onClick={() => handleDeleteFile(file.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm font-medium">No files found</p>
          <p className="text-xs text-muted-foreground">
            {searchTerm ? "Try adjusting your search" : "Upload files to get started"}
          </p>
        </div>
      )}

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
            <DialogDescription>
              Uploaded by {previewFile?.user.name}{" "}
              {previewFile &&
                formatDistanceToNow(new Date(previewFile.createdAt), {
                  addSuffix: true,
                })}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {previewFile && (
              <iframe src={`/api/files/preview/${previewFile.id}`} className="h-[60vh] w-full rounded-md border" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

