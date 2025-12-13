// Seal Encryption Service (Client-Side Fallback)
// Since official Seal Mainnet Key Server IDs are not public, we use
// a secure client-side encryption derived from the user's wallet signature.
// This effectively "seals" the data to the user's identity.

export async function deriveKeyFromSignature(signature: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(signature),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("sui-flow-seal-salt"), // Constant salt for deterministic derivation
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: object, signature: string): Promise<string> {
  const key = await deriveKeyFromSignature(signature);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  // Combine IV and encrypted data into a single string
  const ivArray = Array.from(iv);
  const encryptedArray = Array.from(new Uint8Array(encryptedContent));
  
  return JSON.stringify({
    iv: ivArray,
    data: encryptedArray,
  });
}

export async function decryptData(encryptedString: string, signature: string): Promise<any> {
    console.log("[Seal] Decrypting data...");
  try {
    const parsed = JSON.parse(encryptedString);
    console.log("[Seal] Parsed encrypted structure:", Object.keys(parsed));
    
    if (!parsed.iv || !parsed.data) {
        throw new Error("Invalid encrypted format: missing iv or data");
    }

    const { iv, data } = parsed;
    const key = await deriveKeyFromSignature(signature);
    
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      new Uint8Array(data)
    );

    const decodedData = new TextDecoder().decode(decryptedContent);
    console.log("[Seal] Decryption successful!");
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("[Seal] Decryption failed:", error);
    // trace input length for debugging
    console.log("[Seal] Input string length:", encryptedString?.length);
    throw new Error("Failed to decrypt data. Invalid signature or corrupted data.");
  }
}
