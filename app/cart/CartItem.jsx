"use client";

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex gap-4 md:gap-6 bg-white p-4 md:p-6 border border-gray-100 relative group transition-all duration-300 hover:shadow-md">
      {/* IMAGE */}
      <div className="relative w-24 h-32 md:w-32 md:h-44 bg-gray-50 overflow-hidden flex-shrink-0">
        <Image 
          src={item.thumbnail || item.images?.[0]} 
          alt={item.title} 
          fill 
          sizes="(max-width: 768px) 96px, 128px" 
          quality={65} 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>

      {/* DETAILS */}
      <div className="flex-grow flex flex-col justify-between overflow-hidden">
        <div className="relative">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-medium text-[#7D8A99] uppercase tracking-widest">{item.brand || 'Premium'}</p>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-gray-200 hover:text-red-400 transition-colors absolute -right-2 top-0 p-2"
              title="Remove Item"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <h3 className="text-[16px] md:text-[20px] font-medium text-black uppercase tracking-tight leading-none mt-2 truncate pr-6">
            {item.title}
          </h3>
          
          <div className="h-px w-full bg-gray-50 my-6"></div>
        </div>

        {/* QUANTITY & PRICE */}
        <div className="flex justify-between items-center gap-2 md:gap-4 flex-wrap">
          <div className="flex items-center border border-gray-100 bg-white shadow-sm overflow-hidden rounded-sm">
            <button 
              onClick={() => updateQuantity(item.id, -1)}
              className="w-8 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus size={12} className="text-gray-400" />
            </button>
            <span className="w-10 text-center text-xs font-bold text-black">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              className="w-8 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={12} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-shrink-0">
            <p className="text-xl md:text-2xl font-medium text-black tracking-tighter">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
