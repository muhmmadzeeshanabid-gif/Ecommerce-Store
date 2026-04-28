"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ChevronLeft, CreditCard, Banknote, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_te" + "st_51TQntxHasuGpOGsbUTFtGXcXdTerUzfkBGfNeu5xmQw9O7z8FX8o1XNcxDius75M3yUDA7pfR4qFpBlcfv7cJTo000SGFrcAw9");

const FloatingInput = ({ label, type = "text", required = true }) => {
    return (
        <div className="relative group">
            <input 
                required={required}
                type={type}
                placeholder=" "
                className="block px-6 py-5 w-full text-[13px] font-medium text-black bg-white border border-gray-100 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-all duration-300 rounded-lg"
            />
            <label className="absolute text-[11px] font-black text-gray-300 uppercase tracking-widest duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-4 pointer-events-none">
                {label}
            </label>
        </div>
    );
};

const FloatingSelect = ({ label, options, required = true }) => {
    return (
        <div className="relative group">
            <select 
                required={required}
                defaultValue=""
                className="block px-6 py-5 w-full text-[13px] font-medium text-black bg-white border border-gray-100 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-all duration-300 rounded-lg"
            >
                <option value="" disabled className="text-gray-200">Select City</option>
                {options.map((option, idx) => (
                    <option key={idx} value={option} className="text-black font-medium">{option}</option>
                ))}
            </select>
            <label className="absolute text-[11px] font-black text-gray-300 uppercase tracking-widest duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-4 pointer-events-none">
                {label}
            </label>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <ChevronLeft size={16} className="-rotate-90" />
            </div>
        </div>
    );
};

const STRIPE_APPEARANCE = {
    theme: 'stripe',
    variables: {
        colorPrimary: '#000000',
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '10px',
        fontSizeBase: '14px',
    },
    rules: {
        '.Input': {
            border: '1.5px solid #d1d5db',
            boxShadow: 'none',
            padding: '12px 14px',
            backgroundColor: '#ffffff',
        },
        '.Input:focus': {
            border: '1.5px solid #000000',
            boxShadow: '0 0 0 1px #000000',
        },
        '.Label': {
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#374151',
            marginBottom: '6px',
        },
    }
};

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isOrdered, setIsOrdered] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const intentCreated = React.useRef(false);

    React.useEffect(() => {
        const total = getCartTotal();
        console.log("CheckoutPage: useEffect triggered. Total:", total, "Intent already created:", intentCreated.current);
        
        if (total > 0 && !intentCreated.current) {
            console.log("CheckoutPage: Creating Payment Intent for amount:", total);
            intentCreated.current = true;
            
            fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            })
            .then(async (res) => {
                const data = await res.json();
                console.log("CheckoutPage: API Response status:", res.status);
                if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
                return data;
            })
            .then((data) => {
                if (data.clientSecret) {
                    console.log("CheckoutPage: Received clientSecret successfully");
                    setClientSecret(data.clientSecret);
                } else {
                    console.log("CheckoutPage: No clientSecret in response data");
                    throw new Error('No client secret received from server');
                }
            })
            .catch((err) => {
                console.error("CheckoutPage: Error in payment flow:", err);
                intentCreated.current = false;
                setPaymentError(err.message);
            });
        } else if (total <= 0) {
            console.log("CheckoutPage: Total is 0, waiting for cart items...");
        }
    }, [cartItems]); // Using only cartItems for stable dependency size

    const cities = [
        "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", 
        "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Bahawalpur"
    ];

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsOrdered(true);
            clearCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    };

    // ORDER CONFIRMED
    if (isOrdered) {
        return (
            <div className="bg-white min-h-[85vh] flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-10">
                    <div className="w-16 h-16 border border-black rounded-full flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-black" strokeWidth={1} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-light text-black uppercase tracking-[0.3em]">Order Confirmed</h1>
                        <p className="text-[12px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                            Thank you for your purchase. We have received your order and are preparing it for shipment.
                        </p>
                    </div>
                    <div className="w-full h-px bg-gray-50"></div>
                    <div className="space-y-6 w-full">
                        <Link href="/products" className="btn-animate block w-full py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg">
                            Continue Shopping
                        </Link>
                        <Link href="/" className="block text-[9px] font-black uppercase tracking-[0.3em] text-black hover:text-gray-400 transition-colors">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // EMPTY CART
    if (cartItems.length === 0) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-40 font-outfit flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    <p className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Your cart is empty</p>
                    <Link href="/products" className="btn-animate inline-block px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // RENDER CARD PAYMENT SECTION
    const renderCardPayment = () => {
        if (clientSecret) {
            return (
                <Elements 
                    stripe={stripePromise} 
                    options={{ 
                        clientSecret,
                        appearance: STRIPE_APPEARANCE,
                        loader: 'never',
                    }}
                >
                    <StripePaymentForm 
                        amount={getCartTotal()} 
                        onSuccess={() => {
                            setIsOrdered(true);
                            clearCart();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onLoading={setLoading}
                    />
                </Elements>
            );
        }
        
        if (paymentError) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center px-4">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-red-500 mb-2">Payment Error</p>
                    <p className="text-[10px] text-gray-400">{paymentError}</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center px-4">
                <Loader2 className="w-8 h-8 animate-spin text-gray-200 mb-4" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initializing Secure Gateway...</p>
            </div>
        );
    };

    // RENDER COD SECTION
    const renderCodPayment = () => {
        return (
            <div className="h-full p-10 bg-gray-50 border border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                    <Banknote size={32} className="text-black" />
                </div>
                <div className="space-y-3">
                    <p className="text-[16px] font-black uppercase tracking-widest text-black">Cash on Delivery Info</p>
                    <p className="text-[11px] font-medium text-gray-400 max-w-sm leading-relaxed uppercase tracking-widest">
                        You have chosen to pay upon receipt. Please prepare the total of <span className="text-black font-black">${getCartTotal()}</span> for when our concierge arrives.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-full text-[10px] font-black text-black uppercase tracking-[0.2em] shadow-sm">
                    <ShieldCheck size={16} className="text-green-500" />
                    Verified Transaction
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-40 font-outfit">
            <div className="container mx-auto px-6 lg:px-20 max-w-7xl">
                
                {/* NAV */}
                <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-10">
                    <Link href="/cart" className="btn-animate flex items-center gap-3 px-8 py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-full shadow-lg">
                        <ChevronLeft size={16} /> Bag
                    </Link>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">Checkout</h2>
                    <div className="hidden md:flex items-center gap-2">
                        <ShieldCheck size={18} className="text-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Encrypted Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT: FORM */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handlePlaceOrder} className="space-y-16">
                            
                            {/* SHIPPING */}
                            <div className="space-y-8">
                                <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-black/30">Step 01 / Shipping Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FloatingInput label="Your First Name" />
                                    <FloatingInput label="Your Last Name" />
                                    <div className="md:col-span-2">
                                        <FloatingInput label="Global Shipping Address" />
                                    </div>
                                    <FloatingSelect label="City / Region" options={cities} />
                                    <FloatingInput label="Active Phone Number" />
                                </div>
                            </div>

                            {/* PAYMENT */}
                            <div className="space-y-8">
                                <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-black/30">Step 02 / Payment Mode</p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-8 border transition-all rounded-2xl ${paymentMethod === 'card' ? 'border-black bg-black text-white shadow-2xl scale-[1.02]' : 'border-gray-100 bg-white text-gray-400 hover:border-black'}`}
                                    >
                                        <CreditCard size={24} />
                                        <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none">Card Payment</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-8 border transition-all rounded-2xl ${paymentMethod === 'cod' ? 'border-black bg-black text-white shadow-2xl scale-[1.02]' : 'border-gray-100 bg-white text-gray-400 hover:border-black'}`}
                                    >
                                        <Banknote size={24} />
                                        <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none">Cash on Delivery</span>
                                    </button>
                                </div>

                                {/* PAYMENT CONTENT */}
                                <div className="min-h-[300px] mt-8">
                                    {paymentMethod === 'card' ? renderCardPayment() : renderCodPayment()}
                                </div>
                            </div>

                            {/* COD Submit */}
                            {paymentMethod === 'cod' && (
                                <div className="flex justify-center pt-10">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="btn-animate px-14 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 rounded-full w-full md:w-auto"
                                    >
                                        {loading ? 'Processing...' : 'Place Order Now'}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-white border border-gray-100 p-12 space-y-12 rounded-3xl shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 border-b border-gray-50 pb-8 text-center">Summary</h3>
                            
                            <div className="space-y-8 max-h-[300px] overflow-y-auto no-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-20 h-28 bg-gray-50 overflow-hidden flex-shrink-0 rounded-xl">
                                            <img src={item.thumbnail || item.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <p className="text-[11px] font-black text-black uppercase leading-[1.1] tracking-tight">{item.title}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{item.brand}</p>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-[10px] text-gray-400 font-bold">QTY {item.quantity}</span>
                                                <span className="text-[13px] font-black text-black">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-50">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-black">${getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Logistics</span>
                                    <span className="text-green-500 font-black">Free</span>
                                </div>
                                <div className="flex justify-between items-center pt-8 mt-6 border-t border-black">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Final Due</span>
                                    <span className="text-4xl font-black text-black tracking-tighter">${getCartTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
