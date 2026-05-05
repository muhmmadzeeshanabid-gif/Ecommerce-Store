"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
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
};

export default EmptyCart;
