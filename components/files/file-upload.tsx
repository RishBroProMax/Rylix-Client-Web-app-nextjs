"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FileUploadProps {
  projectId: string
  onUploadComplete: () => void
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("projectId", projectId)
      formData.append("description", description)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully.",
        })
        setFile(null)
        setDescription("")
        onUploadComplete()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        {file ? (
          <div className="flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md border border-dashed p-4">
            <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload or drag and drop</span>
              <span className="text-xs text-muted-foreground">Max file size: 10MB</span>
              <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a description for this file"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  )
}

