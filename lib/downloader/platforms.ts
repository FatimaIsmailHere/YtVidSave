// ─── Platform Configuration ──────────────────────────────────────────────────
// Single source of truth for supported platforms.

export type Platform = "youtube";

export interface PlatformConfig {
  id: Platform;
  name: string;
  hostnames: string[];
  urlPatterns: RegExp[];
  enabled: boolean;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "youtube",
    name: "YouTube",
    hostnames: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
    urlPatterns: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ],
    enabled: true,
  },
];

// ─── Platform Detection ──────────────────────────────────────────────────────

export function detectPlatform(url: string): PlatformConfig | null {
  try {
    const parsed = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`);
    const hostname = parsed.hostname.replace("www.", "").toLowerCase();

    for (const platform of PLATFORMS) {
      if (!platform.enabled) continue;
      for (const host of platform.hostnames) {
        if (hostname === host || hostname.endsWith(`.${host}`)) {
          return platform;
        }
      }
    }
  } catch {
    // Invalid URL
  }
  return null;
}

export function isAllowedUrl(url: string): boolean {
  return detectPlatform(url) !== null;
}

export function getEnabledPlatforms(): PlatformConfig[] {
  return PLATFORMS.filter((p) => p.enabled);
}
