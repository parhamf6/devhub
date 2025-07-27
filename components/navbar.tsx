"use client"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, User, ChevronDown, Home, BarChart3, BookOpen, Heart, Grid3X3, Info, Mail, Shield, LogIn, UserPlus , Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import GithubButton from "./ui/github-icon"
import { UserIcon } from "./animated-icons/user-icon"
import { GithubIcon } from "./animated-icons/github-icon"


const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Learn", href: "/learn", icon: BookOpen },
    { name: "Support", href: "/support", icon: Heart },
]

const moreLinks = [
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Privacy", href: "/privacy", icon: Shield },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [moreOpen, setMoreOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border font-['Poppins',sans-serif]">
        <nav className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="text-primary-500 text-xl font-bold hover:text-accent transition-colors duration-300">
                DH
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-4 items-center">
                {navLinks.map(link => (
                        <motion.div
                        key={link.href}
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "tween", stiffness: 400, damping: 10  }}
                        className="relative"
                        >
                            <Link
                                href={link.href}
                                className="group flex items-center gap-2 text-foreground text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:text-primary"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.name}
                                <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                                />
                            </Link>
                    </motion.div>
                ))}

                {/* More Hover Dropdown */}
                <div className="relative group">
                    <motion.div
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "tween"}}
                    >
                        <Button
                            variant="ghost"
                            className="group flex items-center gap-2 text-foreground font-medium px-3 py-2 transition-all duration-200"
                            onMouseEnter={() => setMoreOpen(true)}
                            onMouseLeave={() => setMoreOpen(false)}
                        >
                            <Grid3X3 className="w-4 h-4" />
                            More
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </motion.div>
                    
                    <div 
                    className={`absolute top-full bg-background bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-lg rounded-lg py-2 w-48 z-50 border transition-all duration-100 ${
                        moreOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                    onMouseEnter={() => setMoreOpen(true)}
                    onMouseLeave={() => setMoreOpen(false)}
                    >
                        {moreLinks.map(link => (
                            <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:text-primary transition-colors duration-150"
                            >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                            </Link>
                        ))}
                    </div>
            </div>

            <div className="flex gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />
            
                <div>
                    <Button variant="ghost" size="icon" className="relative">
                        <GithubIcon />
                    </Button>
                </div>

                {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                            {/* <User className=" w-4 h-4" /> */}
                            <UserIcon />
                            </div>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href="/login" className="flex items-center gap-2 cursor-pointer">
                            <LogIn className="w-4 h-4" />
                            Login
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/signup" className="flex items-center gap-2 cursor-pointer">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                            </Link>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Nav Trigger */}
            <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />

            <div>
                <Button variant="ghost" size="icon" className="relative">
                    <Github />
                </Button>
            </div>
            
            {/* Mobile Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <div className="w-8 h-8  rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <User className=" w-4 h-4" />
                    </div>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center gap-2 cursor-pointer">
                    <LogIn className="w-4 h-4" />
                    Login
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/signup" className="flex items-center gap-2 cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                    </Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="text-foreground" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full h-full p-0 bg-background/95 backdrop-blur-md">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                    <Link href="/" className="text-primary text-xl font-bold bg-clip-text">
                        DevHub
                    </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 px-6 py-8">
                    <div className="space-y-4">
                        {navLinks.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                            href={link.href}
                            className="flex items-center gap-3 text-foreground text-lg font-medium py-3 px-4 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                            onClick={() => setOpen(false)}
                            >
                            <link.icon className="w-5 h-5" />
                            {link.name}
                            </Link>
                        </motion.div>
                        ))}

                        {/* More Section */}
                        <div className="pt-6">
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-2 mb-4">
                            <Grid3X3 className="w-5 h-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">More</p>
                            </div>
                            <div className="space-y-2">
                            {moreLinks.map((link, index) => (
                                <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (navLinks.length + index) * 0.1 }}
                                >
                                <Link
                                    href={link.href}
                                    className="flex items-center gap-3 text-foreground text-base py-2 px-4 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                                    onClick={() => setOpen(false)}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                                </motion.div>
                            ))}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t">
                    <div className="flex items-center justify-center gap-4">
                        <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors duration-200"
                        onClick={() => setOpen(false)}
                        >
                        <LogIn className="w-4 h-4" />
                        Login
                        </Link>
                        <Link
                        href="/signup"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        onClick={() => setOpen(false)}
                        >
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                        </Link>
                    </div>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </nav>
        </header>
    )
}