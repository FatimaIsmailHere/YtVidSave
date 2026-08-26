"use client";

import { useState, useEffect } from "react";

interface InterstitialAdProps {
  onComplete: () => void;
  duration?: number; // seconds
}

export default function InterstitialAd({ onComplete, duration = 5 }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanSkip(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-800 rounded-2xl shadow-2xl overflow-hidden border border-surface-200 dark:border-surface-700">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-surface-50 dark:bg-surface-700/50 border-b border-surface-200 dark:border-surface-600">
          <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
            Advertisement
          </span>
          {!canSkip ? (
            <span className="text-xs text-surface-400">
              Skip in {countdown}s
            </span>
          ) : (
            <button
              onClick={onComplete}
              className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Skip Ad →
            </button>
          )}
        </div>

        {/* Ad Placeholder Content */}
        <div className="aspect-video bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-surface-400 dark:text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              Your ad will appear here
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              728 × 420
            </p>
          </div>
        </div>

        {/* Ad Footer */}
        <div className="px-4 py-3 bg-surface-50 dark:bg-surface-700/50 border-t border-surface-200 dark:border-surface-600 flex items-center justify-between">
          <span className="text-xs text-surface-400">
           广告 / Ad
          </span>
          {canSkip && (
            <button
              onClick={onComplete}
              className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Continue to Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
