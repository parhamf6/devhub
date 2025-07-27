// lib/mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface FrontMatter {
  title: string
  description: string
  tags: string[]
  category: string
  publishedAt: string
  author?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface MDXContent {
  slug: string
  frontMatter: FrontMatter
  content: React.ReactElement
}

export interface MDXPost {
  slug: string
  frontMatter: FrontMatter
}

const CONTENT_DIR = path.join(process.cwd(), 'content/learn')

// Helper function to recursively read all MDX files
function readMDXFiles(dir: string, baseDir: string = dir): MDXPost[] {
  const posts: MDXPost[] = []
  
  if (!fs.existsSync(dir)) {
    return posts
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // Recursively read subdirectories
      posts.push(...readMDXFiles(itemPath, baseDir))
    } else if (item.endsWith('.mdx')) {
      const fileContent = fs.readFileSync(itemPath, 'utf8')
      const { data } = matter(fileContent)
      
      // Create slug from relative path (remove base directory and .mdx extension)
      const relativePath = path.relative(baseDir, itemPath)
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/') // Handle Windows paths
      
      posts.push({
        slug,
        frontMatter: data as FrontMatter
      })
    }
  }

  return posts
}

export async function getAllPosts(): Promise<MDXPost[]> {
  const posts = readMDXFiles(CONTENT_DIR)
  return posts.sort((a, b) => new Date(b.frontMatter.publishedAt).getTime() - new Date(a.frontMatter.publishedAt).getTime())
}

export async function getPostBySlug(slug: string): Promise<MDXContent | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  const { content: compiledContent } = await compileMDX<FrontMatter>({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
    components: {}, // We'll add components separately
  })

  return {
    slug,
    frontMatter: data as FrontMatter,
    content: compiledContent,
  }
}

export async function getPostsByCategory(category: string): Promise<MDXPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.frontMatter.category === category)
}

export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const categories = new Set(allPosts.map(post => post.frontMatter.category))
  return Array.from(categories).sort()
}