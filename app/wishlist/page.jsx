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
        
        {/* Header Section - Reordered */}
        <div className="flex flex-col gap-6 mb-16 border-b border-gray-100 pb-12">
          <div className="flex">
            <Link href="/products" className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all rounded-full shadow-lg group btn-animate">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               Continue Shopping
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-px bg-black"></span>
              <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
                Collection / Favorites
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
              My Wishlist
            </h1>
          </div>
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
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
               <Heart size={48} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">Your wishlist is empty</h3>
              <p className="text-gray-400 text-sm font-medium">Save your favorite items here to keep an eye on them.</p>
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
