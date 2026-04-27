import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user, openAuthModal } = useAuth();

  // Robust unique stat generator (avoids NaN)
  const uniqueId = String(product?.id || product?.title || "0");
  const hash = uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.0 + (hash % 10) / 10).toFixed(1);
  const sold = Math.floor(100 + (hash % 2400));

  return (
    <div className="group flex flex-col gap-4 relative">
      {/* 1. IMAGE BOX (Rounded for premium feel) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-[20px]">
        {/* Floating Wishlist Heart */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer
            ${isInWishlist(product.id) ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'}
          `}
        >
          <Heart size={16} className={isInWishlist(product.id) ? "fill-white" : ""} />
        </button>

        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img 
            src={product.thumbnail || (product.images && product.images[0])} 
            alt={product.title} 
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Simple Shopping Bag Toggle (Visible on Mobile/Hover on Desktop) */}
        <button 
           onClick={(e) => {
             e.preventDefault();
             if (!user) {
               openAuthModal();
               return;
             }
             addToCart(product);
           }}
           className="absolute bottom-4 right-4 bg-white p-3 shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black hover:text-white cursor-pointer rounded-full border border-gray-100 z-10"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* 2. TEXT CONTENT (Left Aligned as per image) */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-[16px] md:text-[18px] font-bold text-black leading-tight tracking-tight line-clamp-2 min-h-[48px]">
           {product.title}
        </h3>
        <p className="text-[14px] md:text-[16px] font-extrabold text-black mt-1">
           ${product.price}
        </p>
        
        {/* Unique Rating & Sold Stats based on Product Hashing */}
        <div className="flex items-center gap-1.5 mt-1 text-[12px] md:text-[13px] text-gray-400 font-medium">
          <Star size={14} className="text-orange-400 fill-orange-400" />
          <span className="text-black font-bold">{rating}</span>
          <span className="mx-1">•</span>
          <span>{sold} Sold</span>
        </div>

        {/* Dedicated Add to Bag Button only for mobile visibility */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              openAuthModal();
              return;
            }
            addToCart(product);
          }}
          className="md:hidden mt-4 w-full h-11 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full active:scale-95 flex items-center justify-center gap-2 border border-black"
        >
          <ShoppingBag size={14} />
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
