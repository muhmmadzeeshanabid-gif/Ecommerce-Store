"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ChevronLeft } from 'lucide-react';

// Components
import EmptyCart from './EmptyCart';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  React.useEffect(() => {
    document.title = "Your Shopping Bag | Zara Inspired";
  }, []);

  if (cartItems.length === 0) {
    return <EmptyCart />;
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
                <CartItem 
                  key={item.id} 
                  item={item} 
                  removeFromCart={removeFromCart} 
                  updateQuantity={updateQuantity} 
                />
              ))}
            </div>
          </div>

          {/* 2. ORDER SUMMARY */}
          <OrderSummary total={getCartTotal()} />

        </div>
      </main>
    </div>
  );
};

export default CartPage;
