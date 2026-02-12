import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useMarketPrices() {
  return useQuery({
    queryKey: [api.market.list.path],
    queryFn: async () => {
      const res = await fetch(api.market.list.path);
      if (!res.ok) throw new Error("Failed to fetch market prices");
      return await res.json();
    },
  });
}
