"use client";

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, ChevronDown, Plus, Minus, Home, Loader2 } from 'lucide-react';

// Dynamically import Leaflet with no SSR to prevent "window is not defined" errors
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-zinc-100 animate-pulse" />
});

interface MapAreaProps {
  onListingsUpdate: (listings: any[]) => void;
  onLocationUpdate: (location: string) => void;
  listings: any[];
  locationText: string;
}

export default function MapArea({ onListingsUpdate, onLocationUpdate, listings, locationText }: MapAreaProps) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coords, setCoords] = useState<[number, number]>([6.5244, 3.3792]); // Default Lagos
  const [pos, setPos] = useState<any>({ lat: 6.5244, lng: 3.3792 });

  const fetchUserLocation = async () => {
    setLoadingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            console.log("Current position:", newPos);
            setCoords([newPos.lat, newPos.lng]);
            setPos(newPos);

            // Submit location and get address from Geoapify
            try {
              const res = await fetch('/api/submit-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPos)
              });
              
              const data = await res.json();
              console.log("Submission response:", data);
              
              if (data.success) {
                if (data.result.formatted_address) {
                  onLocationUpdate(data.result.formatted_address);
                }
                if (data.result.listings) {
                  onListingsUpdate(data.result.listings);
                }
              }
            } catch (syncErr) {
              console.warn("Failed to sync location to backend", syncErr);
            } finally {
               setLoadingLocation(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoadingLocation(false);
          }
        );
      } else {
        console.error("Geolocation not supported");
        setLoadingLocation(false);
      }
    } catch (err) {
      console.error("API error", err);
      setLoadingLocation(false);
    }
  };

  return (
    <main className="flex-1 relative bg-zinc-50 overflow-hidden flex flex-col justify-end h-full w-full">
      {/* Map Background - Replaced with Live Leaflet Map */}
      <div className="absolute inset-0 bg-zinc-100 z-0">
        <LeafletMap center={coords} zoom={13} markers={listings} />
        {/* Subtle grid pattern overlay for map illusion */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>
      </div>

      {/* Map top pill (Showing search area) */}
      <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2 px-3 lg:px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200 flex items-center gap-2 md:gap-2.5 shadow-sm z-20 w-max max-w-[90%] pointer-events-none">
        <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <span className="text-[10px] md:text-xs font-medium text-zinc-800 truncate">{locationText} <span className="text-zinc-400 mx-1 hidden sm:inline">—</span> <span className="text-zinc-500 opacity-80 hidden sm:inline">showing search area</span></span>
      </div>

      {/* Zoom controls: Hidden on lowest viewport range */}
      <div className="absolute top-6 right-6 hidden md:flex flex-col z-20 shadow-sm bg-white/80 backdrop-blur-md rounded-[10px] border border-zinc-200 overflow-hidden">
        <button className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-zinc-200"></div>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* My location button */}
      <div className="absolute bottom-[80px] md:bottom-[88px] right-4 md:right-6 z-20 flex flex-col items-end gap-1.5 md:gap-2">
        <button 
          onClick={fetchUserLocation}
          disabled={loadingLocation}
          className="flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 bg-black text-white rounded-[10px] font-bold text-[10px] md:text-[11px] shadow-md hover:scale-105 hover:bg-zinc-800 transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {loadingLocation ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          {loadingLocation ? 'Locating...' : 'My Location'}
        </button>
        <div className="text-[8px] md:text-[9px] text-zinc-700 opacity-60 font-medium whitespace-nowrap">
          © OpenStreetMap
        </div>
      </div>

      {/* Bottom Sticky Card for map area */}
      <div className="absolute bottom-0 w-full bg-white border-t border-zinc-200 shadow-lg z-20 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 md:gap-4 truncate">
          <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-lg bg-black/5 border border-black/10 flex items-center justify-center">
             <Home className="w-[14px] h-[14px] md:w-4 md:h-4 text-black" />
          </div>
          <div className="flex flex-col gap-0.5 truncate">
            <div className="text-[11px] md:text-[13px] font-bold text-zinc-900 tracking-wide truncate">Select a listing to view details</div>
            <div className="text-[9px] md:text-[11px] text-zinc-500 font-medium truncate">Click any card or map pin</div>
          </div>
        </div>
        <button className="w-6 h-6 md:w-8 md:h-8 flex shrink-0 items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
