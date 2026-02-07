"use client";

import React, { useState } from "react";
import { useSavedDesigns, useUnsaveDesign } from "@/hooks/use-designs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

// SVG data URL for tattoo-style placeholder
const createPlaceholderSvg = (color: string = "#f59e0b") => {
  const svg = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a2e" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="2"><circle cx="200" cy="200" r="30"/><circle cx="200" cy="200" r="60"/><circle cx="200" cy="200" r="90"/><circle cx="200" cy="200" r="120"/>${[0,45,90,135,180,225,270,315].map(a => `<line x1="200" y1="200" x2="${200 + 120*Math.cos(a*Math.PI/180)}" y2="${200 + 120*Math.sin(a*Math.PI/180)}" />`).join('')}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

type Tab = "favorites" | "generated" | "previews";

interface Preview {
  id: string;
  resultUrl: string;
  createdAt: string;
  bodyImage: string;
  design: {
    id: string;
    name: string;
    category: string;
  };
}

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const { data: savedData, isLoading: isLoadingSaved } = useSavedDesigns();
  const unsaveDesign = useUnsaveDesign();

  // Fetch user's generated designs (prefetch on page load)
  const { data: generatedData, isLoading: isLoadingGenerated } = useQuery({
    queryKey: ["generations"],
    queryFn: async () => {
      const res = await fetch("/api/generations");
      if (!res.ok) return { generations: [] };
      return res.json();
    },
  });

  // Fetch user's previews (prefetch on page load)
  const { data: previewsData, isLoading: isLoadingPreviews } = useQuery({
    queryKey: ["previews"],
    queryFn: async () => {
      const res = await fetch("/api/previews");
      if (!res.ok) return { previews: [] };
      return res.json();
    },
  });

  const handleUnsave = async (designId: string) => {
    try {
      await unsaveDesign.mutateAsync(designId);
    } catch (error) {
      console.error("Failed to unsave:", error);
    }
  };

  const tabs: { value: Tab; label: string; count?: number }[] = [
    { value: "favorites", label: "Favorites", count: savedData?.savedDesigns.length || 0 },
    { value: "generated", label: "Generated", count: generatedData?.generations?.length || 0 },
    { value: "previews", label: "Previews", count: previewsData?.previews?.length || 0 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Saved Designs</h1>
        <p className="text-gray-400">
          Your favorite designs, generations, and previews
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "relative px-4 pb-4 text-sm font-medium transition",
              activeTab === tab.value
                ? "text-white"
                : "text-gray-400 hover:text-white"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 rounded-full bg-amber-600/20 px-2 py-0.5 text-xs text-amber-400">
                {tab.count}
              </span>
            )}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        ))}
      </div>

      {/* Favorites Tab */}
      {activeTab === "favorites" && (
        <>
          {isLoadingSaved ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : savedData?.savedDesigns.length === 0 ? (
            <EmptyState
              icon="heart"
              title="No favorites yet"
              description="Save designs from the gallery to see them here"
              actionLabel="Browse Gallery"
              actionHref="/gallery"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {savedData?.savedDesigns.map((saved) => (
                <div
                  key={saved.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <img
                    src={saved.design.imageUrl}
                    alt={saved.design.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.startsWith("data:image")) {
                        img.src = createPlaceholderSvg("#f59e0b");
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUnsave(saved.designId)}
                        className="rounded-full bg-red-500/80 p-2 text-white transition hover:bg-red-500"
                        title="Remove from favorites"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {saved.design.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {saved.design.category}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/studio?design=${saved.designId}`}
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-center rounded-lg bg-amber-600 py-2 text-sm font-medium text-black opacity-0 transition hover:bg-amber-500 group-hover:opacity-100"
                  >
                    Use in Studio
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Generated Tab */}
      {activeTab === "generated" && (
        <>
          {isLoadingGenerated ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : !generatedData?.generations?.length ? (
            <EmptyState
              icon="sparkles"
              title="No generated designs yet"
              description="Create unique designs with AI"
              actionLabel="Generate Design"
              actionHref="/generate"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {generatedData.generations.map((gen: {
                id: string;
                imageUrl: string;
                prompt: string;
                model: string;
                createdAt: string;
              }) => (
                <div
                  key={gen.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <img
                    src={gen.imageUrl}
                    alt={gen.prompt}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.startsWith("data:image")) {
                        img.src = createPlaceholderSvg("#f59e0b");
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <p className="line-clamp-2 text-sm text-white">
                      {gen.prompt}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                        {gen.model}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/studio`}
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-center rounded-lg bg-amber-600 py-2 text-sm font-medium text-black opacity-0 transition hover:bg-amber-500 group-hover:opacity-100"
                  >
                    Use in Studio
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Previews Tab */}
      {activeTab === "previews" && (
        <>
          {isLoadingPreviews ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : !previewsData?.previews?.length ? (
            <EmptyState
              icon="image"
              title="No previews yet"
              description="Create tattoo previews in the studio"
              actionLabel="Open Studio"
              actionHref="/studio"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {previewsData.previews.map((preview: Preview) => (
                <div
                  key={preview.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <img
                    src={preview.resultUrl}
                    alt={`Preview with ${preview.design.name}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.startsWith("data:image")) {
                        img.src = createPlaceholderSvg("#f59e0b");
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <h3 className="font-medium text-white">
                      {preview.design.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                        {preview.design.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(preview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={preview.resultUrl}
                    download={`tattoo-preview-${preview.id}.png`}
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 rounded-lg bg-amber-600 py-2 text-sm font-medium text-black opacity-0 transition hover:bg-amber-500 group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    heart: (
      <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    sparkles: (
      <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    image: (
      <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-amber-500/30">{iconMap[icon] || iconMap.image}</div>
      <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
      <p className="mb-6 text-sm text-gray-400">{description}</p>
      <Link
        href={actionHref}
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-500"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
