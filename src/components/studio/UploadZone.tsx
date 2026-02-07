"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Upload {
  id: string;
  url: string;
  createdAt: string;
}

interface UploadZoneProps {
  onUploadComplete: (url: string, uploadId?: string) => void;
  currentImage?: string;
}

export function UploadZone({ onUploadComplete, currentImage }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviousUploads, setShowPreviousUploads] = useState(false);
  const [previousUploads, setPreviousUploads] = useState<Upload[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch previous uploads
  useEffect(() => {
    if (showPreviousUploads && previousUploads.length === 0) {
      setIsLoadingUploads(true);
      fetch("/api/uploads")
        .then((res) => res.json())
        .then((data) => {
          if (data.uploads) {
            setPreviousUploads(data.uploads);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingUploads(false));
    }
  }, [showPreviousUploads, previousUploads.length]);

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (8MB)
      if (file.size > 8 * 1024 * 1024) {
        setError("File too large. Maximum size is 8MB");
        return;
      }

      console.log("Starting upload for:", file.name, file.type, file.size);
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        const data = await response.json();
        console.log("Upload response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        if (data.url) {
          console.log("Upload successful, URL:", data.url, "ID:", data.uploadId);
          setIsUploading(false);
          setUploadProgress(0);
          setError(null);
          onUploadComplete(data.url, data.uploadId);
        } else {
          throw new Error("No URL returned from upload");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onUploadComplete]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;
      uploadFile(fileArray[0]);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSelectPreviousUpload = (upload: Upload) => {
    onUploadComplete(upload.url, upload.id);
    setShowPreviousUploads(false);
  };

  if (currentImage) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <img
          src={currentImage}
          alt="Uploaded body part"
          className="h-full w-full object-contain"
        />
        <button
          onClick={() => onUploadComplete("")}
          className="absolute right-3 top-3 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur transition hover:bg-black/70"
        >
          Change
        </button>
      </div>
    );
  }

  // Show previous uploads selector
  if (showPreviousUploads) {
    return (
      <div className="flex aspect-[3/4] w-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Select from uploads</h3>
          <button
            onClick={() => setShowPreviousUploads(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Back
          </button>
        </div>

        {isLoadingUploads ? (
          <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-white/10" />
            ))}
          </div>
        ) : previousUploads.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <svg className="mb-2 h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">No previous uploads</p>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto">
            {previousUploads.map((upload) => (
              <button
                key={upload.id}
                onClick={() => handleSelectPreviousUpload(upload)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 transition hover:border-amber-500"
              >
                <img
                  src={upload.url}
                  alt="Previous upload"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">Select</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all",
          isDragging
            ? "border-amber-500 bg-amber-500/10"
            : "border-white/20 bg-white/5 hover:border-amber-500/50 hover:bg-white/10",
          isUploading && "pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                  className="text-amber-500 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                {uploadProgress}%
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {uploadProgress < 100 ? "Uploading..." : "Processing..."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
              <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">
              {isDragging ? "Drop your image here" : "Upload your photo"}
            </h3>
            <p className="mb-4 text-center text-sm text-gray-400">
              Drag and drop or click to upload
              <br />
              PNG, JPG up to 8MB
            </p>
            <div className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-500">
              Choose File
            </div>
          </>
        )}

        {error && (
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Select from previous uploads button */}
      <button
        onClick={() => setShowPreviousUploads(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select from previous uploads
      </button>
    </div>
  );
}
