import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function uploadFile(file: File, projectId: string, userId: string) {
  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `projects/${projectId}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("files").upload(filePath, file)

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("files").getPublicUrl(filePath)

    return {
      name: file.name,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export async function deleteFile(filePath: string) {
  try {
    const { error } = await supabase.storage.from("files").remove([filePath])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

