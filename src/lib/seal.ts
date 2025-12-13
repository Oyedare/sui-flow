// Seal Encryption Service (Client-Side Fallback via CryptoJS)
// Replaces native Web Crypto to support insecure contexts (HTTP) and ensure
// consistent cross-platform behavior.

import CryptoJS from "crypto-js";

/**
 * Normalizes signature to ensure consistency across wallets/devices.
 * Trims whitespace.
 */
function normalizeSignature(sig: string): string {
    return sig.trim();
}

/**
 * Derives a consistent encryption key from a wallet signature using PBKDF2.
 * We use a fixed salt because the signature itself is high-entropy and unique per user/message.
 */
function deriveKey(signature: string): string {
    const cleanSig = normalizeSignature(signature);
    // PBKDF2 to stretch the signature into a key
    // We render the signature as the password
    const salt = "sui-flow-seal-salt-v1"; 
    const key = CryptoJS.PBKDF2(cleanSig, salt, {
        keySize: 256 / 32, // 256-bit key
        iterations: 10000,
        hasher: CryptoJS.algo.SHA256
    });
    return key.toString();
}

/**
 * Encrypts data using AES-256 (via CryptoJS) and the derived key.
 * Returns a stringified JSON containing the ciphertext.
 */
export async function encryptData(data: object, signature: string): Promise<string> {
  try {
    const key = deriveKey(signature);
    const jsonString = JSON.stringify(data);
    
    // Encrypt
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    
    // We utilize a versioned format to future-proof
    return JSON.stringify({
        data: encrypted,
        version: "v2-cryptojs",
        algo: "AES-256-PBKDF2"
    });
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to seal data.");
  }
}

/**
 * Decrypts data using AES-256 (via CryptoJS) and the derived key.
 */
export async function decryptData(encryptedString: string, signature: string): Promise<any> {
    console.log("[Seal] Decrypting data (CryptoJS)...");
  try {
    const parsed = JSON.parse(encryptedString);
    console.log("[Seal] Data version:", parsed.version || "unknown");
    
    let ciphertext = "";
    
    // Handle v2 (crypto-js)
    if (parsed.version === "v2-cryptojs") {
        ciphertext = parsed.data;
    } else {
        // Fallback: If the user provides a Blob ID from the OLD system (v1-native),
        // we can try to detect it, but since we replaced the engine, we can't easily decrypt v1 
        // without the native usage. 
        // However, the prompt says "Key mismatch", implying the old code WAS running.
        // We will Throw a clear error for old backups.
         throw new Error("Old backup format detected. Please create a new backup with the new system.");
    }

    const key = deriveKey(signature);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
        // If decryption results in empty string, it usually means Wrong Key (padding error swallowed)
        throw new Error("Wrong Key");
    }

    console.log("[Seal] Decryption successful!");
    return JSON.parse(decryptedData);
  } catch (error: any) {
    console.error("[Seal] Decryption failed:", error);
    if (error.message === "Wrong Key" || error.message.includes("Malformed")) {
        throw new Error("Key mismatch! The signature does not match the one used for encryption.");
    }
    throw new Error(`Failed to decrypt: ${error.message}`);
  }
}

// Stub for compatibility
export function deriveKeyFromSignature(signature: string) {
    return Promise.resolve(deriveKey(signature));
}
