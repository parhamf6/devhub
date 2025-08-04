// ToolsListWithSearchParams.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { ToolCard } from '@/components/tool-card'
import { motion } from 'framer-motion'

export default function ToolsListWithSearchParams({
  favorites,
  search,
  toggleFavorite,
}: {
  favorites: string[]
  search: string
  toggleFavorite: (slug: string) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = categoryParam ? tool.category === categoryParam : false
      const term = search.toLowerCase()
      const matchSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.slug.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(term))
      return matchCategory && matchSearch
    })
  }, [categoryParam, search])

  if (!categoryParam)
    return <p className="text-center pt-10 text-muted-foreground">Select a category to get started.</p>

  if (filteredTools.length === 0)
    return <p className="text-muted-foreground text-center pt-10">No tools found.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
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
