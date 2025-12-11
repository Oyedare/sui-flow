// NFT Image Caching on Walrus
// Downloads NFT images and stores them on Walrus for faster loading

import { storeBlob } from "./walrus";

/**
 * Fetch image from URL and convert to base64 using img element (CORS-friendly)
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Request CORS headers
    
    img.onload = () => {
      try {
        // Create canvas to convert image to base64
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Get base64 data (remove data URL prefix)
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image from ${imageUrl}`));
    };
    
    // Start loading
    // Use proxy to bypass CORS
    img.src = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  });
}

/**
 * Cache NFT image on Walrus
 * Returns the Walrus blob ID
 */
export async function cacheNFTImage(imageUrl: string): Promise<string> {
  try {
    // Skip if no image URL
    if (!imageUrl) {
      throw new Error("No image URL provided");
    }
    
    // Skip Walrus URLs (already cached)
    if (imageUrl.includes('walrus')) {
      throw new Error("Image already on Walrus");
    }
    
    // Fetch image as base64
    const base64Image = await fetchImageAsBase64(imageUrl);
    
    // Store on Walrus (without encryption for images)
    const blobId = await storeBlob(base64Image, false);
    
    return blobId;
  } catch (error) {
    // Re-throw with CORS context if it's a loading error
    if (error instanceof Error && error.message.includes('Failed to load')) {
      throw new Error(`CORS: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Cache multiple NFT images in batch
 * Returns map of objectId -> blobId
 */
export async function cacheNFTImagesBatch(
  images: Array<{ objectId: string; imageUrl: string }>
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  // Cache images sequentially to avoid rate limiting
  for (const { objectId, imageUrl } of images) {
    try {
      const blobId = await cacheNFTImage(imageUrl);
      results[objectId] = blobId;
      
      // Small delay to avoid overwhelming Walrus
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to cache image for ${objectId}:`, error);
      // Continue with next image
    }
  }
  
  return results;
}
