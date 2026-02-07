"use client";

import { useState } from "react";
import { useDesigns, useSaveDesign, useSavedDesigns } from "@/hooks/use-designs";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
  { value: "all", label: "All" },
  { value: "minimal", label: "Minimal" },
  { value: "tribal", label: "Tribal" },
  { value: "japanese", label: "Japanese" },
  { value: "watercolor", label: "Watercolor" },
  { value: "blackwork", label: "Blackwork" },
  { value: "geometric", label: "Geometric" },
  { value: "realism", label: "Realism" },
  { value: "traditional", label: "Traditional" },
];

// SVG data URLs for tattoo-style placeholder images (with dark background for gallery display)
const createTattooSvg = (design: string, color: string = "#f59e0b") => {
  const patterns: Record<string, string> = {
    rose: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><path d="M200 140c-15-20-45-25-55 5-8 25 10 45 35 55"/><path d="M200 140c15-20 45-25 55 5 8 25-10 45-35 55"/><path d="M180 200c-25-5-50 10-45 40 5 25 30 35 65 30"/><path d="M220 200c25-5 50 10 45 40-5 25-30 35-65 30"/><ellipse cx="200" cy="175" rx="25" ry="30"/><path d="M175 270c0 30-15 60-25 80M200 270v90M225 270c0 30 15 60 25 80"/><path d="M160 300c-20-10-40 0-50 20M240 300c20-10 40 0 50 20"/></g></svg>`,
    wolf: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M200 320l-60-40-20-80 30-50-30-60 40 30 40-40 40 40 40-30-30 60 30 50-20 80z"/><path d="M160 200l40 30 40-30"/><circle cx="156" cy="170" r="14"/><circle cx="244" cy="170" r="14"/><circle cx="156" cy="170" r="5" fill="${color}"/><circle cx="244" cy="170" r="5" fill="${color}"/><path d="M200 220v25l-15 15h30l-15-15z"/><path d="M120 200c-20-30-10-60 0-80M280 200c20-30 10-60 0-80"/><path d="M150 130l-30-50M250 130l30-50"/></g></svg>`,
    dragon: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><path d="M80 180c20-60 80-100 140-80 40 15 60 50 70 90 10 50-10 100-60 120-40 15-90 0-110-40"/><path d="M100 200c30 0 50-20 60-50"/><circle cx="150" cy="140" r="10"/><circle cx="150" cy="140" r="4" fill="${color}"/><path d="M120 160c10 10 25 10 35 0"/><path d="M170 130l30-40 10 30M170 130l-20-50 25 20"/><path d="M230 190c20-10 50-5 70 20s20 60 0 80"/><path d="M300 290c10 20 30 30 50 25"/><path d="M80 180c-20 10-40 30-30 60"/></g></svg>`,
    tribal: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="${color}"><path d="M200 60c-10 0-20 15-20 30 0 20 10 30 20 50 10-20 20-30 20-50 0-15-10-30-20-30z"/><path d="M140 120c-30 20-50 60-40 100 10 50 50 70 100 70s90-20 100-70c10-40-10-80-40-100-20 30-40 50-60 50s-40-20-60-50z"/><path d="M100 180c-40 10-70 40-60 80 10 30 40 50 70 40-20-30-30-70-10-120z"/><path d="M300 180c40 10 70 40 60 80-10 30-40 50-70 40 20-30 30-70 10-120z"/><path d="M150 300c-20 20-20 50 0 70 15 15 35 15 50 0-20-10-40-30-50-70z"/><path d="M250 300c20 20 20 50 0 70-15 15-35 15-50 0 20-10 40-30 50-70z"/></g></svg>`,
    butterfly: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><ellipse cx="120" cy="150" rx="70" ry="55"/><ellipse cx="280" cy="150" rx="70" ry="55"/><ellipse cx="110" cy="260" rx="50" ry="70"/><ellipse cx="290" cy="260" rx="50" ry="70"/><ellipse cx="120" cy="150" rx="35" ry="25"/><ellipse cx="280" cy="150" rx="35" ry="25"/><path d="M200 90v250"/><path d="M195 90c-5-20-20-35-30-40M205 90c5-20 20-35 30-40"/><circle cx="120" cy="150" r="8" fill="${color}"/><circle cx="280" cy="150" r="8" fill="${color}"/></g></svg>`,
    mandala: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#0f0f1a" width="400" height="400"/><g fill="none" stroke="${color}" stroke-width="2.5"><circle cx="200" cy="200" r="20"/><circle cx="200" cy="200" r="45"/><circle cx="200" cy="200" r="70"/><circle cx="200" cy="200" r="100"/><circle cx="200" cy="200" r="130"/><line x1="200" y1="70" x2="200" y2="330"/><line x1="70" y1="200" x2="330" y2="200"/><line x1="108" y1="108" x2="292" y2="292"/><line x1="292" y1="108" x2="108" y2="292"/><circle cx="200" cy="155" r="10"/><circle cx="200" cy="245" r="10"/><circle cx="155" cy="200" r="10"/><circle cx="245" cy="200" r="10"/><circle cx="165" cy="165" r="6" fill="${color}"/><circle cx="235" cy="165" r="6" fill="${color}"/><circle cx="165" cy="235" r="6" fill="${color}"/><circle cx="235" cy="235" r="6" fill="${color}"/></g></svg>`,
  };
  const svg = patterns[design] || patterns.mandala;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Sample designs for demo (shown when database is empty)
const sampleDesigns = [
  {
    id: "sample-1",
    name: "Minimal Rose",
    description: "A delicate single-line rose design",
    imageUrl: createTattooSvg("rose", "#f59e0b"),
    category: "minimal",
    tags: ["rose", "floral", "line"],
  },
  {
    id: "sample-2",
    name: "Geometric Wolf",
    description: "Wolf portrait with geometric shapes",
    imageUrl: createTattooSvg("wolf", "#06b6d4"),
    category: "geometric",
    tags: ["wolf", "animal", "geometric"],
  },
  {
    id: "sample-3",
    name: "Japanese Dragon",
    description: "Traditional Japanese dragon design",
    imageUrl: createTattooSvg("dragon", "#f59e0b"),
    category: "japanese",
    tags: ["dragon", "japanese", "traditional"],
  },
  {
    id: "sample-4",
    name: "Tribal Band",
    description: "Classic tribal armband pattern",
    imageUrl: createTattooSvg("tribal", "#ef4444"),
    category: "tribal",
    tags: ["tribal", "band", "pattern"],
  },
  {
    id: "sample-5",
    name: "Watercolor Butterfly",
    description: "Colorful butterfly with watercolor effect",
    imageUrl: createTattooSvg("butterfly", "#ec4899"),
    category: "watercolor",
    tags: ["butterfly", "colorful", "nature"],
  },
  {
    id: "sample-6",
    name: "Blackwork Mandala",
    description: "Intricate mandala in blackwork style",
    imageUrl: createTattooSvg("mandala", "#8b5cf6"),
    category: "blackwork",
    tags: ["mandala", "blackwork", "geometric"],
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useDesigns({
    category: activeCategory,
    search: searchQuery,
  });

  const { data: savedData } = useSavedDesigns();
  const saveDesign = useSaveDesign();

  const savedDesignIds = new Set(
    savedData?.savedDesigns.map((s) => s.designId) || []
  );

  // Use sample designs if database is empty
  const designs = data?.designs?.length ? data.designs : sampleDesigns;

  const filteredDesigns = designs.filter((design) => {
    const matchesCategory =
      activeCategory === "all" || design.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags?.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleSave = async (designId: string) => {
    try {
      await saveDesign.mutateAsync(designId);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Design Gallery</h1>
          <p className="text-gray-400">
            Browse our curated collection of tattoo designs
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Generate Custom
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none sm:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                activeCategory === category.value
                  ? "bg-amber-600 text-black"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Design Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-amber-500/50"
            >
              <img
                src={design.imageUrl}
                alt={design.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.startsWith("data:image")) {
                    img.src = createTattooSvg("mandala", "#f59e0b");
                  }
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave(design.id)}
                    disabled={savedDesignIds.has(design.id)}
                    className={cn(
                      "rounded-full p-2 transition",
                      savedDesignIds.has(design.id)
                        ? "bg-amber-600 text-black"
                        : "bg-black/50 text-white hover:bg-amber-600 hover:text-black"
                    )}
                  >
                    <svg className="h-4 w-4" fill={savedDesignIds.has(design.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div>
                  <h3 className="font-medium text-white">{design.name}</h3>
                  {design.description && (
                    <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                      {design.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {design.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick action - Use in Studio */}
              <Link
                href={`/studio?design=${design.id}`}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-center rounded-lg bg-amber-600 py-2 text-sm font-medium text-black opacity-0 transition hover:bg-amber-500 group-hover:opacity-100"
              >
                Use in Studio
              </Link>
            </div>
          ))}
        </div>
      )}

      {filteredDesigns.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl opacity-30">🎨</div>
          <h3 className="mb-2 text-lg font-medium text-white">
            No designs found
          </h3>
          <p className="mb-6 text-sm text-gray-400">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
