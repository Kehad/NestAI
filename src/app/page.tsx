"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [maxBudget, setMaxBudget] = useState<number>(5000000);
  const router = useRouter();

  const filters = ["All", "Studio", "1 Bed", "2 Bed", "3+ Bed"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Redirect to explore page with search params
    const params = new URLSearchParams({
      q: searchQuery,
      filter: activeFilter,
      maxBudget: maxBudget.toString()
    });
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden selection:bg-blue-100">
      
      {/* Subtle blue glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"
      />

      <main className="z-10 w-full max-w-2xl px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

        {/* Title */}
        <h1 className="text-xl font-medium text-zinc-800 mb-12 tracking-tight text-center font-[family-name:var(--font-open-sans)]">
          Welcome to NestAI, let's find your next home.
        </h1>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch} 
          className="w-full relative flex items-center bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
        >

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by location, landmark, or area..."
            className="flex-1 py-4 pl-6 bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-lg"
          />

          <div className="pr-2 flex items-center gap-1.5">

            <button 
              type="submit"
              disabled={!searchQuery.trim()}
              className="ml-1 px-4 py-2 bg-zinc-900 text-white rounded-xl font-medium text-sm flex items-center gap-1.5 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-zinc-900 text-white shadow-md"
                  : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-800 shadow-sm"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Budget Slider */}
        <div className="mt-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-full px-5 py-3 shadow-sm">
            <span className="text-sm font-semibold text-zinc-700 whitespace-nowrap">Max Budget:</span>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="100000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="flex-1 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-zinc-800 transition-all"
            />
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
              <span className="text-sm font-semibold text-zinc-500">₦</span>
              <input 
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-20 text-sm font-medium bg-transparent border-none focus:outline-none"
                min="100000"
                max="20000000"
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
