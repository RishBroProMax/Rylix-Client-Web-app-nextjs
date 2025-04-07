import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { sendMessage } from "@/lib/services/message-service"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, content } = await request.json()

    if (!projectId || !content) {
      return NextResponse.json({ error: "Project ID and content are required" }, { status: 400 })
    }

    const message = await sendMessage(projectId, user.id, content)

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

