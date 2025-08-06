"use client"
import Navbar from "@/components/navbar"
import { TimelineDemo } from "./components/timeline-main"
import { Target ,Rocket } from "lucide-react"
import DotExpansion from "@/components/dividers/dot-expantion"
import { motion , Variants } from "framer-motion";
import BlurText from "../../components/text-animation/text-animation"
import { FooterV2 } from "@/components/global/footer-v2"

export default function AboutSection() {
    const fadeUpVariant: Variants = {
        hidden: { 
            opacity: 0, 
            y: 60 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }
    const slideInLeftVariant: Variants = {
        hidden: { 
            opacity: 0, 
            x: -60 
        },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }
    return(
        <main>
            <Navbar />
            <div>
                <div className="flex flex-col flex-wrap gap-16 p-8 m-8 items-center justify-center">
                    <div className="text-6xl font-bold text-center">
                        {/* <h1>About Us</h1> */}
                        <BlurText
                        text="About Us"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-6xl font-bold text-center"
                        />
                    </div>
                    
                        
                    <div className="text-xl text-center">
                        {/* <p >We are Dev hub, this is a persoinal project that start to be a help
                            and a tool for every developer around the world
                        </p> */}
                        <BlurText
                        // text="We are Dev hub, this is a persoinal project that start to be a help and a tool for every developer around the world"
                        text="DevHub exists to support your growth — one tool and one idea at a time."
                        delay={50}
                        animateBy="words"
                        direction="top"
                        className="text-xl text-center"
                    />
                    </div>
                    
                </div>
                <motion.div
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-8">
                    <div className="flex flex-col gap-6 border border-border rounded-[32px] 
                    mr-2 ml-2 sm:overflow-y-scroll md:overflow-y-hidden p-4 w-[420px] h-[320px]
                        hover:border-secondary transition-colors duration-300 bg-card">
                        <Rocket size={42} className="text-teal"/>
                        <h1 className="text-4xl text-teal">Our Mission</h1>
                        <p className="text-muted-foreground">
                            At DevHub, our mission is to empower developers, learners, and makers by building a centralized hub of high-quality tools and community-driven resources.
                            Whether you're writing your first line of code or launching your own project.
                            </p>
                    </div>
                    <div className="flex flex-col gap-6 border border-border rounded-[32px] 
                    mr-2 ml-2 sm:overflow-y-scroll md:overflow-y-hidden p-4 w-[420px] h-[320px]
                        hover:border-secondary transition-colors duration-300 bg-card">
                        <Target size={42} className="text-coral"/>
                        <h1 className="text-4xl text-coral">Our Vision</h1>
                        <p className="text-muted-foreground"> 
                            Our goal is to break down complexity and help developers stay focused.
                            In the long run, DevHub aims to become an open ecosystem of tools, guides, and innovations that make software development smarter and more accessible to everyone around the world.
                            </p>
                    </div>
                </motion.div>
                <DotExpansion />
                <motion.div
                    variants={slideInLeftVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    id="changelog"
                >   
                    <TimelineDemo />
                </motion.div>
            </div>
            <div className="mt-32">
                <FooterV2/>
            </div>
        </main>
    )
}