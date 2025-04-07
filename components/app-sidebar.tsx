"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Home, Folder, MessageSquare, FileText, Calendar, Settings, Users, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession, signOut } from "next-auth/react"

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  label: string
  isActive?: boolean
}

function SidebarLink({ href, icon: Icon, label, isActive }: SidebarLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link href={href}>
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface AppSidebarProps {
  userRole?: "admin" | "client"
}

export function AppSidebar({ userRole = "client" }: AppSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const basePath = `/${userRole}`

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://cdn.imrishmika.site/rylix/RYLIX-white.png"
            alt="Rylix Solutions Logo"
            width={100}
            height={30}
            className="dark:block hidden"
          />
          <Image
            src="https://cdn.imrishmika.site/rylix/RYLIX-white.png"
            alt="Rylix Solutions Logo"
            width={100}
            height={30}
            className="dark:hidden invert"
          />
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink
                href={`${basePath}/dashboard`}
                icon={Home}
                label="Dashboard"
                isActive={isActive(`${basePath}/dashboard`)}
              />
              <SidebarLink
                href={`${basePath}/projects`}
                icon={Folder}
                label="Projects"
                isActive={isActive(`${basePath}/projects`)}
              />
              <SidebarLink
                href={`${basePath}/messages`}
                icon={MessageSquare}
                label="Messages"
                isActive={isActive(`${basePath}/messages`)}
              />
              <SidebarLink
                href={`${basePath}/files`}
                icon={FileText}
                label="Files"
                isActive={isActive(`${basePath}/files`)}
              />
              <SidebarLink
                href={`${basePath}/calendar`}
                icon={Calendar}
                label="Calendar"
                isActive={isActive(`${basePath}/calendar`)}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarLink
                  href={`${basePath}/clients`}
                  icon={Users}
                  label="Clients"
                  isActive={isActive(`${basePath}/clients`)}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4">
          <SidebarMenu>
            <SidebarLink
              href={`${basePath}/settings`}
              icon={Settings}
              label="Settings"
              isActive={isActive(`${basePath}/settings`)}
            />
          </SidebarMenu>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                {session?.user?.name || (userRole === "admin" ? "Admin User" : "Client User")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

