"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const OrderSummary = ({ total }) => {
  return (
    <div className="lg:w-[400px] flex-shrink-0">
      <div className="bg-white border border-gray-200 p-8 sticky top-32 space-y-8">
        <h2 className="text-xl font-medium uppercase tracking-widest border-b border-gray-100 pb-4 text-black">Order Summary</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
            <span className="text-black font-medium">${total}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400 uppercase tracking-widest">Global Shipment</span>
            <span className="text-green-600 font-medium uppercase tracking-widest text-[9px]">Free</span>
          </div>
          <div className="h-px bg-gray-100 my-6"></div>
          <div className="flex justify-between items-end">
            <span className="text-black uppercase tracking-widest text-sm font-medium">Total Amount</span>
            <span className="font-medium text-2xl text-black leading-none">${total}</span>
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
  );
};

export default OrderSummary;
