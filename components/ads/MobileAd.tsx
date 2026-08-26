import AdSlot from "./AdSlot";

export default function MobileAd({ className }: { className?: string }) {
  return (
    <AdSlot
      placement="mobile-banner"
      format="horizontal"
      className={className}
    />
  );
}
