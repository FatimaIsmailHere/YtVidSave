import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import SupportedSources from "@/components/sections/SupportedSources";
import FAQ from "@/components/sections/FAQ";
import SeoContent from "@/components/sections/SeoContent";
import AdSlot from "@/components/ads/AdSlot";
import Downloader from "@/components/downloader/Downloader";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Main content area with sidebar ads on desktop */}
      <div className="container-ytvidsave">
        <div className="flex gap-8 items-start">
          {/* Left sidebar ad - hidden on mobile */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24">
            <AdSlot placement="sidebar" format="vertical" />
            <div className="mt-6">
              <AdSlot placement="sidebar" format="square" />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Downloader />
          </div>

          {/* Right sidebar ad - hidden on mobile */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24">
            <AdSlot placement="sidebar" format="square" />
            <div className="mt-6">
              <AdSlot placement="sidebar" format="vertical" />
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-8">
        <AdSlot placement="content" className="container-ytvidsave" />
      </div>

      <Features />

      <AdSlot placement="between-sections" className="container-ytvidsave" />

      <HowItWorks />

      <SupportedSources />

      <AdSlot placement="between-sections" className="container-ytvidsave" />

      <FAQ />

      <SeoContent />

      {/* Bottom banner ad */}
      <div className="container-ytvidsave my-8">
        <AdSlot placement="bottom-banner" />
      </div>
    </>
  );
}
