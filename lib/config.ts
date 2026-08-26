// ─── Centralized Configuration ───────────────────────────────────────────────
// All configurable values with safe defaults. No secrets stored here.

export const config = {
  // Remote backend URL (set in production when frontend is on Vercel)
  backendUrl: process.env.BACKEND_URL || "",

  // yt-dlp binary path (empty = use system PATH, only for local dev)
  ytDlpPath: process.env.YT_DLP_PATH || "",

  // Timeouts (ms)
  analyzeTimeout: parseInt(process.env.ANALYZE_TIMEOUT || "20000", 10),
  downloadTimeout: parseInt(process.env.DOWNLOAD_TIMEOUT || "300000", 10),

  // Rate limits (per minute per IP)
  rateLimitAnalyze: parseInt(process.env.RATE_LIMIT_ANALYZE || "10", 10),
  rateLimitDownload: parseInt(process.env.RATE_LIMIT_DOWNLOAD || "3", 10),

  // Resource limits
  maxConcurrentDownloads: parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || "2", 10),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "500", 10),

  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ytvidsave.com",
} as const;
