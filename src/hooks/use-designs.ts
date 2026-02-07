import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Design {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  _count?: {
    savedBy: number;
  };
}

interface DesignsResponse {
  designs: Design[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SavedDesign {
  id: string;
  designId: string;
  createdAt: string;
  design: Design;
}

interface SavedDesignsResponse {
  savedDesigns: SavedDesign[];
}

export function useDesigns(params?: {
  category?: string;
  search?: string;
  page?: number;
}) {
  const { category, search, page = 1 } = params || {};

  return useQuery<DesignsResponse>({
    queryKey: ["designs", { category, search, page }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category) searchParams.set("category", category);
      if (search) searchParams.set("search", search);
      searchParams.set("page", String(page));

      const res = await fetch(`/api/designs?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch designs");
      return res.json();
    },
  });
}

export function useSavedDesigns() {
  return useQuery<SavedDesignsResponse>({
    queryKey: ["savedDesigns"],
    queryFn: async () => {
      const res = await fetch("/api/saved");
      if (!res.ok) throw new Error("Failed to fetch saved designs");
      return res.json();
    },
  });
}

export function useSaveDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (designId: string) => {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save design");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedDesigns"] });
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useUnsaveDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (designId: string) => {
      const res = await fetch("/api/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId }),
      });
      if (!res.ok) throw new Error("Failed to unsave design");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedDesigns"] });
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}
