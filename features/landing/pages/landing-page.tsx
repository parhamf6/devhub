"use client"

import { motion , Variants } from "framer-motion";
import { useTheme } from "next-themes"
import HeroSection from "../ui/hero-section/hero-section";
import FeatureSection from "../ui/feature-section/feature-section";
import ExploreToolsSection from "../ui/explor-tools-section/explore-tools-section";
import ExploreMoreSection from "../ui/explore-more-section/explore-more-section";
import { FaqsSection } from "../ui/faq-section/faq-sections";
import DotExpansion from "@/components/dividers/dot-expantion";
import AnimatedWave from "@/components/dividers/animated-wave";
import GeometricExpansion from "@/components/dividers/geometric-expansion";
import SparkleExpansion from "@/components/dividers/sparkle-expansion";


export default function LandingPage() {
    const { theme, setTheme } = useTheme()

    // Animation variants for different entrance effects
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

    const fadeInVariant: Variants = {
        hidden: { 
            opacity: 0,
            scale: 0.95
        },
        visible: { 
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.7,
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

    const slideInRightVariant: Variants = {
        hidden: { 
            opacity: 0, 
            x: 60 
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

    const staggerContainerVariant: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    return (
        <div className="">

            <motion.div 
                className="md:mr-24 md:ml-24 sm:mr-32 sm:ml-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 1,
                    scale: { type: "tween", visualDuration: 0.4, bounce: 0.5 },
                }}
            >
                {/* Hero Section - First to appear with fade up */}
                <motion.div
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <HeroSection />
                </motion.div>
                <DotExpansion/>
                
                {/* Feature Section - Slide in from left */}
                <motion.div
                    variants={slideInLeftVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    
                >
                    <FeatureSection  />
                </motion.div>
                <AnimatedWave />
                

                {/* Explore Tools Section - Fade in with scale */}
                <motion.div
                    variants={fadeInVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <ExploreToolsSection />
                </motion.div>
                <GeometricExpansion />
                
                {/* Explore More Section - Slide in from right */}
                <motion.div
                    variants={slideInRightVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <ExploreMoreSection />
                </motion.div>
                <SparkleExpansion />
                {/* FAQ Section - Staggered fade up */}
                <motion.div
                    variants={staggerContainerVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <FaqsSection />
                </motion.div>
            </motion.div>
        </div>
    );
}
