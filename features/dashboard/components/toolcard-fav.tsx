"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";

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
  onToggleFavorite?: () => void;
};

export const ToolCardFav: React.FC<ToolCardProps> = ({
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
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
    setIsFavorite(stored.includes(slug));
  }, [slug]);

  useEffect(() => {
    // Check if device is mobile
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
    const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
    let updated;
    if (stored.includes(slug)) {
      updated = stored.filter((s: string) => s !== slug);
    } else {
      updated = [...stored, slug];
    }
    localStorage.setItem("devhub-favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
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

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="flex flex-col justify-between p-5 bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-[320px] h-[300px]">
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1 rounded-full transition-colors z-10 ${
                    isFavorite
                      ? "text-yellow-500 bg-yellow-500/10"
                      : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                  }`}
                  onClick={toggleFavorite}
                  title={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Star
                    className="w-5 h-5"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
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
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                +{tags.length - 3}
              </Badge>
            )}
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
                      <DialogTitle className="flex items-center gap-2">
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