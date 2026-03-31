"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarHeaderProps {
  location: string;
  onListingsUpdate: (listings: any[]) => void;
  onLocationUpdate: (location: string) => void;
}

export default function SidebarHeader({ location, onListingsUpdate, onLocationUpdate }: SidebarHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check auth rules: allow first search, require login for subsequent searches
    const hasSearched = localStorage.getItem('nestai_has_searched');
    if (hasSearched && !user) {
      alert("You've used your free search! Please sign in with Google to continue searching.");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) console.error("Login Error:", error.message);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch('/api/search-houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: searchQuery,
          lat: 6.5244, // Default to Lagos lat/lng if not available, can be improved to use current map center
          lng: 3.3792 
        })
      });
      const data = await res.json();
      console.log(data.listings)
      if (data.success) {
        onListingsUpdate(data.listings);
        onLocationUpdate(searchQuery);
        // Mark that the user has completed their first search
        if (!hasSearched) {
          localStorage.setItem('nestai_has_searched', 'true');
        }
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 pb-4 bg-[#0c0c0c]">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-[family-name:var(--font-playfair)]" style={{ fontWeight: 800 }}>
            Find your <span className="text-[#C1F32A] italic pr-1" style={{ fontWeight: 800 }}>perfect</span> home
          </h1>
          <div className="flex items-center text-zinc-500 text-xs gap-2 font-medium">
            <span>AI-powered rental search</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ff3366] fill-[#ff3366]/20" /> 
              <span className="font-semibold text-zinc-300">{location || "Not yet detected"}</span>
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
              className="flex items-center gap-1.5 cursor-pointer text-[10px] bg-white/5 text-zinc-400 border border-white/10 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors"
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
          className="w-full bg-[#131313] border border-[#2a2a2a] rounded-xl py-3 pl-11 pr-24 text-sm focus:outline-none focus:border-[#C1F32A]/50 transition-all placeholder:text-zinc-600/80 text-white"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#C1F32A] text-black font-semibold text-[13px] rounded-[8px] hover:bg-[#b0df22] transition-colors disabled:opacity-50"
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
                ? "bg-[#C1F32A] border-[#C1F32A] text-black" 
                : "bg-transparent border-[#2a2a2a] text-zinc-400 hover:text-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
