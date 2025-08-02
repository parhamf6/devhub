'use client'

import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import 'highlight.js/styles/github-dark.css'

interface EnhancedMarkdownRendererProps {
  content: string
}

export function EnhancedMarkdownRenderer({ content }: EnhancedMarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const toggleCollapse = (id: string) => {
    const newCollapsed = new Set(collapsedSections)
    newCollapsed.has(id) ? newCollapsed.delete(id) : newCollapsed.add(id)
    setCollapsedSections(newCollapsed)
  }

  const components = {
    h2: ({ children, ...props }: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-') || ''
      const isCollapsed = collapsedSections.has(id)

      return (
        <div className="mt-8 mb-4">
          <button
            onClick={() => toggleCollapse(id)}
            className="flex items-center gap-2 text-2xl font-semibold hover:text-accent transition-colors w-full text-left"
            {...props}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {children}
          </button>
        </div>
      )
    },

    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl font-semibold mb-3 mt-6 border-l-4 border-primary pl-3" {...props}>
        {children}
      </h3>
    ),

    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      const codeString = String(children).replace(/\n$/, '')
      const codeId = `code-${Math.random().toString(36).substring(2, 9)}`

      if (!inline) {
        return (
          <div className="relative mb-6 group rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between bg-muted text-muted-foreground px-4 py-2 text-sm">
              <span className="font-mono">{language || 'text'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(codeString, codeId)}
                className="h-6 px-2"
              >
                {copiedCode === codeId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <pre className="bg-background text-foreground p-4 overflow-x-auto text-sm font-mono">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        )
      }

      return (
        <code className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },

    blockquote: ({ children, ...props }: any) => {
      const content = children?.toString() || ''
      let icon = <Info className="w-5 h-5" />
      let bg = 'bg-muted'
      let border = 'border-border'
      let text = 'text-muted-foreground'

      if (content.includes('Warning:') || content.includes('⚠️')) {
        icon = <AlertTriangle className="w-5 h-5 text-yellow-500" />
      } else if (content.includes('Error:') || content.includes('❌')) {
        icon = <XCircle className="w-5 h-5 text-red-500" />
      } else if (content.includes('Success:') || content.includes('✅')) {
        icon = <CheckCircle className="w-5 h-5 text-green-500" />
      } else if (content.includes('Tip:') || content.includes('💡')) {
        icon = <Lightbulb className="w-5 h-5 text-purple-500" />
      }

      return (
        <blockquote
          className={`flex items-start gap-3 ${bg} ${border} ${text} border-l-4 p-4 mb-4 rounded-r-lg break-words`}
          {...props}
        >
          {icon}
          <div className="flex-1">{children}</div>
        </blockquote>
      )
    },

    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-border rounded-md" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }: any) => (
      <thead className="bg-muted text-muted-foreground" {...props}>
        {children}
      </thead>
    ),

    th: ({ children, ...props }: any) => (
      <th className="px-4 py-3 text-left text-sm font-semibold border-b border-border" {...props}>
        {children}
      </th>
    ),

    td: ({ children, ...props }: any) => (
      <td className="px-4 py-3 text-sm border-b border-border" {...props}>
        {children}
      </td>
    ),

    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside space-y-2 text-muted-foreground" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }: any) => <li className="ml-4">{children}</li>,

    p: ({ children, ...props }: any) => (
      <p className="mb-4 text-muted-foreground leading-relaxed" {...props}>
        {children}
      </p>
    ),

    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        className="text-primary hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),

    hr: (props: any) => <hr className="my-8 border-t border-border" {...props} />,

    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),

    em: ({ children, ...props }: any) => (
      <em className="italic text-foreground" {...props}>
        {children}
      </em>
    ),
  }

  const processedContent = useMemo(() => {
    const lines = content.split('\n')
    let result = ''
    let currentSection = ''
    let sectionContent = ''
    let inSection = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('## ')) {
        if (inSection && currentSection) {
          const sectionId = currentSection.toLowerCase().replace(/\s+/g, '-')
          if (!collapsedSections.has(sectionId)) result += sectionContent
        }

        currentSection = line.slice(3).trim()
        sectionContent = ''
        inSection = true
        result += line + '\n'
      } else if (inSection) {
        sectionContent += line + '\n'
      } else {
        result += line + '\n'
      }
    }

    if (inSection && currentSection) {
      const sectionId = currentSection.toLowerCase().replace(/\s+/g, '-')
      if (!collapsedSections.has(sectionId)) result += sectionContent
    }

    return result
  }, [content, collapsedSections])

  return (
    <div className="w-full">
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}




