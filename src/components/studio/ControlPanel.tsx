"use client";

import { useState } from "react";

interface TattooPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  blur: number;
}

interface ControlPanelProps {
  position: TattooPosition;
  onPositionChange: (position: TattooPosition) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export function ControlPanel({
  position,
  onPositionChange,
  onSave,
  onReset,
  isSaving,
}: ControlPanelProps) {
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  // Size as a percentage of base size (150)
  const widthPercent = Math.round((position.width / 150) * 100);
  const heightPercent = Math.round((position.height / 150) * 100);

  const handleWidthChange = (percent: number) => {
    const newWidth = (percent / 100) * 150;
    if (lockAspectRatio) {
      const ratio = position.height / position.width;
      onPositionChange({
        ...position,
        width: newWidth,
        height: newWidth * ratio,
      });
    } else {
      onPositionChange({
        ...position,
        width: newWidth,
      });
    }
  };

  const handleHeightChange = (percent: number) => {
    const newHeight = (percent / 100) * 150;
    if (lockAspectRatio) {
      const ratio = position.width / position.height;
      onPositionChange({
        ...position,
        height: newHeight,
        width: newHeight * ratio,
      });
    } else {
      onPositionChange({
        ...position,
        height: newHeight,
      });
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-4 text-sm font-medium text-white">Adjust Design</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Width Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-gray-400">Width</label>
            <span className="text-xs text-gray-500">{widthPercent}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            value={widthPercent}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-amber-500"
          />
        </div>

        {/* Height Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Height</label>
              <button
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className={`rounded p-0.5 transition ${
                  lockAspectRatio
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-gray-500 hover:text-gray-400"
                }`}
                title={lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {lockAspectRatio ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  )}
                </svg>
              </button>
            </div>
            <span className="text-xs text-gray-500">{heightPercent}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            value={heightPercent}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-amber-500"
          />
        </div>

        {/* Rotation Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-gray-400">Rotation</label>
            <span className="text-xs text-gray-500">{Math.round(position.rotation)}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={position.rotation}
            onChange={(e) =>
              onPositionChange({ ...position, rotation: Number(e.target.value) })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-amber-500"
          />
        </div>

        {/* Opacity Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-gray-400">Opacity</label>
            <span className="text-xs text-gray-500">{Math.round(position.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={position.opacity * 100}
            onChange={(e) =>
              onPositionChange({ ...position, opacity: Number(e.target.value) / 100 })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-amber-500"
          />
        </div>

        {/* Blur Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-gray-400">Blur</label>
            <span className="text-xs text-gray-500">{position.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={position.blur}
            onChange={(e) =>
              onPositionChange({ ...position, blur: Number(e.target.value) })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-amber-500"
          />
        </div>
      </div>

      {/* Position Info */}
      <div className="mt-4 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Position</label>
          <span className="text-xs text-gray-500">
            X: {Math.round(position.x)}px, Y: {Math.round(position.y)}px
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Drag to move, corners to resize, top handle to rotate
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Reset
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-500 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Preview"}
        </button>
      </div>
    </div>
  );
}
