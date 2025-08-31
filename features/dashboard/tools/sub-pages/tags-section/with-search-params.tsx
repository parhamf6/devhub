'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { ToolCard } from '@/components/tool-card'
import { motion } from 'framer-motion'

export default function TagsToolList({
  favorites,
  search,
  toggleFavorite,
}: {
  favorites: string[]
  search: string
  toggleFavorite: (slug: string) => void
}) {
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchTag = tagParam ? tool.tags?.includes(tagParam) : false
      const term = search.toLowerCase()
      const matchSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(term))
      return matchTag && matchSearch
    })
  }, [tagParam, search])

  if (!tagParam)
    return <p className="text-center pt-10 text-muted-foreground">Select a tag to get started.</p>

  if (filteredTools.length === 0)
    return <p className="text-muted-foreground text-center pt-10">No tools found.</p>

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
      {filteredTools.map((tool) => (
        <motion.div key={tool.slug} whileHover={{ scale: 1.03 }}>
          <ToolCard
            {...tool}
            withFavoriteToggle
            onToggleFavorite={() => toggleFavorite(tool.slug)}
          />
        </motion.div>
      ))}
    </div>
  )
}
