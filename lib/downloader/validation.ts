// ─── Validation & Security ───────────────────────────────────────────────────

import { isAllowedUrl, detectPlatform } from "./platforms";

// ─── URL Validation ──────────────────────────────────────────────────────────

export function validateUrl(url: string): {
  valid: boolean;
  normalized?: string;
  error?: string;
} {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "Please enter a URL." };
  }

  const trimmed = url.trim();
  if (trimmed.length > 2048) {
    return { valid: false, error: "URL is too long." };
  }

  const normalized = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { valid: false, error: "Please enter a valid URL." };
  }

  if (!parsed.hostname.includes(".")) {
    return { valid: false, error: "Please enter a valid URL." };
  }

  // Check protocol
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only HTTP/HTTPS URLs are supported." };
  }

  // Check if platform is allowed
  if (!isAllowedUrl(parsed.href)) {
    return {
      valid: false,
      error: "Please enter a valid YouTube URL.",
    };
  }

  return { valid: true, normalized: parsed.href };
}

// ─── Filename Sanitization ───────────────────────────────────────────────────

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .substring(0, 200)
    .trim() || "download";
}

// ─── Format/Quality Validation ───────────────────────────────────────────────

const ALLOWED_FORMATS = ["mp4", "webm", "mp3", "m4a"];
export function validateFormat(formatId: string): boolean {
  return ALLOWED_FORMATS.includes(formatId);
}

// Validate quality ID: must be a number followed by 'p' (e.g. 360p, 720p, 1080p, 1920p)
// This safely accepts all YouTube quality variants without an exhaustive allowlist.
export function validateQuality(qualityId: string): boolean {
  return /^\d{2,4}p$/.test(qualityId);
}

// ─── Error Response Builder ──────────────────────────────────────────────────

export type ErrorCode =
  | "invalid_url"
  | "unsupported_platform"
  | "content_unavailable"
  | "processing_timeout"
  | "rate_limited"
  | "processing_error"
  | "download_error";

export interface ApiError {
  code: ErrorCode;
  message: string;
  suggestion?: string;
}

export function apiError(code: ErrorCode, message: string, suggestion?: string): ApiError {
  return { code, message, suggestion };
}

export const ERRORS = {
  invalidUrl: () =>
    apiError("invalid_url", "Please enter a valid YouTube URL."),
  unsupportedPlatform: () =>
    apiError("unsupported_platform", "Please enter a valid YouTube URL."),
  contentUnavailable: () =>
    apiError("content_unavailable", "We couldn't process this YouTube URL. Please check the link and try again."),
  processingTimeout: () =>
    apiError("processing_timeout", "The request took too long to process. Please try again.", "Try a shorter video or different quality."),
  rateLimited: (retryAfterMs: number) =>
    apiError("rate_limited", `Too many requests. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.`),
  serverError: () =>
    apiError("processing_error", "Something went wrong while processing your request. Please try again later."),
  downloadFailed: () =>
    apiError("download_error", "The download could not be completed. Please try a different format."),
} as const;
