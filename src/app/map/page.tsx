"use client";

import { useEffect } from 'react';
import MapArea from "@/components/MapArea";

export default function MapPage() {
  useEffect(() => {
    async function syncLocation() {
      try {
        // Step 1: Resolve current coordinates from IP
        const locRes = await fetch('/api/location');
        const locData = await locRes.json();
        
        if (locData.success && locData.lat && locData.lon) {
          // Step 2: Submit these to the reverse-geocoding/submit-location API
          await fetch('/api/submit-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: locData.lat, lon: locData.lon })
          });
          console.log("Map Page: Location synced successfully");
        }
      } catch (err) {
        console.error("Map Page: Sync failed", err);
      }
    }
    
    syncLocation();
  }, []);

  return (
    <main className="flex h-full w-full bg-[#111111] text-white font-sans overflow-hidden relative">
      <MapArea />
    </main>
  );
}
