import {  ToolCardProps } from "@/components/tool-card";
export const tools: ToolCardProps[] = [
  // === SECURITY ===
  {
    name: "Token Generator",
    slug: "token-generator",
    description: "Generate random strings for passwords, API keys, and security tokens",
    info: "Quickly create secure tokens for auth, API keys, or password reset flows. Customizable length and character sets.",
    category: "Security",
    version: "1.0.0",
    tags: ["generator", "api-key", "password"],
    type:"tool"
  },
  {
    name: "JWT Decoder & Encoder",
    slug: "jwt",
    description: "Decode and encode JSON Web Tokens with expiration and issuer validation",
    info: "Inspect JWT payloads, validate signatures, and generate new tokens. Supports HS and RS algorithms.",
    category: "Security",
    version: "1.0.0",
    tags: ["encode", "decode", "authentication"],
    type:"tool"
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files",
    info: "Generate checksums for file integrity or hash passwords. Supports file upload and batch hashing.",
    category: "Security",
    version: "1.0.0",
    tags: ["cryptography", "checksum"],
    type:"tool"
  },
  {
    name: "Password Strength Checker",
    slug: "password-strength-checker",
    description: "Analyze password entropy and breach status",
    info: "Check password strength against entropy rules and known breaches. Get suggestions for stronger alternatives.",
    category: "Security",
    version: "1.0.0",
    tags: ["validator", "security"],
    type:"tool"
  },
  {
    name: "HMAC Generator",
    slug: "hmac-generator",
    description: "Generate HMAC signatures for API auth",
    info: "Generate HMAC signatures using SHA-256 or other algorithms. Ideal for securing webhook payloads.",
    category: "Security",
    version: "1.0.0",
    tags: ["signature", "authentication", "cryptography"],
    type:"tool"
  },
  {
    name: "Bcrypt Generator",
    slug: "bcrypt-generator",
    description: "Advanced bcrypt password hashing and verification tool with customizable rounds.",
    info:"This tool generates and verifies password hashes using the Bcrypt algorithm, an industry standard for secure password storage.",
    category: "Security",
    tags: ["Security", "Password", "Hashing", "Bcrypt", "Authentication"],
    type:"tool"
  },
  {
    name: 'RSA Key Pair Generator',
    slug: 'rsa-generator',
    description: 'Generate secure RSA key pairs with customizable options and export formats',
    info:"Generate a new random RSA private and public PEM certificate key pair for encryption and digital signatures",
    category: 'Security',
    tags: ['security', 'encryption', 'cryptography', 'devops'],
    type:"tool"
  },

  // === GENERATOR ===
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate v1 and v4 UUIDs with formatting options",
    info: "Generate UUIDs for database records or session IDs. Choose between v1 (time-based) or v4 (random).",
    category: "Generator",
    version: "1.0.0",
    tags: ["identifier", "unique-id"],
    type:"tool"
  },
  {
    name: 'ULID Generator',
    slug: 'ulid-generator',
    description: 'Generate ULIDs with time-based sorting and advanced options.',
    info:"ULID is a 26-character, universally unique, lexicographically sortable identifier.",
    category: 'Generator',
    tags: ['ulid', 'identifier', 'sortable', 'time-based'],
    type:"tool"
  },
  {
    name: "Cron Expression Generator",
    slug: "cron-expression-generator",
    description: "Advanced cron expression builder with visual editor and next run times",
    info: "Build, validate, and test cron expressions with a visual editor. See next run times and get human-readable descriptions.",
    category: "Generator",
    version: "1.0.0",
    tags: ["cron", "scheduler", "automation", "devops"],
    type:"tool"
  },
  // {
  //   name: "Lorem Ipsum Generator",
  //   slug: "lorem-ipsum-generator",
  //   description: "Placeholder text generator",
  //   info: "Generate customizable dummy text for mockups and prototypes. Control paragraphs, words, and sentences.",
  //   category: "Generator",
  //   version: "1.0.0",
  //   tags: ["text", "mockup"],
  // },
  // === CONVERTER ===
  {
    name: "JSON ↔ YAML Converter",
    slug: "json-yaml-converter",
    description: "Advanced JSON ⇄ YAML converter with validation, formatting and more",
    info: "Convert between JSON and YAML formats. Includes syntax highlighting and error detection.",
    category: "Converter",
    version: "1.0.0",
    tags: ["json", "yaml", "validate", "format"],
    type:"tool"
  },
  {
    name: "JSON ↔ CSV Converter",
    slug: "json-csv-converter",
    description: "Convert between JSON and CSV formats with preview and advanced options",
    info: "Transform JSON arrays to CSV tables and vice versa. Supports nested arrays and custom delimiters.",
    category: "Converter",
    version: "1.0.0",
    tags: ["json", "csv", "data"],
    type:"tool"
  },
  {
    name: "JSON ↔ XML Converter",
    slug: "json-xml-converter",
    description: "Advanced JSON ⇄ XML converter with validation, formatting, and history",
    info: "Transform JSON arrays to XML and vice versa. Supports nested arrays and custom delimiters.",
    category: "Converter",
    version: "1.0.0",
    tags: ["JSON", "XML", "Converter", "Formatter", "Validator"],
    type:"tool"
  },
  {
    name: "JSON ↔ TOML Converter",
    slug: "json-toml-converter",
    description: "Advanced JSON ⇄ TOML converter with validation, formatting, and history",
    info: "Transform JSON arrays to Toml and vice versa. Supports nested arrays and custom delimiters.",
    category: "Converter",
    version: "1.0.0",
    tags: ["JSON", "TOML", "Converter", "Formatter", "Validator"],
    type:"tool"
  },
  {
    name: 'TOML-YAML Converter',
    description: 'Convert between TOML and YAML formats with advanced options',
    slug: 'toml-yaml-converter',
    info:"Transform Yaml to Toml and vice versa. Supports nested arrays and custom delimiters.",
    category: 'Data Converters',
    tags: ['TOML', 'yaml', 'Converter', 'data'],
    type:"tool"
  },
  {
    name: 'Base Converter',
    description: 'Convert numbers between binary, octal, decimal, hexadecimal, and custom bases (2-36).',
    slug: 'base-converter',
    info: "Transform diffrent types of binary , octal , hexadecimal and custom bases (2-36) to each other.",
    category: 'Converter',
    version: "1.0.0",
    tags: ['Converter', 'binary', 'hex', 'decimal'],
    type:"tool"
  },

  // === TEXT & DATA ===
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64",
    description: "Convert text or files to/from Base64",
    info: "Encode text or files to Base64 or decode Base64 content back. Supports drag-and-drop files.",
    category: "Text & Data",
    version: "1.0.0",
    tags: ["encode", "decode", "file"],
    type:"tool"
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    description: "Test and debug regex patterns in real-time",
    info: "Write and test regular expressions with live matches. Includes cheatsheet and flags.",
    category: "Text & Data",
    version: "1.0.0",
    tags: ["pattern", "validation", "test"],
    type:"tool",
  },
  {
    name: "URL Encoder/Decoder",
    slug: "url-encoder-decoder",
    description: "Encode/decode URL components",
    info: "Safely encode special characters in URLs or decode percent-encoded strings.",
    category: "Text & Data",
    version: "1.0.0",
    tags: ["url", "encode", "decode"],
    type:"tool"
  },
  // {
  //   name: "Markdown Previewer",
  //   slug: "markdown-previewer",
  //   description: "Live preview with GitHub-style support",
  //   info: "Write Markdown and see a live GitHub-style preview. Supports tables, code blocks, and syntax highlighting.",
  //   category: "Text & Data",
  //   version: "1.0.0",
  //   tags: ["markdown", "preview", "documentation"],
  // },

  // === NETWORKING ===
  {
    name: "cURL Builder",
    slug: "curl-builder",
    description: "Advanced cURL command builder for API development, testing, and debugging",
    info: "Build cURL commands with a visual editor. Test headers, methods, body, and auth. Export to terminal.",
    category: "Networking",
    version: "1.0.0",
    tags: ["api", "http", "debug"],
    type:"tool"
  },
  // {
  //   name: "HTTP Status Code Lookup",
  //   slug: "http-status-lookup",
  //   description: "Lookup meanings and common causes",
  //   info: "Search HTTP status codes (1xx–5xx) and see their meanings, common causes, and usage examples.",
  //   category: "Networking",
  //   version: "1.0.0",
  //   tags: ["http", "status", "reference"],
  // },
  // {
  //   name: "DNS Lookup Tool",
  //   slug: "dns-lookup",
  //   description: "Query A, CNAME, MX, TXT records",
  //   info: "Perform DNS lookups for any domain. Supports A, AAAA, CNAME, MX, TXT, and more record types.",
  //   category: "Networking",
  //   version: "1.0.0",
  //   tags: ["dns", "domain", "network"],
  // },
  // {
  //   name: "SSL Certificate Checker",
  //   slug: "ssl-checker",
  //   description: "Check expiry, issuer, chain validity",
  //   info: "Inspect SSL certificates for any domain. View expiry date, issuer, chain validity, and cipher suite.",
  //   category: "Networking",
  //   version: "1.0.0",
  //   tags: ["ssl", "tls", "certificate"],
  // },
  // {
  //   name: "WebSocket Tester",
  //   slug: "websocket-tester",
  //   description: "Test WebSocket connections and messages",
  //   info: "Connect to WebSocket endpoints, send messages, and view responses. Ideal for real-time app debugging.",
  //   category: "Networking",
  //   version: "1.0.0",
  //   tags: ["websocket", "realtime", "debug"],
  // },

  // === DESIGN ===
  {
    name: "Color Tool",
    slug: "color",
    description: "Advanced color manipulation and palette generation tool",
    info: "Generate color palettes, convert formats (HEX, RGB, HSL), and check contrast for accessibility compliance.",
    category: "Design",
    version: "1.0.0",
    tags: ["palette", "accessibility", "css"],
    type:"tool"
  },
  // {
  //   name: "CSS Unit Converter",
  //   slug: "css-unit-converter",
  //   description: "Convert between px, em, rem, %, vw/vh",
  //   info: "Convert CSS units between px, em, rem, %, vw, vh. Includes base font size customization.",
  //   category: "Design",
  //   version: "1.0.0",
  //   tags: ["css", "unit", "design"],
  // },
  // {
  //   name: "Favicon Generator",
  //   slug: "favicon-generator",
  //   description: "Create .ico and PNG files in multiple sizes",
  //   info: "Upload an image and generate favicons in all required sizes for browsers and devices.",
  //   category: "Design",
  //   version: "1.0.0",
  //   tags: ["favicon", "icon", "design"],
  // },
  // {
  //   name: "Gradient Generator",
  //   slug: "gradient-generator",
  //   description: "CSS linear/radial gradient builder",
  //   info: "Create CSS gradients with a visual editor. Supports linear, radial, and multi-color gradients.",
  //   category: "Design",
  //   version: "1.0.0",
  //   tags: ["gradient", "css", "design"],
  // },

  // === DEVOPS & UTILS ===
  // {
  //   name: "Dockerfile Linter",
  //   slug: "dockerfile-linter",
  //   description: "Validate and format Dockerfiles",
  //   info: "Lint Dockerfiles for best practices and errors. Supports formatting and multi-stage builds.",
  //   category: "DevOps & Utils",
  //   version: "1.0.0",
  //   tags: ["docker", "lint", "devops"],
  // },
  // {
  //   name: "Git Commit Message Generator",
  //   slug: "git-commit-generator",
  //   description: "Follows conventional commit spec",
  //   info: "Write structured commit messages following the conventional commit spec. Includes type and scope.",
  //   category: "DevOps & Utils",
  //   version: "1.0.0",
  //   tags: ["git", "commit", "conventional"],
  // },
  // {
  //   name: "Environment Variables Editor",
  //   slug: "env-editor",
  //   description: "Validate and format .env files",
  //   info: "Edit and validate .env files. Check for syntax errors and duplicate keys.",
  //   category: "DevOps & Utils",
  //   version: "1.0.0",
  //   tags: ["env", "config", "validation"],
  // },
];