// ─── Media Types ─────────────────────────────────────────────────────────────

export type MediaType = "video" | "audio" | "image" | "unknown";

export type MediaStatus =
  | "idle"
  | "validating"
  | "analyzing"
  | "success"
  | "error";

export type DownloadStatus =
  | "idle"
  | "preparing"
  | "downloading"
  | "ready"
  | "error";

// ─── API Types ───────────────────────────────────────────────────────────────

export interface MediaRequest {
  url: string;
}

export interface MediaFormat {
  id: string;
  label: string;
  container: string;
  mimeType: string;
  type: "video" | "audio";
}

export interface MediaQuality {
  id: string;
  label: string;
  width?: number;
  height?: number;
  bitrate?: string;
}

export interface MediaResult {
  id: string;
  title: string;
  thumbnail?: string;
  source: string;
  sourcePlatform: string;
  platform: string;
  duration?: string;
  durationSeconds?: number;
  type: MediaType;
  originalUrl: string;
  formats: MediaFormat[];
  qualities: MediaQuality[];
}

export interface DownloadRequest {
  mediaId: string;
  formatId: string;
  qualityId: string;
  url?: string;
}

export interface DownloadResult {
  downloadUrl: string;
  filename: string;
  fileSize?: string;
  expiresIn?: number;
}

// ─── Error Types ─────────────────────────────────────────────────────────────

export type ErrorCode =
  | "invalid_url"
  | "unsupported_platform"
  | "content_unavailable"
  | "processing_timeout"
  | "rate_limited"
  | "processing_error"
  | "download_error";

export interface MediaError {
  code: ErrorCode;
  message: string;
  suggestion?: string;
}

// ─── Ad Types ────────────────────────────────────────────────────────────────

export type AdPlacement =
  | "top-banner"
  | "between-hero"
  | "content"
  | "sidebar"
  | "between-sections"
  | "bottom-banner"
  | "mobile-banner";

export type AdFormat = "horizontal" | "vertical" | "square" | "responsive";
