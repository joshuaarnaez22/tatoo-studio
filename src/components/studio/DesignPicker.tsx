"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// SVG data URL for tattoo-style placeholder
const createPlaceholderSvg = (color: string = "#f59e0b") => {
  const svg = `<svg viewBox="0 0 200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a2e" width="200" height="200"/><g fill="none" stroke="${color}" stroke-width="1.5"><circle cx="100" cy="100" r="20"/><circle cx="100" cy="100" r="40"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="80"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="100" y1="100" x2="${100 + 80 * Math.cos(a * Math.PI / 180)}" y2="${100 + 80 * Math.sin(a * Math.PI / 180)}" />`).join('')}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// SVG data URLs for sample tattoo designs - transparent background for better blending
const createTattooSvg = (design: string, color: string = "#f59e0b") => {
  const patterns: Record<string, string> = {
    rose: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><path d="M200 140c-15-20-45-25-55 5-8 25 10 45 35 55"/><path d="M200 140c15-20 45-25 55 5 8 25-10 45-35 55"/><path d="M180 200c-25-5-50 10-45 40 5 25 30 35 65 30"/><path d="M220 200c25-5 50 10 45 40-5 25-30 35-65 30"/><ellipse cx="200" cy="175" rx="25" ry="30"/><path d="M175 270c0 30-15 60-25 80M200 270v90M225 270c0 30 15 60 25 80"/><path d="M160 300c-20-10-40 0-50 20M240 300c20-10 40 0 50 20"/></g></svg>`,
    wolf: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M200 320l-60-40-20-80 30-50-30-60 40 30 40-40 40 40 40-30-30 60 30 50-20 80z"/><path d="M160 200l40 30 40-30"/><circle cx="156" cy="170" r="14"/><circle cx="244" cy="170" r="14"/><circle cx="156" cy="170" r="5" fill="${color}"/><circle cx="244" cy="170" r="5" fill="${color}"/><path d="M200 220v25l-15 15h30l-15-15z"/><path d="M120 200c-20-30-10-60 0-80M280 200c20-30 10-60 0-80"/><path d="M150 130l-30-50M250 130l30-50"/></g></svg>`,
    dragon: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><path d="M80 180c20-60 80-100 140-80 40 15 60 50 70 90 10 50-10 100-60 120-40 15-90 0-110-40"/><path d="M100 200c30 0 50-20 60-50"/><circle cx="150" cy="140" r="10"/><circle cx="150" cy="140" r="4" fill="${color}"/><path d="M120 160c10 10 25 10 35 0"/><path d="M170 130l30-40 10 30M170 130l-20-50 25 20"/><path d="M230 190c20-10 50-5 70 20s20 60 0 80"/><path d="M300 290c10 20 30 30 50 25"/><path d="M80 180c-20 10-40 30-30 60"/></g></svg>`,
    tribal: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="${color}"><path d="M200 60c-10 0-20 15-20 30 0 20 10 30 20 50 10-20 20-30 20-50 0-15-10-30-20-30z"/><path d="M140 120c-30 20-50 60-40 100 10 50 50 70 100 70s90-20 100-70c10-40-10-80-40-100-20 30-40 50-60 50s-40-20-60-50z"/><path d="M100 180c-40 10-70 40-60 80 10 30 40 50 70 40-20-30-30-70-10-120z"/><path d="M300 180c40 10 70 40 60 80-10 30-40 50-70 40 20-30 30-70 10-120z"/><path d="M150 300c-20 20-20 50 0 70 15 15 35 15 50 0-20-10-40-30-50-70z"/><path d="M250 300c20 20 20 50 0 70-15 15-35 15-50 0 20-10 40-30 50-70z"/></g></svg>`,
    butterfly: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><ellipse cx="120" cy="150" rx="70" ry="55"/><ellipse cx="280" cy="150" rx="70" ry="55"/><ellipse cx="110" cy="260" rx="50" ry="70"/><ellipse cx="290" cy="260" rx="50" ry="70"/><ellipse cx="120" cy="150" rx="35" ry="25"/><ellipse cx="280" cy="150" rx="35" ry="25"/><path d="M200 90v250"/><path d="M195 90c-5-20-20-35-30-40M205 90c5-20 20-35 30-40"/><circle cx="120" cy="150" r="8" fill="${color}"/><circle cx="280" cy="150" r="8" fill="${color}"/></g></svg>`,
    mandala: `<svg viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-width="2.5"><circle cx="200" cy="200" r="20"/><circle cx="200" cy="200" r="45"/><circle cx="200" cy="200" r="70"/><circle cx="200" cy="200" r="100"/><circle cx="200" cy="200" r="130"/><line x1="200" y1="70" x2="200" y2="330"/><line x1="70" y1="200" x2="330" y2="200"/><line x1="108" y1="108" x2="292" y2="292"/><line x1="292" y1="108" x2="108" y2="292"/><circle cx="200" cy="155" r="10"/><circle cx="200" cy="245" r="10"/><circle cx="155" cy="200" r="10"/><circle cx="245" cy="200" r="10"/><circle cx="165" cy="165" r="6" fill="${color}"/><circle cx="235" cy="165" r="6" fill="${color}"/><circle cx="165" cy="235" r="6" fill="${color}"/><circle cx="235" cy="235" r="6" fill="${color}"/></g></svg>`,
  };
  const svg = patterns[design] || patterns.mandala;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Sample designs for demo (shown when database is empty)
const sampleDesigns: Design[] = [
  {
    id: "sample-1",
    name: "Minimal Rose",
    imageUrl: createTattooSvg("rose", "#f59e0b"),
    category: "minimal",
  },
  {
    id: "sample-2",
    name: "Geometric Wolf",
    imageUrl: createTattooSvg("wolf", "#06b6d4"),
    category: "geometric",
  },
  {
    id: "sample-3",
    name: "Japanese Dragon",
    imageUrl: createTattooSvg("dragon", "#f59e0b"),
    category: "japanese",
  },
  {
    id: "sample-4",
    name: "Tribal Band",
    imageUrl: createTattooSvg("tribal", "#ef4444"),
    category: "tribal",
  },
  {
    id: "sample-5",
    name: "Watercolor Butterfly",
    imageUrl: createTattooSvg("butterfly", "#ec4899"),
    category: "watercolor",
  },
  {
    id: "sample-6",
    name: "Blackwork Mandala",
    imageUrl: createTattooSvg("mandala", "#8b5cf6"),
    category: "blackwork",
  },
];

interface Design {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: string;
}

interface DesignPickerProps {
  onSelect: (design: Design) => void;
  selectedId?: string;
}

type Tab = "gallery" | "generated";

// Same categories as gallery page for consistency
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

export function DesignPicker({ onSelect, selectedId }: DesignPickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryDesigns, setGalleryDesigns] = useState<Design[]>([]);
  const [generatedDesigns, setGeneratedDesigns] = useState<Design[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isLoadingGenerated, setIsLoadingGenerated] = useState(true);

  // Fetch gallery designs from API
  useEffect(() => {
    async function fetchGalleryDesigns() {
      try {
        const res = await fetch("/api/designs?limit=20");
        if (res.ok) {
          const data = await res.json();
          if (data.designs?.length > 0) {
            setGalleryDesigns(data.designs);
          } else {
            // Use sample designs if database is empty
            setGalleryDesigns(sampleDesigns);
          }
        } else {
          // Use sample designs on error
          setGalleryDesigns(sampleDesigns);
        }
      } catch (error) {
        console.error("Failed to fetch gallery designs:", error);
        // Use sample designs on error
        setGalleryDesigns(sampleDesigns);
      } finally {
        setIsLoadingGallery(false);
      }
    }
    fetchGalleryDesigns();
  }, []);

  // Fetch user's generated designs
  useEffect(() => {
    async function fetchGeneratedDesigns() {
      try {
        const res = await fetch("/api/generations");
        if (res.ok) {
          const data = await res.json();
          if (data.generations?.length > 0) {
            // Convert generations to Design format
            const designs: Design[] = data.generations.map((gen: Generation) => ({
              id: gen.id,
              name: gen.prompt.slice(0, 30) + (gen.prompt.length > 30 ? "..." : ""),
              imageUrl: gen.imageUrl,
              category: "generated",
            }));
            setGeneratedDesigns(designs);
          }
        }
      } catch (error) {
        console.error("Failed to fetch generated designs:", error);
      } finally {
        setIsLoadingGenerated(false);
      }
    }
    fetchGeneratedDesigns();
  }, []);

  // Get current designs based on active tab
  const currentDesigns = activeTab === "gallery" ? galleryDesigns : generatedDesigns;
  const isLoading = activeTab === "gallery" ? isLoadingGallery : isLoadingGenerated;

  const filteredDesigns = currentDesigns.filter((design) => {
    if (activeTab === "generated") {
      // For generated, only filter by search
      return (
        !searchQuery ||
        design.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // For gallery, filter by category and search
    const matchesCategory =
      activeCategory === "all" ||
      design.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("gallery")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
            activeTab === "gallery"
              ? "bg-amber-500/20 text-amber-400"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Gallery
          {galleryDesigns.length > 0 && (
            <span className="rounded-full bg-white/10 px-1.5 text-xs">{galleryDesigns.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("generated")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
            activeTab === "generated"
              ? "bg-amber-500/20 text-amber-400"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Generated
          {generatedDesigns.length > 0 && (
            <span className="rounded-full bg-amber-500/20 px-1.5 text-xs text-amber-400">{generatedDesigns.length}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Categories - only for gallery tab */}
      {activeTab === "gallery" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                activeCategory === category.value
                  ? "bg-amber-600 text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Designs Grid */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-white/10"
              />
            ))}
          </div>
        ) : filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredDesigns.map((design) => (
              <button
                key={design.id}
                onClick={() => onSelect(design)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg border-2 transition",
                  selectedId === design.id
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-white/10 hover:border-amber-500/50"
                )}
              >
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    // Only set fallback if not already a data URL
                    if (!img.src.startsWith("data:image")) {
                      img.src = createPlaceholderSvg("#f59e0b");
                    }
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                  <p className="truncate text-xs font-medium text-white">
                    {design.name}
                  </p>
                  {activeTab === "generated" && (
                    <span className="mt-1 inline-block rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                      AI Generated
                    </span>
                  )}
                </div>
                {selectedId === design.id && (
                  <div className="absolute right-2 top-2 rounded-full bg-amber-500 p-1">
                    <svg className="h-3 w-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-4xl opacity-30">
              {activeTab === "gallery" ? "\u{1F3A8}" : "\u{2728}"}
            </div>
            <p className="mb-1 text-sm font-medium text-white">
              {activeTab === "gallery"
                ? "No designs found"
                : "No generated designs yet"}
            </p>
            <p className="text-xs text-gray-500">
              {activeTab === "gallery"
                ? "Try adjusting your search or filters"
                : "Generate your first design below"}
            </p>
          </div>
        )}
      </div>

      {/* Generate Custom Button */}
      <div className="flex-shrink-0 border-t border-white/10 pt-4 mt-4">
        <a
          href="/generate"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-medium text-black transition hover:from-amber-400 hover:to-amber-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Generate New Design with AI
        </a>
      </div>
    </div>
  );
}
