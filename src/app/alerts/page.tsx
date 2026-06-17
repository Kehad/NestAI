import { Bell } from 'lucide-react';

export default function AlertsPage() {
  return (
    <main className="flex-1 flex items-center justify-center h-full w-full bg-white text-zinc-900 font-sans overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-200">
          <Bell className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-open-sans)]" style={{ fontWeight: 800 }}>Notification Alerts</h1>
        <p className="text-zinc-500 max-w-md">Set up exact criteria for the homes you want, and NestAI will immediately alert you when they become available on the market.</p>
        <button className="mt-8 px-6 py-2.5 bg-black text-white font-semibold text-[13px] rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
          Create New Alert
        </button>
      </div>
    </main>
  );
}
