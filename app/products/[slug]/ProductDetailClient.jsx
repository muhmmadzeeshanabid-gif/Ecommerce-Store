"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Minus, Plus, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';
import ProductReviews from '../../components/ProductReviews';

const ProductDetailClient = ({ product, recommendations }) => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  
  const [mainImage, setMainImage] = useState(product?.images?.[0] || product?.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);

  const getProductColors = () => {
    const text = (product?.title + ' ' + product?.description).toLowerCase();
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'blue': '#3B82F6',
      'navy': '#1E3A8A',
      'red': '#EF4444',
      'green': '#22C55E',
      'olive': '#556B2F',
      'brown': '#78350F',
      'gray': '#9CA3AF',
      'pink': '#EC4899',
      'purple': '#A855F7',
      'yellow': '#EAB308',
      'beige': '#F5F5DC'
    };
    
    const detected = [];
    Object.keys(colorMap).forEach(key => {
      if (text.includes(key)) detected.push({ name: key, hex: colorMap[key] });
    });
    
    return detected;
  };

  const availableColors = getProductColors();
  const sizes = product?.categoryId?.includes('cat-5') ? ['Standard'] : 
                product?.categoryId?.includes('cat-1') ? ['128GB', '256GB'] : 
                ['Small', 'Medium', 'Large', 'X-Large'];

  // States generation (same as ProductCard for consistency)
  const uniqueId = String(product?.id || product?.title || "0");
  const hash = uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.0 + (hash % 10) / 10).toFixed(1);
  const sold = Math.floor(100 + (hash % 2400));

  return (
    <div className="min-h-screen bg-white pb-20 pt-10">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center flex-nowrap whitespace-nowrap gap-1 md:gap-2 text-[10px] md:text-[13px] text-gray-400 font-medium mb-10 overflow-x-auto no-scrollbar">
          <button onClick={() => router.push('/')} className="hover:text-black flex-shrink-0">Home</button>
          <ChevronRight size={12} className="flex-shrink-0 md:w-3.5 md:h-3.5" />
          <button onClick={() => router.push('/products')} className="hover:text-black flex-shrink-0">Shop</button>
          <ChevronRight size={12} className="flex-shrink-0 md:w-3.5 md:h-3.5" />
          <span className="text-black capitalize flex-shrink-0">{(product?.category || "Category").replace('-', ' ')}</span>
          <ChevronRight size={12} className="flex-shrink-0 md:w-3.5 md:h-3.5" />
          <span className="text-gray-300 capitalize truncate max-w-[150px] md:max-w-none">{product?.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* 1. LEFT: IMAGE GALLERY */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {(product.images || [product.thumbnail]).map((img, i) => (
                <div 
                  key={i}
                  className={`relative w-24 h-28 flex-shrink-0 cursor-pointer overflow-hidden border transition-all rounded-2xl ${mainImage === img ? 'border-black ring-2 ring-black/5' : 'border-gray-100 bg-gray-50'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative flex-1 aspect-[4/5] bg-gray-50 overflow-hidden rounded-[32px]">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
          </div>

          <div className="flex flex-col">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
               {product.brand || "John Lewis ANYDAY"}
             </p>

            <h1 className="text-3xl md:text-5xl font-black text-black leading-[1.1] mb-6">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {product.discountPercentage > 0 && (
                  <span className="text-xl font-bold text-gray-300 line-through tracking-tighter">
                    ${Math.round(product.price * (1 + product.discountPercentage / 100))}
                  </span>
                )}
                <span className="text-3xl font-black text-black tracking-tighter">${Number(product.price).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">{sold} Sold</span>
                  <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                  <div className="flex items-center gap-1.5 font-black">
                     <Star size={18} className="text-orange-400 fill-orange-400" />
                     <span className="text-lg">{rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px border-t-2 border-dashed border-gray-100 mb-8"></div>

            {/* Description Section with Interactive 'See More' */}
            <div className="space-y-4 mb-12">
              <h4 className="text-lg font-black text-black uppercase tracking-tight">Description:</h4>
              <p className="text-[16px] text-gray-500 leading-relaxed font-medium">
                {product.description || "This premium item is meticulously crafted to meet the highest standards of quality and style."}
                {showMore && (
                  <span className="animate-in fade-in duration-500">
                    {" This collection features exclusive materials sourced from top-tier textiles, ensuring longevity and an unmatched premium feel in every single detail."}
                  </span>
                )}
                <button 
                  onClick={() => setShowMore(!showMore)}
                  className="text-black font-black cursor-pointer ml-2 hover:underline focus:outline-none"
                >
                  {showMore ? "Show Less" : "See More...."}
                </button>
              </p>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between w-28 md:w-32 h-16 bg-gray-50 px-3 md:px-4 border border-gray-100 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-white transition-colors rounded-full"><Minus size={18} /></button>
                <span className="text-lg font-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-white transition-colors rounded-full"><Plus size={18} /></button>
              </div>
              
              <button 
                onClick={() => {
                  const itemToAdd = {
                    ...product,
                    count: quantity
                  };
                  for(let i=0; i<quantity; i++) addToCart(itemToAdd);
                  
                  const btn = document.getElementById('add-to-cart-btn');
                  const originalContent = btn.innerHTML;
                  btn.innerHTML = 'ADDED!';
                  btn.style.backgroundColor = '#000';
                  setTimeout(() => {
                    btn.innerHTML = originalContent;
                  }, 2000);
                }}
                id="add-to-cart-btn"
                className="flex-[2] md:flex-1 h-16 bg-black text-white flex items-center justify-center gap-3 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl rounded-full btn-animate min-w-[120px]"
              >
                <span className="hidden sm:inline">Add to Bag</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Wishlist Toggle Button (ROUNDED) */}
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-16 h-16 border border-gray-100 flex items-center justify-center transition-all cursor-pointer hover:shadow-lg active:scale-90 rounded-full
                  ${isInWishlist(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white text-gray-400 hover:text-black'}
                `}
              >
                <Heart size={24} className={isInWishlist(product.id) ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Reviews Section (DYNAMIC FROM API) */}
        <ProductReviews 
          reviews={product.reviews || []} 
          productDescription={product.description}
          productRating={rating}
        />

      </div>
    </div>
  );
};

export default ProductDetailClient;
