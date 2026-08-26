"use client";

import { useState } from "react";
import type { MediaResult, DownloadResult as DownloadResultType } from "@/types/downloader";
import FormatSelector from "./FormatSelector";

type DownloadStatus = "idle" | "preparing" | "downloading" | "ready" | "error";

interface DownloadResultProps {
  result: MediaResult;
  onDownload: (formatId: string, qualityId: string) => void;
  downloadStatus: DownloadStatus;
  downloadResult: DownloadResultType | null;
  onDismissDownload: () => void;
}

export default function DownloadResult({
  result,
  onDownload,
  downloadStatus,
  downloadResult,
  onDismissDownload,
}: DownloadResultProps) {
  const [selectedFormat, setSelectedFormat] = useState(
    result.formats[0]?.id || ""
  );
  const [selectedQuality, setSelectedQuality] = useState(
    result.qualities[0]?.id || ""
  );

  const selectedFormatData = result.formats.find(
    (f) => f.id === selectedFormat
  );
  const selectedQualityData = result.qualities.find(
    (q) => q.id === selectedQuality
  );

  return (
    <div className="card p-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Thumbnail */}
        <div className="sm:w-48 sm:h-28 w-full h-40 sm:flex-shrink-0 rounded-xl bg-surface-100 dark:bg-surface-800 overflow-hidden flex items-center justify-center">
          {result.thumbnail ? (
            <img
              src={result.thumbnail}
              alt={result.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-surface-400 dark:text-surface-500">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125"
                />
              </svg>
              <span className="text-xs">No preview</span>
            </div>
          )}
        </div>

        {/* Media info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white truncate">
            {result.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-xs font-medium">
              {result.sourcePlatform}
            </span>
            {result.duration && (
              <>
                <span className="text-surface-300 dark:text-surface-600">·</span>
                <span>{result.duration}</span>
              </>
            )}
            {result.type && (
              <>
                <span className="text-surface-300 dark:text-surface-600">·</span>
                <span className="capitalize">{result.type}</span>
              </>
            )}
          </div>
          {selectedQualityData?.bitrate && (
            <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
              Est. bitrate: {selectedQualityData.bitrate}
            </p>
          )}
        </div>
      </div>

      {/* Format & Quality selectors + Download */}
      <div className="mt-5 pt-5 border-t border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <FormatSelector
              formats={result.formats}
              qualities={result.qualities}
              selectedFormat={selectedFormat}
              selectedQuality={selectedQuality}
              onFormatChange={setSelectedFormat}
              onQualityChange={setSelectedQuality}
            />
          </div>
          <button
            onClick={() => onDownload(selectedFormat, selectedQuality)}
            disabled={downloadStatus === "preparing" || downloadStatus === "downloading"}
            className="btn-primary !px-8 !py-3 w-full sm:w-auto disabled:opacity-60"
            aria-label={`Download as ${selectedFormatData?.label} in ${selectedQualityData?.label}`}
          >
            {downloadStatus === "preparing" || downloadStatus === "downloading" ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{downloadStatus === "downloading" ? "Downloading..." : "Preparing..."}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Download Ready Notification */}
        {downloadStatus === "ready" && downloadResult && (
          <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Download ready
                </p>
                <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                  {selectedFormatData?.label} · {selectedQualityData?.label}
                  {downloadResult.fileSize && downloadResult.fileSize !== "Not available in demo mode" && ` · ${downloadResult.fileSize}`}
                </p>
                <a
                  href={downloadResult.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Open download link
                </a>
              </div>
              <button
                onClick={onDismissDownload}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
