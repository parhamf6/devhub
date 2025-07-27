// "use client"

// import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Menu } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
export default function DashboardNavbar() {
    // const isMobile = useIsMobile()

    return (
        <header className="flex items-center justify-between px-4 py-2 border-b bg-background shadow-sm h-[56px]">
        {/* Left: Logo or Title */}
        <SidebarTrigger />
        <Link href="/" className="text-primary-500 text-xl font-bold hover:text-accent transition-colors duration-300">
            DH
        </Link>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Settings button (could open a modal or dropdown later) */}
            {/* <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            </Button> */}

            {/* Optional: Mobile menu button if your sidebar is collapsible */}
            {/* {isMobile && (
            <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
            </Button>
            )} */}
        </div>
        </header>
    )
}
