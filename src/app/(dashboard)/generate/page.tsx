"use client";

import { useState } from "react";
import { useGenerate, type GenerationQuality } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const styles = [
  { value: "minimal", label: "Minimal / Linework", icon: "✏️" },
  { value: "tribal", label: "Tribal", icon: "🔷" },
  { value: "japanese", label: "Japanese", icon: "🐉" },
  { value: "watercolor", label: "Watercolor", icon: "🎨" },
  { value: "blackwork", label: "Blackwork", icon: "⬛" },
  { value: "geometric", label: "Geometric", icon: "📐" },
  { value: "realism", label: "Realism", icon: "📷" },
  { value: "traditional", label: "Traditional", icon: "⚓" },
];

const promptSuggestions = [
  "A wolf howling at the moon with geometric patterns",
  "Minimalist mountain range with sunrise",
  "Japanese koi fish swimming through waves",
  "Compass with floral elements and coordinates",
  "Phoenix rising from flames",
  "Mandala with lotus flower center",
  "Snake wrapped around a dagger",
  "Constellation of stars forming an animal",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("minimal");
  const [quality, setQuality] = useState<GenerationQuality>("draft");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);

  const generate = useGenerate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generate.mutateAsync({ prompt, style, quality });
      setGeneratedImage(result.imageUrl);
      setGenerationId(result.generationId);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">AI Tattoo Generator</h1>
        <p className="text-gray-400">
          Describe your dream tattoo and let AI create it for you
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Generation Form */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Describe your tattoo
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="A minimalist mountain range with geometric patterns..."
              maxLength={500}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Be specific about style, elements, and mood</span>
              <span>{prompt.length}/500</span>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">Need inspiration?</p>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {suggestion.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white">
              Choose a style
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-3 transition",
                    style === s.value
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  )}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white">
              Generation quality
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuality("draft")}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  quality === "draft"
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-medium text-white">Draft</span>
                  <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                    Free
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Fast generation with Gemini AI. Great for exploring ideas.
                </p>
              </button>

              <button
                onClick={() => setQuality("hd")}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  quality === "hd"
                    ? "border-cyan-500 bg-cyan-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span className="font-medium text-white">HD</span>
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                    Premium
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  High-quality generation with OpenAI. Best for final designs.
                </p>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generate.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generate.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                Generate Tattoo Design
              </span>
            )}
          </button>

          {/* Error Message */}
          {generate.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {generate.error?.message || "Generation failed. Please try again."}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="flex flex-col">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6">
            {generate.isPending ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
                <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                <p className="text-gray-400">Creating your design...</p>
                <p className="mt-2 text-xs text-gray-500">
                  This may take up to 30 seconds
                </p>
              </div>
            ) : generatedImage ? (
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <img
                    src={generatedImage}
                    alt="Generated tattoo design"
                    className="h-full w-full rounded-xl object-contain"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/studio?generation=${generationId}`}
                    className="flex-1 rounded-lg bg-purple-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-purple-700"
                  >
                    Use in Studio
                  </Link>
                  <button
                    onClick={() => {
                      setGeneratedImage(null);
                      setGenerationId(null);
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-4 text-6xl opacity-30">✨</div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  Your design will appear here
                </h3>
                <p className="max-w-sm text-sm text-gray-400">
                  Describe your tattoo idea, choose a style, and click generate
                  to create your unique design
                </p>
              </div>
            )}
          </div>

          {/* Rate Limit Info */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Generation Limits</p>
                <p className="text-xs text-gray-400">
                  Draft: 10/hour (free) • HD: 5/hour (premium)
                </p>
              </div>
              <Link
                href="/saved"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                View History →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
