"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  ExternalLink,
  Star,
  ChevronRight,
  Heart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryColor } from "@/lib/tools/categories";
import { useRouter } from "next/navigation";
export type ToolCardProps = {
  name: string;
  description: string;
  slug: string;
  category: string;
  icon?: React.ReactNode;
  version?: string;
  rating?: number;
  tags?: string[];
  withFavoriteToggle?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  slug,
  category,
  icon,
  version,
  rating,
  tags = [],
  withFavoriteToggle = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
    setIsFavorite(stored.includes(slug));
  }, [slug]);

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
  return (
    <motion.div
      whileHover={{  }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative"
    >
      <div
        className="flex flex-col gap-4 border border-border rounded-[16px] justify-between p-4 w-[320px] h-[320px] bg-card
          hover:border-secondary transition-colors duration-300"
      >
        {/* Top row: name + category + dropdown */}
        <div className="flex justify-between w-full items-start">
          <div className="flex gap-2 items-center">
            {/* {icon ?? (
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {name[0]}
              </div>
            )} */}
            {/* Favorite star */}
            {withFavoriteToggle && (
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={` p-1 rounded-full transition-colors z-10 ${
                    isFavorite ? "text-yellow-500 bg-background" : "text-muted-foreground hover:text-yellow-500"
                }`}
                onClick={toggleFavorite}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                </motion.button>
            )}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold leading-tight">{name}</h2>
              <div className="text-sm text-muted-foreground">
                {/* <Link href={`/dashboard/tools/categories?category=${category}`} className="hover:underline">
                  {category}
                </Link> */}
                {version && <span className="">v{version}</span>}
              </div>
            </div>
          </div>
            
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/tools/${slug}`}>
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Learn
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.share?.({ title: name, url: `/tools/${slug}` })}
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Share
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" /> Report Issue
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <div className={`inline-flex items-center px-2 py-1 rounded-[8px] text-xs font-medium border ${getCategoryColor(category)}`}>
            <Link href={`/dashboard/tools/categories?category=${category}`} className="hover:underline">
              {category}
            </Link>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Link href={`/dashboard/tools/tags?tag=${tag}`} key={tag}>
              <Badge
                variant="secondary"
                className="text-xs hover:bg-accent hover:text-background transition-colors"
              >
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Use button */}
        <div className=" bg-gradient-to-br from-primary to-muted border-2 hover:scale-105 border-border p-2 rounded-[16px]
        text-sm font-medium   duration-300 transition-transform">
          {/* <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center">
            Use {name} <ChevronRight className="w-4 h-4" />
          </Link> */}
          <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center"
            onMouseEnter={() => router.prefetch(`/dashboard/tools/${slug}`) }
          >
            Use {name} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
