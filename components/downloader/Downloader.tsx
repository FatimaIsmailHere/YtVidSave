"use client";

import { useState, useCallback } from "react";
import type {
  MediaResult,
  MediaError,
  MediaStatus,
  DownloadResult as DownloadResultType,
  DownloadStatus,
} from "@/types/downloader";
import UrlInput from "./UrlInput";
import LoadingState from "./LoadingState";
import DownloadResult from "./DownloadResult";
import ErrorState from "./ErrorState";
import InterstitialAd from "@/components/ads/InterstitialAd";

export default function Downloader() {
  const [status, setStatus] = useState<MediaStatus>("idle");
  const [result, setResult] = useState<MediaResult | null>(null);
  const [error, setError] = useState<MediaError | null>(null);
  const [lastUrl, setLastUrl] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle");
  const [downloadResult, setDownloadResult] = useState<DownloadResultType | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ formatId: string; qualityId: string } | null>(null);

  const handleAnalyze = useCallback(async (url: string) => {
    setStatus("analyzing");
    setError(null);
    setResult(null);
    setLastUrl(url);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data as MediaError);
        setStatus("error");
        return;
      }

      setResult(data as MediaResult);
      setStatus("success");
    } catch {
      setError({
        code: "processing_error",
        message: "We couldn't process this YouTube URL. Please check the link and try again.",
        suggestion: "Check your internet connection.",
      });
      setStatus("error");
    }
  }, []);

  const startDownload = useCallback((formatId: string, qualityId: string) => {
    if (!result) return;

    setDownloadStatus("preparing");

    try {
      const params = new URLSearchParams({
        url: result.originalUrl,
        formatId,
        qualityId,
      });
      const downloadUrl = `/api/download?${params.toString()}`;

      const fallbackExt = formatId === "mp3" ? "mp3" : formatId === "m4a" ? "m4a" : formatId === "webm" ? "webm" : "mp4";
      const filename = `ytvidsave.${fallbackExt}`;

      const a = window.document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      a.style.display = "none";
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);

      setDownloadResult({ downloadUrl, filename });
      setDownloadStatus("ready");
    } catch {
      setError({
        code: "download_error",
        message: "We couldn't process this YouTube URL. Please check the link and try again.",
      });
      setStatus("error");
      setDownloadStatus("error");
    }
  }, [result]);

  const handleDownload = useCallback(
    async (formatId: string, qualityId: string) => {
      setPendingDownload({ formatId, qualityId });
      setShowInterstitial(true);
    },
    []
  );

  const handleInterstitialComplete = useCallback(() => {
    setShowInterstitial(false);
    if (pendingDownload) {
      startDownload(pendingDownload.formatId, pendingDownload.qualityId);
      setPendingDownload(null);
    }
  }, [pendingDownload, startDownload]);

  const handleRetry = useCallback(() => {
    if (lastUrl) {
      handleAnalyze(lastUrl);
    } else {
      setStatus("idle");
      setResult(null);
      setError(null);
    }
  }, [lastUrl, handleAnalyze]);

  return (
    <>
      {showInterstitial && (
        <InterstitialAd onComplete={handleInterstitialComplete} />
      )}

      <section id="tool" className="scroll-mt-20">
        <div className="w-full max-w-3xl mx-auto">
          <UrlInput
            onSubmit={handleAnalyze}
            disabled={status === "analyzing"}
            error={
              status === "error" && error?.code === "invalid_url"
                ? error.message
                : undefined
            }
          />

          <div className="mt-6">
            {status === "analyzing" && <LoadingState />}
            {status === "success" && result && (
              <DownloadResult
                result={result}
                onDownload={handleDownload}
                downloadStatus={downloadStatus}
                downloadResult={downloadResult}
                onDismissDownload={() => {
                  setDownloadStatus("idle");
                  setDownloadResult(null);
                }}
              />
            )}
            {status === "error" && error && (
              <ErrorState error={error} onRetry={handleRetry} />
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-surface-400 dark:text-surface-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>Only download YouTube videos you own or have permission to use.</span>
          </div>
        </div>
      </section>
    </>
  );
}
