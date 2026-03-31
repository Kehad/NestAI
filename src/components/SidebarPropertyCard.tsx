"use client";

import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';

interface SidebarPropertyCardProps {
  item: any;
  isReviewOpen: boolean;
  onToggleReview: () => void;
}

export default function SidebarPropertyCard({ item, isReviewOpen, onToggleReview }: SidebarPropertyCardProps) {
  const [reviews, setLocalReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);

  const handleReviewClick = async () => {
    onToggleReview();
    
    if (!hasFetchedReviews && !isReviewOpen) {
      try {
        const res = await fetch(`/api/reviews?propertyId=${item.id}`);
        const data = await res.json();
        if (data.success) {
          setLocalReviews(data.reviews);
          setHasFetchedReviews(true);
        }
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          propertyId: item.id, 
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

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl p-4 hover:border-[#C1F32A]/30 transition-all group">
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
      
      {isReviewOpen ? (
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
                 <button type="button" onClick={onToggleReview} className="text-[10px] text-zinc-500 hover:text-white transition-colors">Cancel</button>
                 <button type="submit" className="bg-[#C1F32A] text-black text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-lg hover:bg-[#b0df22] transition-colors">Post</button>
               </div>
             </div>
           </form>
        </div>
      ) : (
        <div className="flex gap-2">
          <button 
            onClick={handleReviewClick}
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
  );
}
