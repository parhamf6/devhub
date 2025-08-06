'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { tools } from '@/lib/tools/toolDate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TagsToolList from './with-search-params'
import { Collapsible,CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown , ChevronUp } from 'lucide-react'

export default function ToolsTagsPageSection() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [collapsed , setCollapsed] = useState(false)

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

  const tags = useMemo(() => {
    const tagSet = new Set(tools.flatMap((tool) => tool.tags || []))
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [])

  const handleTagClick = (tag: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('tag', tag)
    window.history.pushState({}, '', url)
    window.dispatchEvent(new Event('popstate'))
  }

  const clearTagFilter = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('tag')
    window.history.pushState({}, '', url)
    window.dispatchEvent(new Event('popstate'))
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

      {/* Tags */}
      <Collapsible className=''>
        <CollapsibleTrigger onClick={() => setCollapsed(!collapsed)}>
          <div className='flex  items-center gap-2 border p-4 rounded-2xl border-border'>
            <div>
                <h1>
                See All <span className='text-violet'> Tags</span>
              </h1>
            </div>
            <div>
              {collapsed ? <ChevronDown /> : <ChevronUp />}
              {/* <span className="sr-only">Toggle</span> */}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={clearTagFilter}
              className="ml-2"
            >
              Clear Tag
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tool Cards */}
      <Suspense fallback={<p className="pt-10 text-center">Loading tools...</p>}>
        <TagsToolList
          favorites={favorites}
          search={search}
          toggleFavorite={toggleFavorite}
        />
      </Suspense>
    </div>
  )
}
