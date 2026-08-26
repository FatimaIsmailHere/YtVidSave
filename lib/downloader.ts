// Re-export from new service architecture
// This file exists for backward compatibility with existing imports.

export type { MediaFormat, MediaQuality } from "./downloader/ytDlp";
export type { Platform, PlatformConfig } from "./downloader/platforms";
export { detectPlatform, isAllowedUrl, getEnabledPlatforms } from "./downloader/platforms";
export { validateUrl, sanitizeFilename, ERRORS } from "./downloader/validation";
export type { ApiError, ErrorCode } from "./downloader/validation";
