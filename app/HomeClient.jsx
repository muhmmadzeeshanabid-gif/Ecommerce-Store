"use client";
import React from 'react';
import Link from 'next/link';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';

const HomeClient = ({ featuredProducts, brands }) => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Luxury Hero Section */}
      <section className="container mx-auto px-6 py-12 lg:py-24 lg:px-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Content Block */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-px bg-black"></span>
                <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
                  Global Fashion Selection
                </p>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                Find Cloth <br />
                <span className="font-playfair italic font-medium text-gray-400">That Matches</span> <br />
                Your Style
              </h1>
            </div>
            
            <p className="max-w-md text-gray-500 text-base md:text-lg leading-relaxed font-light">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>
            
            <div className="flex items-center gap-8 pt-4">
              <Link 
                href="/products" 
                className="px-14 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-full btn-animate"
              >
                Shop Now
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-16 pt-12 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">200+</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Brands</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">2k+</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Products</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">30k+</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customers</p>
              </div>
            </div>
          </div>
          
          {/* Right: Image Area with Premium Styling */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-60 group-hover:bg-neutral-200 transition-all duration-1000"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neutral-100 rounded-full blur-2xl opacity-40 group-hover:bg-gray-200 transition-all duration-1000"></div>

            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-none border border-white mt-4 group">
              <img 
                src="/hero-image.jpg" 
                alt="Zara Fashion" 
                className="w-full h-full object-cover transition-all duration-[4000ms] group-hover:scale-110 ease-out"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-20 transition-opacity duration-1000"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-all duration-1000 pointer-events-none select-none">
                <h2 className="text-white text-[12vw] font-black rotate-[-15deg] tracking-tighter mix-blend-overlay">ZARA</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Bar */}
      <div className="w-full bg-black py-10 md:py-12 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-8 gap-y-6 md:gap-10">
            {brands.map((brand) => (
              <Link 
                key={brand}
                href={`/brands/${brand.toLowerCase().replace(' ', '-')}`}
                className="text-white font-bold text-base md:text-2xl tracking-tighter uppercase italic hover:opacity-50 transition-opacity whitespace-nowrap"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="container mx-auto px-6 sm:px-10 py-24 lg:px-20">
        
        <div className="flex flex-col gap-2 mb-20">
          <p className="text-[11px] font-black tracking-[0.6em] text-black/20 uppercase pl-1">
            Season 2026 Archive
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-[120px] font-black text-black uppercase tracking-tighter leading-[0.8]">
            New Arrivals
          </h2>
        </div>

        <div className="sticky top-[80px] z-[40] bg-[#FAF9F6]/90 backdrop-blur-md mb-16 -mx-6 lg:-mx-20 px-6 lg:px-20 py-6 border-b border-black/5">
          <CategoryNav />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/products" 
            className="inline-block px-14 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer rounded-full btn-animate shadow-2xl"
          >
            View More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeClient;
