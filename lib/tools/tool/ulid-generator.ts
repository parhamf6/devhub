// lib/tools/tool/ulid-generator.ts
import { ulid } from 'ulid';

export interface ULIDOptions {
  count?: number;
  uppercase?: boolean;
  time?: Date | null;
  entropy?: string | null;
  includeTimestamp?: boolean;
  sortDirection?: 'asc' | 'desc';
}

// Helper function to decode time from ULID
function decodeTime(id: string): number {
  const timeStr = id.substring(0, 10);
  return parseInt(timeStr, 32);
}

function generateULID(options?: ULIDOptions): string[] {
  const count = Math.max(1, Math.min(100, options?.count ?? 1));
  const uppercase = options?.uppercase ?? false;
  const time = options?.time ?? null;
  const entropy = options?.entropy ?? null;
  const includeTimestamp = options?.includeTimestamp ?? false;
  const sortDirection = options?.sortDirection ?? 'asc';

  const create = (): string => {
    let id: string;
    
    if (time) {
      // Generate ULID for specific time
      id = ulid(time.getTime());
    } else if (entropy) {
      // Generate ULID with specific entropy
      id = ulid(ulid().slice(0, 10) + entropy);
    } else {
      // Generate standard ULID
      id = ulid();
    }
    
    if (uppercase) id = id.toUpperCase();
    
    if (includeTimestamp) {
      const timestamp = decodeTime(id);
      id = `${id} (Timestamp: ${new Date(timestamp).toISOString()})`;
    }
    
    return id;
  };

  const ulids = Array.from({ length: count }, () => create());
  
  // Sort ULIDs if needed
  if (sortDirection === 'asc') {
    ulids.sort((a, b) => a.localeCompare(b));
  } else if (sortDirection === 'desc') {
    // reverse sort
    ulids.sort((a, b) => b.localeCompare(a));
  }
  
  return ulids;
}

const ulidGenerator = {
  name: 'ULID Generator',
  slug: 'ulid-generator',
  description: 'Generate ULIDs with time-based sorting and advanced options.',
  category: 'Generator',
  tags: ['ulid', 'identifier', 'sortable', 'time-based'],
  generate: generateULID,
};

export default ulidGenerator;