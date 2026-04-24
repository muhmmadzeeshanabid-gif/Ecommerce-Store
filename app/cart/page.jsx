"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ChevronLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  React.useEffect(() => {
    document.title = "Your Shopping Bag | Zara Store";
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-10 rounded-full bg-gray-50 text-gray-200">
          <ShoppingBag size={80} strokeWidth={1} />
        </div>
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest text-black">
          Cart is Empty
        </h1>
        <p className="text-gray-400 mb-10 max-w-xs text-xs font-medium uppercase tracking-wider">
          Your shopping bag is currently empty. Start exploring our collections.
        </p>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-14 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-lg rounded-full btn-animate"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20">
      <main className="container mx-auto px-6 lg:px-20">
        
        {/* BACK TO HOME BUTTON */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-md active:scale-95 rounded-full btn-animate"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 1. CART ITEMS LIST */}
          <div className="flex-grow space-y-6">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-black border-b border-gray-200 pb-6">Your Shopping Bag</h1>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white p-6 border border-gray-100 shadow-sm relative transition-all hover:shadow-md">
                  <div className="w-24 h-32 md:w-32 md:h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img src={item.thumbnail || item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.brand}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-black uppercase tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      
                      {/* Selected Options */}
                      <div className="flex items-center gap-4 mt-2">
                        {item.selectedSize && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Size:</span>
                            <span className="text-[11px] font-black text-black uppercase">{item.selectedSize}</span>
                          </div>
                        )}
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Color:</span>
                            <div className="w-3 h-3 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: item.selectedColor }}></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                      <div className="flex items-center border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-black tracking-tight">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. WHITE BACKGROUND INVOICE */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-white border border-gray-200 p-8 sticky top-32 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-100 pb-4 text-black">Order Summary</h2>
              
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-sm border-b border-gray-50 pb-2">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-black uppercase line-clamp-1">{item.title}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-black">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-black font-bold">${getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-500 uppercase tracking-widest">Global Shipment</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[9px]">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between pt-2">
                  <span className="text-black uppercase tracking-widest text-sm font-bold">Total Amount</span>
                  <span className="font-bold text-2xl text-black">${getCartTotal()}</span>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  href="/checkout"
                  className="w-full bg-black text-white flex items-center justify-center py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-md mb-6 active:scale-95 rounded-full btn-animate"
                >
                  Confirm Checkout
                </Link>
                
                <div className="space-y-5 border-t border-gray-50 pt-6 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Secure Payments</p>
                  <div className="flex justify-center gap-4 grayscale opacity-30">
                    <span className="text-[10px] font-black italic">VISA</span>
                    <span className="text-[10px] font-black italic">MASTERCARD</span>
                    <span className="text-[10px] font-bold">AMEX</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-gray-300">
                  <ShieldCheck size={18} />
                  <p className="text-[9px] font-bold uppercase tracking-widest">Safe & Secured Checkout</p>
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
