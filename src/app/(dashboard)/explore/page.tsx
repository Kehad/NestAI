"use client";

import { useState, Suspense } from "react";
import MainSidebar from "@/components/MainSidebar";
import MapArea from "@/components/MapArea";

export default function App() {
  const [listings, setListings] = useState<any[]>([]);
  const [locationText, setLocationText] = useState("Lagos, Nigeria");

  return (
    <main className="flex flex-col md:flex-row h-full w-full bg-white text-zinc-900 overflow-hidden relative font-sans">
      <Suspense fallback={<div className="w-80 border-r border-zinc-200">Loading...</div>}>
        <MainSidebar listings={listings} location={locationText} onListingsUpdate={setListings} onLocationUpdate={setLocationText} />
      </Suspense>
      <MapArea onListingsUpdate={setListings} onLocationUpdate={setLocationText} listings={listings} locationText={locationText} />
    </main>
  );
}
