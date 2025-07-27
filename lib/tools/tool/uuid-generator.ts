// lib/tools/tool/uuid-generator.ts

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export type UUIDVersion = 'v1' | 'v4';

export interface UUIDOptions {
    version?: UUIDVersion;
    uppercase?: boolean;
    removeHyphens?: boolean;
    count?: number;
}

function generateUUID(options?: UUIDOptions): string[] {
    const version = options?.version || 'v4';
    const uppercase = options?.uppercase ?? false;
    const removeHyphens = options?.removeHyphens ?? false;
    const count = Math.max(1, Math.min(100, options?.count ?? 1));

    const create = () => {
        let id = version === 'v1' ? uuidv1() : uuidv4();
        if (removeHyphens) id = id.replace(/-/g, '');
        if (uppercase) id = id.toUpperCase();
        return id;
    };

    return Array.from({ length: count }, () => create());
}

const uuidGenerator = {
    name: 'UUID Generator',
    slug: 'uuid-generator',
    description: 'Generate v1 and v4 UUIDs with formatting options.',
    category: 'Generator',
    tags: ['uuid', 'identifier', 'v4', 'v1'],
    generate: generateUUID,
};

export default uuidGenerator;
