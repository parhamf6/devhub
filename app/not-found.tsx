"use client"

import { motion } from "framer-motion"
import { Code2, Github, Home, Search, Terminal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import { FooterV2 } from "@/components/global/footer-v2"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {/* <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Dev Hub</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                Community
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header> */}
    <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="text-[12rem] md:text-[16rem] font-bold text-muted/20 leading-none select-none">
                404
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20">
                <Terminal className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Looks like this page got lost in the code. Let's get you back to building amazing things.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="min-w-[160px] bg-transparent">
                <Link href="/dashboard">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
              Popular Destinations
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                <Link href="/about" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">About</h3>
                      <p className="text-sm text-muted-foreground">Look About who we are</p>
                    </div>
                  </div>
                </Link>
              </Card>

              {/* <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                <Link href="/community" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Github className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">About</h3>
                      <p className="text-sm text-muted-foreground">Look Who We Are</p>
                    </div>
                  </div>
                </Link>
              </Card> */}

              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                <Link href="/support" className="block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <Terminal className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">Contact</h3>
                      <p className="text-sm text-muted-foreground">Get help & report issues</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2024 Dev Hub. Open source and community driven.</p>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="https://github.com/devhub" className="hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
      <div className="mt-32">
        <FooterV2 />
      </div>
    </div>
  )
}
