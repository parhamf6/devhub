'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useState , useEffect } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { ToolCard } from '@/components/tool-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function ToolsTagsPageSection() {
    const [favorites , setFavorites] = useState<string[]>([])
      useEffect(() => {
        const stored = localStorage.getItem("devhub-favorites")
        if (stored) setFavorites(JSON.parse(stored))
      }, [])
      const favoriteTools = tools.filter((tool) => favorites.includes(tool.slug))
      const toolsToDisplay = favoriteTools.length > 0 ? favoriteTools : tools
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')
  const [search, setSearch] = useState("")

  // Get all unique tags
  const tags = useMemo(() => {
    const tagSet = new Set(tools.flatMap(tool => tool.tags || []))
    return Array.from(tagSet).sort()
  }, [])

  // Filter tools by selected tag and search
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchTag = tagParam ? tool.tags?.includes(tagParam) : false
      const term = search.toLowerCase()
      const matchSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(term))
      return matchTag && matchSearch
    })
  }, [tagParam, search])

  const handleTagClick = (tag: string) => {
    router.push(`?tag=${encodeURIComponent(tag)}`)
  }

  const clearTagFilter = () => {
    router.push(`/dashboard/tools/tags`) // change path if needed
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tools by Tags</h1>
        <Input
          placeholder="Search by name, tag, category..."
          className="max-w-sm h-[48px] w-full sm:w-[512px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tags filter */}
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map(tag => (
          <Button
            key={tag}
            variant={tagParam === tag ? 'default' : 'outline'}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </Button>
        ))}
        {tagParam && (
          <Button variant="ghost" onClick={clearTagFilter} className="ml-2">
            Clear Tag
          </Button>
        )}
      </div>

      {/* Tool cards */}
      <div className="pt-6">
        {tagParam ? (
          filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <motion.div key={tool.slug} whileHover={{ scale: 1.03 }}>
                    <ToolCard {...tool}
                    withFavoriteToggle 
                    onToggleFavorite={() => toggleFavorite(tool.slug)}/>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center pt-10">No tools found.</p>
          )
        ) : (
          <p className="text-center pt-10 text-muted-foreground">Select a tag to get started.</p>
        )}
      </div>
    </div>
  )
}
