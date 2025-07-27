import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/dashboard/components/app-sidebar"
import DashboardNavbar from "@/features/dashboard/components/dashbaord-navbar"
import DevHubSidebar from "@/features/dashboard/components/sidebar"
import { AppSidebarV2 } from "@/features/dashboard/components/sidebarV2/app-sidebarV2"
import { AppSidebarV3 } from "@/features/dashboard/components/sidebarV2/app-sidebarV3"
import { Toaster } from "sonner"
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
        <div className="flex flex-col h-screen w-screen">
            {/* Fixed Navbar on top */}
            <div className="fixed top-0 left-0 right-0 z-50">
            <DashboardNavbar />
            </div>

            {/* Sidebar + Main Content */}
            <div className="flex flex-1 pt-[56px] h-full">
            {/* Make sure AppSidebar doesn't overlap navbar */}
            <div className="h-full">
                <AppSidebar />
                {/* <AppSidebarV2 /> */}
                <AppSidebarV3 />
            </div>

            <main className="flex-1 p-2 overflow-y-auto">
                
                {/* <SidebarTrigger /> */}
                {children}
                <Toaster richColors />
            </main>
            </div>
        </div>
        </SidebarProvider>
        // <main className="">
        //     <DevHubSidebar />
        //     {children}
        // </main>
    )
}
