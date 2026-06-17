"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useSavedProperties } from '@/context/SavedPropertiesContext';
import SidebarPropertyCard from '@/components/SidebarPropertyCard';

export default function SavedPage() {
  const { savedProperties } = useSavedProperties();
  const [reviewProperty, setReviewProperty] = useState<string | null>(null);

  const handleToggleReview = (id: string) => {
    setReviewProperty(prev => prev === id ? null : id);
  };

  if (savedProperties.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center h-full w-full bg-white text-zinc-900 font-sans overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-200">
            <Heart className="w-8 h-8 text-[#ff3366] fill-[#ff3366]/20" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-open-sans)]" style={{ fontWeight: 800 }}>Your Saved Properties</h1>
          <p className="text-zinc-500 max-w-md">Properties you heart will show up here. You haven't saved any apartments yet.</p>
          <Link href="/">
            <button className="mt-8 px-6 py-2.5 bg-black text-white font-semibold text-[13px] rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
              Explore listings
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full w-full bg-white text-zinc-900 font-sans overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center shadow-sm border border-zinc-200">
            <Heart className="w-5 h-5 text-[#ff3366] fill-[#ff3366]/20" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-open-sans)]" style={{ fontWeight: 800 }}>
            Your Saved Properties ({savedProperties.length})
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProperties.map(property => (
            <SidebarPropertyCard 
              key={property.id} 
              item={property}
              isReviewOpen={reviewProperty === property.id}
              onToggleReview={() => handleToggleReview(property.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
