// ─── YtVidSave Backend Server ────────────────────────────────────────────────
// Standalone Express server that provides yt-dlp powered analyze + download.
// Deploy on Render (free tier) with yt-dlp and ffmpeg installed.

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Config ──────────────────────────────────────────────────────────────────

const ANALYZE_TIMEOUT = parseInt(process.env.ANALYZE_TIMEOUT || "20000", 10);
const DOWNLOAD_TIMEOUT = parseInt(process.env.DOWNLOAD_TIMEOUT || "300000", 10);
const RATE_LIMIT_ANALYZE = parseInt(process.env.RATE_LIMIT_ANALYZE || "10", 10);
const RATE_LIMIT_DOWNLOAD = parseInt(process.env.RATE_LIMIT_DOWNLOAD || "3", 10);
const MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || "2", 10);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: [
    "https://ytvidsave.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST"],
  credentials: false,
}));

app.use(express.json());

// ─── Rate Limiting (in-memory, per-IP) ───────────────────────────────────────

const rateLimits = new Map();

function checkRateLimit(key, limitPerMinute) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  let entry = rateLimits.get(key);

  if (!entry || now - entry.start > windowMs) {
    entry = { start: now, count: 0 };
    rateLimits.set(key, entry);
  }

  entry.count++;

  if (entry.count > limitPerMinute) {
    const retryAfterMs = windowMs - (now - entry.start);
    return { allowed: false, retryAfterMs };
  }

  return { allowed: true, retryAfterMs: 0 };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (now - entry.start > 120000) rateLimits.delete(key);
  }
}, 300000);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || "unknown";
}

function detectPlatform(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
      return { id: "youtube", name: "YouTube" };
    }
  } catch {}
  return null;
}

function validateUrl(url) {
  if (!url || typeof url !== "string") return { valid: false, error: "Please enter a valid YouTube URL." };
  try {
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) return { valid: false, error: "Please enter a valid YouTube URL." };
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") return { valid: true, normalized: u.href };
    return { valid: false, error: "Please enter a valid YouTube URL." };
  } catch {
    return { valid: false, error: "Please enter a valid YouTube URL." };
  }
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9_\-. ]/g, "_").substring(0, 100);
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Spawn yt-dlp safely ─────────────────────────────────────────────────────

function spawnYtDlp(args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn("yt-dlp", args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    child.stdout?.on("data", (data) => { stdout += data.toString(); });
    child.stderr?.on("data", (data) => { stderr += data.toString(); });

    const timer = setTimeout(() => {
      killed = true;
      try { child.kill("SIGTERM"); } catch {}
      setTimeout(() => { try { child.kill("SIGKILL"); } catch {} }, 3000);
      reject(new Error("Process timed out"));
    }, timeoutMs);

    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return;
      if (code === 0 || stdout.trim()) {
        resolve({ stdout, stderr });
      } else {
        reject({ exitCode: code, stderr: stderr.trim(), stdout: stdout.trim(), args });
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      if (!killed) reject(err);
    });
  });
}

function classifyError(err) {
  const msg = (err.stderr || err.message || "").toLowerCase();

  if (msg.includes("login") || msg.includes("sign in") || msg.includes("authentication") || msg.includes("cookies")) {
    return { code: "content_unavailable", message: "This content requires authentication to access.", suggestion: "Only publicly accessible media can be downloaded." };
  }
  if (msg.includes("empty media") || msg.includes("empty response")) {
    return { code: "content_unavailable", message: "This media could not be accessed.", suggestion: "The content may be private, deleted, or restricted." };
  }
  if (msg.includes("geo") || msg.includes("not available in your country")) {
    return { code: "content_unavailable", message: "This content is not available in your region.", suggestion: "The media may be geo-restricted." };
  }
  if (msg.includes("network") || msg.includes("connection") || msg.includes("timed out")) {
    return { code: "network_error", message: "A network error occurred while fetching the media.", suggestion: "Please try again later." };
  }
  if (msg.includes("unsupported") || msg.includes("no extractor")) {
    return { code: "invalid_url", message: "This URL format is not supported.", suggestion: "Please check the URL and try again." };
  }

  return { code: "content_unavailable", message: "We couldn't retrieve this media. Please check the URL and try again.", suggestion: "Make sure the URL is public and accessible." };
}

// ─── Health Check ────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Analyze Endpoint ────────────────────────────────────────────────────────

app.post("/api/analyze", async (req, res) => {
  const startTime = Date.now();

  try {
    // Rate limit
    const ip = getClientIp(req);
    const rl = checkRateLimit(`analyze:${ip}`, RATE_LIMIT_ANALYZE);
    if (!rl.allowed) {
      return res.status(429).json({ code: "rate_limited", message: "Too many requests. Please wait a moment." });
    }

    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ code: "invalid_url", message: "Please enter a valid YouTube URL." });
    }

    // Validate
    const validation = validateUrl(url);
    if (!validation.valid) {
      return res.status(400).json({ code: "invalid_url", message: validation.error });
    }

    // Detect platform
    const platform = detectPlatform(validation.normalized);
    if (!platform) {
      return res.status(400).json({ code: "unsupported_platform", message: "This URL is not supported. Please enter a valid YouTube URL." });
    }

    // yt-dlp: get video info
    const { stdout } = await spawnYtDlp(["-j", "--no-warnings", "--no-check-certificates", validation.normalized], ANALYZE_TIMEOUT);

    const info = JSON.parse(stdout.trim());

    // Extract formats
    const formatSet = new Map();
    const qualitySet = new Map();

    if (info.formats && Array.isArray(info.formats)) {
      for (const fmt of info.formats) {
        const ext = (fmt.ext || "").toLowerCase();
        const hasVideo = fmt.vcodec && fmt.vcodec !== "none";
        const hasAudio = fmt.acodec && fmt.acodec !== "none";

        if (ext === "mp4" && hasVideo && hasAudio && !formatSet.has("mp4")) {
          formatSet.set("mp4", { id: "mp4", label: "MP4", container: "mp4", mimeType: "video/mp4", type: "video" });
        } else if (ext === "webm" && hasVideo && !formatSet.has("webm")) {
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

    const formats = formatSet.size > 0
      ? Array.from(formatSet.values())
      : [
          { id: "mp4", label: "MP4", container: "mp4", mimeType: "video/mp4", type: "video" },
          { id: "mp3", label: "MP3", container: "mp3", mimeType: "audio/mpeg", type: "audio" },
        ];

    const qualities = qualitySet.size > 0
      ? Array.from(qualitySet.values()).sort((a, b) => (b.height || 0) - (a.height || 0))
      : [
          { id: "1080p", label: "1080p", width: 1920, height: 1080, bitrate: "5 Mbps" },
          { id: "720p", label: "720p", width: 1280, height: 720, bitrate: "2.5 Mbps" },
          { id: "480p", label: "480p", width: 854, height: 480, bitrate: "1 Mbps" },
        ];

    const duration = Date.now() - startTime;
    console.log(`[analyze] OK platform=${platform.id} duration=${duration}ms title="${info.title}"`);

    res.json({
      id: Math.random().toString(36).substring(2, 10),
      title: info.title || "Untitled",
      thumbnail: info.thumbnail,
      source: info.uploader || platform.name,
      sourcePlatform: platform.name,
      platform: platform.id,
      duration: info.duration ? formatDuration(info.duration) : undefined,
      durationSeconds: info.duration,
      type: "video",
      originalUrl: validation.normalized,
      formats,
      qualities,
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[analyze] FAILED after ${duration}ms:`, err.stderr || err.message || err);
    const classified = classifyError(err);
    const status = classified.code === "rate_limited" ? 429 : classified.code === "invalid_url" ? 400 : 404;
    res.status(status).json(classified);
  }
});

// ─── Download Endpoint ───────────────────────────────────────────────────────

let activeDownloads = 0;

app.post("/api/download", async (req, res) => {
  const startTime = Date.now();

  try {
    // Concurrency check
    if (activeDownloads >= MAX_CONCURRENT_DOWNLOADS) {
      return res.status(503).json({ code: "server_busy", message: "Server is busy. Please try again shortly." });
    }

    // Rate limit
    const ip = getClientIp(req);
    const rl = checkRateLimit(`download:${ip}`, RATE_LIMIT_DOWNLOAD);
    if (!rl.allowed) {
      return res.status(429).json({ code: "rate_limited", message: "Too many requests. Please wait a moment." });
    }

    const { url, formatId, qualityId } = req.body;

    // Validate URL
    const urlValidation = validateUrl(url || "");
    if (!urlValidation.valid) {
      return res.status(400).json({ code: "invalid_url", message: urlValidation.error });
    }

    // Validate platform
    const platform = detectPlatform(urlValidation.normalized);
    if (!platform) {
      return res.status(400).json({ code: "unsupported_platform", message: "This URL is not supported." });
    }

    // Validate format & quality
    const validFormats = ["mp4", "webm", "mp3", "m4a"];
    if (!formatId || !validFormats.includes(formatId)) {
      return res.status(400).json({ code: "invalid_request", message: "Invalid format selected." });
    }
    if (!qualityId || !/^\d{2,4}p$/.test(qualityId)) {
      return res.status(400).json({ code: "invalid_request", message: "Invalid quality selected." });
    }

    // Build yt-dlp args
    const height = qualityId.replace("p", "");
    let formatSelector = "best";

    if (formatId === "mp3" || formatId === "m4a") {
      formatSelector = "bestaudio/best";
    } else if (formatId === "mp4") {
      formatSelector = `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    } else if (formatId === "webm") {
      formatSelector = `bestvideo[height<=${height}][ext=webm]+bestaudio[ext=webm]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    }

    const args = ["-f", formatSelector, "-o", "-", "--no-warnings", "--no-check-certificates"];
    if (formatId === "webm") args.push("--merge-output-format", "webm");
    else if (formatId === "mp4") args.push("--merge-output-format", "mp4");
    args.push(urlValidation.normalized);

    // Content type
    const ext = formatId === "mp3" ? "mp3" : formatId === "m4a" ? "m4a" : formatId === "webm" ? "webm" : "mp4";
    const contentType = formatId === "mp3" ? "audio/mpeg" : formatId === "m4a" ? "audio/mp4" : formatId === "webm" ? "video/webm" : "video/mp4";
    const safeFilename = sanitizeFilename(`ytvidsave_download.${ext}`);

    // Stream download
    activeDownloads++;
    console.log(`[download] starting: yt-dlp ${args.join(" ")}`);

    const child = spawn("yt-dlp", args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderrData = "";

    child.stderr?.on("data", (data) => { stderrData += data.toString(); });

    // Set response headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    child.stdout?.pipe(res);

    child.on("close", (code) => {
      activeDownloads = Math.max(0, activeDownloads - 1);
      const duration = Date.now() - startTime;
      if (code === 0) {
        console.log(`[download] OK duration=${duration}ms`);
      } else {
        console.error(`[download] FAILED exit=${code} duration=${duration}ms stderr=${stderrData.substring(0, 300)}`);
        if (!res.headersSent) {
          const classified = classifyError({ stderr: stderrData });
          res.status(502).json(classified);
        }
      }
    });

    child.on("error", (err) => {
      activeDownloads = Math.max(0, activeDownloads - 1);
      console.error(`[download] spawn error: ${err.message}`);
      if (!res.headersSent) {
        res.status(502).json({ code: "server_error", message: "Download failed. Please try again." });
      }
    });

    // Handle client disconnect
    req.on("close", () => {
      if (!child.killed) {
        try { child.kill("SIGTERM"); } catch {}
        activeDownloads = Math.max(0, activeDownloads - 1);
      }
    });
  } catch (err) {
    activeDownloads = Math.max(0, activeDownloads - 1);
    console.error(`[download] Unexpected error:`, err);
    if (!res.headersSent) {
      res.status(500).json({ code: "server_error", message: "An unexpected error occurred." });
    }
  }
});

// GET handler for browser direct download
app.get("/api/download", (req, res) => {
  const { url, formatId, qualityId } = req.query;
  if (!url) return res.status(400).json({ code: "invalid_url", message: "Missing URL parameter." });

  // Delegate to POST handler
  req.body = { url, formatId: formatId || "mp4", qualityId: qualityId || "1080p" };
  req.method = "POST";
  app.handle(req, res);
});

// ─── Start Server ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`YtVidSave backend running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
