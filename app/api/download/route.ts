import { NextRequest } from "next/server";
import { config } from "@/lib/config";
import { validateUrl, validateFormat, validateQuality, ERRORS } from "@/lib/downloader/validation";
import { detectPlatform } from "@/lib/downloader/platforms";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
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

    // ── Proxy to remote backend OR use local yt-dlp ─────────────────────
    if (config.backendUrl) {
      // REMOTE BACKEND: forward the request and stream the response
      const backendRes = await fetch(`${config.backendUrl}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlValidation.normalized,
          formatId,
          qualityId,
        }),
        signal: AbortSignal.timeout(config.downloadTimeout),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => null);
        const duration = Date.now() - startTime;
        console.log(`[download:proxy] ERROR status=${backendRes.status} duration=${duration}ms`);
        return Response.json(
          errorData || { code: "download_failed", message: "Download failed." },
          { status: backendRes.status }
        );
      }

      // Stream the backend response to the client
      const duration = Date.now() - startTime;
      console.log(`[download:proxy] streaming from backend, duration=${duration}ms`);

      return new Response(backendRes.body, {
        status: 200,
        headers: {
          "Content-Type": backendRes.headers.get("Content-Type") || "video/mp4",
          "Content-Disposition": backendRes.headers.get("Content-Disposition") || 'attachment; filename="ytvidsave_download.mp4"',
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // LOCAL BACKEND: use local yt-dlp (for local development)
    const ext = formatId === "mp3" ? "mp3" : formatId === "m4a" ? "m4a" : formatId === "webm" ? "webm" : "mp4";
    const contentType =
      formatId === "mp3" ? "audio/mpeg"
      : formatId === "m4a" ? "audio/mp4"
      : formatId === "webm" ? "video/webm"
      : "video/mp4";

    const { sanitizeFilename } = await import("@/lib/downloader/validation");
    const { getYtDlpArgs } = await import("@/lib/downloader/ytDlp");
    const { spawn } = await import("child_process");

    const safeFilename = sanitizeFilename(`ytvidsave_download.${ext}`);
    const args = getYtDlpArgs(urlValidation.normalized!, formatId, qualityId);

    // Track concurrent downloads
    let activeDownloads = 0;
    if (activeDownloads >= config.maxConcurrentDownloads) {
      return Response.json(ERRORS.serverError(), { status: 503 });
    }

    activeDownloads++;

    const readable = new ReadableStream({
      start(controller) {
        const bin = config.ytDlpPath || "yt-dlp";
        console.log(`[download] starting: ${bin} ${args.join(" ")}`);

        const child = spawn(bin, args, {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
        });

        let stderrData = "";

        child.stdout?.on("data", (chunk: Buffer) => {
          try { controller.enqueue(new Uint8Array(chunk)); } catch {}
        });

        child.stderr?.on("data", (data: Buffer) => { stderrData += data.toString(); });

        child.on("close", (code) => {
          if (code === 0) {
            try { controller.close(); } catch {}
          } else {
            console.error(`[download] yt-dlp failed exit=${code} stderr=${stderrData.substring(0, 300)}`);
            try { controller.error(new Error(stderrData || `yt-dlp exited with code ${code}`)); } catch {}
          }
          activeDownloads = Math.max(0, activeDownloads - 1);
        });

        child.on("error", (err) => {
          try { controller.error(err); } catch {}
          activeDownloads = Math.max(0, activeDownloads - 1);
        });

        request.signal?.addEventListener("abort", () => {
          if (!child.killed) {
            try { child.kill("SIGTERM"); } catch {}
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
    const duration = Date.now() - startTime;
    console.error(`[download] Unexpected error after ${duration}ms:`, err);
    return Response.json(
      { code: "server_error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// GET handler — browser navigates here for direct download via <a href="/api/download?...">
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const formatId = searchParams.get("formatId") || "mp4";
  const qualityId = searchParams.get("qualityId") || "1080p";

  if (!url) {
    return Response.json({ code: "invalid_url", message: "Missing URL parameter." }, { status: 400 });
  }

  const syntheticRequest = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, formatId, qualityId }),
  });

  return POST(syntheticRequest as unknown as NextRequest);
}
