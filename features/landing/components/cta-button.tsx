'use client';

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Props {
  onClick?: () => void;
  className?: string;
}

const GetStartedButton: React.FC<Props> = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    const handleClick = async () => {
        // Trigger click animation
        await controls.start({
            scale: [1, 0.95, 1.02, 1],
            transition: { duration: 0.3, ease: "easeInOut" }
        });
        
        if (onClick) onClick();
    };

    return (
        <div className="relative inline-block">
            {/* Animated background glow with subtle pulse */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl"
                animate={{
                    opacity: isHovered ? 0.7 : [0.1, 0.2, 0.1],
                    scale: isHovered ? 1.1 : [1, 1.05, 1],
                }}
                transition={{ 
                    opacity: isHovered ? { duration: 0.4, ease: "easeOut" } : {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    scale: isHovered ? { duration: 0.4, ease: "easeOut" } : {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            />
            
            {/* Floating particles */}
            {isHovered && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{ 
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 60 - 30,
                                opacity: 0,
                                scale: 0
                            }}
                            animate={{
                                y: -20,
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                            style={{
                                left: `${20 + (i * 10)}%`,
                                top: '50%'
                            }}
                        />
                    ))}
                </div>
            )}

            <motion.button
                animate={controls}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                className="relative group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-white/20"
                // Subtle breathing animation to draw attention
                initial={{ scale: 1 }}
                whileInView={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                        '0 10px 25px rgba(59, 130, 246, 0.3)',
                        '0 15px 35px rgba(139, 92, 246, 0.4)',
                        '0 10px 25px rgba(59, 130, 246, 0.3)'
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Animated background shine - subtle periodic shine even without hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }}
                    animate={{
                        x: isHovered ? '200%' : [-100, -80, -100]
                    }}
                    transition={{ 
                        duration: isHovered ? 0.8 : 4,
                        ease: "easeInOut",
                        delay: isHovered ? 0.1 : 0,
                        repeat: isHovered ? 0 : Infinity,
                        repeatDelay: 6
                    }}
                />
                
                {/* Ripple effect on hover */}
                <motion.div
                    className="absolute inset-0 bg-white/10 rounded-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Icon with gentle pulse animation */}
                <motion.div
                    animate={{
                        rotate: isHovered ? 360 : [0, 5, -5, 0],
                        scale: isHovered ? 1.1 : [1, 1.05, 1],
                    }}
                    transition={{ 
                        rotate: isHovered ? { duration: 0.6, ease: "easeInOut" } : {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        scale: isHovered ? { duration: 0.2 } : {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }
                    }}
                >
                    <Sparkles className="h-5 w-5" />
                </motion.div>

                {/* Text with subtle bounce */}
                <motion.a
                    animate={{
                        y: isHovered ? -1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    href='/dashboard'
                    className="relative z-10"
                >
                    Get Started
                </motion.a>

                {/* Arrow with gentle bob animation */}
                <motion.div
                    animate={{
                        x: isHovered ? 4 : [0, 2, 0],
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ 
                        x: isHovered ? {
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25 
                        } : {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 3
                        },
                        scale: { duration: 0.2 }
                    }}
                    className="relative z-10"
                >
                    <ArrowRight className="h-5 w-5" />
                </motion.div>

                {/* Gradient border animation */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'exclude',
                        maskComposite: 'exclude'
                    }}
                />
            </motion.button>
        </div>
    );
};

export default GetStartedButton;
