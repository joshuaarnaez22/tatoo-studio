import { useMutation, useQueryClient } from "@tanstack/react-query";

export type GenerationQuality = "draft" | "hd";

export interface GenerateRequest {
  prompt: string;
  style: string;
  quality: GenerationQuality;
}

export interface GenerateResponse {
  success: boolean;
  generationId: string;
  imageUrl: string;
  model: string;
  remaining: number;
}

export function useGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateRequest): Promise<GenerateResponse> => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate design");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate generations list to show new one
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}
