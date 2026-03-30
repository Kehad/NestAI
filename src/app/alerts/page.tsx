import { Bell } from 'lucide-react';

export default function AlertsPage() {
  return (
    <main className="flex-1 flex items-center justify-center h-full w-full bg-[#111111] text-white font-sans overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 shadow-lg border border-white/5">
          <Bell className="w-8 h-8 text-[#C1F32A]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-playfair)]" style={{ fontWeight: 800 }}>Notification Alerts</h1>
        <p className="text-zinc-400 max-w-md">Set up exact criteria for the homes you want, and NestAI will immediately alert you when they become available on the market.</p>
        <button className="mt-8 px-6 py-2.5 bg-[#C1F32A] text-black font-semibold text-[13px] rounded-xl hover:bg-[#b0df22] transition-colors shadow-lg shadow-[#C1F32A]/20">
          Create New Alert
        </button>
      </div>
    </main>
  );
}
