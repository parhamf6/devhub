// ToolsCategoriesPageSection.tsx
'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ToolsListWithSearchParams from './tools-with-search-params'

export default function ToolsCategoriesPageSection() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('devhub-favorites')
    if (stored) setFavorites(JSON.parse(stored))
  }, [])

  const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug]

    setFavorites(updated)
    localStorage.setItem('devhub-favorites', JSON.stringify(updated))
  }

  const [search, setSearch] = useState('')
  const categories = useMemo(() => {
    const set = new Set(tools.map((tool) => tool.category))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tools Categories</h1>
        {/* <Input
          placeholder="Search by name, tag, category..."
          className="max-w-sm h-[48px] w-full sm:w-[512px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set('category', cat)
              window.history.pushState({}, '', url)
              window.dispatchEvent(new Event('popstate'))
            }}
          >
            {cat}
          </Button>
        ))}
        <Button
          variant="ghost"
          onClick={() => {
            const url = new URL(window.location.href)
            url.searchParams.delete('category')
            window.history.pushState({}, '', url)
            window.dispatchEvent(new Event('popstate'))
          }}
          className="ml-2"
        >
          Clear Tag
        </Button>
      </div>

      {/* Tools List with Suspense */}
      <Suspense fallback={<p className="pt-10 text-center">Loading tools...</p>}>
        <ToolsListWithSearchParams
          favorites={favorites}
          search={search}
          toggleFavorite={toggleFavorite}
        />
      </Suspense>
    </div>
  )
}
