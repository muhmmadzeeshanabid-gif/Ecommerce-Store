"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear the cart when the user lands on the success page
        const timer = setTimeout(() => {
            clearCart();
        }, 1000);
        return () => clearTimeout(timer);
    }, [clearCart]);

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-32 font-outfit flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-2xl text-center space-y-8">
                
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-4">
                    <CheckCircle2 size={50} className="text-green-500" strokeWidth={1.5} />
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none">
                        Order Successful
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed">
                        Thank you for your purchase. Your order has been placed successfully and is being processed.
                    </p>
                </div>

                <div className="pt-8">
                    <Link 
                        href="/products"
                        className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-full shadow-2xl active:scale-95"
                    >
                        Back to Store
                        <ArrowRight size={18} />
                    </Link>
                </div>
                
            </div>
        </div>
    );
};

export default OrderSuccessPage;
