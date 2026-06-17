"use client";

import { useState } from 'react';
import { Home } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarPropertyCard from './SidebarPropertyCard';
import SidebarAiChat from './SidebarAiChat';

interface MainSidebarProps {
  listings: any[];
  location: string;
  onListingsUpdate: (listings: any[]) => void;
  onLocationUpdate: (location: string) => void;
}

export default function MainSidebar({ listings, location, onListingsUpdate, onLocationUpdate }: MainSidebarProps) {
  const [reviewProperty, setReviewProperty] = useState<string | null>(null);

  const handleToggleReview = (id: string) => {
    setReviewProperty(prev => prev === id ? null : id);
  };

  return (
    <aside className="w-full md:w-[430px] md:min-w-[400px] bg-white border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col h-[70dvh] md:h-full z-10 shadow-2xl relative shrink-0 overflow-hidden">
       {/* Top Header Section */}
       <SidebarHeader 
         location={location} 
         onListingsUpdate={onListingsUpdate} 
         onLocationUpdate={onLocationUpdate} 
       />

       <div className="h-px bg-zinc-200 w-full"></div>

       {/* Middle Content Section (Scrollable) */}
       <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="px-6 py-4 flex justify-between items-center bg-white/80 sticky top-0 z-10 border-b border-zinc-200/80 backdrop-blur-md">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">{listings.length} Properties Found</span>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {listings.length > 0 ? (
              listings.map((item) => (
                <SidebarPropertyCard 
                  key={item.id} 
                  item={item} 
                  isReviewOpen={reviewProperty === item.id} 
                  onToggleReview={() => handleToggleReview(item.id)} 
                />
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-24 opacity-50">
                <Home className="w-12 h-12 text-zinc-400 mb-4 stroke-[1]" />
                <p className="text-[12px] text-zinc-500 max-w-[200px]">Click the "My Location" button to scan for nearby properties</p>
              </div>
            )}
          </div>
       </div>

       {/* Bottom AI Chat Section (Sticky) */}
       <SidebarAiChat listings={listings} />
    </aside>
  );
}
