export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const SITE_CONFIG = {
  name: "YtVidSave",
  tagline: "Download. Convert. Done.",
  description:
    "YtVidSave is a fast, free YouTube video downloader. Download YouTube videos in MP4, WebM, MP3, and M4A. Choose from 4K, 1080p, 720p, and more. Simply paste a URL and download.",
  url: "https://ytvidsave.com",
  email: "support@ytvidsave.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#supported-sources", label: "Supported Sources" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const MOBILE_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#supported-sources", label: "Supported Sources" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
