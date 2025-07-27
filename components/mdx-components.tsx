// components/mdx-components.tsx
import React from 'react'
import Image from 'next/image'

// Custom Callout Component
interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-r-lg ${styles[type]}`}>
      {children}
    </div>
  )
}

// Custom CodeBlock Component
interface CodeBlockProps {
  language?: string
  children: React.ReactNode
}

export function CodeBlock({ language = 'javascript', children }: CodeBlockProps) {
  return (
    <div className="mb-4">
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg">
        {language}
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )
}

// Custom Image Component
interface CustomImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function CustomImage({ src, alt, caption, width = 800, height = 400 }: CustomImageProps) {
  return (
    <figure className="mb-6">
      <Image 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className="w-full rounded-lg shadow-lg" 
      />
      {caption && (
        <figcaption className="text-gray-600 text-sm mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// MDX Components mapping
export const mdxComponents = {
  // HTML elements
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4" {...props}>
      {children}
    </blockquote>
  ),
  
  // Custom components
  Callout,
  CodeBlock,
  Image: CustomImage,
}