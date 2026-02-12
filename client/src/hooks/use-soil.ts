import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSoilReport } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useSoilReports() {
  return useQuery({
    queryKey: [api.soil.list.path],
    queryFn: async () => {
      const res = await fetch(api.soil.list.path);
      if (!res.ok) throw new Error("Failed to fetch soil reports");
      return await res.json();
    },
  });
}

export function useCreateSoilReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSoilReport) => {
      const res = await fetch(api.soil.create.path, {
        method: api.soil.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create report");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.soil.list.path] });
      toast({ title: "Success", description: "Soil report saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// Prediction hook separately, might be used within the form before saving
type PredictInput = z.infer<typeof api.soil.predict.input>;

export function usePredictCrop() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: PredictInput) => {
      const res = await fetch(api.soil.predict.path, {
        method: api.soil.predict.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Prediction failed");
      }
      return await res.json(); // Returns { recommendedCrop, confidence, fertilizer }
    },
    onError: (error: Error) => {
      toast({ title: "Prediction Error", description: error.message, variant: "destructive" });
    },
  });
}
