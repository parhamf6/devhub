import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardNavbar from "@/features/dashboard/components/dashbaord-navbar"
import { AppSidebarV3 } from "@/features/dashboard/components/sidebarV2/app-sidebarV3"
import { Toaster } from "sonner"
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
        <div className="flex flex-col h-screen w-screen">
            <div className="fixed top-0 left-0 right-0 z-50">
            <DashboardNavbar />
            </div>
            <div className="flex flex-1 pt-[56px] h-full">
            <div className="h-full">
                <AppSidebarV3 />
            </div>
            <main className="flex-1 p-2 overflow-y-auto">
                {children}
                <Toaster richColors />
            </main>
            </div>
        </div>
        </SidebarProvider>
    )
}
