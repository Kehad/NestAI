"use client";

import { useState } from 'react';
import { Search, MapPin, ChevronDown, Home, Star } from 'lucide-react';

interface MainSidebarProps {
  listings: any[];
  location: string;
  onListingsUpdate: (listings: any[]) => void;
  onLocationUpdate: (location: string) => void;
}

export default function MainSidebar({ listings, location, onListingsUpdate, onLocationUpdate }: MainSidebarProps) {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const chips = ["All", "Studio", "1 Bed", "2 Bed", "3+ Bed"];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

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
      if (data.success) {
        onListingsUpdate(data.listings);
        onLocationUpdate(searchQuery);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  // --- Review State ---
  const [reviewProperty, setReviewProperty] = useState<string | null>(null);
  const [reviews, setLocalReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // --- AI Agent State ---
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "assistant", content: "Hi! I'm NestAI House Agent. Ask me anything about these properties!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // --- Review Logic ---
  const fetchReviews = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
      const data = await res.json();
      if (data.success) {
        setLocalReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const handleReviewClick = (propertyId: string) => {
    setReviewProperty(propertyId);
    fetchReviews(propertyId);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProperty) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          propertyId: reviewProperty, 
          rating, 
          comment, 
          userName: "Guest User" 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setLocalReviews([data.review, ...reviews]);
        setComment("");
        alert("Review submitted!");
      }
    } catch (err) {
      console.error("Error submitting review", err);
    }
  };

  // --- AI Agent Logic ---
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, listings })
      });
      const data = await res.json();
      setChatMessages([...newMessages, data]);
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <aside className="w-full md:w-[400px] md:min-w-[400px] bg-[#0c0c0c] border-b md:border-b-0 md:border-r border-[#1f1f1f] flex flex-col h-[70dvh] md:h-full z-10 shadow-2xl relative shrink-0 overflow-hidden">
       {/* Top Header Section */}
       <div className="p-6 pb-4 bg-[#0c0c0c]">
         <div className="mb-6">
           <h1 className="text-3xl font-bold tracking-tight mb-2 font-[family-name:var(--font-playfair)]" style={{ fontWeight: 800 }}>
             Find your <span className="text-[#C1F32A] italic pr-1" style={{ fontWeight: 800 }}>perfect</span> home
           </h1>
           <div className="flex items-center text-zinc-500 text-xs gap-2 font-medium">
             <span>AI-powered rental search</span>
             <div className="flex items-center gap-1">
               <MapPin className="w-3 h-3 text-[#ff3366] fill-[#ff3366]/20" /> 
               <span className="font-semibold text-zinc-300">{location || "Lagos, NG"}</span>
             </div>
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

       <div className="h-px bg-[#1f1f1f] w-full"></div>

       {/* Middle Content Section (Scrollable) */}
       <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="px-6 py-4 flex justify-between items-center bg-[#0a0a0a]/50 sticky top-0 z-10 border-b border-[#1f1f1f]/50 backdrop-blur-md">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">{listings.length} Properties Found</span>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {listings.length > 0 ? (
              listings.map((item) => (
                <div key={item.id} className="bg-[#161616] border border-[#262626] rounded-2xl p-4 hover:border-[#C1F32A]/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[14px] font-bold text-white group-hover:text-[#C1F32A] transition-colors">{item.title}</div>
                    <div className="text-[12px] font-bold text-[#C1F32A]">{item.price}</div>
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C1F32A]" /> {item.location}
                  </div>
                  <div className="text-[12px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </div>
                  
                  {reviewProperty === item.id ? (
                    <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                       <div className="text-[11px] font-bold text-zinc-400 mb-2">Community Reviews ({reviews.length})</div>
                       <div className="max-h-32 overflow-y-auto mb-4 custom-scrollbar pr-2 flex flex-col gap-2">
                         {reviews.length > 0 ? reviews.map((r, idx) => (
                           <div key={idx} className="p-2 bg-white/5 rounded-lg border border-white/5">
                             <div className="flex justify-between text-[10px] mb-1">
                               <span className="font-bold text-[#C1F32A]">{r.user_name}</span>
                               <span className="text-zinc-500 flex items-center gap-0.5">
                                 {r.rating} <Star className="w-2.5 h-2.5 fill-zinc-500 stroke-none" />
                               </span>
                             </div>
                             <div className="text-[10px] text-zinc-400">{r.comment}</div>
                           </div>
                         )) : <div className="text-[10px] text-zinc-600">No reviews yet. Be the first!</div>}
                       </div>

                       <form onSubmit={submitReview} className="space-y-2">
                         <textarea 
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           placeholder="Share your thoughts..."
                           className="w-full bg-black/40 border border-[#2a2a2a] rounded-lg p-2 text-[11px] text-white focus:outline-none focus:border-[#C1F32A]/50"
                           rows={2}
                         />
                         <div className="flex justify-between items-center">
                           <select 
                             value={rating} 
                             onChange={(e) => setRating(Number(e.target.value))}
                             className="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-1 text-[10px] text-zinc-400 cursor-pointer"
                           >
                             {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                           </select>
                           <div className="flex gap-2">
                             <button type="button" onClick={() => setReviewProperty(null)} className="text-[10px] text-zinc-500 hover:text-white transition-colors">Cancel</button>
                             <button type="submit" className="bg-[#C1F32A] text-black text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:bg-[#b0df22] transition-colors">Post</button>
                           </div>
                         </div>
                       </form>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReviewClick(item.id)}
                        className="flex-1 bg-white/5 border border-white/10 text-white text-center py-2.5 rounded-xl text-[11px] font-semibold hover:bg-white/10 transition-colors"
                      >
                        Reviews
                      </button>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 bg-[#C1F32A]/10 border border-[#C1F32A]/20 text-[#C1F32A] py-2.5 rounded-xl text-center text-[11px] font-semibold hover:bg-[#C1F32A]/20 transition-colors"
                        >
                          Details
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-24 opacity-30">
                <Home className="w-12 h-12 text-white mb-4 stroke-[1]" />
                <p className="text-[12px] text-white max-w-[200px]">Click the "My Location" button to scan for nearby properties</p>
              </div>
            )}
          </div>
       </div>

       {/* Bottom AI Chat Section (Sticky) */}
       <div className="bg-[#0f0f0f] border-t border-[#1f1f1f] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-[#C1F32A] animate-pulse"></div>
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">NestAI House Agent</span>
          </div>
          
          <div className="max-h-48 overflow-y-auto mb-4 flex flex-col gap-3 custom-scrollbar pr-1">
             {chatMessages.map((m, idx) => (
               <div key={idx} className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] shadow-sm ${
                 m.role === 'user' 
                  ? 'bg-[#C1F32A]/10 text-zinc-100 self-end border border-[#C1F32A]/20 rounded-tr-none' 
                  : 'bg-[#1a1a1a] text-zinc-400 self-start border border-[#2a2a2a] rounded-tl-none'
               }`}>
                 {m.content}
               </div>
             ))}
             {isTyping && <div className="text-[10px] text-zinc-600 animate-pulse ml-1">Agent is analyzing...</div>}
          </div>

          <form onSubmit={sendMessage} className="relative">
             <input 
               type="text"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               placeholder="Ask for recommendations..."
               className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl py-3 pl-4 pr-12 text-[11px] text-white focus:outline-none focus:border-[#C1F32A]/50 transition-all placeholder:text-zinc-600"
             />
             <button type="submit" className="absolute right-2 top-2 p-1.5 text-[#C1F32A] hover:bg-[#C1F32A]/10 rounded-lg transition-all">
                <Search className="w-4 h-4" />
             </button>
          </form>
       </div>
    </aside>
  );
}
