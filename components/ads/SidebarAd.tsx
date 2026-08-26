import AdSlot from "./AdSlot";

export default function SidebarAd({ className }: { className?: string }) {
  return (
    <AdSlot
      placement="sidebar"
      format="vertical"
      className={className}
    />
  );
}
