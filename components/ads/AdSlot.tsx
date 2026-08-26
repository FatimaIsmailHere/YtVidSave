"use client";

import { cn } from "@/lib/utils";
import type { AdPlacement, AdFormat } from "@/types/downloader";

interface AdSlotProps {
  placement: AdPlacement;
  format?: AdFormat;
  className?: string;
  responsive?: boolean;
}

const AD_SIZES: Record<
  AdPlacement,
  { width: number; height: number; label: string }
> = {
  "top-banner": { width: 728, height: 90, label: "728 × 90" },
  "between-hero": { width: 728, height: 90, label: "728 × 90" },
  content: { width: 728, height: 90, label: "728 × 90" },
  sidebar: { width: 300, height: 250, label: "300 × 250" },
  "between-sections": { width: 970, height: 90, label: "970 × 90" },
  "bottom-banner": { width: 728, height: 90, label: "728 × 90" },
  "mobile-banner": { width: 320, height: 100, label: "320 × 100" },
};

const MOBILE_AD_SIZES: Record<string, { width: number; height: number; label: string }> = {
  sidebar: { width: 300, height: 250, label: "300 × 250" },
  "top-banner": { width: 320, height: 100, label: "320 × 100" },
  "between-hero": { width: 320, height: 100, label: "320 × 100" },
  content: { width: 320, height: 250, label: "320 × 250" },
  "between-sections": { width: 320, height: 100, label: "320 × 100" },
  "bottom-banner": { width: 320, height: 100, label: "320 × 100" },
  "mobile-banner": { width: 320, height: 100, label: "320 × 100" },
};

export default function AdSlot({
  placement,
  format = "responsive",
  className,
}: AdSlotProps) {
  const adSize = AD_SIZES[placement] || AD_SIZES.content;

  // ─── Integration Point ──────────────────────────────────────────────────
  // To connect Google AdSense:
  // 1. Replace this component's render with an AdSense unit
  // 2. Use the placement as the ad unit's data-ad-slot value
  // 3. Ensure AdSense script is loaded in layout.tsx
  //
  // Example AdSense integration:
  // <ins class="adsbygoogle"
  //   style={{ display: 'block' }}
  //   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //   data-ad-slot="XXXXXXXXXX"
  //   data-ad-format={format === 'responsive' ? 'auto' : undefined}
  //   data-full-width-responsive={responsive ? 'true' : undefined}
  // />
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex items-center justify-center my-6 sm:my-8",
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Desktop ad */}
      <div className="hidden md:flex flex-col items-center">
        <div
          className="flex items-center justify-center border border-dashed border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-800/30 overflow-hidden"
          style={{
            width: format === "responsive" ? "100%" : adSize.width,
            maxWidth: adSize.width,
            height: adSize.height,
          }}
        >
          <div className="flex flex-col items-center gap-1 text-surface-400 dark:text-surface-500 select-none pointer-events-none">
            <svg
              className="w-5 h-5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            <span className="text-xs font-medium tracking-wider uppercase">
              Advertisement
            </span>
            <span className="text-[10px] text-surface-300 dark:text-surface-600">
              {adSize.label}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile ad */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div
          className="flex items-center justify-center border border-dashed border-surface-300 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-800/30 overflow-hidden w-full"
          style={{
            maxWidth: MOBILE_AD_SIZES[placement]?.width || 320,
            height: MOBILE_AD_SIZES[placement]?.height || 100,
          }}
        >
          <div className="flex flex-col items-center gap-1 text-surface-400 dark:text-surface-500 select-none pointer-events-none">
            <span className="text-xs font-medium tracking-wider uppercase">
              Advertisement
            </span>
            <span className="text-[10px] text-surface-300 dark:text-surface-600">
              {MOBILE_AD_SIZES[placement]?.label || "320 × 100"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
