/**
 * Walrus Integration Library
 * Provides functions to store and retrieve data from Walrus decentralized storage
 */

// Default Walrus publisher endpoint (testnet)
const WALRUS_PUBLISHER_URL = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 
  'https://publisher.walrus-testnet.walrus.space';

const WALRUS_AGGREGATOR_URL = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
  'https://aggregator.walrus-testnet.walrus.space';

/**
 * Simple client-side encryption using Web Crypto API
 */
async function encryptData(data: string, password: string = 'sui-flow-default'): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data using Web Crypto API
 */
async function decryptData(encryptedBase64: string, password: string = 'sui-flow-default'): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Decode base64
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  // Extract salt, iv, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  return decoder.decode(decrypted);
}

/**
 * Store data to Walrus and return blob ID
 */
export async function storeBlob(data: string | Blob, encrypt: boolean = true): Promise<string> {
  try {
    // Encrypt data if requested (must be string)
    let payload: string | Blob = data;
    
    if (encrypt) {
      if (typeof data !== 'string') {
        throw new Error('Encryption only supported for string data');
      }
      payload = await encryptData(data);
    }
    
    // Upload to Walrus publisher with epochs parameter (5 epochs = ~5 days on testnet)
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=5`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: payload,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Walrus upload failed (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    
    // Extract blob ID from response
    // Walrus returns: { "newlyCreated": { "blobObject": { "blobId": "..." } } } or { "alreadyCertified": { "blobId": "..." } }
    // NOTE: Use "blobId" (base64 string) NOT "id" (hex object ID)
    const blobId = result.newlyCreated?.blobObject?.blobId || 
                   result.alreadyCertified?.blobId;
    
    if (!blobId) {
      console.error('Walrus response:', result);
      throw new Error('No blob ID returned from Walrus');
    }
    
    return blobId;
  } catch (error) {
    console.error('Walrus store error:', error);
    throw error;
  }
}

/**
 * Read data from Walrus using blob ID
 */
export async function readBlob(blobId: string, decrypt: boolean = true): Promise<string> {
  try {
    // Fetch from Walrus aggregator (blobId is base64 encoded, no prefix to strip)
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);
    
    if (!response.ok) {
      throw new Error(`Walrus read failed (${response.status}): ${response.statusText}`);
    }
    
    const payload = await response.text();
    
    // Decrypt if requested
    return decrypt ? await decryptData(payload) : payload;
  } catch (error) {
    console.error('Walrus read error:', error);
    throw error;
  }
}

/**
 * Check if a blob exists on Walrus
 */
export async function blobExists(blobId: string): Promise<boolean> {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`, {
      method: 'HEAD'
    });
    return response.ok;
  } catch {
    return false;
  }
}
