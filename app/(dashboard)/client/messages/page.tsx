"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, PaperclipIcon } from "lucide-react"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    project: "Website Redesign",
    lastMessage: "Can you provide feedback on the latest mockups?",
    timestamp: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    project: "Mobile App Development",
    lastMessage: "We've updated the project timeline.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    project: "Brand Identity",
    lastMessage: "Logo designs are ready for review.",
    timestamp: "Apr 2",
    unread: false,
  },
]

// Mock data for messages
const initialMessages = [
  {
    id: 1,
    sender: "admin",
    content:
      "Hello! I've uploaded the latest design mockups for your website. Could you please review them and provide feedback?",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: 2,
    sender: "client",
    content: "Hi there! I'll take a look at them today and get back to you with my thoughts.",
    timestamp: "10:45 AM",
    read: true,
  },
  {
    id: 3,
    sender: "admin",
    content: "Great! I've also included some notes about the color scheme and typography choices.",
    timestamp: "11:00 AM",
    read: true,
  },
  {
    id: 4,
    sender: "admin",
    content:
      "Let me know if you have any questions or if you'd like to schedule a call to discuss the designs in more detail.",
    timestamp: "11:02 AM",
    read: false,
  },
]

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message = {
      id: messages.length + 1,
      sender: "client",
      content: newMessage,
      timestamp: "Just now",
      read: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">Communicate with the project team</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your project discussions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="m-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full flex items-start space-x-3 p-3 text-left hover:bg-muted ${
                        activeConversation.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{conversation.project}</p>
                          <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <div className="space-y-1">
                  {conversations
                    .filter((conversation) => conversation.unread)
                    .map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full flex items-start space-x-3 p-3 text-left hover:bg-muted ${
                          activeConversation.id === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                          <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{conversation.project}</p>
                            <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </button>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="flex flex-col md:col-span-2">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{activeConversation.project}</CardTitle>
                <CardDescription>Rylix Solutions Team</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "client" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.sender === "client" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Button variant="outline" size="icon">
                <PaperclipIcon className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

