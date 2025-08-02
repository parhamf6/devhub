import { tools } from "./toolDate";

export const tags = Array.from(
    new Set(
        tools.flatMap(tool => tool.tags).filter((tag): tag is string => typeof tag === 'string')
    )
).sort((a, b) => a.localeCompare(b));
