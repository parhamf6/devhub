"use client"
import React from 'react';
import { motion , Variants} from "framer-motion";
import { 
    Heart, 
    Star, 
    Users, 
    DollarSign, 
    Github, 
    Twitter, 
    MessageSquare, 
    ExternalLink,
    Coffee,
    Sparkles,
    Trophy,
    Share2,
    ArrowRight
} from 'lucide-react';
import Navbar from "@/components/navbar";
import { FooterV2 } from '@/components/global/footer-v2';
// import SpotlightCard from "./spotlight-card";
import { Highlight } from "../../../components/text-animation/hero-highlighter";
import { ReactNode } from "react";

type SpotlightCardProps = {
    children: ReactNode;
    className?: string;
    spotlightColor?: string; // make it optional
};


const SpotlightCard = ({ children, className = "", spotlightColor }: SpotlightCardProps) => (
    <div className={`relative flex items-center justify-between flex-col overflow-hidden bg-card border border-border rounded-[var(--radius)] p-6 hover:border-primary/50 transition-all duration-300 group ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

// const Highlight = ({ children, className }) => (
//   <span className={`bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent ${className}`}>
//     {children}
//   </span>
// );

export default function SupportPage2() {
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
    };

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
    };

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
    };

    const staggerContainer: Variants = {
        hidden: {},
        visible: {
        transition: {
            staggerChildren: 0.2
        }
        }
    };

    const supportOptions = [
    {
        icon: Share2,
        title: "Spread the Love",
        description: "We’d be thrilled if you shared DevHub with your friends and community!",
        details: "We love every single person in our community, and word-of-mouth is the heart of open source growth. Share DevHub on social media, chat with your developer pals, or mention us in your blog posts—you’ll be helping fellow builders discover a place they can call home!",
        action: "Share the Love",
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-500",
        links: [
        { icon: Twitter, label: "Tweet about DevHub", href: "#" },
        { icon: MessageSquare, label: "Share on Discord", href: "#" },
        { icon: Github, label: "Fork & Share", href: "#" }
        ]
    },
    {
        icon: Star,
        title: "Show Some ❤️ on GitHub",
        description: "Star our repository to let us know you’re enjoying DevHub!",
        details: "Every star is a hug from the community—helping us reach more developers and showing support. It’s quick, it’s easy, and it means the world to us!",
        action: "Star DevHub",
        color: "from-yellow-500/20 to-orange-500/20",
        iconColor: "text-yellow-500",
        links: [
        { icon: Github, label: "DevHub Repository", href: "#" },
        { icon: ExternalLink, label: "View Source Code", href: "#" }
        ]
    },
    {
        icon: Trophy,
        title: "Join Our Sponsor Family",
        description: "Become a sponsor and help us build DevHub even better—together.",
        details: "Sponsorship lets us dedicate more time to crafting new features, improving docs, and keeping infrastructure running smoothly. As a sponsor, you’ll get special recognition, sneak peeks, and the chance to shape our future roadmap!",
        action: "Become a Sponsor",
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-500",
        benefits: [
        "Your logo on our homepage",
        "Priority support and feedback",
        "Input on upcoming features",
        "Monthly progress updates"
        ]
    },
    {
        icon: Coffee,
        title: "Buy Us a Coffee",
        description: "Fuel our passion—your donation keeps DevHub thriving!",
        details: "Every bit of support powers hosting costs, new tooling, and lets maintainers spend more time building features you love. We appreciate every cup—and every contributor—big or small!",
        action: "Donate Now",
        color: "from-green-500/20 to-emerald-500/20",
        iconColor: "text-green-500",
        options: [
        "One-time donation",
        "Monthly support",
        "Buy us a coffee",
        "Crypto contributions"
        ]
    }
    ];

    return (
        <main className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            <div className="relative flex flex-col items-center px-4 py-16 md:py-24">
            <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-center max-w-4xl mx-auto"
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <Highlight>You Want to Support Us?</Highlight>
                </h1>
                <motion.p
                variants={slideInRightVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                Here's everything you need to know about helping our open source community thrive and grow together.
                </motion.p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl"
            >
                {[
                { icon: Users, value: "2.5k+", label: "Active Contributors" },
                { icon: Star, value: "15k+", label: "GitHub Stars" },
                { icon: Heart, value: "50+", label: "Sponsors" }
                ].map((stat, index) => (
                <motion.div
                    key={index}
                    variants={fadeUpVariant}
                    className="text-center p-6 bg-card/50 rounded-[var(--radius)] border border-border backdrop-blur-sm"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
                ))}
            </motion.div>
            </div>
        </div>

        {/* Support Options */}
        <div className="px-4 py-16">
            <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
            >
            {supportOptions.map((option, index) => (
                <motion.div
                key={index}
                variants={fadeUpVariant}
                className="group"
                >
                <SpotlightCard className="h-full hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                    <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-[var(--radius)] bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                        <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                        </div>
                        <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {option.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {option.description}
                        </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 mb-6">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {option.details}
                        </p>

                        {/* Additional Info */}
                        {option.stats && (
                        <div className="text-sm font-medium text-primary mb-4">
                            {option.stats}
                        </div>
                        )}

                        {option.benefits && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-foreground mb-2">Benefits:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                            {option.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                                {benefit}
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {option.options && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-foreground mb-2">Options:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                            {option.options.map((optionItem, i) => (
                                <li key={i} className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {optionItem}
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {/* Links */}
                        {option.links && (
                        <div className="space-y-2">
                            {option.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </a>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-[var(--radius)] font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        {option.action}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    </div>
                </SpotlightCard>
                </motion.div>
            ))}
            </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="px-4 py-16"
        >
            <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-[var(--radius)] p-12 text-primary-foreground">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make a Difference?
                </h2>
                <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Every contribution, no matter how small, helps us build better tools for the developer community. Join thousands of supporters who believe in open source!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-foreground text-primary py-3 px-8 rounded-[var(--radius)] font-medium hover:bg-primary-foreground/90 transition-colors"
                >
                    Get Started Today
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-primary-foreground/30 text-primary-foreground py-3 px-8 rounded-[var(--radius)] font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                    Learn More
                </motion.button>
                </div>
            </div>
            </div>
        </motion.div>

        <FooterV2 />
        </main>
    );
}

