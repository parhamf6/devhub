'use client';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
    Copy, 
    Download, 
    Search,
    AlertCircle,
    RefreshCw,
    History,
    Star,
    StarOff,
    ChevronRight,
    ChevronDown,
    Book,
    Zap,
    Clock,
    Save,
    Trash2,
    Code,
    Plus,
    ArrowRight,
    Hash,
    Upload,
    Maximize,
    Minimize,
    HelpCircle,
    Lightbulb,
    BarChart2,
    Copy as CopyIcon,
    FileDown,
    BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import useMediaQuery from '@/hooks/use-media-query';

// Configuration options
const CONFIG = {
    enableShare: true, // Set to false to disable sharing
    enableFileUpload: true, // Set to false to disable file upload
    enableVisualizer: true, // Set to false to disable regex visualizer
    enableExplanation: true, // Set to false to disable regex explanation
    mobileBreakpoint: '768px', // Mobile breakpoint
};

import { RegexFlags, RegexMatch, RegexOptions, RegexResult , CHEATSHEET_DATA , EXAMPLE_PATTERNS } from '@/lib/tools/tool/regex-tester';



const tool = {
    name: "Advanced Regex Tester",
    description: "Test and debug regular expressions with real-time feedback and comprehensive analysis",
    slug: "regex-tester",
    category: "Text & Data",
    tags: ["regex", "pattern", "validation", "test"]
};


export default function RegexTesterPage() {
    const [options, setOptions] = useState<RegexOptions>({
        pattern: '',
        flags: {
            global: true,
            ignoreCase: false,
            multiline: false,
            dotAll: false,
            unicode: false,
            sticky: false
        },
        testString: '',
        replaceString: '',
        mode: 'test'
    });
    
    const [result, setResult] = useState<RegexResult>({
        matches: [],
        isValid: true,
        executionTime: 0,
        stats: {
            matchCount: 0,
            groupCount: 0
        }
    });
    
    const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
    const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [cheatsheetSearch, setCheatsheetSearch] = useState('');
    const [openSections, setOpenSections] = useState<string[]>(['Character Classes', 'Quantifiers']);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [newPatternName, setNewPatternName] = useState('');
    const [newPatternDescription, setNewPatternDescription] = useState('');
    const [newPatternTags, setNewPatternTags] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [highlightColor, setHighlightColor] = useState('yellow');
    const [showExplanation, setShowExplanation] = useState(false);
    const [showVisualizer, setShowVisualizer] = useState(false);
    const [fullScreenResult, setFullScreenResult] = useState(false);
    const [selectedExampleCategory, setSelectedExampleCategory] = useState<string>('all');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout>();
    
    // Media queries for responsive design
    const isMobile = useMediaQuery(`(max-width: ${CONFIG.mobileBreakpoint})`);
    const isTablet = useMediaQuery(`(min-width: ${CONFIG.mobileBreakpoint}) and (max-width: 1024px)`);
    const isDesktop = useMediaQuery(`(min-width: 1025px)`);
    
    // Process regex with debouncing
    const processRegex = useCallback(() => {
        if (!options.pattern) {
            setResult({
                matches: [],
                isValid: true,
                executionTime: 0,
                stats: { matchCount: 0, groupCount: 0 }
            });
            return;
        }
        
        setIsProcessing(true);
        
        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        debounceTimeoutRef.current = setTimeout(() => {
            const startTime = performance.now();
            
            try {
                const flagsStr = Object.entries(options.flags)
                    .filter(([, value]) => value)
                    .map(([key]) => {
                        switch (key) {
                            case 'global': return 'g';
                            case 'ignoreCase': return 'i';
                            case 'multiline': return 'm';
                            case 'dotAll': return 's';
                            case 'unicode': return 'u';
                            case 'sticky': return 'y';
                            default: return '';
                        }
                    })
                    .join('');
                
                const regex = new RegExp(options.pattern, flagsStr);
                const matches: RegexMatch[] = [];
                let match;
                
                if (options.flags.global) {
                    while ((match = regex.exec(options.testString)) !== null) {
                        matches.push({
                            match: match[0],
                            groups: match.slice(1),
                            namedGroups: match.groups || {},
                            index: match.index,
                            lastIndex: regex.lastIndex,
                            input: match.input
                        });
                        
                        // Prevent infinite loop
                        if (match[0].length === 0) {
                            regex.lastIndex++;
                        }
                        if (matches.length > 1000) break; // Safety limit
                    }
                } else {
                    match = regex.exec(options.testString);
                    if (match) {
                        matches.push({
                            match: match[0],
                            groups: match.slice(1),
                            namedGroups: match.groups || {},
                            index: match.index,
                            lastIndex: match.index + match[0].length,
                            input: match.input
                        });
                    }
                }
                
                const executionTime = performance.now() - startTime;
                
                let replaceResult;
                if (options.mode === 'replace' && options.replaceString) {
                    replaceResult = options.testString.replace(regex, options.replaceString);
                }
                
                // Generate explanation
                let explanation = '';
                if (options.pattern && CONFIG.enableExplanation) {
                    explanation = generateExplanation(options.pattern, options.flags);
                }
                
                setResult({
                    matches,
                    isValid: true,
                    executionTime,
                    replaceResult,
                    explanation,
                    stats: {
                        matchCount: matches.length,
                        groupCount: matches.reduce((acc, match) => Math.max(acc, match.groups.length), 0)
                    }
                });
            } catch (error) {
                setResult({
                    matches: [],
                    isValid: false,
                    error: error instanceof Error ? error.message : 'Invalid regex pattern',
                    executionTime: performance.now() - startTime,
                    stats: { matchCount: 0, groupCount: 0 }
                });
            }
            
            setIsProcessing(false);
        }, 300);
    }, [options]);
    
    // Generate a simple explanation for the regex pattern
    const generateExplanation = (pattern: string, flags: RegexFlags): string => {
        let explanation = "This pattern ";
        
        // Check for common patterns
        if (pattern.includes("\\d")) {
            explanation += "matches digits";
            if (pattern.includes("+") || pattern.includes("{")) {
                explanation += " in sequences";
            }
        } else if (pattern.includes("\\w")) {
            explanation += "matches word characters";
        } else if (pattern.includes("[a-zA-Z]")) {
            explanation += "matches letters";
        } else {
            explanation += "matches the specified pattern";
        }
        
        // Add flag information
        const activeFlags = Object.entries(flags)
            .filter(([_, value]) => value)
            .map(([key]) => key);
            
        if (activeFlags.length > 0) {
            explanation += " with the following flags: " + activeFlags.join(", ");
        }
        
        return explanation;
    };
    
    useEffect(() => {
        processRegex();
    }, [processRegex]);
    
    // Load saved patterns from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('regex-tester-patterns');
            if (saved) {
                const patterns = JSON.parse(saved);
                setSavedPatterns(patterns.map((p: any) => ({
                    ...p,
                    createdAt: new Date(p.createdAt)
                })));
            }
        } catch (error) {
            console.error('Failed to load saved patterns:', error);
        }
    }, []);
    
    // Save patterns to localStorage
    const saveToLocalStorage = useCallback((patterns: SavedPattern[]) => {
        try {
            localStorage.setItem('regex-tester-patterns', JSON.stringify(patterns));
        } catch (error) {
            console.error('Failed to save patterns:', error);
        }
    }, []);
    
    // Highlight matches in text with color coding
    const highlightedText = useMemo(() => {
        if (!options.testString || !result.matches.length) {
            return options.testString;
        }
        
        const parts = [];
        let lastIndex = 0;
        
        // Define color palette for different matches
        const colors = [
            'bg-yellow-200 dark:bg-yellow-800',
            'bg-green-200 dark:bg-green-800',
            'bg-blue-200 dark:bg-blue-800',
            'bg-purple-200 dark:bg-purple-800',
            'bg-pink-200 dark:bg-pink-800',
            'bg-indigo-200 dark:bg-indigo-800'
        ];
        
        result.matches.forEach((match, matchIndex) => {
            // Add text before match
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${matchIndex}`}>
                        {options.testString.slice(lastIndex, match.index)}
                    </span>
                );
            }
            
            // Add highlighted match with color based on index
            const colorClass = highlightColor === 'rainbow' 
                ? colors[matchIndex % colors.length]
                : `bg-${highlightColor}-200 dark:bg-${highlightColor}-800`;
                
            parts.push(
                <span
                    key={`match-${matchIndex}`}
                    className={`${selectedMatch === matchIndex 
                        ? 'bg-blue-500 text-white' 
                        : colorClass
                    } px-1 rounded cursor-pointer transition-all duration-200 hover:opacity-80`}
                    onClick={() => setSelectedMatch(matchIndex === selectedMatch ? null : matchIndex)}
                >
                    {match.match}
                </span>
            );
            
            lastIndex = match.lastIndex;
        });
        
        // Add remaining text
        if (lastIndex < options.testString.length) {
            parts.push(
                <span key="text-end">
                    {options.testString.slice(lastIndex)}
                </span>
            );
        }
        
        return parts;
    }, [options.testString, result.matches, selectedMatch, highlightColor]);
    
    // Handle flag changes
    const handleFlagChange = (flag: keyof RegexFlags, value: boolean) => {
        setOptions(prev => ({
            ...prev,
            flags: { ...prev.flags, [flag]: value }
        }));
    };
    
    // Copy functionality
    const handleCopy = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied to clipboard!`);
        } catch {
            toast.error('Failed to copy to clipboard');
        }
    };
    
    // Share functionality
    const handleShare = () => {
        if (!CONFIG.enableShare) {
            toast.info('Sharing is disabled');
            return;
        }
        
        const flagsStr = Object.entries(options.flags)
            .filter(([, value]) => value)
            .map(([key]) => {
                switch (key) {
                    case 'global': return 'g';
                    case 'ignoreCase': return 'i';
                    case 'multiline': return 'm';
                    case 'dotAll': return 's';
                    case 'unicode': return 'u';
                    case 'sticky': return 'y';
                    default: return '';
                }
            })
            .join('');
            
        const shareUrl = `${window.location.origin}${window.location.pathname}?pattern=${encodeURIComponent(options.pattern)}&flags=${flagsStr}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Regex Pattern',
                text: `Check out this regex pattern: /${options.pattern}/${flagsStr}`,
                url: shareUrl
            }).catch(() => {
                // Fallback to copying to clipboard
                handleCopy(shareUrl, 'Share URL');
            });
        } else {
            // Fallback to copying to clipboard
            handleCopy(shareUrl, 'Share URL');
        }
    };
    
    // Save pattern
    const handleSavePattern = () => {
        if (!newPatternName.trim() || !options.pattern) {
            toast.error('Please enter a pattern name and regex pattern');
            return;
        }
        
        const newPattern: SavedPattern = {
            id: Date.now().toString(),
            name: newPatternName.trim(),
            pattern: options.pattern,
            flags: { ...options.flags },
            description: newPatternDescription.trim() || `Saved on ${new Date().toLocaleDateString()}`,
            tags: newPatternTags.split(',').map(tag => tag.trim()).filter(Boolean),
            createdAt: new Date(),
            isFavorite: false
        };
        
        const updatedPatterns = [...savedPatterns, newPattern];
        setSavedPatterns(updatedPatterns);
        saveToLocalStorage(updatedPatterns);
        
        setNewPatternName('');
        setNewPatternDescription('');
        setNewPatternTags('');
        setSaveDialogOpen(false);
        toast.success('Pattern saved successfully!');
    };
    
    // Load pattern
    const handleLoadPattern = (pattern: SavedPattern) => {
        setOptions(prev => ({
            ...prev,
            pattern: pattern.pattern,
            flags: { ...pattern.flags }
        }));
        toast.success(`Pattern "${pattern.name}" loaded!`);
    };
    
    // Delete pattern
    const handleDeletePattern = (patternId: string) => {
        const updatedPatterns = savedPatterns.filter(p => p.id !== patternId);
        setSavedPatterns(updatedPatterns);
        saveToLocalStorage(updatedPatterns);
        toast.success('Pattern deleted!');
    };
    
    // Toggle favorite
    const handleToggleFavorite = (patternId: string) => {
        const updatedPatterns = savedPatterns.map(p => 
            p.id === patternId ? { ...p, isFavorite: !p.isFavorite } : p
        );
        setSavedPatterns(updatedPatterns);
        saveToLocalStorage(updatedPatterns);
    };
    
    // Load example pattern
    const handleLoadExample = (example: ExamplePattern) => {
        setOptions(prev => ({
            ...prev,
            pattern: example.pattern,
            flags: { ...example.flags },
            testString: example.testString
        }));
        toast.success(`Example "${example.name}" loaded!`);
    };
    
    // Insert cheatsheet pattern
    const handleInsertPattern = (pattern: string) => {
        setOptions(prev => ({
            ...prev,
            pattern: prev.pattern + pattern
        }));
        toast.success('Pattern inserted!');
    };
    
    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!CONFIG.enableFileUpload) {
            toast.info('File upload is disabled');
            return;
        }
        
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setOptions(prev => ({
                ...prev,
                testString: content
            }));
            toast.success(`File "${file.name}" loaded!`);
        };
        reader.readAsText(file);
    };
    
    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        if (!CONFIG.enableFileUpload) return;
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        if (!CONFIG.enableFileUpload) return;
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.log') || file.name.endsWith('.json') || file.name.endsWith('.csv'))) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setOptions(prev => ({
                    ...prev,
                    testString: content
                }));
                toast.success(`File "${file.name}" loaded!`);
            };
            reader.readAsText(file);
        } else {
            toast.error('Please upload a text file');
        }
    };
    
    // Copy all matches
    const handleCopyAllMatches = () => {
        if (result.matches.length === 0) {
            toast.error('No matches to copy');
            return;
        }
        
        const matchesText = result.matches.map(match => match.match).join('\n');
        handleCopy(matchesText, 'All matches');
    };
    
    // Export matches as JSON
    const handleExportMatches = () => {
        if (result.matches.length === 0) {
            toast.error('No matches to export');
            return;
        }
        
        const exportData = {
            pattern: options.pattern,
            flags: options.flags,
            testString: options.testString,
            matches: result.matches,
            stats: result.stats,
            executionTime: result.executionTime
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'regex-matches.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast.success('Matches exported successfully!');
    };
    
    // Filter cheatsheet items
    const filteredCheatsheet = useMemo(() => {
        if (!cheatsheetSearch) return CHEATSHEET_DATA;
        
        return CHEATSHEET_DATA.map(section => ({
            ...section,
            items: section.items.filter(item => 
                item.pattern.toLowerCase().includes(cheatsheetSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(cheatsheetSearch.toLowerCase())
            )
        })).filter(section => section.items.length > 0);
    }, [cheatsheetSearch]);
    
    // Filter examples by category
    const filteredExamples = useMemo(() => {
        if (selectedExampleCategory === 'all') return EXAMPLE_PATTERNS;
        return EXAMPLE_PATTERNS.filter(example => example.category === selectedExampleCategory);
    }, [selectedExampleCategory]);
    
    // Get unique example categories
    const exampleCategories = useMemo(() => {
        const categories = ['all', ...new Set(EXAMPLE_PATTERNS.map(p => p.category).filter(Boolean))];
        return categories;
    }, []);
    
    // Generate code export
    const generateCode = (language: string) => {
        const flagsStr = Object.entries(options.flags)
            .filter(([, value]) => value)
            .map(([key]) => {
                switch (key) {
                    case 'global': return 'g';
                    case 'ignoreCase': return 'i';
                    case 'multiline': return 'm';
                    case 'dotAll': return 's';
                    case 'unicode': return 'u';
                    case 'sticky': return 'y';
                    default: return '';
                }
            })
            .join('');
            
        switch (language) {
            case 'javascript':
                return `const regex = /${options.pattern}/${flagsStr};\nconst matches = text.match(regex);`;
            case 'python':
                return `import re\npattern = r'${options.pattern}'\nmatches = re.findall(pattern, text${options.flags.ignoreCase ? ', re.IGNORECASE' : ''})`;
            case 'php':
                return `$pattern = '/${options.pattern}/${flagsStr}';\npreg_match_all($pattern, $text, $matches);`;
            case 'java':
                return `String pattern = "${options.pattern}";\nPattern r = Pattern.compile(pattern${flagsStr ? ', Pattern.' + flagsStr.toUpperCase().split('').join(', Pattern.') : ''});\nMatcher m = r.matcher(text);\nwhile (m.find()) {\n    System.out.println(m.group());\n}`;
            default:
                return options.pattern;
        }
    };
    
    // Generate regex visualizer
    const renderRegexVisualizer = () => {
        if (!options.pattern || !CONFIG.enableVisualizer) return null;
        
        // Simple visualization - break down the pattern into parts
        const parts: { type: string; value: string; description?: string }[] = [];
        let currentPart = '';
        
        for (let i = 0; i < options.pattern.length; i++) {
            const char = options.pattern[i];
            
            if (char === '\\') {
                // Escape sequence
                if (i + 1 < options.pattern.length) {
                    const nextChar = options.pattern[i + 1];
                    const escapeSeq = char + nextChar;
                    
                    let description = '';
                    switch (escapeSeq) {
                        case '\\d': description = 'Any digit'; break;
                        case '\\D': description = 'Non-digit'; break;
                        case '\\w': description = 'Word character'; break;
                        case '\\W': description = 'Non-word character'; break;
                        case '\\s': description = 'Whitespace'; break;
                        case '\\S': description = 'Non-whitespace'; break;
                        case '\\b': description = 'Word boundary'; break;
                        case '\\B': description = 'Non-word boundary'; break;
                    }
                    
                    parts.push({
                        type: 'escape',
                        value: escapeSeq,
                        description
                    });
                    
                    i++; // Skip next character
                }
            } else if (char === '[') {
                // Character class
                let charClass = char;
                i++;
                while (i < options.pattern.length && options.pattern[i] !== ']') {
                    charClass += options.pattern[i];
                    i++;
                }
                if (i < options.pattern.length && options.pattern[i] === ']') {
                    charClass += options.pattern[i];
                }
                
                parts.push({
                    type: 'character-class',
                    value: charClass,
                    description: 'Character class'
                });
            } else if (char === '(') {
                // Group
                let group = char;
                i++;
                let depth = 1;
                
                while (i < options.pattern.length && depth > 0) {
                    if (options.pattern[i] === '(') depth++;
                    if (options.pattern[i] === ')') depth--;
                    group += options.pattern[i];
                    i++;
                }
                i--; // Adjust for loop increment
                
                parts.push({
                    type: 'group',
                    value: group,
                    description: group.startsWith('(?:') ? 'Non-capturing group' : 'Capturing group'
                });
            } else if ('*+?{'.includes(char)) {
                // Quantifier
                let quantifier = char;
                if (char === '{') {
                    i++;
                    while (i < options.pattern.length && options.pattern[i] !== '}') {
                        quantifier += options.pattern[i];
                        i++;
                    }
                    if (i < options.pattern.length && options.pattern[i] === '}') {
                        quantifier += options.pattern[i];
                    }
                }
                
                let description = '';
                switch (char) {
                    case '*': description = 'Zero or more'; break;
                    case '+': description = 'One or more'; break;
                    case '?': description = 'Zero or one'; break;
                    case '{': description = 'Range quantifier'; break;
                }
                
                parts.push({
                    type: 'quantifier',
                    value: quantifier,
                    description
                });
            } else if ('^$'.includes(char)) {
                // Anchor
                parts.push({
                    type: 'anchor',
                    value: char,
                    description: char === '^' ? 'Start of line/string' : 'End of line/string'
                });
            } else if ('|'.includes(char)) {
                // Alternation
                parts.push({
                    type: 'alternation',
                    value: char,
                    description: 'OR operator'
                });
            } else {
                // Literal character
                currentPart += char;
            }
        }
        
        if (currentPart) {
            parts.push({
                type: 'literal',
                value: currentPart,
                description: 'Literal characters'
            });
        }
        
        return (
            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
                {parts.map((part, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Badge 
                                variant={part.type === 'escape' ? 'default' : 
                                        part.type === 'character-class' ? 'secondary' : 
                                        part.type === 'group' ? 'outline' : 
                                        part.type === 'quantifier' ? 'destructive' : 
                                        part.type === 'anchor' ? 'default' : 'secondary'}
                                className="text-xs"
                            >
                                {part.value}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{part.description}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        );
    };
    
    // Responsive file upload area
    const renderFileUploadArea = (mode: 'test' | 'replace') => {
        if (!CONFIG.enableFileUpload) return null;
        
        return (
            <div
                className={`border-2 border-dashed rounded-lg transition-colors ${
                    isDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Textarea
                    value={options.testString}
                    onChange={(e) => setOptions(prev => ({ ...prev, testString: e.target.value }))}
                    placeholder={mode === 'test' 
                        ? "Enter text to test against your regex pattern or drag and drop a file..." 
                        : "Enter text to test replacement or drag and drop a file..."}
                    className="min-h-32 font-mono text-sm resize-y border-1 bg-card"
                />
                {!options.testString && (
                    <div className="text-center p-4 text-muted-foreground">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Drag and drop a file here, or click to select</p>
                        <p className="text-xs mt-1">Supports .txt, .log, .json, .csv files</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => document.getElementById(`file-upload-${mode}`)?.click()}
                        >
                            Browse Files
                        </Button>
                        <input
                            type="file"
                            id={`file-upload-${mode}`}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".txt,.log,.json,.csv"
                        />
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <TooltipProvider>
            <div className="flex flex-col p-2 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">{tool.name}</h1>
                        </div>
                        <div className="flex gap-2">
                            {isDesktop && (
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    {/* <Book className="w-4 h-4 mr-2" /> */}
                                    {sidebarOpen ? <BookOpen className="w-4 h-4 mr-2" /> : <Book className="w-4 h-4 mr-2" />  }
                                    {sidebarOpen ? 'Hide' : 'Show'} Reference
                                </Button>
                            )}
                            <LearnButton 
                                tool={tool}
                                variant="secondary"
                                mdFilePath="content/learn/regex.md"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm md:text-base">{tool.description}</p>
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4 md:space-y-6">
                        {/* Pattern Input */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="text-lg md:text-xl">Regular Expression Pattern</span>
                                    </span>
                                    <div className="flex gap-1 sm:gap-2">
                                        {CONFIG.enableExplanation && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        // variant="ghost"
                                                        variant={showExplanation ? "secondary" : "outline"}
                                                        size="sm"
                                                        onClick={() => setShowExplanation(!showExplanation)}
                                                    >
                                                        <Lightbulb className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    See the explanation, if the input is not empty
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {CONFIG.enableVisualizer && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        variant={showVisualizer ? "secondary" : "outline"}
                                                        size="sm"
                                                        onClick={() => setShowVisualizer(!showVisualizer)}
                                                    >
                                                        <BarChart2 className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    See the Pattern Breakdown, if the input is not empty
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Save className="w-4 h-4 mr-1 sm:mr-2" />
                                                            <span className="hidden sm:inline">Save</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    press to save the pattern
                                                </TooltipContent>
                                            </Tooltip>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Save Pattern</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="pattern-name">Pattern Name</Label>
                                                        <Input
                                                            id="pattern-name"
                                                            value={newPatternName}
                                                            onChange={(e) => setNewPatternName(e.target.value)}
                                                            placeholder="Enter pattern name..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="pattern-description">Description</Label>
                                                        <Textarea
                                                            id="pattern-description"
                                                            value={newPatternDescription}
                                                            onChange={(e) => setNewPatternDescription(e.target.value)}
                                                            placeholder="Enter description..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="pattern-tags">Tags (comma separated)</Label>
                                                        <Input
                                                            id="pattern-tags"
                                                            value={newPatternTags}
                                                            onChange={(e) => setNewPatternTags(e.target.value)}
                                                            placeholder="email, validation, etc."
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button onClick={handleSavePattern} className="flex-1">
                                                            Save Pattern
                                                        </Button>
                                                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Pattern Input */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-mono text-lg">/</span>
                                        <Input
                                            value={options.pattern}
                                            onChange={(e) => setOptions(prev => ({ ...prev, pattern: e.target.value }))}
                                            placeholder="Enter regex pattern..."
                                            className="flex-1 font-mono text-sm"
                                        />
                                        <span className="font-mono text-lg">/</span>
                                        <div className="flex items-center gap-1">
                                            {Object.entries(options.flags).map(([flag, value]) => (
                                                value && (
                                                    <Badge key={flag} variant="secondary" className="font-mono text-xs">
                                                        {flag === 'global' && 'g'}
                                                        {flag === 'ignoreCase' && 'i'}
                                                        {flag === 'multiline' && 'm'}
                                                        {flag === 'dotAll' && 's'}
                                                        {flag === 'unicode' && 'u'}
                                                        {flag === 'sticky' && 'y'}
                                                    </Badge>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Explanation */}
                                {showExplanation && options.pattern && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Explanation</span>
                                        </div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {result.explanation || "Analyzing your pattern..."}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Visualizer */}
                                {showVisualizer && options.pattern && (
                                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Pattern Breakdown</span>
                                        </div>
                                        {renderRegexVisualizer()}
                                    </div>
                                )}
                                
                                {/* Flags */}
                                <div>
                                    <Label className="mb-2 block">Flags</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {Object.entries(options.flags).map(([flag, value]) => (
                                            <div key={flag} className="flex items-center gap-2">
                                                <Switch
                                                    checked={value}
                                                    onCheckedChange={(checked) => handleFlagChange(flag as keyof RegexFlags, checked)}
                                                />
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Label className="cursor-pointer text-sm">
                                                            {flag === 'global' && 'g - Global'}
                                                            {flag === 'ignoreCase' && 'i - Ignore Case'}
                                                            {flag === 'multiline' && 'm - Multiline'}
                                                            {flag === 'dotAll' && 's - Dot All'}
                                                            {flag === 'unicode' && 'u - Unicode'}
                                                            {flag === 'sticky' && 'y - Sticky'}
                                                        </Label>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            {flag === 'global' && 'Find all matches, not just the first'}
                                                            {flag === 'ignoreCase' && 'Case insensitive matching'}
                                                            {flag === 'multiline' && '^ and $ match line breaks'}
                                                            {flag === 'dotAll' && '. matches newlines'}
                                                            {flag === 'unicode' && 'Unicode support'}
                                                            {flag === 'sticky' && 'Match only at lastIndex'}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Quick Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOptions(prev => ({ ...prev, pattern: '' }))}
                                    >
                                        Clear
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Code className="w-4 h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Export Code</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleCopy(generateCode('javascript'), 'JavaScript code')}>
                                                JavaScript
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCopy(generateCode('python'), 'Python code')}>
                                                Python
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCopy(generateCode('php'), 'PHP code')}>
                                                PHP
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleCopy(generateCode('java'), 'Java code')}>
                                                Java
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* {CONFIG.enableShare && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
                                            <span className="hidden sm:inline">Share</span>
                                        </Button>
                                    )} */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Highlight Color
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setHighlightColor('yellow')}>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                                                Yellow
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setHighlightColor('green')}>
                                                <div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
                                                Green
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setHighlightColor('blue')}>
                                                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2" />
                                                Blue
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setHighlightColor('purple')}>
                                                <div className="w-3 h-3 rounded-full bg-purple-400 mr-2" />
                                                Purple
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setHighlightColor('rainbow')}>
                                                <div className="flex mr-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                                                </div>
                                                Rainbow
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Mode Selection */}
                        <Tabs value={options.mode} onValueChange={(value) => setOptions(prev => ({ ...prev, mode: value as 'test' | 'replace' }))}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="test">Test Mode</TabsTrigger>
                                <TabsTrigger value="replace">Replace Mode</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="test" className="space-y-4">
                                {/* Test String Input */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Test String</Label>
                                        {CONFIG.enableFileUpload && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('file-upload-test')?.click()}
                                            >
                                                <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Upload File</span>
                                            </Button>
                                        )}
                                        <input
                                            type="file"
                                            id="file-upload-test"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".txt,.log,.json,.csv"
                                        />
                                    </div>
                                    {renderFileUploadArea('test')}
                                </div>
                                
                                {/* Highlighted Results */}
                                {options.testString && (
                                    <Card className="shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <span>Highlighted Results</span>
                                                <div className="flex items-center gap-2">
                                                    {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
                                                    <Badge variant="outline">
                                                        {result.stats.matchCount} {result.stats.matchCount === 1 ? 'match' : 'matches'}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setFullScreenResult(!fullScreenResult)}
                                                    >
                                                        {fullScreenResult ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className={`bg-muted/30 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap ${fullScreenResult ? 'min-h-screen' : 'min-h-32'}`}>
                                                {highlightedText}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                            
                            <TabsContent value="replace" className="space-y-4">
                                {/* Test String Input */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Test String</Label>
                                        {CONFIG.enableFileUpload && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('file-upload-replace')?.click()}
                                            >
                                                <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Upload File</span>
                                            </Button>
                                        )}
                                        <input
                                            type="file"
                                            id="file-upload-replace"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".txt,.log,.json,.csv"
                                        />
                                    </div>
                                    {renderFileUploadArea('replace')}
                                </div>
                                
                                {/* Replace String Input */}
                                <div>
                                    <Label className="mb-2 block">Replace String</Label>
                                    <Input
                                        value={options.replaceString}
                                        onChange={(e) => setOptions(prev => ({ ...prev, replaceString: e.target.value }))}
                                        placeholder="Enter replacement string (use $1, $2 for groups)..."
                                        className="font-mono"
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">
                                            Use $1, $2... for groups, $& for entire match, $` for text before match, $' for text after match
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Highlighted Results */}
                                {options.testString && (
                                    <Card className="shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <span>Highlighted Results</span>
                                                <div className="flex items-center gap-2">
                                                    {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
                                                    <Badge variant="outline">
                                                        {result.stats.matchCount} {result.stats.matchCount === 1 ? 'match' : 'matches'}
                                                    </Badge>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-32">
                                                {highlightedText}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                                
                                {/* Replace Results */}
                                {result.replaceResult !== undefined && (
                                    <Card className="shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                                <span>Replace Result</span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleCopy(result.replaceResult!, 'Replace result')}
                                                    >
                                                        <Copy className="w-4 h-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Copy</span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const blob = new Blob([result.replaceResult!], { type: 'text/plain' });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = 'replaced-text.txt';
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                            URL.revokeObjectURL(url);
                                                            toast.success('File downloaded!');
                                                        }}
                                                    >
                                                        <FileDown className="w-4 h-4 mr-1 sm:mr-2" />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </Button>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-16">
                                                {result.replaceResult}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                        
                        {/* Error Alert */}
                        {result.error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{result.error}</AlertDescription>
                            </Alert>
                        )}
                        
                        {/* Matches Table */}
                        {result.matches.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <span>Match Details</span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {result.executionTime.toFixed(2)}ms
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCopyAllMatches}
                                            >
                                                <CopyIcon className="w-4 h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Copy All</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleExportMatches}
                                            >
                                                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                                                <span className="hidden sm:inline">Export</span>
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
                                        <div className="space-y-2">
                                            {result.matches.map((match, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        selectedMatch === index 
                                                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
                                                            : 'hover:bg-muted/50'
                                                    }`}
                                                    onClick={() => setSelectedMatch(index === selectedMatch ? null : index)}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                                                        <Badge variant="secondary">Match {index + 1}</Badge>
                                                        <div className="text-xs text-muted-foreground">
                                                            Position: {match.index}-{match.lastIndex}
                                                        </div>
                                                    </div>
                                                    <div className="font-mono text-sm mb-2 p-2 bg-muted/30 rounded break-all">
                                                        "{match.match}"
                                                    </div>
                                                    {match.groups.length > 0 && (
                                                        <div>
                                                            <div className="text-sm font-medium mb-1">Groups:</div>
                                                            <div className="space-y-1">
                                                                {match.groups.map((group, groupIndex) => (
                                                                    <div key={groupIndex} className="flex items-center gap-2 text-xs">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            ${groupIndex + 1}
                                                                        </Badge>
                                                                        <span className="font-mono break-all">
                                                                            {group ? `"${group}"` : 'undefined'}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {Object.keys(match.namedGroups).length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="text-sm font-medium mb-1">Named Groups:</div>
                                                            <div className="space-y-1">
                                                                {Object.entries(match.namedGroups).map(([name, value]) => (
                                                                    <div key={name} className="flex items-center gap-2 text-xs">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {name}
                                                                        </Badge>
                                                                        <span className="font-mono break-all">"{value}"</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Statistics */}
                        {result.isValid && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Card className="shadow-sm">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {result.stats.matchCount}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">Matches</div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                            {result.stats.groupCount}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">Groups</div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {result.executionTime.toFixed(2)}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">ms</div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {options.testString.length}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">Characters</div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                    
                    {/* Sidebar */}
                    {sidebarOpen && (
                        <div className={`${isMobile ? 'w-full' : isTablet ? 'w-80' : 'w-80'} space-y-4`}>
                            {/* Mobile sidebar toggle */}
                            {isMobile && (
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Reference</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                            
                            <Tabs defaultValue="cheatsheet" className="w-full">
                                <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3'} w-full`}>
                                    <TabsTrigger value="cheatsheet" className="text-xs">Reference</TabsTrigger>
                                    <TabsTrigger value="history" className="text-xs">Saved</TabsTrigger>
                                    <TabsTrigger value="examples" className="text-xs">Presets</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="cheatsheet" className="space-y-4">
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Book className="w-5 h-5" />
                                                Quick Reference
                                            </CardTitle>
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search patterns..."
                                                    value={cheatsheetSearch}
                                                    onChange={(e) => setCheatsheetSearch(e.target.value)}
                                                    className="pl-8"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-96">
                                                <div className="space-y-2">
                                                    {filteredCheatsheet.map((section) => (
                                                        <Collapsible
                                                            key={section.category}
                                                            open={openSections.includes(section.category)}
                                                            onOpenChange={(open) => {
                                                                setOpenSections(prev => 
                                                                    open 
                                                                        ? [...prev, section.category]
                                                                        : prev.filter(s => s !== section.category)
                                                                );
                                                            }}
                                                        >
                                                            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/50 rounded">
                                                                <span className="font-medium text-sm">{section.category}</span>
                                                                {openSections.includes(section.category) ? 
                                                                    <ChevronDown className="w-4 h-4" /> : 
                                                                    <ChevronRight className="w-4 h-4" />
                                                                }
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="space-y-1 pl-2">
                                                                {section.items.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="p-2 rounded hover:bg-muted/30 cursor-pointer group transition-colors"
                                                                        onClick={() => handleInsertPattern(item.pattern)}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <code className="text-xs font-mono bg-muted px-1 rounded break-all">
                                                                                {item.pattern}
                                                                            </code>
                                                                            <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground mt-1">
                                                                            {item.description}
                                                                        </div>
                                                                        {item.example && (
                                                                            <div className="text-xs text-muted-foreground mt-1 italic">
                                                                                {item.example}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                
                                <TabsContent value="history" className="space-y-4">
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <History className="w-5 h-5" />
                                                Saved Patterns
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-96">
                                                {savedPatterns.length === 0 ? (
                                                    <div className="text-center text-muted-foreground py-8">
                                                        <History className="w-8 h-8 mx-auto mb-2" />
                                                        <p>No saved patterns yet</p>
                                                        <p className="text-xs">Save patterns to access them later</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {savedPatterns
                                                            .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))
                                                            .map((pattern) => (
                                                            <div
                                                                key={pattern.id}
                                                                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                                                onClick={() => handleLoadPattern(pattern)}
                                                            >
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-sm">{pattern.name}</span>
                                                                        {pattern.isFavorite && (
                                                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleToggleFavorite(pattern.id);
                                                                            }}
                                                                        >
                                                                            {pattern.isFavorite ? 
                                                                                <Star className="w-3 h-3 text-yellow-500 fill-current" /> :
                                                                                <StarOff className="w-3 h-3" />
                                                                            }
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeletePattern(pattern.id);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <code className="text-xs font-mono bg-muted px-2 py-1 rounded block mb-2 break-all">
                                                                    /{pattern.pattern}/
                                                                    {Object.entries(pattern.flags)
                                                                        .filter(([, value]) => value)
                                                                        .map(([key]) => {
                                                                            switch (key) {
                                                                                case 'global': return 'g';
                                                                                case 'ignoreCase': return 'i';
                                                                                case 'multiline': return 'm';
                                                                                case 'dotAll': return 's';
                                                                                case 'unicode': return 'u';
                                                                                case 'sticky': return 'y';
                                                                                default: return '';
                                                                            }
                                                                        })
                                                                        .join('')}
                                                                </code>
                                                                {pattern.description && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {pattern.description}
                                                                    </div>
                                                                )}
                                                                {pattern.tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {pattern.tags.map((tag, index) => (
                                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                                {tag}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                
                                <TabsContent value="examples" className="space-y-4">
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Zap className="w-5 h-5" />
                                                Example Patterns
                                            </CardTitle>
                                            {/* Category filter */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {exampleCategories.map(category => (
                                                    <Button
                                                        key={category}
                                                        variant={selectedExampleCategory === category ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedExampleCategory(category)}
                                                        className="text-xs capitalize"
                                                    >
                                                        {category}
                                                    </Button>
                                                ))}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-96">
                                                <div className="space-y-3">
                                                    {filteredExamples.map((example, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                                            onClick={() => handleLoadExample(example)}
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                                                                <span className="font-medium text-sm">{example.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    {example.category && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {example.category}
                                                                        </Badge>
                                                                    )}
                                                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                                </div>
                                                            </div>
                                                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded block mb-2 break-all">
                                                                {example.pattern}
                                                            </code>
                                                            <div className="text-xs text-muted-foreground">
                                                                {example.description}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
                
                {/* Mobile bottom bar for sidebar toggle */}
                {isMobile && !sidebarOpen && (
                    <div className="fixed bottom-4 right-4 z-10">
                        <Button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-full shadow-lg"
                            size="lg"
                        >
                            <Book className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}