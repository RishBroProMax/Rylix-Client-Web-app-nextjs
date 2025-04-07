import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { deleteProjectFile } from "@/lib/services/file-service"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id

    const result = await deleteProjectFile(fileId, user.id, user.role)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

