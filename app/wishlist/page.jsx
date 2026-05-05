"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems } = useCart();

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-20">
        
        <div className="flex flex-col items-center justify-center mb-8 md:mb-10 mt-4 text-center px-4">
          <h1 className="text-5xl md:text-[80px] font-playfair italic font-medium text-zinc-900 tracking-tight leading-none mb-4">
            My Wishlist
          </h1>
          <div className="flex items-center justify-center w-full max-w-sm gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-400"></div>
            <div className="w-2 h-2 rotate-45 bg-zinc-800 outline outline-offset-2 outline-1 outline-zinc-300"></div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-400"></div>
          </div>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase">
            Your Personal Favorites
          </span>
        </div>

        {/* Content Section */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-white/50 border border-dashed border-gray-200 rounded-[40px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-neutral-200">
               <Heart size={48} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Your wishlist is empty</h3>
              <p className="text-neutral-400 text-sm font-medium">Save your favorite items here to keep an eye on them.</p>
            </div>
            <Link 
                href="/products" 
                className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-full shadow-xl btn-animate"
            >
              Explore Collection
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
