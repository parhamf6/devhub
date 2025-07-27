import {  ToolCardProps } from "@/components/tool-card";
export const tools: ToolCardProps[] = [
  {
    name: "Token Generator",
    slug: "token-generator",
    description: "Generate random strings for passwords, API keys, and security tokens",
    category: "Secuirty",
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
];

// Future: Uncomment to use localStorage
// export const tools = JSON.parse(localStorage.getItem('favorite-tools') || '[]')
