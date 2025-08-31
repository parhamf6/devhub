"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ChevronRight,
  InfoIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCategoryColor } from "@/lib/tools/categories";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export type ToolCardProps = {
  name: string;
  description: string;
  slug: string;
  info: string;
  category: string;
  icon?: React.ReactNode;
  version?: string;
  rating?: number;
  tags?: string[];
  withFavoriteToggle?: boolean;
  isFavorite?: boolean;
  type: 'tool' | 'cheatsheet';
  onToggleFavorite?: () => void;
};

export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  slug,
  info,
  category,
  icon,
  version,
  rating,
  tags = [],
  withFavoriteToggle = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
    setIsFavorite(stored.includes(slug));
  }, [slug]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFavorite = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
    let updated;
    if (stored.includes(slug)) {
      updated = stored.filter((s: string) => s !== slug);
    } else {
      updated = [...stored, slug];
    }
    localStorage.setItem("devhub-favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleInfoClick = () => {
    if (isMobile) {
      setIsInfoDialogOpen(true);
    }
  };

  const InfoButton = React.forwardRef<HTMLButtonElement>((props, ref) => (
    <Button 
      {...props}
      ref={ref}
      variant="secondary"
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors"
    >
      <InfoIcon className="w-4 h-5" />
    </Button>
  ));

  // Star animation variants
  const starVariants = {
    inactive: { 
      rotate: 0, 
      scale: 1,
      fill: "none"
    },
    active: { 
      rotate: 360, 
      scale: [1, 1.3, 1],
      fill: "currentColor",
      transition: { 
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    }
  };

  // Button animation variants
  const buttonVariants = {
    idle: { 
      scale: 1,
    },
    hover: { 
      scale: 1.1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.9,
      transition: { duration: 0.1 }
    },
    active: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Particle animation
  const Particle = ({ angle, onComplete }: { angle: number, onComplete: () => void }) => (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: '50%',
        top: '50%',
        backgroundColor: 'var(--warning)',
      }}
      initial={{ 
        opacity: 1, 
        scale: 0,
        x: 0,
        y: 0
      }}
      animate={{
        opacity: 0,
        scale: [0, 1, 0],
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 30,
      }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onComplete}
    />
  );

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="flex flex-col justify-between p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-[320px] h-[300px]">
          {/* Header */}
          <div className="flex justify-between items-start  h-full">
            <div className="flex items-start gap-3">
              <div>
                <h2 className="text-lg font-bold leading-tight">{name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {version && (
                    <span className="text-xs text-muted-foreground">
                      v{version}
                    </span>
                  )}
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getCategoryColor(
                      category
                    )}`}
                  >
                    <Link
                      href={`/dashboard/tools/categories?category=${category}`}
                      className="hover:underline"
                    >
                      {category}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {withFavoriteToggle && (
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  animate={isFavorite ? "active" : "idle"}
                  whileHover="hover"
                  whileTap="tap"
                  className={`p-1 rounded-full transition-colors z-10 relative overflow-hidden ${
                    isFavorite
                      ? "text-[var(--warning)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                  onClick={toggleFavorite}
                  title={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {/* Background glow effect */}
                  {isFavorite && (
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'var(--warning)', opacity: 0.2 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.5 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                  
                  {/* Animated star icon */}
                  <motion.div
                    variants={starVariants}
                    initial="inactive"
                    animate={isFavorite ? "active" : "inactive"}
                  >
                    <Star
                      className="w-5 h-5"
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </motion.div>
                  
                  {/* Particles container */}
                  <AnimatePresence>
                    {!isFavorite && isAnimating && (
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Particle 
                            key={i} 
                            angle={(i / 8) * Math.PI * 2} 
                            onComplete={() => {}} 
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="text-sm text-muted-foreground  h-full mt-2 line-clamp-3">
            <p>
              {description}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 h-full">
            {tags.slice(0, 3).map((tag) => (
              <Link href={`/dashboard/tools/tags?tag=${tag}`} key={tag}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
          
          {/* Buttons */}
          <div className="mt-auto flex gap-2">
            <Link
              href={`/dashboard/tools/${slug}`}
              onMouseEnter={() => router.prefetch(`/dashboard/tools/${slug}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Use <ChevronRight className="w-4 h-4" />
            </Link>
            
            {/* Info Button with conditional behavior */}
            <>
                {/* Mobile Dialog */}
                <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                  <DialogTrigger asChild>
                    <div style={{ display: isMobile ? 'block' : 'none' }} >
                      <span className="text-secondary">
                        <InfoButton />
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-muted-foreground gap-2">
                        <InfoIcon className="w-5 h-5" />
                        About {name}
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm leading-relaxed">
                      {info}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
                
                {/* Desktop Tooltip */}
                <div style={{ display: isMobile ? 'none' : 'block' }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoButton />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50">
                      <p className="text-sm">{info}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
            </>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};