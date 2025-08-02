"use client"
import React, { useState } from 'react';
import { 
  Search, 
  Home, 
  Code, 
  Terminal, 
  Database, 
  User, 
  BookOpen,
  GitBranch,
  Zap,
  Monitor,
  Package,
  Activity,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Folder,
  File,
  Cloud,
  LogIn
} from 'lucide-react';

// CONFIGURATION: Change these props to customize the sidebar behavior
interface DevHubSidebarProps {
  isUserLoggedIn?: boolean; // Set to true when user is authenticated
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const DevHubSidebar: React.FC<DevHubSidebarProps> = ({ 
  isUserLoggedIn = false, // CHANGE: Set to true to show authenticated state
  userProfile = { name: 'Guest User', email: 'guest@example.com' }
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // CONFIGURATION: Add/remove sections here, set default expanded state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projects: true,
    tools: true,
    monitoring: false
  });
  const [activeItem, setActiveItem] = useState('dashboard');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // CONFIGURATION: Add/remove/modify menu items here
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Folder,
      isSection: true,
      children: [
        { id: 'all-projects', label: 'All Projects', icon: Package, path: '/projects' },
        { id: 'repositories', label: 'Repositories', icon: GitBranch, path: '/repos' },
        { id: 'deployments', label: 'Deployments', icon: Cloud, path: '/deployments' },
        { id: 'templates', label: 'Templates', icon: File, path: '/templates' }
      ]
    },
    {
      id: 'tools',
      label: 'Development Tools',
      icon: Code,
      isSection: true,
      children: [
        { id: 'code-editor', label: 'Code Editor', icon: Code, path: '/editor' },
        { id: 'terminal', label: 'Terminal', icon: Terminal, path: '/terminal' },
        { id: 'database', label: 'Database', icon: Database, path: '/database' },
        { id: 'api-tester', label: 'API Tester', icon: Zap, path: '/api-tester' },
        { id: 'preview', label: 'Live Preview', icon: Monitor, path: '/preview' }
      ]
    },
    {
      id: 'monitoring',
      label: 'Monitoring & Analytics',
      icon: Activity,
      isSection: true,
      children: [
        { id: 'performance', label: 'Performance', icon: Activity, path: '/performance' },
        { id: 'logs', label: 'Logs', icon: BookOpen, path: '/logs' },
        { id: 'metrics', label: 'Metrics', icon: Globe, path: '/metrics' }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: BookOpen,
      path: '/docs'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Star,
      path: '/favorites'
    }
  ];

  // CONFIGURATION: Search functionality - modify filter logic if needed
  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.children && item.children.some(child => 
      child.label.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // CONFIGURATION: Individual sidebar item component - modify styling here
  const SidebarItem: React.FC<{
    item: any;
    isChild?: boolean;
    level?: number;
  }> = ({ item, isChild = false, level = 0 }) => {
    const isExpanded = expandedSections[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;

    return (
      <div className="w-full">
        <button
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group
            ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
            ${isChild ? 'ml-4' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              setActiveItem(item.id);
            }
          }}
        >
          <item.icon 
            size={isCollapsed ? 16 : (isChild ? 14 : 16)} 
            className={`
              flex-shrink-0 transition-colors duration-200
              ${isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'}
            `}
          />
          
          {!isCollapsed && (
            <>
              <span className={`flex-1 font-medium ${isChild ? 'text-xs' : 'text-sm'}`}>
                {item.label}
              </span>
              {hasChildren && (
                isExpanded ? 
                  <ChevronUp size={12} className="text-sidebar-foreground/60" /> : 
                  <ChevronDown size={12} className="text-sidebar-foreground/60" />
              )}
            </>
          )}
        </button>

        {!isCollapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any) => (
              <SidebarItem key={child.id} item={child} isChild={true} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* SECTION: Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Code size={16} className="text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-bold text-sidebar-foreground">DevHub</h2>
              <p className="text-xs text-sidebar-foreground/60">Developer Tools</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors duration-200"
        >
          {isCollapsed ? 
            <ChevronRight size={16} className="text-sidebar-foreground" /> : 
            <ChevronLeft size={16} className="text-sidebar-foreground" />
          }
        </button>
      </div>

      {/* SECTION: Search bar - only visible when expanded */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-sidebar-foreground/60" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-sidebar-accent/20 border border-sidebar-border rounded-lg text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:outline-none focus:ring-2 focus:ring-sidebar-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* SECTION: Main menu items - modify menuItems array to change these */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
          {(searchQuery ? filteredItems : menuItems).map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* SECTION: Bottom user area - authentication state dependent */}
      <div className="border-t border-sidebar-border p-4">
        {isUserLoggedIn ? (
          // AUTHENTICATED USER: Shows profile info when logged in
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-7 h-7 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{userProfile.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{userProfile.email}</p>
              </div>
            )}
          </div>
        ) : (
          // UNAUTHENTICATED USER: Shows sign in option
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center justify-center gap-2 px-3 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:bg-sidebar-primary/90 transition-colors duration-200 cursor-pointer flex-1"
              onClick={() => {
                // CONFIGURATION: Add your sign in logic here
                console.log('Sign in clicked');
              }}
            >
              <LogIn size={14} />
              {!isCollapsed && <span className="text-xs font-medium">Sign In</span>}
            </button>
            {!isCollapsed && (
              <div className="w-7 h-7 bg-sidebar-accent/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sidebar-accent/30 transition-colors duration-200">
                <User size={14} className="text-sidebar-foreground" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevHubSidebar;