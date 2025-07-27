'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    FacebookIcon,
    InstagramIcon,
    YoutubeIcon,
    Heart,
} from 'lucide-react';
import { FrameIcon } from 'lucide-react';
import { GithubIcon } from '../animated-icons/github-icon';
import { LinkedinIcon } from '../animated-icons/linkedin-icon';
import { TwitterIcon } from '../animated-icons/twitter-icon';

const footerSections = [
    {
        label: 'Project',
        links: [
        { title: 'About Us', href: '/about' },
        { title: 'Blog', href: '/blog' },
        { title: 'Changelog', href: '/changelog' },
        { title: 'Roadmap', href: '/roadmap' },
        ],
    },
    {
        label: 'Community',
        links: [
        { title: 'Join Discord', href: 'https://discord.gg/' },
        { title: 'Join Telegram', href: 'https://discord.gg/' },
        { title: 'GitHub', href: 'https://github.com/' },
        { title: 'Contribute', href: '/contribute' },
        ],
    },
    {
        label: 'Support',
        links: [
        { title: 'FAQs', href: '/FAQs' },
        { title: 'Contact Support', href: '/contact' },
        { title: 'Report a Bug', href: '/bug-report' },
        { title: 'Feedback', href: '/feedback' },
        ],
    },
    {
        label: 'Legal',
        links: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Cookie Settings', href: '/cookies' },
        ],
    },
];

export function FooterV2() {
    return (
        <footer className="relative w-full max-w-7xl mx-auto px-6 py-12 border-t">
        <div className="absolute top-0 left-1/2 w-1/3 h-px bg-muted -translate-x-1/2 blur" />

        <div className="grid gap-10 md:grid-cols-5 xl:gap-16">
            {/* Logo + Description */}
            <AnimatedContainer className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
                <FrameIcon className="size-8 text-primary" />
                <span className="font-bold text-xl">Dev Hub</span>
            </div>
            <p className="text-muted-foreground text-sm">
                Open source tools for developers. Join our community to build the future together.
            </p>

            <div className="flex space-x-4 pt-4">
                <a href="#" aria-label="GitHub"><GithubIcon className="size-5 hover:text-primary" /></a>
                <a href="#" aria-label="X / Twitter"><TwitterIcon className="size-5 hover:text-primary" /></a>
                <a href="#" aria-label="LinkedIn"><LinkedinIcon className="size-5 hover:text-primary" /></a>
            </div>
            </AnimatedContainer>

            {/* Link Groups */}
            <div className="col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerSections.map((section, i) => (
                <AnimatedContainer key={section.label} delay={0.1 + i * 0.1}>
                <h3 className="text-sm font-semibold text-foreground">{section.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {section.links.map((link) => (
                    <li key={link.title}>
                        <a
                        href={link.href}
                        className="hover:text-primary transition-colors duration-300"
                        >
                        {link.title}
                        </a>
                    </li>
                    ))}
                </ul>
                </AnimatedContainer>
            ))}
            </div>
        </div>

        {/* Subscribe */}
        {/* <AnimatedContainer className="mt-12 w-full max-w-lg">
            <h3 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
            Get updates on features and releases.
            </p>
            <form className="flex gap-2">
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition"
            >
                Subscribe
            </button>
            </form>
        </AnimatedContainer> */}

        {/* Bottom Bar */}
        <div className="mt-10 border-t flex flex-col pt-6 text-center text-sm text-muted-foreground">
            <a href='https://portfoblog-front-private.vercel.app/' >
                <span className='hover:text-accent transition-colors duration-300'>Made with Love by Parham.F</span>
            </a>
            © {new Date().getFullYear()} Dev Hub. All rights reserved.
        </div>
        </footer>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: string;
    children: React.ReactNode;
    };

    function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
        initial={{ opacity: 0, translateY: 10, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        className={className}
        >
        {children}
        </motion.div>
    );
}
