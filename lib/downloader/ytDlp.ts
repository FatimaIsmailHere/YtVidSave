// ─── yt-dlp Service ──────────────────────────────────────────────────────────
// Safe yt-dlp integration using child_process.spawn (no shell injection).
// All user input is passed as array arguments, never concatenated into shell strings.

import { spawn, ChildProcess } from "child_process";
import { config } from "../config";
import { Writable } from "stream";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface YtDlpFormatInfo {
  format_id: string;
  ext: string;
  vcodec: string;
  acodec: string;
  width?: number;
  height?: number;
  tbr?: number;
  filesize?: number;
  url?: string;
}

export interface YtDlpInfo {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  uploader?: string;
  webpage_url: string;
  formats: YtDlpFormatInfo[];
}

export interface MediaInfo {
  title: string;
  thumbnail?: string;
  duration?: string;
  durationSeconds?: number;
  uploader?: string;
  platform: string;
  formats: MediaFormat[];
  qualities: MediaQuality[];
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

export interface DownloadOptions {
  url: string;
  formatId: string;
  qualityId: string;
}

/** Error thrown when yt-dlp fails, carrying the full stderr for diagnostics. */
export class YtDlpError extends Error {
  exitCode: number | null;
  stderr: string;
  stdout: string;
  args: string[];

  constructor(
    message: string,
    opts: { exitCode: number | null; stderr: string; stdout: string; args: string[] }
  ) {
    super(message);
    this.name = "YtDlpError";
    this.exitCode = opts.exitCode;
    this.stderr = opts.stderr;
    this.stdout = opts.stdout;
    this.args = opts.args;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getYtDlpBinary(): string {
  return config.ytDlpPath || "yt-dlp";
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Safe Spawn with Manual Timeout ──────────────────────────────────────────

function spawnAsync(
  args: string[],
  timeoutMs: number
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const bin = getYtDlpBinary();

    if (process.env.NODE_ENV !== "production") {
      console.log(`[yt-dlp] spawning: ${bin} ${args.join(" ")}`);
    }

    const child: ChildProcess = spawn(bin, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    child.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      killed = true;
      try { child.kill("SIGTERM"); } catch { /* ignore */ }
      setTimeout(() => {
        try { child.kill("SIGKILL"); } catch { /* ignore */ }
      }, 3000);
      reject(new Error("Process timed out"));
    }, timeoutMs);

    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return;
      if (code === 0 || stdout.trim()) {
        resolve({ stdout, stderr });
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.error(`[yt-dlp] FAILED (exit=${code}):`);
          console.error(`[yt-dlp] stderr: ${stderr}`);
          console.error(`[yt-dlp] stdout: ${stdout}`);
          console.error(`[yt-dlp] args: ${JSON.stringify(args)}`);
        }
        reject(
          new YtDlpError(stderr.trim() || `yt-dlp exited with code ${code}`, {
            exitCode: code,
            stderr: stderr.trim(),
            stdout: stdout.trim(),
            args,
          })
        );
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      if (!killed) {
        if (process.env.NODE_ENV !== "production") {
          console.error(`[yt-dlp] spawn error: ${err.message}`);
        }
        reject(err);
      }
    });
  });
}

// ─── Spawn with Writable Stream (for piping output to a response) ────────────
// Streams yt-dlp stdout directly to a Writable (e.g. NextResponse body).
// Returns stderr for diagnostics.

function spawnStream(
  args: string[],
  writable: Writable,
  timeoutMs: number
): Promise<{ stderr: string }> {
  return new Promise((resolve, reject) => {
    const bin = getYtDlpBinary();

    if (process.env.NODE_ENV !== "production") {
      console.log(`[yt-dlp] streaming: ${bin} ${args.join(" ")}`);
    }

    const child: ChildProcess = spawn(bin, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let killed = false;

    child.stdout?.on("data", (data: Buffer) => {
      if (!writable.destroyed) {
        writable.write(data);
      }
    });

    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      killed = true;
      try { child.kill("SIGTERM"); } catch { /* ignore */ }
      setTimeout(() => {
        try { child.kill("SIGKILL"); } catch { /* ignore */ }
      }, 3000);
      writable.destroy(new Error("Process timed out"));
      reject(new Error("Process timed out"));
    }, timeoutMs);

    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return;
      if (!writable.destroyed) {
        writable.end();
      }
      if (code === 0 || !stderr.trim()) {
        resolve({ stderr });
      } else {
        reject(
          new YtDlpError(stderr.trim() || `yt-dlp exited with code ${code}`, {
            exitCode: code,
            stderr: stderr.trim(),
            stdout: "",
            args,
          })
        );
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      if (!killed) {
        if (!writable.destroyed) {
          writable.destroy(err);
        }
        reject(err);
      }
    });

    // Handle writable stream errors (e.g. client disconnect)
    writable.on("error", (err) => {
      if (!killed) {
        killed = true;
        try { child.kill("SIGTERM"); } catch { /* ignore */ }
        clearTimeout(timer);
      }
    });
  });
}

// ─── Get Video Info ──────────────────────────────────────────────────────────

export async function getVideoInfo(url: string): Promise<MediaInfo> {
  const start = Date.now();

  const { stdout, stderr } = await spawnAsync(
    ["-j", "--no-warnings", "--no-check-certificates", url],
    config.analyzeTimeout
  );

  if (process.env.NODE_ENV !== "production" && stderr) {
    console.log(`[yt-dlp] stderr (non-fatal): ${stderr.substring(0, 500)}`);
  }

  const info: YtDlpInfo = JSON.parse(stdout.trim());

  // Extract formats
  const formatSet = new Map<string, MediaFormat>();
  const qualitySet = new Map<string, MediaQuality>();

  if (info.formats && Array.isArray(info.formats)) {
    for (const fmt of info.formats) {
      const ext = (fmt.ext || "").toLowerCase();
      const hasVideo = fmt.vcodec && fmt.vcodec !== "none";
      const hasAudio = fmt.acodec && fmt.acodec !== "none";

      if (ext === "mp4" && hasVideo && hasAudio && !formatSet.has("mp4")) {
        formatSet.set("mp4", { id: "mp4", label: "MP4", container: "mp4", mimeType: "video/mp4", type: "video" });
      } else if (ext === "webm" && hasVideo && hasAudio && !formatSet.has("webm")) {
        formatSet.set("webm", { id: "webm", label: "WebM", container: "webm", mimeType: "video/webm", type: "video" });
      } else if (ext === "webm" && hasVideo && !formatSet.has("webm")) {
        // Video-only WebM — still show it as an option (yt-dlp can merge)
        formatSet.set("webm", { id: "webm", label: "WebM", container: "webm", mimeType: "video/webm", type: "video" });
      } else if (ext === "mp3" && !formatSet.has("mp3")) {
        formatSet.set("mp3", { id: "mp3", label: "MP3", container: "mp3", mimeType: "audio/mpeg", type: "audio" });
      } else if (ext === "m4a" && !formatSet.has("m4a")) {
        formatSet.set("m4a", { id: "m4a", label: "M4A", container: "m4a", mimeType: "audio/mp4", type: "audio" });
      }

      if (hasVideo && fmt.height) {
        const key = `${fmt.height}p`;
        if (!qualitySet.has(key)) {
          qualitySet.set(key, {
            id: key,
            label: `${fmt.height}p`,
            width: fmt.width,
            height: fmt.height,
            bitrate: fmt.tbr ? `${Math.round(fmt.tbr)} kbps` : undefined,
          });
        }
      }
    }
  }

  // Fallbacks
  const formats = formatSet.size > 0
    ? Array.from(formatSet.values())
    : [
        { id: "mp4", label: "MP4", container: "mp4", mimeType: "video/mp4", type: "video" as const },
        { id: "mp3", label: "MP3", container: "mp3", mimeType: "audio/mpeg", type: "audio" as const },
      ];

  const qualities = qualitySet.size > 0
    ? Array.from(qualitySet.values()).sort((a, b) => (b.height || 0) - (a.height || 0))
    : [
        { id: "1080p", label: "1080p", width: 1920, height: 1080, bitrate: "5 Mbps" },
        { id: "720p", label: "720p", width: 1280, height: 720, bitrate: "2.5 Mbps" },
        { id: "480p", label: "480p", width: 854, height: 480, bitrate: "1 Mbps" },
      ];

  const elapsed = Date.now() - start;
  if (process.env.NODE_ENV !== "production") {
    console.log(`[yt-dlp] analyze OK in ${elapsed}ms title="${info.title}" formats=${formats.length} qualities=${qualities.length}`);
  }

  return {
    title: info.title || "Untitled",
    thumbnail: info.thumbnail,
    duration: info.duration ? formatDuration(info.duration) : undefined,
    durationSeconds: info.duration,
    uploader: info.uploader,
    platform: info.webpage_url,
    formats,
    qualities,
  };
}

// ─── Get Download Args ───────────────────────────────────────────────────────
// Builds yt-dlp arguments to download to stdout (-o -).

export function getYtDlpArgs(
  url: string,
  formatId: string,
  qualityId: string
): string[] {
  let formatSelector = "best";

  if (formatId === "mp3" || formatId === "m4a") {
    formatSelector = "bestaudio/best";
  } else {
    const height = qualityId.replace("p", "");
    if (formatId === "mp4") {
      formatSelector = `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    } else if (formatId === "webm") {
      // Use merge-output-format to get a single combined file
      formatSelector = `bestvideo[height<=${height}][ext=webm]+bestaudio[ext=webm]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    } else {
      formatSelector = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    }
  }

  const args = ["-f", formatSelector, "-o", "-", "--no-warnings", "--no-check-certificates"];

  // For formats that may need merging, tell yt-dlp to merge into the right container
  if (formatId === "webm") {
    args.push("--merge-output-format", "webm");
  } else if (formatId === "mp4") {
    args.push("--merge-output-format", "mp4");
  }

  args.push(url);
  return args;
}

// ─── Stream Download ─────────────────────────────────────────────────────────
// Pipes yt-dlp stdout directly to the response body. No temp files.

export async function streamDownload(
  url: string,
  formatId: string,
  qualityId: string,
  writable: Writable
): Promise<void> {
  const start = Date.now();
  const args = getYtDlpArgs(url, formatId, qualityId);

  try {
    await spawnStream(args, writable, config.downloadTimeout);
    const elapsed = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[yt-dlp] stream completed in ${elapsed}ms`);
    }
  } catch (err) {
    const elapsed = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.error(`[yt-dlp] stream failed after ${elapsed}ms: ${err instanceof Error ? err.message : err}`);
    }
    throw err;
  }
}

// ─── Error Classification ────────────────────────────────────────────────────

export type YtDlpErrorCategory =
  | "auth_required"
  | "content_unavailable"
  | "geo_restricted"
  | "extractor_error"
  | "network_error"
  | "unknown";

export function classifyYtDlpError(err: unknown): {
  category: YtDlpErrorCategory;
  userMessage: string;
  suggestion?: string;
} {
  if (!(err instanceof YtDlpError)) {
    return {
      category: "unknown",
      userMessage: "An unexpected error occurred.",
      suggestion: "Please try again later.",
    };
  }

  const msg = err.stderr.toLowerCase();

  if (msg.includes("login") || msg.includes("sign in") || msg.includes("authentication") || msg.includes("cookies")) {
    return {
      category: "auth_required",
      userMessage: "This content requires authentication to access.",
      suggestion: "Only publicly accessible media can be downloaded. This content may be private or restricted.",
    };
  }

  if (msg.includes("empty media response") || msg.includes("empty response")) {
    return {
      category: "content_unavailable",
      userMessage: "This media could not be accessed.",
      suggestion: "The content may be private, deleted, or restricted to certain regions.",
    };
  }

  if (msg.includes("geo") || msg.includes("not available in your country") || msg.includes("geographic")) {
    return {
      category: "geo_restricted",
      userMessage: "This content is not available in your region.",
      suggestion: "The media may be geo-restricted by the platform.",
    };
  }

  if (msg.includes("unsupported") || msg.includes("no extractor")) {
    return {
      category: "extractor_error",
      userMessage: "This URL format is not supported.",
      suggestion: "Please check the URL and try again.",
    };
  }

  if (msg.includes("network") || msg.includes("connection") || msg.includes("resolve") || msg.includes("timed out")) {
    return {
      category: "network_error",
      userMessage: "A network error occurred while fetching the media.",
      suggestion: "Please check your internet connection and try again.",
    };
  }

  if (msg.includes("unexpected response") || msg.includes("please report")) {
    return {
      category: "extractor_error",
      userMessage: "Unable to process this URL due to a platform change.",
      suggestion: "Please try a different URL or try again later.",
    };
  }

  return {
    category: "unknown",
    userMessage: "We couldn't retrieve this media. Please check the URL and try again.",
    suggestion: "Make sure the URL is public and accessible.",
  };
}
