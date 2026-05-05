"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';

const HomeClient = ({ featuredProducts, brands }) => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Hero Section — Editorial Parallax Style */}
      <section className="container mx-auto px-6 py-12 lg:py-24 lg:px-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Content Block with staggered reveals */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 hero-text-reveal">
                <span className="w-10 h-px bg-black"></span>
                <p className="text-[10px] font-bold tracking-[0.4em] text-neutral-400 uppercase">
                  Global Fashion Selection
                </p>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-black leading-[0.9] uppercase tracking-tighter hero-text-reveal hero-text-reveal-delay-1">
                Find Cloth <br />
                <span className="font-playfair italic font-medium text-neutral-400">That Matches</span> <br />
                Your Style
              </h1>
            </div>
            
            <p className="max-w-md text-neutral-500 text-base md:text-lg leading-relaxed font-light hero-text-reveal hero-text-reveal-delay-2">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>
            
            <div className="flex items-center gap-8 pt-4 hero-text-reveal hero-text-reveal-delay-3">
              <Link 
                href="/products" 
                className="px-14 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-full btn-animate"
              >
                Shop Now
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-16 pt-12 border-t border-gray-100 hero-text-reveal hero-text-reveal-delay-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">200+</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Brands</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">2k+</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Products</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tighter text-black">30k+</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Customers</p>
              </div>
            </div>
          </div>
          
          {/* Right: Image Area — New Editorial Design */}
          <div className="lg:col-span-5 relative">
            {/* Floating decorative accents */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-2 border-black/5 float-accent-1 pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/[0.03] rounded-full float-accent-2 pointer-events-none"></div>
            <div className="absolute top-1/2 -right-4 w-16 h-16 rounded-full bg-amber-100/40 blur-xl float-accent-2 pointer-events-none"></div>

            {/* Main image container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.2)] mt-4 hero-shimmer">
              <Image 
                src="/hero-image.png" 
                alt="Zara Fashion — Minimal Editorial" 
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                quality={85}
                className="object-cover hero-image-drift"
              />
              {/* Subtle gradient overlay — editorial vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Bottom tag */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                <div className="space-y-1">
                  <p className="text-white/90 text-[9px] font-black uppercase tracking-[0.4em]">Summer 2026</p>
                  <p className="text-white/50 text-[8px] font-bold uppercase tracking-[0.3em]">Exclusive Collection</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10">
                  <span className="text-white text-[8px] font-black">NEW</span>
                </div>
              </div>
            </div>

            {/* Side vertical text */}
            <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
              <p className="text-[9px] font-black tracking-[0.6em] text-black/10 uppercase whitespace-nowrap">Discover • Explore • Style</p>
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
