"use client";

import type { MediaError } from "@/types/downloader";

interface ErrorStateProps {
  error: MediaError;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      className="card p-6 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 animate-fade-in"
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            {error.message}
          </h3>
          {error.suggestion && (
            <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
              {error.suggestion}
            </p>
          )}
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium
                       text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200
                       underline underline-offset-2 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
