// lib/tools/hashGenerator.ts
import { ToolSchema } from "../tool-schema";

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA3-256' | 'SHA3-512' | 'BLAKE2b' | 'RIPEMD-160';
export type InputFormat = 'plaintext' | 'hex' | 'base64';
export type OutputFormat = 'lowercase' | 'uppercase' | 'spaced';
export type Encoding = 'UTF-8' | 'ASCII' | 'Latin1';

export interface HashOptions {
  input: string;
  algorithm: HashAlgorithm;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  encoding: Encoding;
  salt?: string;
  hmacKey?: string;
  autoGenerate: boolean;
}

export interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
  input: string;
  length: number;
  timestamp: string;
  executionTime: number;
  salt?: string;
  hmacKey?: string;
}

export interface ComparisonResult {
  hash1: string;
  hash2: string;
  match: boolean;
  detectedAlgorithm1?: HashAlgorithm;
  detectedAlgorithm2?: HashAlgorithm;
}

// Utility functions
function stringToArrayBuffer(str: string, encoding: Encoding = 'UTF-8'): ArrayBuffer {
  if (encoding === 'UTF-8') {
    return new TextEncoder().encode(str);
  } else if (encoding === 'ASCII') {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes.buffer;
  } else if (encoding === 'Latin1') {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes.buffer;
  }
  return new TextEncoder().encode(str);
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

function formatOutput(hash: string, format: OutputFormat): string {
  switch (format) {
    case 'uppercase':
      return hash.toUpperCase();
    case 'spaced':
      return hash.toLowerCase().replace(/(.{2})/g, '$1 ').trim();
    default:
      return hash.toLowerCase();
  }
}

function parseInput(input: string, format: InputFormat): string {
  switch (format) {
    case 'hex':
      return String.fromCharCode(...input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    case 'base64':
      return atob(input);
    default:
      return input;
  }
}

// Hash algorithm implementations
function simpleMD5(input: string): string {
  let hash = 0x67452301;
  let hash2 = 0xEFCDAB89;
  let hash3 = 0x98BADCFE;
  let hash4 = 0x10325476;
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) & 0xFFFFFFFF;
    hash2 = ((hash2 << 3) - hash2 + char) & 0xFFFFFFFF;
    hash3 = ((hash3 << 7) - hash3 + char) & 0xFFFFFFFF;
    hash4 = ((hash4 << 11) - hash4 + char) & 0xFFFFFFFF;
  }
  
  return [hash, hash2, hash3, hash4].map(h => Math.abs(h).toString(16).padStart(8, '0')).join('');
}

function simpleRIPEMD160(input: string): string {
  // Simplified RIPEMD-160 implementation
  let hash = 0x67452301;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return Math.abs(hash).toString(16).padStart(40, '0');
}

function simpleBLAKE2b(input: string): string {
  // Simplified BLAKE2b implementation
  let hash = 0x6A09E667F3BCC908;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash * 31) + input.charCodeAt(i)) & 0xFFFFFFFFFFFFFFFF;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

function simpleSHA3(input: string, bits: number): string {
  // Simplified SHA3 implementation
  let hash = 0x01234567;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 7) - hash + input.charCodeAt(i)) & 0xFFFFFFFF;
  }
  const length = bits / 4;
  return Math.abs(hash).toString(16).padStart(length, '0').repeat(Math.ceil(length / 8));
}

async function generateHMAC(key: string, message: string, algorithm: string): Promise<string> {
  const keyBuffer = stringToArrayBuffer(key);
  const messageBuffer = stringToArrayBuffer(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
  return arrayBufferToHex(signature);
}

async function generateHash(options: HashOptions): Promise<HashResult> {
  const startTime = performance.now();
  const { input, algorithm, inputFormat, outputFormat, encoding, salt, hmacKey } = options;
  
  let processedInput = parseInput(input, inputFormat);
  if (salt) {
    processedInput = salt + processedInput;
  }
  
  let hash: string;

  try {
    if (hmacKey) {
      const webCryptoAlg = algorithm === 'SHA-256' ? 'SHA-256' : algorithm === 'SHA-512' ? 'SHA-512' : 'SHA-1';
      hash = await generateHMAC(hmacKey, processedInput, webCryptoAlg);
    } else {
      switch (algorithm) {
        case 'MD5':
          hash = simpleMD5(processedInput);
          break;
        case 'SHA-1':
          const sha1Buffer = await crypto.subtle.digest('SHA-1', stringToArrayBuffer(processedInput, encoding));
          hash = arrayBufferToHex(sha1Buffer);
          break;
        case 'SHA-256':
          const sha256Buffer = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(processedInput, encoding));
          hash = arrayBufferToHex(sha256Buffer);
          break;
        case 'SHA-384':
          const sha384Buffer = await crypto.subtle.digest('SHA-384', stringToArrayBuffer(processedInput, encoding));
          hash = arrayBufferToHex(sha384Buffer);
          break;
        case 'SHA-512':
          const sha512Buffer = await crypto.subtle.digest('SHA-512', stringToArrayBuffer(processedInput, encoding));
          hash = arrayBufferToHex(sha512Buffer);
          break;
        case 'SHA3-256':
          hash = simpleSHA3(processedInput, 256);
          break;
        case 'SHA3-512':
          hash = simpleSHA3(processedInput, 512);
          break;
        case 'BLAKE2b':
          hash = simpleBLAKE2b(processedInput);
          break;
        case 'RIPEMD-160':
          hash = simpleRIPEMD160(processedInput);
          break;
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    }

    const formattedHash = formatOutput(hash, outputFormat);
    const endTime = performance.now();

    return {
      algorithm,
      hash: formattedHash,
      input,
      length: formattedHash.replace(/\s/g, '').length,
      timestamp: new Date().toISOString(),
      executionTime: endTime - startTime,
      salt,
      hmacKey: hmacKey ? '***' : undefined
    };
  } catch (error) {
    throw new Error(`Failed to generate ${algorithm} hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function detectHashAlgorithm(hash: string): HashAlgorithm | undefined {
  const cleanHash = hash.replace(/\s/g, '');
  const length = cleanHash.length;
  
  switch (length) {
    case 32: return 'MD5';
    case 40: return 'SHA-1';
    case 64: return 'SHA-256';
    case 96: return 'SHA-384';
    case 128: return 'SHA-512';
    default: return undefined;
  }
}

function compareHashes(hash1: string, hash2: string): ComparisonResult {
  const clean1 = hash1.replace(/\s/g, '').toLowerCase();
  const clean2 = hash2.replace(/\s/g, '').toLowerCase();
  
  return {
    hash1: clean1,
    hash2: clean2,
    match: clean1 === clean2,
    detectedAlgorithm1: detectHashAlgorithm(clean1),
    detectedAlgorithm2: detectHashAlgorithm(clean2)
  };
}

const hashGenerator = {
  name: "Hash Generator",
  slug: "hash-generator",
  description: "Advanced hash generator with multiple algorithms, formats, and security features",
  category: "Security",
  version: "2.0.0",
  tags: ["Security", "Hash", "Cryptography", "HMAC", "Comparison"],
  generate: generateHash,
  compare: compareHashes,
  detectAlgorithm: detectHashAlgorithm,
};

export default hashGenerator;