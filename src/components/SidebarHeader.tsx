"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, LogIn, LogOut } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SidebarHeaderProps {
  location: string;
  onListingsUpdate: (listings: any[]) => void;
  onLocationUpdate: (location: string) => void;
}

export default function SidebarHeader({ location, onListingsUpdate, onLocationUpdate }: SidebarHeaderProps) {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "All";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const initialSearchFired = useRef(false);
  const [activeChip, setActiveChip] = useState(initialFilter);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [maxBudget, setMaxBudget] = useState<number>(searchParams.get("maxBudget") ? parseInt(searchParams.get("maxBudget")!) : 5000000);
  const chips = ["All", "Studio", "1 Bed", "2 Bed", "3+ Bed"];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (initialSearchQuery && !initialSearchFired.current) {
      initialSearchFired.current = true;
      handleSearch(undefined, initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse.trim()) return;

    // Check auth rules: allow first search, require login for subsequent searches
    // const hasSearched = localStorage.getItem('nestai_has_searched');
    // if (hasSearched && !user) {
    //   alert("You've used your free search! Please sign in with Google to continue searching.");
    //   const { error } = await supabase.auth.signInWithOAuth({
    //     provider: 'google',
    //     options: {
    //       redirectTo: window.location.origin
    //     }
    //   });
    //   if (error) console.error("Login Error:", error.message);
    //   return;
    // }

    setIsSearching(true);
    
    // Clear previous results immediately
    onListingsUpdate([]);
    onLocationUpdate(queryToUse);
    
    let currentListings: any[] = [];
    const sources = ["Jiji", "PropertyPro", "Twitter", "Facebook", "Instagram"];
    
    const fetchSource = async (source: string) => {
      try {
        const res = await fetch('/api/search-houses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            address: queryToUse,
            lat: 6.5244, // Default to Lagos lat/lng if not available
            lng: 3.3792,
            maxBudget: maxBudget,
            filter: activeChip,
            targetSource: source
          })
        });
        const data = await res.json();
        if (data.success && data.listings && data.listings.length > 0) {
          // Progressively append
          currentListings = [...currentListings, ...data.listings];
          onListingsUpdate([...currentListings]);
        }
      } catch (err) {
        console.error(`Search error for ${source}`, err);
      }
    };

    try {
      await Promise.allSettled(sources.map(source => fetchSource(source)));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 pb-4 bg-white border-b border-zinc-200">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-black font-bold tracking-tight mb-2 font-[family-name:var(--font-open-sans)]" style={{ fontWeight: 800 }}>
            Find your <span className="text-black italic pr-1" style={{ fontWeight: 800 }}>perfect</span> home
          </h1>
          <div className="flex items-center text-zinc-500 text-xs gap-2 font-medium">
            <span>AI-powered rental search</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ff3366] fill-[#ff3366]/20" /> 
              <span className="font-semibold text-zinc-600">{location || "Not yet detected"}</span>
            </div>
          </div>
        </div>
        
        {/* Auth State UI */}
        <div className="flex flex-col items-end">
          {user ? (
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="flex items-center gap-1.5 text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-md hover:bg-red-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          ) : (
            <button 
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
              className="flex items-center gap-1.5 cursor-pointer text-[10px] bg-white text-zinc-600 border border-zinc-200 px-2 py-1 rounded-md hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              <LogIn className="w-3 h-3" /> Sign In
            </button>
          )}
        </div>
        
      </div>

      <form onSubmit={handleSearch} className="relative group/search mb-4">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-4 h-4 ml-0.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Scan for houses near you..."
          className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-11 pr-24 text-sm focus:outline-none focus:border-zinc-400 transition-all placeholder:text-zinc-400 text-zinc-900"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-black text-white font-semibold text-[13px] rounded-[8px] hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Scan"}
        </button>
      </form>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {chips.map((chip) => (
          <button 
            key={chip} 
            onClick={() => setActiveChip(chip)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
              activeChip === chip 
                ? "bg-black border-black text-white" 
                : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-4 px-1 flex flex-col w-full">
        <div className="flex justify-between w-full mb-2 text-[11px] font-semibold text-zinc-600">
          <span>Max Budget</span>
          <span>₦ {maxBudget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3 w-full">
          <input
            type="range"
            min="100000"
            max="20000000"
            step="100000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="flex-1 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-zinc-800 transition-all"
          />
          <input 
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-20 text-xs border border-zinc-200 rounded-md px-1.5 py-1 focus:outline-none focus:border-zinc-400 text-zinc-900"
            min="100000"
            max="20000000"
          />
        </div>
      </div>
    </div>
  );
}
