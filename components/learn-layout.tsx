// components/learn-layout.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MDXPost } from '@/lib/mdx'
import Navbar from './navbar'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { FolderIcon , MenuIcon } from 'lucide-react'

interface LearnLayoutProps {
  children: React.ReactNode
  posts: MDXPost[]
  currentSlug?: string
}

export default function LearnLayout({ children, posts, currentSlug }: LearnLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Group posts by category and organize by folder structure
  const postsByCategory = posts.reduce((acc, post) => {
    const category = post.frontMatter.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(post)
    return acc
  }, {} as Record<string, MDXPost[]>)

  // Helper function to organize posts by folder structure
  const organizeByFolder = (posts: MDXPost[]) => {
    const organized: { [key: string]: MDXPost[] } = {}
    posts.forEach(post => {
      const parts = post.slug.split('/')
      if (parts.length > 1) {
        const folder = parts[0]
        if (!organized[folder]) {
          organized[folder] = []
        }
        organized[folder].push(post)
      } else {
        if (!organized['_root']) {
          organized['_root'] = []
        }
        organized['_root'].push(post)
      }
    })
    return organized
  }

  const isActive = (slug: string) => pathname === `/learn/${slug}`

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Mobile Sidebar Trigger */}
        <div className="lg:hidden p-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open sidebar">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar postsByCategory={postsByCategory} organizeByFolder={organizeByFolder} isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-card min-h-screen">
          <Sidebar postsByCategory={postsByCategory} organizeByFolder={organizeByFolder} isActive={isActive} />
        </aside>
        {/* Main Content */}
        <div className="flex lg:pl-0">
          {/* Breadcrumbs */}
          {currentSlug && (
            <div className="bg-primary border-b border-border px-6 py-4">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/learn" className="hover:text-accent">
                      Learn
                    </Link>
                  </li>
                  <li>
                    <span className="">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">
                      {posts.find(p => p.slug === currentSlug)?.frontMatter.title}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          )}
          <main className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

// Sidebar component using shadcn/ui style
function Sidebar({ postsByCategory, organizeByFolder, isActive, onNavigate }: {
  postsByCategory: Record<string, MDXPost[]>,
  organizeByFolder: (posts: MDXPost[]) => Record<string, MDXPost[]>,
  isActive: (slug: string) => boolean,
  onNavigate?: () => void
}) {
  return (
    <nav className="px-6 space-y-6 max-h-screen overflow-y-auto pb-20">
      {Object.entries(postsByCategory).map(([category, categoryPosts]) => {
        const organizedPosts = organizeByFolder(categoryPosts)
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold pt-4 uppercase tracking-wide mb-3">
              {category}
            </h3>
            {/* Root level posts */}
            {organizedPosts['_root'] && (
              <ul className="space-y-2 mb-4">
                {organizedPosts['_root'].map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/learn/${post.slug}`}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(post.slug)
                          ? 'font-medium bg-muted'
                          : 'hover:text-accent'
                      }`}
                      onClick={onNavigate}
                    >
                      {post.frontMatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {/* Folder-organized posts */}
            {Object.entries(organizedPosts).map(([folder, folderPosts]) => {
              if (folder === '_root') return null
              return (
                <div key={folder} className="mb-4">
                  <h4 className="text-xs font-medium uppercase tracking-wide mb-2 px-3">
                    📁 {folder}
                  </h4>
                  <ul className="space-y-1 ml-3 border-l border-border pl-3">
                    {folderPosts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/learn/${post.slug}`}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(post.slug)
                              ? 'font-medium bg-muted'
                              : 'hover:text-accent'
                          }`}
                          onClick={onNavigate}
                        >
                          {post.frontMatter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}