"use client";

import { useEffect, useMemo, useState } from "react";
import { tools as allTools } from "@/lib/tools/toolDate"
import { ToolCard, ToolCardProps } from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashbaordToolsSection() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // NEW

  useEffect(() => {
    const stored = localStorage.getItem("devhub-favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];

    setFavorites(updated);
    localStorage.setItem("devhub-favorites", JSON.stringify(updated));
  };

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const term = search.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(term));

      const isFavorite = favorites.includes(tool.slug);

      return matchesSearch && (!showOnlyFavorites || isFavorite);
    });
  }, [search, favorites, showOnlyFavorites]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <h1 className="text-3xl font-bold text-center">🛠️ All Tools</h1>
          <Button 
          onClick={() => setShowOnlyFavorites((prev) => !prev)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              showOnlyFavorites
                ? "bg-secondary text-background border-secondary"
                : "bg-transparent text-secondary border-secondary hover:bg-accent hover:text-background"
            } transition`}
          >
            {showOnlyFavorites ? "★ Favorites" : "☆ Show Favorites"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, tag, category..."
            className="max-w-sm h-[48px] w-[512px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.slug}
            whileHover={{ scale: 1.03 }}
            className="relative"
          >
            <ToolCard
              {...tool}
              withFavoriteToggle
              isFavorite={favorites.includes(tool.slug)}
              onToggleFavorite={() => toggleFavorite(tool.slug)}
            />
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <p className="text-muted-foreground text-center pt-10">
          No tools found.
        </p>
      )}
    </div>
  );
}
