import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

export function useSuiNS(address: string | null | undefined) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["suins", address],
    queryFn: async () => {
      if (!address) return null;

      // 1. Resolve Name
      const namePage = await client.resolveNameServiceNames({
        address,
        limit: 1,
      });

      const name = namePage.data?.[0];
      if (!name) return null;

      // 2. Resolve Avatar (if name exists)
      let avatarUrl = null;
      // Note: We might need to handle specific implementation for fetching avatar
      // Often stored in the NFT metadata linked to the name object.
      // For MVP, knowing the name is the primary win. Getting the avatar 
      // requires querying the name object fields.
      
      // Let's try to get details if possible, but the SDK method resolveNameServiceNames 
      // returns the domain strings. 
      // We can use generic object fetching if needed, but keeping it simple for now.
      
      return {
        name,
        avatarUrl, // Placeholder or fetch if strictly required
      };
    },
    enabled: !!address,
  });
}
