"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Rnd } from "react-rnd";
import { cn } from "@/lib/utils";

// SVG placeholder for broken images
const brokenImagePlaceholder = `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a2e" width="200" height="200"/><g fill="none" stroke="#f59e0b" stroke-width="2"><rect x="40" y="40" width="120" height="120" rx="8"/><path d="M60 130l30-40 20 25 30-45 20 60"/><circle cx="80" cy="80" r="12"/></g><text x="100" y="180" text-anchor="middle" fill="#666" font-size="12">Image expired</text></svg>`)}`;

interface TattooPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  blur: number;
}

interface TattooCanvasProps {
  bodyImage: string;
  tattooImage?: string;
  position: TattooPosition;
  onPositionChange: (position: TattooPosition) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export function TattooCanvas({
  bodyImage,
  tattooImage,
  position,
  onPositionChange,
  canvasRef,
}: TattooCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [startAngle, setStartAngle] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Set ref for parent access
  useEffect(() => {
    if (canvasRef && containerRef.current) {
      (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current;
    }
  }, [canvasRef]);

  const handleRotateStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsRotating(true);

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const centerX = position.x + position.width / 2;
      const centerY = position.y + position.height / 2;

      const angle = Math.atan2(clientY - rect.top - centerY, clientX - rect.left - centerX);
      setStartAngle(angle - (position.rotation * Math.PI) / 180);
    },
    [position]
  );

  const handleRotateMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isRotating) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const centerX = position.x + position.width / 2;
      const centerY = position.y + position.height / 2;

      const angle = Math.atan2(clientY - rect.top - centerY, clientX - rect.left - centerX);
      const newRotation = ((angle - startAngle) * 180) / Math.PI;

      onPositionChange({
        ...position,
        rotation: newRotation,
      });
    },
    [isRotating, position, startAngle, onPositionChange]
  );

  const handleRotateEnd = useCallback(() => {
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (isRotating) {
      window.addEventListener("mousemove", handleRotateMove);
      window.addEventListener("mouseup", handleRotateEnd);
      window.addEventListener("touchmove", handleRotateMove);
      window.addEventListener("touchend", handleRotateEnd);
      return () => {
        window.removeEventListener("mousemove", handleRotateMove);
        window.removeEventListener("mouseup", handleRotateEnd);
        window.removeEventListener("touchmove", handleRotateMove);
        window.removeEventListener("touchend", handleRotateEnd);
      };
    }
  }, [isRotating, handleRotateMove, handleRotateEnd]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      {/* Body Image */}
      <img
        src={bodyImage}
        alt="Body"
        className="pointer-events-none h-full w-full object-contain"
        draggable={false}
        crossOrigin="anonymous"
      />

      {/* Tattoo Overlay with react-rnd */}
      {tattooImage && containerSize.width > 0 && (
        <Rnd
          size={{ width: position.width, height: position.height }}
          position={{ x: position.x, y: position.y }}
          onDragStop={(e, d) => {
            onPositionChange({ ...position, x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, pos) => {
            onPositionChange({
              ...position,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: pos.x,
              y: pos.y,
            });
          }}
          bounds="parent"
          className="group"
          style={{
            transform: `rotate(${position.rotation}deg)`,
          }}
          resizeHandleStyles={{
            topLeft: { cursor: "nwse-resize" },
            topRight: { cursor: "nesw-resize" },
            bottomLeft: { cursor: "nesw-resize" },
            bottomRight: { cursor: "nwse-resize" },
            top: { cursor: "ns-resize" },
            bottom: { cursor: "ns-resize" },
            left: { cursor: "ew-resize" },
            right: { cursor: "ew-resize" },
          }}
          resizeHandleClasses={{
            topLeft:
              "!w-4 !h-4 !-top-2 !-left-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            topRight:
              "!w-4 !h-4 !-top-2 !-right-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            bottomLeft:
              "!w-4 !h-4 !-bottom-2 !-left-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            bottomRight:
              "!w-4 !h-4 !-bottom-2 !-right-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            top:
              "!w-8 !h-3 !-top-1.5 !left-1/2 !-translate-x-1/2 bg-amber-500/70 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            bottom:
              "!w-8 !h-3 !-bottom-1.5 !left-1/2 !-translate-x-1/2 bg-amber-500/70 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            left:
              "!w-3 !h-8 !-left-1.5 !top-1/2 !-translate-y-1/2 bg-amber-500/70 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
            right:
              "!w-3 !h-8 !-right-1.5 !top-1/2 !-translate-y-1/2 bg-amber-500/70 rounded-full opacity-0 group-hover:opacity-100 transition z-10",
          }}
        >
          <div className="relative h-full w-full cursor-move">
            <div
              className="absolute inset-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{
                backgroundImage: `url(${tattooImage})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                mixBlendMode: "multiply",
                opacity: position.opacity,
                filter: position.blur > 0 ? `blur(${position.blur}px)` : undefined,
              }}
            />
            {/* Selection border */}
            <div className="absolute inset-0 rounded border-2 border-amber-500/50 opacity-0 transition group-hover:opacity-100" />
            {/* Rotation handle */}
            <div
              onMouseDown={handleRotateStart}
              onTouchStart={handleRotateStart}
              className="absolute -top-8 left-1/2 flex h-6 w-6 -translate-x-1/2 cursor-grab items-center justify-center rounded-full bg-amber-500 opacity-0 shadow-lg transition group-hover:opacity-100 active:cursor-grabbing"
            >
              <svg
                className="h-4 w-4 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 4v5h5" />
                <path d="M20 20v-5h-5" />
                <path d="M4 9a9 9 0 0 1 15 6.7" />
                <path d="M20 15a9 9 0 0 1-15-6.7" />
              </svg>
            </div>
            {/* Connection line to rotation handle */}
            <div className="absolute -top-6 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-amber-500/50 opacity-0 transition group-hover:opacity-100" />
          </div>
        </Rnd>
      )}

      {/* Instructions overlay */}
      {tattooImage && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-gray-300 backdrop-blur">
          Drag to move | Corner handles to resize | Top handle to rotate
        </div>
      )}

      {/* No design selected message */}
      {!tattooImage && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-black/60 px-6 py-4 text-center backdrop-blur">
            <p className="text-sm text-gray-300">Select a design to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
