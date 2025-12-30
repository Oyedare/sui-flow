import { NextRequest, NextResponse } from "next/server";

// Verified working endpoints
const SUI_GRAPHQL_URL_MAINNET = "https://sui-mainnet.mystenlabs.com/graphql"; // Legacy/Fallback
const SUI_GRAPHQL_URL_MAINNET_BETA = "https://graphql-beta.mainnet.sui.io"; // Old beta (broken)
const SUI_GRAPHQL_URL_MAINNET_OFFICIAL = "https://graphql.mainnet.sui.io/graphql"; // Verified Working

const SUI_GRAPHQL_URL_TESTNET = "https://graphql.testnet.sui.io/graphql"; // Assumed similar structure

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const network = searchParams.get("network");
    
    // Use the Official endpoint for mainnet as it's verified working
    const endpoint = network === "testnet" 
        ? SUI_GRAPHQL_URL_TESTNET 
        : SUI_GRAPHQL_URL_MAINNET_OFFICIAL;

    const body = await req.json().catch(() => ({}));

    console.log(`[GraphQL Proxy] Forwarding request to ${endpoint}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SuiFlow/1.0.0",
        "Accept": "*/*",
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GraphQL Proxy] Upstream Error ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `Upstream Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[GraphQL Proxy] Internal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
