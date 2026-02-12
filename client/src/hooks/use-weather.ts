import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useWeather(location: string) {
  return useQuery({
    queryKey: [api.weather.get.path, location],
    queryFn: async () => {
      if (!location) return null;
      // Note: Endpoint expects query param? The schema defined input object but GET usually implies query params or URL params.
      // Assuming backend reads query params for GET request if body not standard.
      // Let's construct URL with query param manually since axios/fetch GET doesn't take body usually.
      const url = `${api.weather.get.path}?location=${encodeURIComponent(location)}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return await res.json();
    },
    enabled: !!location,
  });
}
