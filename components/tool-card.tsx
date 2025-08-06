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



// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
// import {
//   Star,
//   ChevronRight,
//   InfoIcon,
//   ExternalLink,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { getCategoryColor } from "@/lib/tools/categories";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";

// export type ToolCardProps = {
//   name: string;
//   description: string;
//   slug: string;
//   info: string;
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
//   info,
//   category,
//   icon,
//   version,
//   rating,
//   tags = [],
//   withFavoriteToggle = false,
// }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("devhub-favorites") || "[]");
//     setIsFavorite(stored.includes(slug));
//   }, [slug]);

//   useEffect(() => {
//     const checkMobile = () => {
//       const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
//         || window.innerWidth < 768;
//       setIsMobile(isMobileDevice);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const toggleFavorite = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
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

//   const handleInfoClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isMobile) {
//       setIsInfoDialogOpen(true);
//     }
//   };

//   const InfoButton = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
//     <Button 
//       {...props}
//       ref={ref}
//       variant="ghost"
//       size="sm"
//       className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
//       onClick={handleInfoClick}
//     >
//       <InfoIcon className="w-4 h-4" />
//     </Button>
//   ));

//   return (
//     <TooltipProvider>
//       <motion.div
//         whileHover={{ y: -2, scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400, damping: 25 }}
//         className="relative group"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="relative flex flex-col p-6 bg-gradient-to-br from-card to-card/95 border border-border rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 w-[340px] h-[320px] backdrop-blur-sm">
          
//           {/* Gradient overlay on hover */}
//           <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
//           {/* Header with favorite and info */}
//           <div className="relative flex justify-between items-start mb-5">
//             <div className="flex-1">
//               <div className="flex items-start justify-between mb-2">
//                 <h2 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
//                   {name}
//                 </h2>
//                 <div className="flex items-center gap-1 ml-3">
//                   {/* Info Button */}
//                   <>
//                     {/* Mobile Dialog */}
//                     <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
//                       <DialogTrigger asChild>
//                         <div style={{ display: isMobile ? 'block' : 'none' }}>
//                           <InfoButton />
//                         </div>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-md">
//                         <DialogHeader>
//                           <DialogTitle className="flex items-center gap-2">
//                             <InfoIcon className="w-5 h-5 text-primary" />
//                             About {name}
//                           </DialogTitle>
//                         </DialogHeader>
//                         <DialogDescription className="text-sm leading-relaxed">
//                           {info}
//                         </DialogDescription>
//                       </DialogContent>
//                     </Dialog>

//                     {/* Desktop Tooltip */}
//                     <div style={{ display: isMobile ? 'none' : 'block' }}>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <InfoButton />
//                         </TooltipTrigger>
//                         <TooltipContent className="max-w-xs z-50">
//                           <p className="text-sm">{info}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </div>
//                   </>
                  
//                   {/* Favorite Button */}
//                   {withFavoriteToggle && (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       className={`h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center ${
//                         isFavorite
//                           ? "text-yellow-500 bg-yellow-500/15 shadow-sm"
//                           : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
//                       }`}
//                       onClick={toggleFavorite}
//                       title={isFavorite ? "Remove from favorites" : "Add to favorites"}
//                     >
//                       <Star
//                         className="w-4 h-4 transition-transform duration-200"
//                         fill={isFavorite ? "currentColor" : "none"}
//                       />
//                     </motion.button>
//                   )}
//                 </div>
//               </div>
              
//               {/* Category and Version */}
//               <div className="flex items-center gap-3 flex-wrap">
//                 <Link
//                   href={`/dashboard/tools/categories?category=${category}`}
//                   className="group/category"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 group-hover/category:scale-105 ${getCategoryColor(category)}`}>
//                     {category}
//                     <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover/category:opacity-100 transition-opacity duration-200" />
//                   </div>
//                 </Link>
//                 {version && (
//                   <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
//                     v{version}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="relative mb-5">
//             <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
//               {description}
//             </p>
//             <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
//           </div>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-6">
//             {tags.slice(0, 4).map((tag) => (
//               <Link href={`/dashboard/tools/tags?tag=${tag}`} key={tag} className="group/tag">
//                 <Badge
//                   variant="secondary"
//                   className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 group-hover/tag:scale-105"
//                 >
//                   #{tag}
//                 </Badge>
//               </Link>
//             ))}
//             {tags.length > 4 && (
//               <Badge
//                 variant="outline"
//                 className="text-xs text-muted-foreground border-dashed"
//               >
//                 +{tags.length - 4} more
//               </Badge>
//             )}
//           </div>

//           {/* Action Button */}
//           <div className="mt-auto">
//             <Link
//               href={`/dashboard/tools/${slug}`}
//               onMouseEnter={() => router.prefetch(`/dashboard/tools/${slug}`)}
//               className="group/button w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary/90 rounded-2xl hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/25"
//               >
//                 <span>Use Tool</span>
//                 <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
//               </motion.div>
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     </TooltipProvider>
//   );
// };


