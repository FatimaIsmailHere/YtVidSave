"use client";

import type { MediaFormat, MediaQuality } from "@/types/downloader";

interface FormatSelectorProps {
  formats: MediaFormat[];
  qualities: MediaQuality[];
  selectedFormat: string;
  selectedQuality: string;
  onFormatChange: (formatId: string) => void;
  onQualityChange: (qualityId: string) => void;
}

export default function FormatSelector({
  formats,
  qualities,
  selectedFormat,
  selectedQuality,
  onFormatChange,
  onQualityChange,
}: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label
          htmlFor="format-select"
          className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5"
        >
          Format
        </label>
        <select
          id="format-select"
          value={selectedFormat}
          onChange={(e) => onFormatChange(e.target.value)}
          className="input-field !py-2.5 !px-3 text-sm cursor-pointer"
        >
          {formats.map((fmt) => (
            <option key={fmt.id} value={fmt.id}>
              {fmt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="quality-select"
          className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5"
        >
          Quality
        </label>
        <select
          id="quality-select"
          value={selectedQuality}
          onChange={(e) => onQualityChange(e.target.value)}
          className="input-field !py-2.5 !px-3 text-sm cursor-pointer"
        >
          {qualities.map((q) => (
            <option key={q.id} value={q.id}>
              {q.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
