"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Message } from "@prisma/client"

interface MessageWithSender extends Message {
  sender: {
    id: string
    name: string
    email: string
    image: string
    role: string
  }
}

interface RealTimeMessagesProps {
  projectId: string
  initialMessages: MessageWithSender[]
  onNewMessage: (message: MessageWithSender) => void
}

export function RealTimeMessages({ projectId, initialMessages, onNewMessage }: RealTimeMessagesProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages)

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`project-${projectId}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "realtime_messages",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender details
          const response = await fetch(`/api/messages/${payload.new.message_id}`)
          if (response.ok) {
            const newMessage = await response.json()
            onNewMessage(newMessage)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, onNewMessage])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  return null // This is just a subscription component
}

