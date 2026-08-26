# YtVidSave

A fast, free YouTube video downloader built with Next.js, TypeScript, and yt-dlp. Download YouTube videos and Shorts in multiple formats and qualities.

## Features

- **YouTube Video Download** — Paste any YouTube URL and download in MP4, WebM, MP3, or M4A
- **YouTube Shorts Support** — Works with youtube.com/shorts/ URLs
- **Multiple Qualities** — From 360p up to 4K depending on source
- **Dark/Light Mode** — Theme persists via localStorage
- **Responsive Design** — Works on mobile, tablet, and desktop
- **SEO Optimized** — Metadata, structured data, sitemap, robots.txt
- **Ad-Ready Architecture** — Placeholder slots ready for Google AdSense integration
- **Claymorphism UI** — Modern, tactile design with depth and layered shadows
- **Security First** — URL validation, rate limiting, safe process spawning

## Tech Stack

- **Frontend:** React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, yt-dlp (Python)
- **Runtime:** Node.js 18+

## Prerequisites

### yt-dlp

This application requires [yt-dlp](https://github.com/yt-dlp/yt-dlp) to be installed on the server.

```bash
# Install via pip
pip install yt-dlp

# Or on Windows
python -m pip install yt-dlp

# Verify installation
yt-dlp --version
```

### Node.js

```bash
# Requires Node.js 18+
node --version
```

## Local Development

```bash
# Clone the repository
git clone https://github.com/FatimaIsmailHere/YtVidSave.git
cd YtVidSave

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `YT_DLP_PATH` | (empty) | Path to yt-dlp binary. Leave empty for system PATH. |
| `ANALYZE_TIMEOUT` | `20000` | Timeout for URL analysis (ms) |
| `DOWNLOAD_TIMEOUT` | `300000` | Timeout for file download (ms) |
| `RATE_LIMIT_ANALYZE` | `10` | Max analyze requests per minute per IP |
| `RATE_LIMIT_DOWNLOAD` | `3` | Max download requests per minute per IP |
| `MAX_CONCURRENT_DOWNLOADS` | `2` | Max simultaneous downloads |
| `MAX_FILE_SIZE_MB` | `500` | Maximum download file size in MB |
| `NEXT_PUBLIC_SITE_URL` | `https://ytvidsave.com` | Site URL for SEO metadata |

## API Endpoints

### POST /api/analyze

Analyzes a YouTube URL and returns video metadata.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "id": "...",
  "title": "Video Title",
  "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg",
  "source": "Channel Name",
  "sourcePlatform": "YouTube",
  "platform": "youtube",
  "duration": "3:33",
  "durationSeconds": 213,
  "originalUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "formats": [
    { "id": "mp4", "label": "MP4", "container": "mp4", "mimeType": "video/mp4", "type": "video" },
    { "id": "webm", "label": "WebM", "container": "webm", "mimeType": "video/webm", "type": "video" },
    { "id": "mp3", "label": "MP3", "container": "mp3", "mimeType": "audio/mpeg", "type": "audio" },
    { "id": "m4a", "label": "M4A", "container": "m4a", "mimeType": "audio/mp4", "type": "audio" }
  ],
  "qualities": [
    { "id": "2160p", "label": "2160p", "width": 3840, "height": 2160 },
    { "id": "1080p", "label": "1080p", "width": 1920, "height": 1080 },
    ...
  ]
}
```

### GET /api/download

Downloads the video and streams it to the browser.

**Parameters:**
- `url` — YouTube video URL
- `formatId` — `mp4`, `webm`, `mp3`, or `m4a`
- `qualityId` — e.g. `1080p`, `720p`, `360p`

**Response:** Binary file stream with `Content-Disposition: attachment`

## Supported Platforms

| Platform | Status |
|----------|--------|
| YouTube (watch URLs) | ✅ Fully supported |
| YouTube Shorts | ✅ Fully supported |
| YouTube (embed URLs) | ✅ Fully supported |
| youtu.be short links | ✅ Fully supported |

## Project Structure

```
app/
  layout.tsx              — Root layout with metadata, JSON-LD
  page.tsx                — Homepage with sidebar ads
  globals.css             — Tailwind + claymorphism styles
  robots.ts               — robots.txt
  sitemap.ts              — sitemap.xml
  api/
    analyze/route.ts      — URL analysis endpoint
    download/route.ts     — File download endpoint
  privacy/page.tsx        — Privacy Policy
  terms/page.tsx          — Terms of Service
  dmca/page.tsx           — DMCA Notice
  contact/page.tsx        — Contact page

components/
  ads/
    AdSlot.tsx            — Reusable ad placeholder (AdSense-ready)
    TopAd.tsx             — Top banner ad
    SidebarAd.tsx         — Sidebar ad
    MobileAd.tsx          — Mobile ad
    InterstitialAd.tsx    — Pre-download interstitial ad
  downloader/
    Downloader.tsx        — Main download controller
    UrlInput.tsx          — URL input field
    DownloadResult.tsx    — Video result card
    FormatSelector.tsx    — Format/quality dropdowns
    LoadingState.tsx      — Loading skeleton
    ErrorState.tsx        — Error display
  layout/
    Header.tsx            — Navigation header
    Footer.tsx            — Site footer
    ThemeToggle.tsx       — Dark/light mode toggle
  sections/
    Hero.tsx              — Hero section
    Features.tsx          — Feature cards
    HowItWorks.tsx        — 3-step guide
    SupportedSources.tsx  — Platform info
    FAQ.tsx               — Accordion FAQ
    SeoContent.tsx        — SEO content section

lib/
  config.ts               — Centralized configuration
  utils.ts                — Utility functions
  rateLimit.ts            — In-memory rate limiter
  validation.ts           — URL validation (re-exports)
  downloader/
    platforms.ts           — Platform detection & config
    validation.ts          — URL validation, sanitization, errors
    ytDlp.ts               — yt-dlp service layer (safe spawn)

types/
  downloader.ts           — TypeScript interfaces
```

## Security

- **No shell injection:** All yt-dlp commands use `spawn()` with argument arrays, never shell string concatenation
- **URL allowlist:** Only YouTube URLs are accepted
- **Rate limiting:** Per-IP sliding window (10 analyze/min, 3 download/min)
- **Concurrency control:** Max 2 simultaneous downloads
- **Timeouts:** 20s for analysis, 5min for downloads
- **Filename sanitization:** Special characters stripped, length limited
- **Error sanitization:** No server paths or stack traces exposed to users
- **Process cleanup:** yt-dlp processes are killed on timeout or client disconnect

## Advertisement Architecture

The app includes a modular ad-slot system ready for Google AdSense integration:

- **AdSlot.tsx** — Generic placeholder component with 7 placement types
- **InterstitialAd.tsx** — Pre-download interstitial with countdown
- Sidebar vertical ads (300×250, 300×600)
- Top/bottom horizontal banners (728×90, 970×90)
- Mobile banners (320×100, 320×250)

### To connect AdSense

1. Add AdSense script to `app/layout.tsx`
2. Replace placeholder `<div>` in `AdSlot.tsx` with `<ins class="adsbygoogle">` elements
3. Use the `placement` prop as the `data-ad-slot` value

## Backend Requirements

- **yt-dlp** must be installed in the runtime environment
- The server streams files through Node.js (bandwidth-dependent)
- In-memory rate limiting — for multi-instance deployments, consider Redis
- No database required

## License

All rights reserved.
