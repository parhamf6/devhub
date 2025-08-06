'use client'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils' // if you have a `cn` helper

type GitHubStarButtonProps = {
  repoUrl: string
  count?: number
  className?: string
}

export const GitHubStarButton = ({ repoUrl, count, className }: GitHubStarButtonProps) => {
    return (
        <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={cn('relative inline-flex', className)}
        >
        <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
            <Button
            variant="outline"
            className="group relative overflow-hidden border border-border px-4 py-2 gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground shadow-md transition-colors duration-300"
            >
            {/* Automatic shine effect every 3 seconds */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
            
            {/* Hover shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
            
            <Github className="h-4 w-4 group-hover:rotate-[15deg] transition-transform duration-300" />
            Star
            {typeof count === 'number' && (
                <span className="ml-2 px-2 rounded-full bg-muted text-muted-foreground text-xs">
                {count.toLocaleString()}
                </span>
            )}
            </Button>
        </Link>
        </motion.div>
    )
}


// // components/GitHubStarButton.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface GitHubStarButtonProps {
//     className?: string;
//     repoUrl?: string;
//     showCount?: boolean;
//     }

// export function GitHubStarButton({ 
//     className, 
//     repoUrl = "https://github.com/your-username/your-repo", 
//     showCount = true 
//     }: GitHubStarButtonProps) {
//     const [starCount, setStarCount] = useState<number | null>(null);
//     const [isHovered, setIsHovered] = useState(false);
//     const [hasStarred, setHasStarred] = useState(false);

//     // Fetch star count (you would replace this with actual API call)
//     useEffect(() => {
//         // In a real implementation, you would fetch from GitHub API
//         // For demo purposes, we'll use a placeholder
//         const fetchStarCount = async () => {
//         try {
//             // Example API call (you would replace with your actual repo)
//             // const response = await fetch(`https://api.github.com/repos/your-username/your-repo`);
//             // const data = await response.json();
//             // setStarCount(data.stargazers_count);
            
//             // For demo purposes
//             setStarCount(42);
//         } catch (error) {
//             console.error("Error fetching star count:", error);
//             setStarCount(null);
//         }
//         };

//         fetchStarCount();
//     }, []);

//     const handleClick = () => {
//         setHasStarred(!hasStarred);
//         if (!hasStarred && starCount !== null) {
//         setStarCount(starCount + 1);
//         } else if (hasStarred && starCount !== null) {
//         setStarCount(starCount - 1);
//         }
//         window.open(repoUrl, "_blank");
//     };

//     return (
//         <Button
//         variant="outline"
//         size="sm"
//         className={cn(
//             "group relative overflow-hidden border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]",
//             className
//         )}
//         onClick={handleClick}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         >
//         {/* Background animation overlay */}
//         <motion.div
//             className="absolute inset-0 bg-[var(--primary)]"
//             initial={{ x: "-100%" }}
//             animate={{ x: isHovered ? "0%" : "-100%" }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//         />

//         <div className="relative flex items-center gap-1.5">
//             {/* Star icon with animation */}
//             <motion.div
//             animate={{
//                 rotate: hasStarred ? [0, 360] : 0,
//                 scale: isHovered ? 1.2 : 1,
//             }}
//             transition={{ 
//                 rotate: { duration: 0.5, ease: "easeInOut" },
//                 scale: { duration: 0.2, ease: "easeInOut" }
//             }}
//             >
//             <Star
//                 className={cn(
//                 "h-4 w-4 transition-colors duration-300",
//                 hasStarred ? "fill-yellow-400 text-yellow-400" : "text-[var(--foreground)] group-hover:text-[var(--primary-foreground)]"
//                 )}
//             />
//             </motion.div>

//             {/* Star count */}
//             {showCount && starCount !== null && (
//             <motion.span
//                 className="text-xs font-medium"
//                 animate={{ 
//                 scale: hasStarred ? [1, 1.2, 1] : 1,
//                 opacity: isHovered ? 1 : 0.9
//                 }}
//                 transition={{ scale: { duration: 0.3 } }}
//             >
//                 {starCount}
//             </motion.span>
//             )}
//         </div>

//         {/* Tooltip on hover */}
//         <motion.div
//             className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[var(--popover)] px-2 py-1 text-xs text-[var(--popover-foreground)] shadow-md"
//             initial={{ opacity: 0, y: 5 }}
//             animate={{ 
//             opacity: isHovered ? 1 : 0, 
//             y: isHovered ? 0 : 5 
//             }}
//             transition={{ duration: 0.2 }}
//         >
//             {hasStarred ? "Unstar on GitHub" : "Star on GitHub"}
//         </motion.div>
//         </Button>
//     );
// }