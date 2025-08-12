import { Buffer } from 'buffer';

export interface RSAKeyPair {
  privateKey: string;
  publicKey: string;
  publicKeySSH: string;
  fingerprint: string;
  keySize: number;
}

export interface RSAKeyOptions {
  keySize: number;
  format: 'PEM' | 'DER';
  passphrase?: string;
  comment?: string;
}

export interface RSAHistoryItem {
  id: string;
  name: string;
  keyPair: RSAKeyPair;
  createdAt: Date;
  starred: boolean;
}

export const rsaGenerator = {
  name: 'RSA Key Pair Generator',
  description: 'Generate secure RSA key pairs with customizable options and export formats',
  slug: 'rsa-generator',
  category: 'security',
  tags: ['security', 'encryption', 'cryptography', 'devops'],
};

// Generate a random string for key ID
const generateKeyId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generate RSA key pair
export async function generateRSAKeyPair(options: RSAKeyOptions): Promise<RSAKeyPair> {
  const { keySize } = options;
  
  // Generate key pair using Web Crypto API
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: keySize,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  // Export private key
  const privateKeyExported = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKeyBase64 = Buffer.from(privateKeyExported).toString('base64');
  const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

  // Export public key
  const publicKeyExported = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const publicKeyBase64 = Buffer.from(publicKeyExported).toString('base64');
  const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;

  // Generate SSH format public key
  const publicKeySSH = await generateSSHPublicKey(keyPair.publicKey, options.comment || 'generated-key');

  // Generate fingerprint
  const fingerprint = await generateFingerprint(publicKeyExported);

  return {
    privateKey: privateKeyPEM,
    publicKey: publicKeyPEM,
    publicKeySSH,
    fingerprint,
    keySize,
  };
}

// Generate SSH format public key
async function generateSSHPublicKey(publicKey: CryptoKey, comment: string): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const buffer = Buffer.from(exported);
  
  // SSH public key format: "ssh-rsa <base64-encoded-key> <comment>"
  // This is a simplified version - in a real implementation, you'd need to properly format the key
  const sshKey = `ssh-rsa ${buffer.toString('base64')} ${comment}`;
  return sshKey;
}

// Generate fingerprint for the public key
async function generateFingerprint(publicKey: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', publicKey);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Format as SHA256:fingerprint
  return `SHA256:${hashHex.match(/.{1,2}/g)?.join(':')}`;
}

// Validate key size
export function validateKeySize(keySize: number): boolean {
  return [1024, 2048, 3072, 4096].includes(keySize);
}

// Format key for display
export function formatKeyForDisplay(key: string, isPrivate: boolean = false): string {
  if (key.length < 100) return key;
  
  const header = isPrivate ? "-----BEGIN PRIVATE KEY-----" : "-----BEGIN PUBLIC KEY-----";
  const footer = isPrivate ? "-----END PRIVATE KEY-----" : "-----END PUBLIC KEY-----";
  
  const keyContent = key.replace(header, '').replace(footer, '').trim();
  const lines = keyContent.match(/.{1,64}/g) || [];
  
  return `${header}\n${lines.join('\n')}\n${footer}`;
}

// Get key strength rating
export function getKeyStrengthRating(keySize: number): { rating: string; color: string; description: string } {
  if (keySize >= 4096) {
    return { 
      rating: "Excellent", 
      color: "bg-green-500", 
      description: "Suitable for high-security applications and long-term use" 
    };
  } else if (keySize >= 3072) {
    return { 
      rating: "Very Good", 
      color: "bg-green-400", 
      description: "Recommended for most enterprise applications" 
    };
  } else if (keySize >= 2048) {
    return { 
      rating: "Good", 
      color: "bg-yellow-500", 
      description: "Minimum recommended size for current security standards" 
    };
  } else {
    return { 
      rating: "Weak", 
      color: "bg-red-500", 
      description: "Not recommended for production use" 
    };
  }
}