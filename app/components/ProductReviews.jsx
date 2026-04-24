"use client";

import React, { useState, useMemo } from 'react';
import { Star, ThumbsUp, ThumbsDown, ChevronUp, Check, MessageSquare } from 'lucide-react';

const ProductReviews = ({ reviews = [], productDescription = "", productRating = 4.5 }) => {
  const [activeFilter, setActiveFilter] = useState('All Reviews');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [reactions, setReactions] = useState({}); // { reviewId: 'like' | 'dislike' | null }
  const [poppingEmoji, setPoppingEmoji] = useState(null); // { id, type }

  // standard review text as requested by user
  const standardComment = productDescription || "This premium item is meticulously crafted to meet the highest standards of quality and style. This collection features exclusive materials sourced from top-tier textiles, ensuring longevity and an unmatched premium feel in every single detail.";

  // Standardize reviews as requested and ensure ratings match a high-quality product (4.0+)
  const standardizedReviews = useMemo(() => {
    return reviews.map((rev, idx) => {
      const balancedRating = Math.max(Math.floor(productRating), rev.rating); 
      return {
        ...rev,
        id: `rev-${idx}`,
        rating: balancedRating,
        comment: standardComment, 
        hasDescription: true,
        baseLikes: 10 + (idx * 7) % 150
      };
    });
  }, [reviews, standardComment, productRating]);

  // Handle Filtering Logic
  const filteredReviews = useMemo(() => {
    let result = standardizedReviews;
    if (activeFilter === 'With Description') {
      result = result.filter(r => r.hasDescription);
    }
    if (selectedRatings.length > 0) {
      result = result.filter(r => selectedRatings.includes(r.rating));
    }
    return result;
  }, [standardizedReviews, activeFilter, selectedRatings]);

  const handleReaction = (id, type) => {
    const isAdding = reactions[id] !== type;
    
    setReactions(prev => ({
      ...prev,
      [id]: isAdding ? type : null
    }));
    
    if (isAdding) {
      // Set popping emoji for 1 second only when adding a reaction
      setPoppingEmoji({ id, type });
      setTimeout(() => {
        setPoppingEmoji(null);
      }, 1000);
    }
  };

  return (
    <div className="mt-20 py-16 bg-white font-outfit">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 font-outfit">Product Reviews</h2>

        <div className="border border-dashed border-gray-200 rounded-xl p-8 mb-12 bg-gray-50/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-orange-400 flex flex-col items-center justify-center bg-white shadow-sm">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">{productRating}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={`${i < Math.round(productRating) ? "text-orange-400 fill-orange-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tight">from {reviews.length} reviews</p>
                <button 
                  onClick={() => {setActiveFilter('All Reviews'); setSelectedRatings([]);}}
                  className="text-[10px] font-black text-orange-400 mt-1 uppercase hover:underline text-left cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            <div className="md:col-span-9 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-10 text-[13px] font-medium text-gray-700">
                    {star}.0 <Star size={14} className="text-orange-400 fill-orange-400" />
                  </div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-700" 
                      style={{ width: `${star <= Math.ceil(productRating) ? (star === 5 ? 85 : star === 4 ? 40 : 15) : 0}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-[13px] font-medium text-gray-400">
                    {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '10%' : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 border border-dashed border-gray-200 rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm bg-white/50">
             <h3 className="text-base font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Reviews Filter</h3>
             <div className="space-y-10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-gray-800">Rating</span>
                    <ChevronUp size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setSelectedRatings(prev => prev.includes(s) ? prev.filter(r => r !== s) : [...prev, s])}
                        className="flex items-center gap-3 w-full group text-left cursor-pointer"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${selectedRatings.includes(s) ? 'bg-orange-400 border-orange-400' : 'border-gray-300 group-hover:border-orange-400'}`}>
                          {selectedRatings.includes(s) && <Check size={10} className="text-white" />}
                        </div>
                        <div className={`flex items-center gap-1 text-[13px] font-medium ${selectedRatings.includes(s) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                          <Star size={12} className="text-orange-400 fill-orange-400" /> {s}
                        </div>
                        <span className="ml-auto text-[11px] text-gray-300 font-bold">{reviews.filter(r => r.rating === s).length}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-bold text-gray-800 uppercase tracking-tighter">Review Topics</span>
                    <ChevronUp size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {['Product Quality', 'Seller Services', 'Product Price', 'Shipment', 'Match with Description'].map((topic) => (
                      <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center group-hover:border-orange-400"><Check size={10} className="text-orange-400 opacity-0 group-hover:opacity-40" /></div>
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-900 uppercase tracking-tight">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
             </div>
          </aside>

          <main className="lg:col-span-9">
            <h3 className="text-base font-bold text-gray-900 mb-6 uppercase tracking-tighter">Review Lists</h3>
            <div className="flex flex-row overflow-x-auto no-scrollbar gap-3 mb-12 pb-2">
              {[
                { label: 'All Reviews', icon: null },
                { label: 'With Description', icon: <MessageSquare size={14} /> }
              ].map((chip) => (
                <button 
                  key={chip.label} 
                  onClick={() => setActiveFilter(chip.label)}
                  className={`flex flex-row items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg border transition-all cursor-pointer whitespace-nowrap
                  ${activeFilter === chip.label ? 'bg-gray-800 border-gray-900 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-800'}`}
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-12">
              {filteredReviews.length > 0 ? filteredReviews.map((rev) => (
                <div key={rev.id} className="pb-10 border-b border-dashed border-gray-100 last:border-0 relative group">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={`${i < rev.rating ? "text-orange-400 fill-orange-400" : "text-gray-100"}`} />
                    ))}
                  </div>
                  <h4 className="text-[16px] font-bold text-gray-900 mb-3 leading-tight tracking-tight uppercase">This is amazing product I have.</h4>
                  <p className="text-[14px] text-gray-500 font-normal leading-relaxed mb-6 max-w-4xl transition-colors group-hover:text-gray-800">{rev.comment}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-gray-100 overflow-hidden bg-gray-50 ring-2 ring-white">
                        <img src={`https://i.pravatar.cc/150?u=${rev.reviewerName}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-gray-800">{rev.reviewerName}</span>
                         <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Verified Buyer</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 relative">
                      {/* Floating Emojis Logic - Dissapears after 2s */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none z-20">
                         <span className={`text-3xl transition-all duration-700 transform 
                           ${(poppingEmoji?.id === rev.id && poppingEmoji?.type === 'like') ? 'opacity-100 -translate-y-6 scale-150' : 'opacity-0 translate-y-0 scale-50'}`}>
                           🤩
                         </span>
                         <span className={`text-3xl transition-all duration-700 transform 
                           ${(poppingEmoji?.id === rev.id && poppingEmoji?.type === 'dislike') ? 'opacity-100 -translate-y-6 scale-150' : 'opacity-0 translate-y-0 scale-50'}`}>
                           😢
                         </span>
                      </div>

                      <button 
                        onClick={() => handleReaction(rev.id, 'like')}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all cursor-pointer ${reactions[rev.id] === 'like' ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-black'}`}
                      >
                        <ThumbsUp size={16} className={reactions[rev.id] === 'like' ? 'fill-white' : ''} />
                        <span className="text-[13px] font-bold">{rev.baseLikes + (reactions[rev.id] === 'like' ? 1 : 0)}</span>
                      </button>

                      <button 
                        onClick={() => handleReaction(rev.id, 'dislike')}
                        className={`flex items-center justify-center w-11 h-11 border rounded-full transition-all cursor-pointer ${reactions[rev.id] === 'dislike' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-red-500'}`}
                      >
                        <ThumbsDown size={16} className={reactions[rev.id] === 'dislike' ? 'fill-white' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
                   <p className="text-gray-400 font-bold italic uppercase tracking-widest text-sm">No reviews matching your filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
