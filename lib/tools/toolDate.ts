import {  ToolCardProps } from "@/components/tool-card";
export const tools: ToolCardProps[] = [
  {
    name: "Token Generator",
    slug: "token-generator",
    description: "Generate random strings for passwords, API keys, and security tokens",
    category: "Security",
    version: "0.0.1",
    tags: ["Security", "Token"],
    // icon: "/icons/eslint.png",
  },
  {
    name: 'UUID Generator',
    slug: 'uuid-generator',
    description: 'Generate v1 and v4 UUIDs with formatting options.',
    category: 'Generator',
    version: "0.0.1",
    tags: ['uuid', 'identifier'],
  },
  {
    name: "JWT Decoder & Encoder",
    slug: "jwt",
    description: "Decode and encode JSON Web Tokens with expiration and issuer validation.",
    category: "Security",
    version: "1.0.0",
    tags: ["Security", "JWT", "Token", "Authentication", "Decode", "Encode"],
  },
  {
    slug: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Convert text or files to/from Base64. Useful for encoding tokens, images, and binary data.",
    category: "Text",
    tags: ["text", "encode", "decode", "base64", "file"],
  }
];

// Future: Uncomment to use localStorage
// export const tools = JSON.parse(localStorage.getItem('favorite-tools') || '[]')
