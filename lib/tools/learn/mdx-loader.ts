// Fix for lib/mdx-loader.ts - Add the missing parseFrontmatter function

export interface LearnContent {
  title: string;
  content: string;
  lastUpdated?: string;
}

// Add this parseFrontmatter function that was missing
function parseFrontmatter(frontmatter: string): Record<string, any> {
  const lines = frontmatter.split('\n');
  const metadata: Record<string, any> = {};
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      metadata[key.trim()] = valueParts.join(':').trim().replace(/['"]/g, '');
    }
  });
  
  return metadata;
}

export async function loadLearningContent(slug: string): Promise<LearnContent | null> {
  try {
    const response = await fetch(`/content/learn/${slug}.md`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Extract frontmatter if present
    const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const [, frontmatter, markdownContent] = match;
      const metadata = parseFrontmatter(frontmatter); // Now this function exists!
      
      return {
        title: metadata.title || `Learn ${slug}`,
        content: markdownContent,
        lastUpdated: metadata.lastUpdated
      };
    }
    
    return {
      title: `Learn ${slug}`,
      content: content
    };
  } catch (error) {
    console.error(`Failed to load learning content for ${slug}:`, error);
    return null;
  }
}

// Add the new function for manual file paths
export async function loadLearningContentFromPath(filePath: string): Promise<LearnContent | null> {
  try {
    // Remove leading slash if present for consistency
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    const response = await fetch(cleanPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Extract frontmatter if present
    const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const [, frontmatter, markdownContent] = match;
      const metadata = parseFrontmatter(frontmatter); // Using the same function
      
      return {
        title: metadata.title || 'Learning Guide',
        content: markdownContent,
        lastUpdated: metadata.lastUpdated
      };
    }
    
    return {
      title: 'Learning Guide',
      content: content
    };
  } catch (error) {
    console.error(`Failed to load learning content from ${filePath}:`, error);
    return null;
  }
}