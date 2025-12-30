import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";

export type Network = "mainnet" | "testnet";

interface GraphQLResponse<T> {
  data?: T;
  errors?: any[];
}

// Updated based on confirmed schema
const SAFE_HISTORY_QUERY = `
  query TransactionHistory($address: SuiAddress!, $cursor: String, $limit: Int) {
    address(address: $address) {
      transactions(
        first: $limit
        after: $cursor
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          digest
          effects {
            timestamp
            status
            gasEffects {
              gasSummary {
                computationCost
                storageCost
                storageRebate
                nonRefundableStorageFee
              }
            }
            balanceChanges {
              nodes {
                amount
                coinType {
                  repr
                }
                owner {
                  asAddress: address
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchSuiGraphQL(
  network: Network,
  query: string,
  variables: Record<string, any>
) {
  // Use local proxy to avoid CORS
  const url = `/api/graphql?network=${network}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL Error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchTransactionHistoryGraphQL(
  address: string,
  network: Network = "mainnet",
  cursor: string | null = null,
  limit: number = 50
): Promise<{ data: SuiTransactionBlockResponse[], nextCursor: string | null, hasNextPage: boolean }> {
  
  const result = await fetchSuiGraphQL(network, SAFE_HISTORY_QUERY, {
    address,
    cursor,
    limit
  }) as GraphQLResponse<any>;

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error(result.errors[0]?.message || "GraphQL Error");
  }

  // Handle new nested structure: address -> transactions -> nodes -> effects
  const data = result.data?.address?.transactions;
  
  if (!data) return { data: [], nextCursor: null, hasNextPage: false };

  const mapped: SuiTransactionBlockResponse[] = data.nodes.map((node: any) => ({
    digest: node.digest,
    // Timestamp is now on effects
    timestampMs: node.effects?.timestamp ? new Date(node.effects.timestamp).getTime().toString() : undefined,
    balanceChanges: node.effects?.balanceChanges?.nodes?.map((bc: any) => ({
      coinType: bc.coinType?.repr || "",
      amount: bc.amount,
      owner: {
        AddressOwner: bc.owner?.asAddress || "", 
      }
    })) || [],
    effects: {
       status: { status: node.effects?.status?.toLowerCase() || 'success' },
       gasUsed: node.effects?.gasEffects?.gasSummary || {
         computationCost: "0",
         storageCost: "0",
         storageRebate: "0",
         nonRefundableStorageFee: "0"
       }
    } as any
  }));

  return {
    data: mapped,
    nextCursor: data.pageInfo.endCursor,
    hasNextPage: data.pageInfo.hasNextPage
  };
}

export async function fetchAllTransactionHistoryGraphQL(
  address: string,
  network: Network = "mainnet",
  onProgress?: (count: number) => void
): Promise<SuiTransactionBlockResponse[]> {
  let allData: SuiTransactionBlockResponse[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    // Safety break
    if (allData.length > 50000) break;

    const res = await fetchTransactionHistoryGraphQL(address, network, cursor, 50);
    allData = [...allData, ...res.data];
    cursor = res.nextCursor;
    hasNext = res.hasNextPage;
    
    if (onProgress) {
      onProgress(allData.length);
    }

    if (!cursor) break;
  }

  return allData;
}
