"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Truck, Package, Clock, MapPin, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
    const { clearCart } = useCart();
    const [orderNumber, setOrderNumber] = useState("");
    const [orderDate, setOrderDate] = useState("");

    useEffect(() => {
        // Mocking an order completion
        setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
        setOrderDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        
        // This is a simulation, in a real app we'd save it to DB
        // We clear the cart after the user arrives here
        const timer = setTimeout(() => {
            clearCart();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const steps = [
        { title: 'Order Placed', time: 'Just Now', status: 'completed', icon: <CheckCircle2 size={16} /> },
        { title: 'Payment Confirmed', time: 'Just Now', status: 'completed', icon: <CheckCircle2 size={16} /> },
        { title: 'Processing', time: 'Estimated: 24h', status: 'active', icon: <Clock size={16} /> },
        { title: 'Shipped', time: 'Pending', status: 'pending', icon: <Truck size={16} /> },
        { title: 'Delivered', time: 'Pending', status: 'pending', icon: <Package size={16} /> },
    ];

    return (
        <div className="bg-white min-h-screen pt-28 pb-32 font-outfit">
            <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                
                {/* 1. SUCCESS HEADER */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                        <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                        Order Confirmed
                    </h1>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                        Thank you for your purchase. Your style is on the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* LEFT: ORDER DETAILS & TRACKING */}
                    <div className="lg:col-span-7 space-y-12">
                        
                        {/* Order Meta */}
                        <div className="flex flex-wrap gap-8 py-8 border-y border-gray-100">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order Number</p>
                                <p className="text-sm font-black text-black">#{orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-black text-black">{orderDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment Method</p>
                                <p className="text-sm font-black text-black underline underline-offset-4 decoration-black/10">Credit Card (Visa)</p>
                            </div>
                        </div>

                        {/* Delivery Tracking Timeline */}
                        <div className="space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-tighter text-black">Delivery Tracking</h3>
                            <div className="space-y-0 relative">
                                {/* Vertical line */}
                                <div className="absolute left-[7px] top-2 bottom-6 w-px bg-gray-100"></div>

                                {steps.map((step, idx) => (
                                    <div key={idx} className="relative pl-10 pb-10 last:pb-0">
                                        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-white z-10 
                                            ${step.status === 'completed' ? 'border-green-500 bg-green-500' : 'border-gray-200'}`}>
                                            {step.status === 'completed' && <div className="w-1 h-1 bg-white rounded-full m-0.5 mx-auto mt-1"></div>}
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-gray-300' : 'text-black'}`}>
                                                    {step.title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{step.time}</p>
                                            </div>
                                            <div className={`${step.status === 'active' ? 'text-black font-bold animate-pulse' : 'text-gray-200'}`}>
                                                {step.icon}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DELIVERY ADDRESS & ACTIONS */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 border border-gray-100 p-10 space-y-10 rounded-[32px]">
                            
                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-black">
                                    <MapPin size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest font-outfit">Delivery Address</h3>
                                </div>
                                <div className="pl-8 space-y-1">
                                    <p className="text-sm font-bold text-black uppercase">Muhammad Zeeshan</p>
                                    <p className="text-xs text-gray-500 font-medium">Model Town, Extension Phase 2</p>
                                    <p className="text-xs text-gray-500 font-medium">Lahore, Punjab, 54000</p>
                                    <p className="text-xs text-gray-500 font-medium tracking-widest">+92 300 1234567</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Need Help */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Merchant Support</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    If you have any questions about your order, please contact our 24/7 concierge service.
                                </p>
                                <button className="text-[11px] font-black text-black uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 transition-colors">
                                    Chat with Support
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="pt-6 space-y-4">
                                <Link 
                                    href="/products"
                                    className="flex items-center justify-center gap-3 w-full bg-black text-white py-6 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-full shadow-2xl active:scale-95"
                                >
                                    Continue Shopping
                                    <ArrowRight size={18} />
                                </Link>
                                <Link 
                                    href="/"
                                    className="flex items-center justify-center w-full py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-black hover:bg-white rounded-full border border-transparent hover:border-gray-100 transition-all"
                                >
                                    Return home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BRANDING */}
                <div className="mt-32 pt-16 border-t border-gray-50 flex flex-col items-center">
                    <ShoppingBag size={40} className="text-gray-100 mb-6" />
                    <p className="text-[10px] font-black text-gray-100 uppercase tracking-[1em]">ZARA INSPIRED STORE</p>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccessPage;
