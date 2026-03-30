import { Heart } from 'lucide-react';

export default function SavedPage() {
  return (
    <main className="flex-1 flex items-center justify-center h-full w-full bg-[#111111] text-white font-sans overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 shadow-lg border border-white/5">
          <Heart className="w-8 h-8 text-[#ff3366] fill-[#ff3366]/20" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-playfair)]" style={{ fontWeight: 800 }}>Your Saved Properties</h1>
        <p className="text-zinc-400 max-w-md">Properties you heart will show up here. You haven't saved any apartments yet.</p>
        <button className="mt-8 px-6 py-2.5 bg-[#C1F32A] text-black font-semibold text-[13px] rounded-xl hover:bg-[#b0df22] transition-colors shadow-lg shadow-[#C1F32A]/20">
          Explore listings
        </button>
      </div>
    </main>
  );
}
