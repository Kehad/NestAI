"use client";

import { useState } from "react";
import MainSidebar from "@/components/MainSidebar";
import MapArea from "@/components/MapArea";

export default function App() {
  const [listings, setListings] = useState<any[]>([]);
  const [locationText, setLocationText] = useState("Lagos, Nigeria");

  return (
    <main className="flex flex-col md:flex-row h-full w-full bg-[#111111] text-white overflow-hidden relative font-sans">
      <MainSidebar listings={listings} location={locationText} onListingsUpdate={setListings} onLocationUpdate={setLocationText} />
      <MapArea onListingsUpdate={setListings} onLocationUpdate={setLocationText} listings={listings} locationText={locationText} />
    </main>
  );
}
