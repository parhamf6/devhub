'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import { LearningSheet } from './learn-dialog';
// import { LearningDialog } from './learn-dialog';
import { loadLearningContentFromPath } from '@/lib/tools/learn/mdx-loader';
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

// Additional interface for learning content
export interface LearnContent {
  title: string;
  content: string;
  lastUpdated?: string;
}

interface LearnButtonProps {
  tool: ToolCardProps;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  fullWidth?: boolean;
  // NEW: Optional manual file path
  mdFilePath?: string;
}

export function LearnButton({ 
  tool, 
  variant = 'outline', 
  size = 'default',
  className = '',
  fullWidth = false,
  mdFilePath // NEW: Manual file path
}: LearnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<LearnContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLearnClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let learningContent: LearnContent | null = null;
      
      if (mdFilePath) {
        // Use manual file path
        learningContent = await loadLearningContentFromPath(mdFilePath);
      } else {
        // Use automatic slug-based loading
        learningContent = await loadLearningContent(tool.slug);
      }
      
      if (learningContent) {
        setContent(learningContent);
        setIsOpen(true);
      } else {
        setError(`No learning content found for ${tool.name}`);
      }
    } catch (err) {
      setError(`Failed to load learning content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = `${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <>
      <Button
        onClick={handleLearnClick}
        variant={variant}
        size={size}
        className={buttonClasses}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <BookOpen className="w-4 h-4 mr-2" />
        )}
        Learn
      </Button>

      {content && (
        <LearningSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          tool={tool}
          content={content}
        />
        // <LearningDialog
        //   isOpen={isOpen}
        //   onClose={() => setIsOpen(false)}
        //   tool={tool}
        //   content={content}
        // />
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </>
  );
}
