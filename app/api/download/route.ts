import { NextRequest } from "next/server";
import { config } from "@/lib/config";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { validateUrl, validateFormat, validateQuality, sanitizeFilename, ERRORS } from "@/lib/downloader/validation";
import { detectPlatform } from "@/lib/downloader/platforms";
import { classifyYtDlpError, getYtDlpArgs } from "@/lib/downloader/ytDlp";
import { spawn } from "child_process";

// Track concurrent downloads
let activeDownloads = 0;

function getYtDlpBinary(): string {
  return process.env.YT_DLP_PATH || "yt-dlp";
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Concurrency Check ───────────────────────────────────────────────
    if (activeDownloads >= config.maxConcurrentDownloads) {
      return Response.json(ERRORS.serverError(), { status: 503 });
    }

    // ── Rate Limit ──────────────────────────────────────────────────────
    const ip = getClientIp(request);
    const rl = checkRateLimit(`download:${ip}`, config.rateLimitDownload);
    if (!rl.allowed) {
      const err = ERRORS.rateLimited(rl.retryAfterMs);
      return Response.json(err, {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      });
    }

    // ── Parse Body ──────────────────────────────────────────────────────
    let body: { url?: string; formatId?: string; qualityId?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json(ERRORS.invalidUrl(), { status: 400 });
    }

    const { url, formatId, qualityId } = body;

    // ── Validate URL ────────────────────────────────────────────────────
    const urlValidation = validateUrl(url || "");
    if (!urlValidation.valid) {
      return Response.json(
        { code: "invalid_url", message: urlValidation.error },
        { status: 400 }
      );
    }

    // ── Validate Platform ───────────────────────────────────────────────
    const platform = detectPlatform(urlValidation.normalized!);
    if (!platform) {
      return Response.json(ERRORS.unsupportedPlatform(), { status: 400 });
    }

    // ── Validate Format & Quality ───────────────────────────────────────
    if (!formatId || !validateFormat(formatId)) {
      return Response.json(
        { code: "invalid_request", message: "Invalid format selected." },
        { status: 400 }
      );
    }
    if (!qualityId || !validateQuality(qualityId)) {
      return Response.json(
        { code: "invalid_request", message: "Invalid quality selected." },
        { status: 400 }
      );
    }

    // ── Build Filename ──────────────────────────────────────────────────
    const ext = formatId === "mp3" ? "mp3" : formatId === "m4a" ? "m4a" : formatId === "webm" ? "webm" : "mp4";
    const safeFilename = sanitizeFilename(`ytvidsave_download.${ext}`);

    const contentType =
      formatId === "mp3" ? "audio/mpeg"
      : formatId === "m4a" ? "audio/mp4"
      : formatId === "webm" ? "video/webm"
      : "video/mp4";

    // ── Build yt-dlp args ──────────────────────────────────────────────
    const args = getYtDlpArgs(urlValidation.normalized!, formatId, qualityId);

    // ── Create ReadableStream that pipes yt-dlp stdout ──────────────────
    activeDownloads++;

    let processExited = false;
    let exitCode: number | null = null;
    let stderrData = "";

    const readable = new ReadableStream({
      start(controller) {
        const bin = getYtDlpBinary();
        console.log(`[download] starting: ${bin} ${args.join(" ")}`);

        const child = spawn(bin, args, {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
        });

        child.stdout?.on("data", (chunk: Buffer) => {
          try {
            controller.enqueue(new Uint8Array(chunk));
          } catch {
            // Stream already closed
          }
        });

        child.stderr?.on("data", (data: Buffer) => {
          stderrData += data.toString();
        });

        child.on("close", (code) => {
          exitCode = code;
          processExited = true;
          if (code === 0) {
            try {
              controller.close();
            } catch {
              // Already closed
            }
          } else {
            console.error(`[download] yt-dlp failed exit=${code} stderr=${stderrData.substring(0, 300)}`);
            try {
              controller.error(new Error(stderrData || `yt-dlp exited with code ${code}`));
            } catch {
              // Already closed
            }
          }
          activeDownloads = Math.max(0, activeDownloads - 1);
          const duration = Date.now() - startTime;
          console.log(`[download] process exited code=${code} duration=${duration}ms`);
        });

        child.on("error", (err) => {
          processExited = true;
          console.error(`[download] spawn error: ${err.message}`);
          try {
            controller.error(err);
          } catch {
            // Already closed
          }
          activeDownloads = Math.max(0, activeDownloads - 1);
        });

        // Handle client disconnect — kill the child process
        request.signal?.addEventListener("abort", () => {
          if (!processExited) {
            console.log(`[download] client disconnected, killing yt-dlp`);
            try {
              child.kill("SIGTERM");
            } catch {
              // ignore
            }
            activeDownloads = Math.max(0, activeDownloads - 1);
          }
        });
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    activeDownloads = Math.max(0, activeDownloads - 1);
    const duration = Date.now() - startTime;
    console.error(`[download] Unexpected error after ${duration}ms:`, err);

    const classified = classifyYtDlpError(err);
    return Response.json(
      { code: classified.category, message: classified.userMessage, suggestion: classified.suggestion },
      { status: 502 }
    );
  }
}

// GET handler — browser navigates here for direct download via <a href="/api/download?..." download>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const formatId = searchParams.get("formatId") || "mp4";
  const qualityId = searchParams.get("qualityId") || "1080p";

  // Build a synthetic POST request and delegate
  const syntheticRequest = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, formatId, qualityId }),
  });

  return POST(syntheticRequest as unknown as NextRequest);
}
