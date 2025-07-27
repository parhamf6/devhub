'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, Tag, GripVertical, X } from 'lucide-react';
import { EnhancedMarkdownRenderer } from './md-render';
import Link from 'next/link';
export interface LearnContent {
  title: string;
  content: string;
  lastUpdated?: string;
}
import { getCategoryColor } from '@/lib/tools/categories';
export type ToolCardProps = {
  name: string;
  description: string;
  slug: string;
  category: string;
  icon?: React.ReactNode;
  version?: string;
  rating?: number;
  tags?: string[];
  withFavoriteToggle?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

interface LearningSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolCardProps;
  content: LearnContent;
}

export function LearningSheet({
  isOpen,
  onClose,
  tool,
  content,
}: LearningSheetProps) {
  const [sheetWidth, setSheetWidth] = useState(75); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const viewportWidth = window.innerWidth;
      const newWidth = ((viewportWidth - e.clientX) / viewportWidth) * 100;
      
      // Constrain width between 30% and 90%
      const constrainedWidth = Math.max(30, Math.min(90, newWidth));
      setSheetWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0
          h-[100vh]
          max-h-[100vh]
          flex
          flex-col
          overflow-hidden
          z-[100]
          relative
          inset-0
          translate-x-0
          translate-y-0
          rounded-none
          border-0
          shadow-none
        "
        style={{
          width: `${sheetWidth}vw`,
          maxWidth: `${sheetWidth}vw`,
          minWidth: '320px',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: 'auto'
        }}
      >
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="absolute left-0 top-0 bottom-0 w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Static Header */}
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
          <DialogHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                {tool.icon && <div className="p-2 rounded-lg">{tool.icon}</div>}
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl text-primary font-bold mb-1 break-words">
                    {content.title}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground break-words">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                {/* <Badge variant="secondary">{tool.category}</Badge> */}
                <div className={`inline-flex items-center px-2 py-1 rounded-[8px] text-xs font-medium border ${getCategoryColor(tool.category)}`}>
                  <Link href={`/dashboard/tools/categories?category=${tool.category}`} className="hover:underline">
                    {tool.category}
                  </Link>
                </div>

                {tool.version && (
                  <Badge variant="outline">v{tool.version}</Badge>
                )}

                {tool.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium">{tool.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {tool.tags?.length ? (
                  <>
                    <Tag className="w-4 h-4 flex-shrink-0" />
                    {tool.tags.map((tag, index) => (
                      <Link href={`/dashboard/tools/tags?tag=${tag}`} key={tag}>
                      <Badge
                        variant="secondary"
                        className="text-xs hover:bg-accent hover:text-background transition-colors"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                    ))}
                  </>
                ) : null}
              </div>

              {content.lastUpdated && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  Updated: {content.lastUpdated}
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-6 pb-8">
            <EnhancedMarkdownRenderer content={content.content} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}