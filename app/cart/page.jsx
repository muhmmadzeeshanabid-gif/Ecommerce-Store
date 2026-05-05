"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  React.useEffect(() => {
    document.title = "Your Shopping Bag | Zara Inspired";
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-10 rounded-full bg-gray-50 text-gray-200">
          <ShoppingBag size={80} strokeWidth={1} />
        </div>
        <h1 className="text-2xl font-medium mb-4 uppercase tracking-widest text-black">
          Cart is Empty
        </h1>
        <p className="text-gray-400 mb-10 max-w-xs text-xs font-medium uppercase tracking-wider">
          Your shopping bag is currently empty. Start exploring our collections.
        </p>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-14 py-5 bg-black text-white text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-lg rounded-full"
        >
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 font-inter text-black">
      <main className="container mx-auto px-4 md:px-6 lg:px-20">
        
        {/* BACK TO HOME */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-medium uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-full"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 1. CART ITEMS LIST */}
          <div className="flex-grow space-y-4">
        <div className="flex flex-col items-center justify-center mb-10 md:mb-12 mt-4 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-playfair italic font-medium text-zinc-900 tracking-tight leading-none mb-4">
            Shopping Bag
          </h1>
          <div className="flex items-center justify-center w-full max-w-sm gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-400"></div>
            <div className="w-2 h-2 rotate-45 bg-zinc-800 outline outline-offset-2 outline-1 outline-zinc-300"></div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-400"></div>
          </div>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase">
            Your Selected Items
          </span>
        </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 md:gap-6 bg-white p-4 md:p-6 border border-gray-100 relative group">
                  
                  {/* IMAGE */}
                  <div className="relative w-24 h-32 md:w-32 md:h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                    <Image src={item.thumbnail || item.images?.[0]} alt={item.title} fill sizes="(max-width: 768px) 96px, 128px" quality={65} className="object-cover" />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-grow flex flex-col justify-between overflow-hidden">
                    <div className="relative">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-medium text-[#7D8A99] uppercase tracking-widest">{item.brand || 'Premium'}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-200 hover:text-zinc-500 transition-colors absolute -right-2 top-0 p-2"
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
                      <div className="flex items-center border border-gray-100 bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={12} className="text-gray-400" />
                        </button>
                        <span className="w-10 text-center text-xs font-medium text-black">{item.quantity}</span>
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
              ))}
            </div>
          </div>

          {/* 2. ORDER SUMMARY */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-white border border-gray-200 p-8 sticky top-32 space-y-8">
              <h2 className="text-xl font-medium uppercase tracking-widest border-b border-gray-100 pb-4 text-black">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-black font-medium">${getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400 uppercase tracking-widest">Global Shipment</span>
                  <span className="text-green-600 font-medium uppercase tracking-widest text-[9px]">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-6"></div>
                <div className="flex justify-between items-end">
                  <span className="text-black uppercase tracking-widest text-sm font-medium">Total Amount</span>
                  <span className="font-medium text-2xl text-black leading-none">${getCartTotal()}</span>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  href="/checkout"
                  className="w-full bg-black text-white flex items-center justify-center py-5 text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-md mb-8 rounded-full"
                >
                  Proceed Checkout
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-gray-200">
                  <ShieldCheck size={18} />
                  <p className="text-[9px] font-medium uppercase tracking-widest">Safe & Secured Checkout</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CartPage;
