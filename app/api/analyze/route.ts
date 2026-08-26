import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { validateUrl, ERRORS } from "@/lib/downloader/validation";
import { detectPlatform } from "@/lib/downloader/platforms";
import { getVideoInfo, classifyYtDlpError } from "@/lib/downloader/ytDlp";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Rate Limit ──────────────────────────────────────────────────────
    const ip = getClientIp(request);
    const rl = checkRateLimit(`analyze:${ip}`, config.rateLimitAnalyze);
    if (!rl.allowed) {
      const err = ERRORS.rateLimited(rl.retryAfterMs);
      return NextResponse.json(err, {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      });
    }

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

    // ── Validate URL ────────────────────────────────────────────────────
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { code: "invalid_url", message: validation.error },
        { status: 400 }
      );
    }

    // ── Detect Platform ─────────────────────────────────────────────────
    const platform = detectPlatform(validation.normalized!);
    if (!platform) {
      return NextResponse.json(ERRORS.unsupportedPlatform(), { status: 400 });
    }

    // ── Fetch Media Info via yt-dlp ─────────────────────────────────────
    let mediaInfo;
    try {
      mediaInfo = await getVideoInfo(validation.normalized!);
    } catch (err: unknown) {
      // DEV-ONLY: Full error details in terminal for diagnosis
      const elapsed = Date.now() - startTime;
      if (process.env.NODE_ENV !== "production") {
        console.error(`[analyze] FAILED for ${platform.id} after ${elapsed}ms:`);
        if (err instanceof Error) console.error(`  message: ${err.message}`);
      }

      // Timeout
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("timed out") || msg.includes("timeout")) {
        return NextResponse.json(ERRORS.processingTimeout(), { status: 504 });
      }

      // Classify the yt-dlp error into a user-friendly message
      const classified = classifyYtDlpError(err);
      return NextResponse.json(
        { code: classified.category === "auth_required" ? "content_unavailable" : "content_unavailable",
          message: classified.userMessage,
          suggestion: classified.suggestion },
        { status: classified.category === "auth_required" ? 403 : 404 }
      );
    }

    // ── Build Response ──────────────────────────────────────────────────
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
