"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Hammer,
  Rocket,
  Code2,
  Sparkles,
  Clock,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Zap,
  Cpu,
  Palette,
} from "lucide-react"
import { TwitterIcon } from "../animated-icons/twitter-icon"
import { GithubIcon } from "../animated-icons/github-icon"
import { FooterV2 } from "./footer-v2"
import { motion , Variants } from "framer-motion";
export default function UnderDevelopmentPage() {
  const [progress, setProgress] = useState(0)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    "Building amazing UI components",
    "Implementing core functionality",
    "Adding smooth animations",
    "Optimizing performance",
    "Testing user experience",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 52 ? 52 : prev + 1))
    }, 80)

    const featureTimer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(featureTimer)
    }
  }, [features.length])


  return (
    <motion.div
    initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
          duration: 1,
          scale: { type: "spring", visualDuration: 1, },
      }}
    className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Status Badge */}
          <div className="animate-bounce-in mt-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Under Development
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Something Amazing
              <br />
              <span className="text-coral">Is Coming Soon</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're crafting an exceptional experience just for you. Our team is working around the clock to bring you
              something truly special.
            </p>
            
          </div>

          {/* Progress Section */}
          <div className="space-y-6 animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
            <div className="bg-card/50 border border-secondary backdrop-blur-sm  rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Development Progress</span>
                <span className="text-sm font-bold text-accent">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span className="animate-pulse">{features[currentFeature]}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                <TwitterIcon className="w-4 h-4 mr-2" />
                Follow Progress
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                <GithubIcon className="w-4 h-4 mr-2" />
                Follow Progress
              </Button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <p className="text-sm text-muted-foreground">
              Expected launch: <span className="font-medium text-foreground">Q4 2025</span>
            </p>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-1/4 left-10 animate-float opacity-20">
            <Cpu className="w-8 h-8 text-primary animate-spin-slow" />
          </div>
          <div className="absolute top-1/3 right-10 animate-float opacity-20" style={{ animationDelay: "1s" }}>
            <Hammer className="w-6 h-6 text-secondary" />
          </div>
          <div className="absolute bottom-1/4 left-1/4 animate-float opacity-20" style={{ animationDelay: "2s" }}>
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div>
        <FooterV2 />
      </div>
    </motion.div>
  )
}
