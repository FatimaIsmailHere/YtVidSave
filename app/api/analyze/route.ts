import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { validateUrl, ERRORS } from "@/lib/downloader/validation";
import { detectPlatform } from "@/lib/downloader/platforms";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Parse Body ──────────────────────────────────────────────────────
    let body: { url?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(ERRORS.invalidUrl(), { status: 400 });
    }

    const { url } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json(ERRORS.invalidUrl(), { status: 400 });
    }

    // ── Validate URL locally ────────────────────────────────────────────
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { code: "invalid_url", message: validation.error },
        { status: 400 }
      );
    }

    const platform = detectPlatform(validation.normalized!);
    if (!platform) {
      return NextResponse.json(ERRORS.unsupportedPlatform(), { status: 400 });
    }

    // ── Proxy to remote backend OR use local yt-dlp ─────────────────────
    if (config.backendUrl) {
      // REMOTE BACKEND: forward the request
      const backendRes = await fetch(`${config.backendUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validation.normalized }),
        signal: AbortSignal.timeout(config.analyzeTimeout),
      });

      const data = await backendRes.json();
      const duration = Date.now() - startTime;
      console.log(`[analyze:proxy] status=${backendRes.status} duration=${duration}ms`);

      return NextResponse.json(data, { status: backendRes.status });
    }

    // LOCAL BACKEND: use local yt-dlp (for local development)
    const { getVideoInfo, classifyYtDlpError } = await import("@/lib/downloader/ytDlp");

    let mediaInfo;
    try {
      mediaInfo = await getVideoInfo(validation.normalized!);
    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      if (process.env.NODE_ENV !== "production") {
        console.error(`[analyze] FAILED for ${platform.id} after ${elapsed}ms:`, err);
      }

      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("timed out") || msg.includes("timeout")) {
        return NextResponse.json(ERRORS.processingTimeout(), { status: 504 });
      }

      const classified = classifyYtDlpError(err);
      return NextResponse.json(
        { code: classified.category === "auth_required" ? "content_unavailable" : "content_unavailable",
          message: classified.userMessage,
          suggestion: classified.suggestion },
        { status: classified.category === "auth_required" ? 403 : 404 }
      );
    }

    const result = {
      id: Math.random().toString(36).substring(2, 10),
      title: mediaInfo.title,
      thumbnail: mediaInfo.thumbnail,
      source: mediaInfo.uploader || platform.name,
      sourcePlatform: platform.name,
      platform: platform.id,
      duration: mediaInfo.duration,
      durationSeconds: mediaInfo.durationSeconds,
      type: "video" as const,
      originalUrl: validation.normalized!,
      formats: mediaInfo.formats,
      qualities: mediaInfo.qualities,
    };

    const duration = Date.now() - startTime;
    console.log(`[analyze] OK platform=${platform.id} duration=${duration}ms`);

    return NextResponse.json(result);
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[analyze] Unexpected error after ${duration}ms:`, err);
    return NextResponse.json(ERRORS.serverError(), { status: 500 });
  }
}
