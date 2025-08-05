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
  onToggleFavorite?: () => void;
  needsDialog?: boolean;
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
  needsDialog = false,
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
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="flex flex-col p-5 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-[320px] h-[280px]">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
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
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground mb-4 mt-2 line-clamp-3">
            <p >
            {description}
          </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
            >
              Use <ChevronRight className="w-4 h-4" />
            </Link>

            {needsDialog ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                    <InfoIcon className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {info}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                  variant="secondary"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                    <InfoIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs z-50">
                  <p className="text-sm">{info}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};











// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MoreHorizontal,
//   Eye,
//   ExternalLink,
//   Star,
//   ChevronRight,
//   Heart,
//   InfoIcon
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { getCategoryColor } from "@/lib/tools/categories";
// import { useRouter } from "next/navigation";
// export type ToolCardProps = {
//   name: string;
//   description: string;
//   slug: string;
//   info:string;
//   category: string;
//   icon?: React.ReactNode;
//   version?: string;
//   rating?: number;
//   tags?: string[];
//   withFavoriteToggle?: boolean;
//   isFavorite?: boolean;
//   onToggleFavorite?: () => void;
// };

// export const ToolCard: React.FC<ToolCardProps> = ({
//   name,
//   description,
//   slug,
//   category,
//   icon,
//   version,
//   rating,
//   tags = [],
//   withFavoriteToggle = false,
// }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
//     setIsFavorite(stored.includes(slug));
//   }, [slug]);

//   const toggleFavorite = () => {
//     const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
//     let updated;
//     if (stored.includes(slug)) {
//       updated = stored.filter((s: string) => s !== slug);
//     } else {
//       updated = [...stored, slug];
//     }
//     localStorage.setItem("devhub-favorites", JSON.stringify(updated));
//     setIsFavorite(!isFavorite);
//   };
//   return (
//     <motion.div
//       whileHover={{  }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       className="relative"
//     >
//       <div
//         className="flex flex-col gap-4 border border-border rounded-[16px] justify-between p-4 w-[320px] h-[320px] bg-card
//           hover:border-secondary transition-colors duration-300"
//       >
//         {/* Top row: name + category + dropdown */}
//         <div className="flex justify-between w-full items-start">
//           <div className="flex gap-2 items-center">
//             {/* {icon ?? (
//               <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
//                 {name[0]}
//               </div>
//             )} */}
//             {/* Favorite star */}
//             {withFavoriteToggle && (
//                 <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={` p-1 rounded-full transition-colors z-10 ${
//                     isFavorite ? "text-yellow-500 bg-background" : "text-muted-foreground hover:text-yellow-500"
//                 }`}
//                 onClick={toggleFavorite}
//                 title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//                 >
//                 <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
//                 </motion.button>
//             )}
//             <div className="flex flex-col">
//               <h2 className="text-xl font-semibold leading-tight">{name}</h2>
//               <div className="text-sm text-muted-foreground">
//                 {/* <Link href={`/dashboard/tools/categories?category=${category}`} className="hover:underline">
//                   {category}
//                 </Link> */}
//                 {version && <span className="">v{version}</span>}
//               </div>
//             </div>
//           </div>
//           <div className={`inline-flex items-center px-2 py-1 rounded-[8px] text-xs font-medium border ${getCategoryColor(category)}`}>
//             <Link href={`/dashboard/tools/categories?category=${category}`} className="hover:underline">
//               {category}
//             </Link>
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

//         {/* Tags */}
//         <div className="flex flex-wrap gap-1">
//           {tags.map((tag) => (
//             <Link href={`/dashboard/tools/tags?tag=${tag}`} key={tag}>
//               <Badge
//                 variant="secondary"
//                 className="text-xs hover:bg-accent hover:text-background transition-colors"
//               >
//                 #{tag}
//               </Badge>
//             </Link>
//           ))}
//         </div>

//         {/* buttons */}
//         <div className="flex gap-2 items-center justify-between">
//           <div className=" bg-gradient-to-br from-primary to-muted 
//           border-2 hover:scale-105 border-border p-2 rounded-[8px] w-[150px]
//           text-sm font-medium duration-300 transition-transform">
//           {/* <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center">
//             Use {name} <ChevronRight className="w-4 h-4" />
//           </Link> */}
//           <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center"
//             onMouseEnter={() => router.prefetch(`/dashboard/tools/${slug}`) }
//           >
//             Use <ChevronRight className="w-4 h-4" />
//           </Link>
//           </div>
//           <div className=" bg-gradient-to-br from-secondary to-muted border-2 hover:scale-105 
//             border-border p-2 rounded-[8px] w-[150px]
//             text-sm font-medium duration-300 transition-transform">
//             {/* <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center">
//               Use {name} <ChevronRight className="w-4 h-4" />
//             </Link> */}
//             <Link href={`/dashboard/tools/${slug}`} className="flex gap-2 items-center justify-center"
//               onMouseEnter={() => router.prefetch(`/dashboard/tools/${slug}`) }
//             >
//               info <InfoIcon className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
