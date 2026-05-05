"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';

const sliderData = [
  {
    id: 1,
    image: "/hero_couple_inside.png",
    badge: "Exclusive Collection",
    titleLine1: "Find Cloth",
    titleLine2: "That Matches",
    titleLine3: "Your Style",
    desc: "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.",
    stats: [
      { num: "200+", label: "Global Brands" },
      { num: "2k+", label: "Premium Items" },
      { num: "30k+", label: "Happy Clients" }
    ],
    objectPos: "object-center"
  },
  {
    id: 2,
    image: "/hero_final_2.png",
    badge: "Flagship Store",
    titleLine1: "Discover",
    titleLine2: "Elegance For",
    titleLine3: "Every Occasion",
    desc: "Experience luxury shopping at its finest. Premium collections tailored for your exquisite taste.",
    stats: [
      { num: "100%", label: "Authentic Quality" },
      { num: "50+", label: "Top Designers" },
      { num: "24/7", label: "Client Service" }
    ],
    objectPos: "object-center"
  },
  {
    id: 3,
    image: "/hero_final_3.png",
    badge: "Premium Accessories",
    titleLine1: "Timeless",
    titleLine2: "Elegance &",
    titleLine3: "Grace",
    desc: "Complete your look with our exclusive collection of high-end designer accessories and leather goods.",
    stats: [
      { num: "5k+", label: "Accessories" },
      { num: "100%", label: "Genuine Leather" },
      { num: "Global", label: "Shipping" }
    ],
    objectPos: "object-center"
  }
];

const HomeClient = ({ featuredProducts, brands }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Hero Section — Dynamic Slider */}
      <section className="relative w-full h-[85vh] min-h-[700px] flex flex-col justify-end pb-10 lg:pb-16 overflow-hidden bg-black">
        
        {/* Slider Background Images */}
        {sliderData.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
          >
            <Image 
              src={slide.image} 
              alt={`Zara Fashion Banner ${index + 1}`} 
              fill
              sizes="100vw"
              priority
              quality={100}
              unoptimized={true}
              className={`object-cover ${slide.objectPos} ${index === currentSlide ? 'animate-[zoom-out_20s_ease-out_forwards]' : ''}`}
            />
            {/* Extremely subtle shadow strictly behind text to ensure readability without making image dark */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent w-full"></div>
          </div>
        ))}

        {/* Dynamic Content Overlaid on Image */}
        <div className="relative z-10 w-full px-6 lg:px-20 mt-auto flex flex-col md:flex-row items-end justify-between gap-10">
          
          {/* Text and Button Block (Left side) */}
          <div className="text-left space-y-6 max-w-2xl" key={`text-${currentSlide}`}>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-2 shadow-xl animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold drop-shadow-md">{sliderData[currentSlide].badge}</span>
            </div>

            <h1 className="text-4xl md:text-[60px] lg:text-[75px] font-black text-white leading-[1] tracking-tighter uppercase drop-shadow-[0_20px_30px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {sliderData[currentSlide].titleLine1} <br />
              <span className="font-playfair italic font-medium text-white/95 drop-shadow-[0_20px_30px_rgba(0,0,0,1)]">{sliderData[currentSlide].titleLine2}</span> <br />
              {sliderData[currentSlide].titleLine3}
            </h1>

            <p className="text-sm md:text-base text-white font-medium leading-relaxed drop-shadow-[0_10px_10px_rgba(0,0,0,1)] max-w-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {sliderData[currentSlide].desc}
            </p>

            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link 
                href="/products" 
                className="inline-flex px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 hover:scale-105 transition-all duration-300 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Minimal Bottom Stats */}
          <div className="flex flex-row md:flex-col justify-start md:justify-end gap-6 md:gap-10 text-left md:text-right pb-2" key={`stats-${currentSlide}`}>
            {sliderData[currentSlide].stats.map((stat, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${400 + (i * 100)}ms` }}>
                <p className="text-2xl md:text-3xl font-bold tracking-tighter text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">{stat.num}</p>
                <p className="text-[9px] text-white/80 font-bold uppercase tracking-[0.2em] mt-1 drop-shadow-md">{stat.label}</p>
              </div>
            ))}
          </div>
          
        </div>

        {/* Slider Controls/Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sliderData.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </section>

      {/* Luxury Brand Partners (Ultra Minimalist) */}
      <div className="w-full bg-[#0a0a0a] py-8 md:py-10 overflow-x-auto no-scrollbar flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6">
          <div className="flex flex-nowrap justify-between md:justify-center items-center gap-12 md:gap-28 w-max md:w-full mx-auto">
            {/* Show exactly 5 brands, excluding Calvin Klein */}
            {brands.filter(b => b.toUpperCase() !== "CALVIN KLEIN").slice(0, 5).map((brand, index) => (
              <span key={index} className="text-white hover:text-zinc-500 font-playfair font-medium text-2xl md:text-3xl tracking-[0.4em] uppercase transition-colors duration-300 whitespace-nowrap cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="container mx-auto px-6 sm:px-10 pt-12 pb-24 lg:px-20">
        
        <div className="flex flex-col items-center justify-center mb-8 md:mb-10 mt-4 text-center px-4">
          
          {/* High-End Elegant Heading */}
          <h2 className="text-4xl md:text-[70px] font-playfair italic font-medium text-zinc-900 tracking-tight leading-none mb-4">
            New Arrivals
          </h2>
          
          {/* Refined Geometric Divider */}
          <div className="flex items-center justify-center w-full max-w-sm gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-400"></div>
            <div className="w-2 h-2 rotate-45 bg-zinc-800 outline outline-offset-2 outline-1 outline-zinc-300"></div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-400"></div>
          </div>
          
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase">
            Curated Collection 2026
          </span>
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
