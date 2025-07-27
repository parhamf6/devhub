import { tools } from "./toolDate";

export const tags = Array.from(
    new Set(tools.flatMap(tool => tool.tags))
).sort();
