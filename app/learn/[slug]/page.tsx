// app/learn/[...slug]/page.tsx
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getAllPosts, type FrontMatter } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx-components'
import LearnLayout from '@/components/learn-layout'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface PageProps {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const slug = params.slug.join('/')
  const post = await getCompiledPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.frontMatter.title} | DevHub Learn`,
    description: post.frontMatter.description,
    keywords: post.frontMatter.tags.join(', '),
  }
}

// Custom function to compile MDX with components
async function getCompiledPost(slug: string) {
  const filePath = path.join(process.cwd(), 'content/learn', `${slug}.mdx`)
  
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
    components: mdxComponents,
  })

  return {
    slug,
    frontMatter: data as FrontMatter,
    content: compiledContent,
  }
}

export default async function PostPage({ params }: PageProps) {
  const slug = params.slug.join('/')
  const post = await getCompiledPost(slug)
  const allPosts = await getAllPosts()

  if (!post) {
    notFound()
  }

  return (
    <LearnLayout posts={allPosts} currentSlug={slug}>
      <article className="max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.frontMatter.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {post.frontMatter.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.frontMatter.publishedAt}>
              {new Date(post.frontMatter.publishedAt).toLocaleDateString()}
            </time>
            {post.frontMatter.author && (
              <span>by {post.frontMatter.author}</span>
            )}
            {post.frontMatter.difficulty && (
              <span className={`px-2 py-1 rounded text-xs ${
                post.frontMatter.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                post.frontMatter.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {post.frontMatter.difficulty}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.frontMatter.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {post.content}
        </div>
      </article>
    </LearnLayout>
  )
}