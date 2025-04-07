import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import prisma from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id

    // Get file details
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        project: {
          select: {
            id: true,
            members: {
              where: {
                userId: user.id,
              },
            },
          },
        },
      },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if user has access to this file
    const hasAccess = user.role === "ADMIN" || file.project.members.length > 0

    if (!hasAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get file from Supabase Storage
    const { data, error } = await supabase.storage.from("files").download(file.filePath)

    if (error || !data) {
      console.error("Error downloading file:", error)
      return NextResponse.json({ error: "Error downloading file" }, { status: 500 })
    }

    // Set appropriate headers for download
    const headers = new Headers()
    headers.set("Content-Type", file.fileType || "application/octet-stream")
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(file.name)}"`)

    return new NextResponse(data, {
      headers,
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

