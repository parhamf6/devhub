"use client"

// import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Menu } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { GitHubStarButton } from "@/components/github-btn"
import { GithubIcon } from "@/components/animated-icons/github-icon"
import { SearchButtonDash } from "@/features/search/search-btn-dash"
import { tools } from "@/lib/tools/toolDate"
import { useState , useEffect } from "react"
export default function DashboardNavbar() {
    // const isMobile = useIsMobile()
    const allItems = tools
    const [favorites, setFavorites] = useState<string[]>([]);
    useEffect(() => {
          const stored = localStorage.getItem("devhub-favorites");
          if (stored) setFavorites(JSON.parse(stored));
        }, []);
    return (
        <header className="flex items-center justify-between px-4 py-2 border-b bg-background shadow-sm h-[56px]">
        {/* Left: Logo or Title */}
        <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/" className="text-primary-500 text-xl font-bold hover:text-accent transition-colors duration-300">
                DH
            </Link>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />
            <div >
                <Button variant="ghost" size="icon" className="relative">
                    <Link target="_blank" href="https://github.com/parhamf6/devhub">
                        <GithubIcon />
                    </Link>
                </Button>
            </div>
            <SearchButtonDash items={allItems} favorites={favorites} />
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
