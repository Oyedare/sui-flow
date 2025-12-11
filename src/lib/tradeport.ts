// Tradeport API Service
// GraphQL client for fetching NFT floor prices and collection stats

const TRADEPORT_API_URL = "https://api.tradeport.xyz/graphql";

interface TradeportConfig {
  apiKey?: string;
  apiUser?: string;
}

// Get API credentials from environment variables
function getConfig(): TradeportConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_TRADEPORT_API_KEY,
    apiUser: process.env.NEXT_PUBLIC_TRADEPORT_API_USER,
  };
}

/**
 * Check if Tradeport API is configured
 */
export function isTradeportConfigured(): boolean {
  const config = getConfig();
  return Boolean(config.apiKey && config.apiUser);
}

/**
 * Fetch collection stats including floor price
 */
export async function fetchCollectionStats(collectionSlug: string) {
  const config = getConfig();
  
  if (!config.apiKey || !config.apiUser) {
    console.warn("Tradeport API not configured. Set NEXT_PUBLIC_TRADEPORT_API_KEY and NEXT_PUBLIC_TRADEPORT_API_USER");
    return null;
  }

  const query = `
    query GetCollectionStats($slug: String!) {
      collection(slug: $slug) {
        id
        name
        slug
        floorPrice
        totalVolume
        totalSupply
        description
      }
    }
  `;

  try {
    const response = await fetch(TRADEPORT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "x-api-user": config.apiUser,
      },
      body: JSON.stringify({
        query,
        variables: { slug: collectionSlug },
      }),
    });

    if (!response.ok) {
      throw new Error(`Tradeport API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return null;
    }

    return data.data?.collection || null;
  } catch (error) {
    console.error("Failed to fetch collection stats:", error);
    return null;
  }
}

/**
 * Fetch floor prices for multiple collections
 */
export async function fetchFloorPrices(collectionSlugs: string[]): Promise<Record<string, number>> {
  const floorPrices: Record<string, number> = {};

  // Fetch in parallel
  const results = await Promise.allSettled(
    collectionSlugs.map(async (slug) => {
      const stats = await fetchCollectionStats(slug);
      return { slug, floorPrice: stats?.floorPrice };
    })
  );

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value.floorPrice) {
      floorPrices[result.value.slug] = result.value.floorPrice;
    }
  });

  return floorPrices;
}
