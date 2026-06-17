import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col-reverse md:flex-row h-full w-full bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      <SidebarNav />
      <div className="flex-1 overflow-hidden relative w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
