// Types
export interface RegexMatch {
    match: string;
    groups: (string | undefined)[];
    namedGroups: Record<string, string>;
    index: number;
    lastIndex: number;
    input: string;
}
export interface RegexFlags {
    global: boolean;
    ignoreCase: boolean;
    multiline: boolean;
    dotAll: boolean;
    unicode: boolean;
    sticky: boolean;
}
export interface RegexOptions {
    pattern: string;
    flags: RegexFlags;
    testString: string;
    replaceString: string;
    mode: 'test' | 'replace';
}
export interface RegexResult {
    matches: RegexMatch[];
    isValid: boolean;
    error?: string;
    executionTime: number;
    explanation?: string;
    replaceResult?: string;
    stats: {
        matchCount: number;
        groupCount: number;
        totalSteps?: number;
    };
}
export interface SavedPattern {
    id: string;
    name: string;
    pattern: string;
    flags: RegexFlags;
    description?: string;
    tags: string[];
    createdAt: Date;
    isFavorite: boolean;
}


export interface CheatsheetItem {
    category: string;
    items: Array<{
        pattern: string;
        description: string;
        example?: string;
    }>;
}

export interface ExamplePattern {
    name: string;
    pattern: string;
    flags: RegexFlags;
    testString: string;
    description: string;
    category?: string;
}




// Cheatsheet data
export const CHEATSHEET_DATA: CheatsheetItem[] = [
    {
        category: "Character Classes",
        items: [
            { pattern: "\\d", description: "Any digit (0-9)", example: "\\d+ matches '123'" },
            { pattern: "\\D", description: "Any non-digit", example: "\\D+ matches 'abc'" },
            { pattern: "\\w", description: "Word character (a-z, A-Z, 0-9, _)", example: "\\w+ matches 'hello_123'" },
            { pattern: "\\W", description: "Non-word character", example: "\\W+ matches '!@#'" },
            { pattern: "\\s", description: "Whitespace character", example: "\\s+ matches spaces/tabs" },
            { pattern: "\\S", description: "Non-whitespace character", example: "\\S+ matches 'text'" },
            { pattern: "[a-z]", description: "Lowercase letters", example: "[a-z]+ matches 'hello'" },
            { pattern: "[A-Z]", description: "Uppercase letters", example: "[A-Z]+ matches 'HELLO'" },
            { pattern: "[0-9]", description: "Any digit", example: "[0-9]+ matches '123'" },
            { pattern: "[^abc]", description: "Not a, b, or c", example: "[^abc]+ matches 'xyz'" }
        ]
    },
    {
        category: "Quantifiers",
        items: [
            { pattern: "*", description: "0 or more", example: "a* matches '', 'a', 'aaa'" },
            { pattern: "+", description: "1 or more", example: "a+ matches 'a', 'aaa'" },
            { pattern: "?", description: "0 or 1", example: "a? matches '', 'a'" },
            { pattern: "{n}", description: "Exactly n times", example: "a{3} matches 'aaa'" },
            { pattern: "{n,}", description: "n or more times", example: "a{2,} matches 'aa', 'aaa'" },
            { pattern: "{n,m}", description: "Between n and m times", example: "a{2,4} matches 'aa' to 'aaaa'" }
        ]
    },
    {
        category: "Anchors",
        items: [
            { pattern: "^", description: "Start of string/line", example: "^hello matches line starting with 'hello'" },
            { pattern: "$", description: "End of string/line", example: "world$ matches line ending with 'world'" },
            { pattern: "\\b", description: "Word boundary", example: "\\bword\\b matches 'word' not 'sword'" },
            { pattern: "\\B", description: "Non-word boundary", example: "\\Bword matches 'sword' not 'word'" },
            { pattern: "\\A", description: "Start of string only", example: "\\Ahello matches start of entire string" },
            { pattern: "\\Z", description: "End of string only", example: "world\\Z matches end of entire string" }
        ]
    },
    {
        category: "Groups & Lookarounds",
        items: [
            { pattern: "()", description: "Capturing group", example: "(\\d+) captures numbers" },
            { pattern: "(?:)", description: "Non-capturing group", example: "(?:\\d+) groups without capture" },
            { pattern: "(?=)", description: "Positive lookahead", example: "\\d(?=px) matches digit before 'px'" },
            { pattern: "(?!)", description: "Negative lookahead", example: "\\d(?!px) matches digit not before 'px'" },
            { pattern: "(?<=)", description: "Positive lookbehind", example: "(?<=\\$)\\d+ matches digits after '$'" },
            { pattern: "(?<!)", description: "Negative lookbehind", example: "(?<!\\$)\\d+ matches digits not after '$'" }
        ]
    },
    {
        category: "Common Patterns",
        items: [
            { pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Email address" },
            { pattern: "https?://[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+", description: "URL" },
            { pattern: "\\d{3}-\\d{3}-\\d{4}", description: "Phone number (XXX-XXX-XXXX)" },
            { pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", description: "IPv4 address" },
            { pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}", description: "Hex color" },
            { pattern: "\\b[A-Z]{2,}\\b", description: "Acronyms (2+ uppercase letters)" }
        ]
    }
];

// Expanded example patterns with categories
export const EXAMPLE_PATTERNS: ExamplePattern[] = [
    // Email patterns
    {
        name: "Email Validation",
        pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Contact us at support@example.com or sales@company.org for more info.",
        description: "Validates email addresses",
        category: "Email"
    },
    {
        name: "Username Validation",
        pattern: "^[a-zA-Z0-9_]{4,16}$",
        flags: { global: false, ignoreCase: true, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Valid usernames: user_123, JohnDoe, test_user\nInvalid usernames: user@name, very-long-username",
        description: "Validates usernames (4-16 characters, alphanumeric + underscore)",
        category: "Email"
    },
    
    // URL patterns
    {
        name: "Extract URLs",
        pattern: "https?://[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+",
        flags: { global: true, ignoreCase: true, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Visit https://example.com or http://test.org for more information.",
        description: "Extracts HTTP and HTTPS URLs",
        category: "URL"
    },
    {
        name: "URL Parameters",
        pattern: "[?&]([^=]+)=([^&]*)",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "https://example.com/search?q=regex&page=2&lang=en",
        description: "Extracts URL parameters",
        category: "URL"
    },
    
    // Phone number patterns
    {
        name: "Phone Numbers (US)",
        pattern: "\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Call (555) 123-4567 or 555-123-4567 or 555 123 4567",
        description: "Matches various US phone number formats",
        category: "Phone"
    },
    {
        name: "International Phone Numbers",
        pattern: "\\+(?:[0-9] ?){6,14}[0-9]",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Contact us at +1 (555) 123-4567 or +44 20 7946 0958",
        description: "Matches international phone numbers with country code",
        category: "Phone"
    },
    
    // Date patterns
    {
        name: "Date (YYYY-MM-DD)",
        pattern: "\\d{4}-\\d{2}-\\d{2}",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Dates: 2023-01-15, 1999-12-31, 2023-02-28",
        description: "Matches dates in YYYY-MM-DD format",
        category: "Date"
    },
    {
        name: "Time (HH:MM:SS)",
        pattern: "([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Times: 09:30:45, 14:25:10, 23:59:59",
        description: "Matches time in HH:MM:SS format",
        category: "Date"
    },
    
    // Color patterns
    {
        name: "Hex Colors",
        pattern: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Colors: #FF5733, #fff, #123456, invalid: #12G",
        description: "Matches hex color codes",
        category: "Color"
    },
    {
        name: "RGB Colors",
        pattern: "rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)",
        flags: { global: true, ignoreCase: true, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Colors: rgb(255, 87, 51), RGB(120, 200, 80), rgb(0, 0, 0)",
        description: "Matches RGB color values",
        category: "Color"
    },
    
    // Text patterns
    {
        name: "HTML Tags",
        pattern: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)</\\1>",
        flags: { global: true, ignoreCase: true, multiline: false, dotAll: true, unicode: false, sticky: false },
        testString: "<div class='example'>Hello world</div><p>This is a paragraph</p>",
        description: "Matches HTML tags and their content",
        category: "Text"
    },
    {
        name: "Markdown Headers",
        pattern: "^#{1,6}\\s+(.+)$",
        flags: { global: true, ignoreCase: false, multiline: true, dotAll: false, unicode: false, sticky: false },
        testString: "# Header 1\n## Header 2\n### Header 3\nThis is not a header",
        description: "Matches Markdown headers (# to ######)",
        category: "Text"
    },
    
    // Validation patterns
    {
        name: "Password Strength",
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        flags: { global: false, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Valid: StrongPass123!\nInvalid: weak, onlylowercase, NoNumbers!",
        description: "Validates strong passwords (8+ chars, mixed case, numbers, special chars)",
        category: "Validation"
    },
    {
        name: "Credit Card",
        pattern: "\\b(?:\\d[ -]*?){13,16}\\b",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Card numbers: 4111-1111-1111-1111, 4111 1111 1111 1111, 4111111111111111",
        description: "Matches credit card numbers (13-16 digits)",
        category: "Validation"
    },
    
    // Code patterns
    {
        name: "JavaScript Variables",
        pattern: "\\b(?:var|let|const)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "const x = 5; let y = 10; var z = 15;",
        description: "Matches JavaScript variable declarations",
        category: "Code"
    },
    {
        name: "CSS Selectors",
        pattern: "([a-zA-Z0-9_-]+)(\\.[a-zA-Z0-9_-]+)?(#[a-zA-Z0-9_-]+)?",
        flags: { global: true, ignoreCase: false, multiline: false, dotAll: false, unicode: false, sticky: false },
        testString: "Selectors: div, .class, #id, div.class, div#id",
        description: "Matches CSS selectors (element, class, ID)",
        category: "Code"
    }
];