"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, ShieldCheck, Truck, Package, Clock, Loader2, Sparkles, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

const OrderSuccessPage = () => {
    const { clearCart } = useCart();
    const [orderData, setOrderData] = useState(null);
    const [step, setStep] = useState(0);
    const slipRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        const savedOrder = localStorage.getItem('latestOrder');
        if (savedOrder) {
            setOrderData(JSON.parse(savedOrder));
        }
        clearCart();

        // Step-by-step animation sequence with auto-scroll
        const runSteps = async () => {
            for (let i = 1; i <= 4; i++) {
                await new Promise(resolve => setTimeout(resolve, i === 1 ? 800 : 1400));
                setStep(i);
                
                // Auto-scroll logic for mobile
                if (window.innerWidth < 1024) {
                    if (i < 4 && stepsRef.current[i]) {
                        stepsRef.current[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else if (i === 4 && slipRef.current) {
                        setTimeout(() => {
                            slipRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 500);
                    }
                }
            }
        };

        runSteps();
    }, []);

    const downloadReceipt = () => {
        if (slipRef.current === null) return;
        
        toPng(slipRef.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `zara-receipt-${orderData?.orderId || 'order'}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('oops, something went wrong!', err);
            });
    };

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-outfit">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    const ProcessingStep = ({ index, label, activeStep, icon: Icon }) => {
        const isCompleted = activeStep > index;
        const isActive = activeStep === index;
        
        return (
            <div 
                ref={el => stepsRef.current[index] = el}
                className={`flex items-center gap-6 p-6 md:p-7 rounded-3xl border transition-all duration-700 ${
                isActive ? 'bg-black text-white border-black z-20 scale-[1.02] md:scale-[1.05]' : 
                isCompleted ? 'bg-gray-100 border-transparent opacity-50 z-10' : 
                'bg-transparent border-gray-100 opacity-20 z-0'
            }`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    isActive ? 'bg-white text-black' : 'bg-gray-50 text-gray-300'
                }`}>
                    {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} /> : isActive ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div className="space-y-1">
                    <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] ${isActive ? 'text-white/50' : 'text-gray-400'}`}>
                        Stage 0{index + 1}
                    </p>
                    <h3 className={`text-[12px] md:text-[14px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-black'}`}>
                        {label}
                    </h3>
                </div>
                {isCompleted && (
                    <div className="ml-auto text-green-500">
                        <Sparkles size={18} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pt-20 md:pt-28 pb-32 font-outfit text-black relative">
            
            <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* LEFT SIDE: ANIMATED PROCESSING DASHBOARD (First on mobile) */}
                    <div className="lg:col-span-6 space-y-10 md:space-y-12 order-1">
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                {step < 4 ? 'Payment' : 'Order'} <span className="text-gray-200 block">{step < 4 ? 'Status' : 'Confirmed'}</span>
                            </h1>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.6em]">System Verified</p>
                        </div>

                        {/* LIVE STEPS */}
                        <div className="space-y-3 md:space-y-4">
                            <ProcessingStep index={0} label="Securing Payment" activeStep={step} icon={ShieldCheck} />
                            <ProcessingStep index={1} label="Inventory Verified" activeStep={step} icon={Package} />
                            <ProcessingStep index={2} label="Packaging Ready" activeStep={step} icon={ShoppingBag} />
                            <ProcessingStep index={3} label="Awaiting Pickup" activeStep={step} icon={Truck} />
                        </div>

                        {/* FINAL ACTION BUTTONS */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-6 transition-all duration-1000 ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                            <button 
                                onClick={downloadReceipt}
                                className="flex-1 flex items-center justify-center gap-4 py-5 md:py-6 bg-black text-white rounded-2xl text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all active:scale-[0.98]"
                            >
                                <Download className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> Download PDF
                            </button>
                            <Link 
                                href="/products"
                                className="flex-1 flex items-center justify-center gap-4 py-5 md:py-6 border-2 border-black text-black rounded-2xl text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all active:scale-[0.98]"
                            >
                                Store <ArrowRight className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: THE AUTHENTIC SLIP (Second on mobile) */}
                    <div className="lg:col-span-6 flex justify-center lg:justify-end order-2">
                        <div className={`transition-all duration-1000 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div ref={slipRef} className="relative bg-white w-full max-w-[350px] min-h-[500px] flex flex-col text-black border border-gray-100">
                                
                                {/* SERRATED TOP */}
                                <div className="absolute -top-1 left-0 w-full h-2 flex gap-1 px-1 overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="min-w-[16px] h-4 bg-white rotate-45 -translate-y-2 border border-gray-100"></div>
                                    ))}
                                </div>

                                {/* PAID STAMP */}
                                <div className="absolute top-24 right-6 -rotate-[25deg] border-[3px] border-red-500/30 px-3 py-1 rounded-md pointer-events-none select-none z-10">
                                    <div className="border border-red-500/20 px-4 py-1">
                                        <p className="text-red-500/30 text-2xl font-black uppercase tracking-[0.2em] italic leading-none">PAID</p>
                                    </div>
                                </div>

                                {/* TOP BRANDING */}
                                <div className="bg-black p-10 flex flex-col items-center text-center space-y-4">
                                    <ShoppingBag size={28} className="text-white" />
                                    <div className="space-y-1">
                                        <h2 className="text-white text-[11px] font-black uppercase tracking-[0.8em]">ZARA INSPIRED</h2>
                                        <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.4em]">Official Store Receipt</p>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex-1 space-y-10 bg-white">
                                    {/* 1. TRANSACTION INFO */}
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1.5">
                                                <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Sent By</p>
                                                <p className="text-[12px] font-black text-black uppercase leading-none truncate w-32">{orderData.cardHolder}</p>
                                                <p className="text-[9px] font-bold text-gray-400 tracking-tight">{orderData.maskedCard}</p>
                                            </div>
                                            <div className="text-right space-y-1.5">
                                                <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Received By</p>
                                                <p className="text-[12px] font-black text-black uppercase leading-none">Zara Store</p>
                                                <p className="text-[9px] font-bold text-gray-400 tracking-tight">ID: #9921-OK</p>
                                            </div>
                                        </div>

                                        <div className="h-px w-full bg-gray-50"></div>

                                        <div className="grid grid-cols-2 gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            <div className="space-y-1">
                                                <span className="block text-gray-300 text-[7px]">Order Ref</span>
                                                <span>#{orderData.orderId}</span>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <span className="block text-gray-300 text-[7px]">Timestamp</span>
                                                <span>{orderData.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. ITEMS LIST */}
                                    <div className="space-y-5 pt-8 border-t border-gray-100">
                                        {orderData.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black text-gray-300">{item.quantity}x</span>
                                                    <p className="text-[10px] font-black text-black uppercase tracking-tight truncate w-36">{item.title}</p>
                                                </div>
                                                <p className="text-[11px] font-black text-black">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 3. TOTAL */}
                                    <div className="pt-10 border-t-2 border-black border-dashed">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-black">
                                                    <ShieldCheck size={14} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest">Verified</p>
                                                </div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{orderData.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1">Payable Total</p>
                                                <p className="text-4xl font-black text-black tracking-tighter leading-none">${orderData.total}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. BARCODE */}
                                    <div className="pt-10 flex flex-col items-center space-y-2 opacity-20">
                                        <div className="flex gap-0.5 h-8">
                                            {[...Array(40)].map((_, i) => (
                                                <div key={i} className={`bg-black ${i % 3 === 0 ? 'w-0.5' : i % 5 === 0 ? 'w-1.5' : 'w-px'}`}></div>
                                            ))}
                                        </div>
                                        <p className="text-[7px] font-black tracking-[0.5em]">ZARA-{orderData.orderId}-TX</p>
                                    </div>
                                </div>

                                {/* SERRATED BOTTOM */}
                                <div className="h-2 flex gap-1 px-1 overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="min-w-[16px] h-4 bg-white rotate-45 translate-y-1 border border-gray-100"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM LEGAL */}
                <div className="mt-20 text-center opacity-30 px-6">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 leading-relaxed italic">Zara Inspired Store • Digital Ownership Verified • Secure Archive Record</p>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccessPage;
