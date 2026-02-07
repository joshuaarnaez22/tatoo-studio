"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/studio/UploadZone";
import { TattooCanvas } from "@/components/studio/TattooCanvas";
import { DesignPicker } from "@/components/studio/DesignPicker";
import { ControlPanel } from "@/components/studio/ControlPanel";
import { removeBackground } from "@imgly/background-removal";
import html2canvas from "html2canvas";

interface TattooPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  blur: number;
}

interface Design {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

const defaultPosition: TattooPosition = {
  x: 100,
  y: 150,
  width: 150,
  height: 150,
  rotation: 0,
  opacity: 1,
  blur: 0,
};

export default function StudioPage() {
  const [bodyImage, setBodyImage] = useState<string>("");
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [processedDesignUrl, setProcessedDesignUrl] = useState<string | null>(null);
  const [useBgRemoved, setUseBgRemoved] = useState(false);
  const [position, setPosition] = useState<TattooPosition>(defaultPosition);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleUploadComplete = (url: string, id?: string) => {
    setBodyImage(url);
    if (id) setUploadId(id);
  };

  const handleDesignSelect = (design: Design) => {
    setSelectedDesign(design);
    setProcessedDesignUrl(null);
    setUseBgRemoved(false);
  };

  const handleRemoveBackground = async () => {
    if (!selectedDesign?.imageUrl) return;

    setIsRemovingBg(true);
    toast.loading("Removing background...", { id: "remove-bg" });

    try {
      const blob = await removeBackground(selectedDesign.imageUrl);
      const url = URL.createObjectURL(blob);
      setProcessedDesignUrl(url);
      setUseBgRemoved(true);
      toast.success("Background removed!", { id: "remove-bg" });
    } catch (error) {
      console.error("Background removal failed:", error);
      toast.error("Failed to remove background. Try a different image.", { id: "remove-bg" });
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleSave = async () => {
    if (!bodyImage || !selectedDesign || !canvasRef.current) {
      toast.error("Please upload a photo and select a design first");
      return;
    }

    setIsSaving(true);
    toast.loading("Saving preview...", { id: "save-preview" });

    try {
      // Capture the canvas as an image
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });

      const imageDataUrl = canvas.toDataURL("image/png");

      // Save to API
      const response = await fetch("/api/previews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadId: uploadId,
          designId: selectedDesign.id,
          designImageUrl: selectedDesign.imageUrl,
          designName: selectedDesign.name,
          position,
          imageDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save preview");
      }

      toast.success("Preview saved! Check your saved designs.", { id: "save-preview" });
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save preview",
        { id: "save-preview" }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPosition(defaultPosition);
    toast.info("Position reset");
  };

  // The actual tattoo image to display (processed or original based on toggle)
  const displayTattooImage = useBgRemoved && processedDesignUrl
    ? processedDesignUrl
    : selectedDesign?.imageUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Tattoo Studio</h1>
        <p className="text-gray-400">
          Upload a photo of your body part and preview tattoo designs
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel - Upload / Canvas */}
        <div className="lg:col-span-5">
          {!bodyImage ? (
            <UploadZone
              onUploadComplete={handleUploadComplete}
              currentImage={bodyImage}
            />
          ) : (
            <TattooCanvas
              bodyImage={bodyImage}
              tattooImage={displayTattooImage}
              position={position}
              onPositionChange={setPosition}
              canvasRef={canvasRef}
            />
          )}

          {/* Actions under canvas */}
          {bodyImage && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setBodyImage("");
                  setUploadId(null);
                }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                Change Photo
              </button>
              {selectedDesign && !processedDesignUrl && (
                <button
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                  className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 py-2 text-sm text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-50"
                >
                  {isRemovingBg ? "Processing..." : "Remove BG"}
                </button>
              )}
              {processedDesignUrl && (
                <button
                  onClick={() => setUseBgRemoved(!useBgRemoved)}
                  className={`flex-1 rounded-lg border py-2 text-sm transition ${
                    useBgRemoved
                      ? "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  }`}
                >
                  {useBgRemoved ? "Show Original" : "Show No BG"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Design Picker & Controls */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Design Picker */}
          <div className="flex h-[700px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 lg:h-[calc(100vh-220px)] lg:max-h-[800px] lg:min-h-[500px]">
            <h2 className="mb-4 flex-shrink-0 text-lg font-semibold text-white">
              Choose a Design
            </h2>
            <div className="min-h-0 flex-1 overflow-hidden">
              <DesignPicker
                onSelect={handleDesignSelect}
                selectedId={selectedDesign?.id}
              />
            </div>
          </div>

          {/* Control Panel - Only show when both image and design are selected */}
          {bodyImage && selectedDesign && (
            <ControlPanel
              position={position}
              onPositionChange={setPosition}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-r from-amber-500/10 to-red-500/10 p-6">
        <h3 className="mb-3 text-sm font-medium text-white">Quick Tips</h3>
        <ul className="grid gap-2 text-sm text-gray-400 sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <span className="text-amber-400">1.</span>
            Upload a clear photo of the area where you want your tattoo
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">2.</span>
            Select a design and use &quot;Remove BG&quot; for better blending
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">3.</span>
            Drag corners to resize, top handle to rotate, then save
          </li>
        </ul>
      </div>
    </div>
  );
}
