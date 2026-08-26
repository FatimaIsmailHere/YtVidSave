import AdSlot from "./AdSlot";

export default function TopAd({ className }: { className?: string }) {
  return (
    <AdSlot
      placement="top-banner"
      format="horizontal"
      className={className}
    />
  );
}
