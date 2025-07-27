'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useState , useEffect } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { ToolCard } from '@/components/tool-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function ToolsCategoriesPageSection() {
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
  const categoryParam = searchParams.get('category')
  const [search, setSearch] = useState("")

  const categories = useMemo(() => {
    const set = new Set(tools.map(tool => tool.category))
    return Array.from(set).sort()
  }, [])

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchCategory = categoryParam ? tool.category === categoryParam : false
      const term = search.toLowerCase()
      const matchSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(term))
      return matchCategory && matchSearch
    })
  }, [categoryParam, search])

  const handleCategoryClick = (cat: string) => {
    router.push(`?category=${encodeURIComponent(cat)}`)
  }
  const clearTagFilter = () => {
    router.push(`/dashboard/tools/categories`) // change path if needed
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tools Categories</h1>
        <Input
          placeholder="Search by name, tag, category..."
          className="max-w-sm h-[48px] w-full sm:w-[512px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryParam === cat ? 'default' : 'outline'}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </Button>
        ))}
        {categoryParam && (
          <Button variant="ghost" onClick={clearTagFilter} className="ml-2">
            Clear Tag
          </Button>
        )}
      </div>

      {/* Tools */}
      <div className="pt-6">
        {categoryParam ? (
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
          <p className="text-center pt-10 text-muted-foreground">Select a category to get started.</p>
        )}
      </div>
    </div>
  )
}

