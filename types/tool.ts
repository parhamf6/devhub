
// Your existing ToolCardProps interface
export type Tool = {
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