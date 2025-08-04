"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  HomeIcon, Calendar, Home, Inbox, Search, Settings ,ChevronDown ,ToolCase
} from "lucide-react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent, SidebarMenu , SidebarMenuButton , SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { title } from "process"
import { categories } from "@/lib/tools/categories"

// This is sample data.
const items = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Dashboard', url: '/dashboard', icon: Inbox },
    // { title: 'Tools', url: '/dashboard/tools', icon: ToolCase },
]
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
        title: "Tools",
        url: "/dashboard/tools",
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
            title: "Favorites",
            url: "/dashboard/tools/favorite",
            },
            {
                title:"Categories",
                url:"/dashboard/tools/categories"
            },
            {
                title:"Tags",
                url:"/dashboard/tools/tags"
            }
        ],
        },
        // {
        // title: "Navigation",
        // url: "/",
        // icon: HomeIcon,
        // items: [
        //     {
        //     title: "Support Us",
        //     url: "/support",
        //     },
        //     {
        //     title: "Explorer",
        //     url: "#",
        //     },
        //     {
        //     title: "Quantum",
        //     url: "#",
        //     },
        // ],
        // },
        // {
        // title: "Documentation",
        // url: "#",
        // icon: BookOpen,
        // items: [
        //     {
        //     title: "Introduction",
        //     url: "#",
        //     },
        //     {
        //     title: "Get Started",
        //     url: "#",
        //     },
        //     {
        //     title: "Tutorials",
        //     url: "#",
        //     },
        //     {
        //     title: "Changelog",
        //     url: "#",
        //     },
        // ],
        // },
        // {
        // title: "Settings",
        // url: "#",
        // icon: Settings2,
        // items: [
        //     {
        //     title: "General",
        //     url: "#",
        //     },
        //     {
        //     title: "Team",
        //     url: "#",
        //     },
        //     {
        //     title: "Billing",
        //     url: "#",
        //     },
        //     {
        //     title: "Limits",
        //     url: "#",
        //     },
        // ],
        // },
    ],
}

export function AppSidebarV3({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    return (
        <Sidebar className="pt-[56px]" collapsible="icon" {...props}>
        {/* <SidebarHeader>
        </SidebarHeader> */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map((item) => {
                            const isActive = pathname === item.url
                            return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title} asChild>
                                <a
                                    href={item.url}
                                    className={clsx(
                                    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                                    isActive
                                        ? 'bg-foreground text-background font-semibold'
                                        : 'hover:bg-muted'
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.title}</span>
                                </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            )
                        })}
                        {/* <NavMain items={data.navMain} /> */}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    
                </SidebarGroup>
                <div >
                    <NavMain items={data.navMain} />
                </div>
            </SidebarContent>
            {/* <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent> */}
            {/* <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter> */}
            <SidebarRail />
        </Sidebar>
    )
}
