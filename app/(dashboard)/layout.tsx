import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={user.role.toLowerCase() as "admin" | "client"} />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <div className="flex-1 p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

