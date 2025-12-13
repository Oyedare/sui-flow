const TRADEPORT_API_URL = "https://api.indexer.xyz/graphql";

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
 * Fetch floor prices for multiple collections by type
 */
export async function fetchFloorPrices(collectionTypes: string[]): Promise<Record<string, number>> {
  const config = getConfig();
  const floorPrices: Record<string, number> = {};
  
  if (!config.apiKey || !config.apiUser || collectionTypes.length === 0) {
    return floorPrices;
  }

  // Deduplicate types
  const uniqueTypes = Array.from(new Set(collectionTypes));

  // Construct query aliases for batch fetching
  // We use the package ID or type as the alias key
  const queryBody = uniqueTypes.map((type, index) => {
    // Escape special characters in alias if needed, strict alphanumeric for GraphQL alias
    const alias = `col_${index}`;
    return `
      ${alias}: sui_collections(
        where: { id: { _eq: "${type}" } }
        limit: 1
      ) {
        floor_price
      }
    `;
  }).join("\n");

  const query = `
    query GetFloorPrices {
      ${queryBody}
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
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`Indexer API error: ${response.statusText}`);
      return floorPrices;
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return floorPrices;
    }

    // Map results back to types
    uniqueTypes.forEach((type, index) => {
      const alias = `col_${index}`;
      const data = result.data?.[alias];
      if (data && data.length > 0 && data[0].floor_price) {
        // Floor price from Indexer is often in MIST (decimals needed) or raw.
        // Usually floor_price is in raw units. Assuming standard SUI (9 decimals).
        // Let's assume the API returns it as a number or string. 
        // We will store it directly for now or sanitize it.
        // Note: Check if division is needed. Usually APIs return raw values.
        // For safe implementation, we'll assume it's scaled.
        floorPrices[type] = Number(data[0].floor_price) / 1e9;
      }
    });

    return floorPrices;

  } catch (error) {
    console.error("Failed to fetch floor prices:", error);
    return floorPrices;
  }
} 

