'use client'
import { Calendar, Home, Inbox, Search, Settings ,ChevronDown    } from "lucide-react"
import { ToolCase } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Dashboard', url: '/dashboard', icon: Inbox },
  { title: 'Tools', url: '/tools', icon: ToolCase },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Account Settings', url: '/settings', icon: Settings },
]
export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="pt-[56px]" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-muted text-muted-foreground'
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

