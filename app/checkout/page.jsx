"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ChevronLeft, CreditCard, Banknote, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_te" + "st_51TQntxHasuGpOGsbUTFtGXcXdTerUzfkBGfNeu5xmQw9O7z8FX8o1XNcxDius75M3yUDA7pfR4qFpBlcfv7cJTo000SGFrcAw9");

const FloatingInput = ({ label, name, value, onChange, type = "text", required = true }) => {
    return (
        <div className="relative group">
            <input 
                name={name}
                value={value}
                onChange={onChange}
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

const FloatingSelect = ({ label, name, value, onChange, options, required = true }) => {
    return (
        <div className="relative group">
            <select 
                name={name}
                value={value}
                onChange={onChange}
                required={required}
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
        '.Tab': {
            display: 'flex !important',
            flexDirection: 'row !important',
            alignItems: 'center !important',
            justifyContent: 'center !important',
            gap: '8px !important',
            padding: '12px 16px !important',
        },
        '.TabIcon': {
            marginBottom: '0px !important',
            marginRight: '8px !important',
        },
        '.TabLabel': {
            marginTop: '0px !important',
            whiteSpace: 'nowrap !important',
            fontSize: '13px !important',
            fontWeight: '600 !important',
        }
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
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
        
        const total = getCartTotal();
        const orderId = Math.floor(100000 + Math.random() * 900000).toString();
        const now = new Date();
        
        const cardHolderName = (formData?.firstName && formData?.lastName) 
            ? `${formData.firstName} ${formData.lastName}` 
            : "Premium Customer";

        const latestOrder = {
            orderId,
            total,
            items: cartItems.map(item => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                thumbnail: item.thumbnail || item.images?.[0]
            })),
            date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            paymentMethod: 'Cash on Delivery',
            cardHolder: cardHolderName,
            maskedCard: 'CASH ON DELIVERY',
            receivedBy: 'ZARA INSPIRED STORE'
        };

        localStorage.setItem('latestOrder', JSON.stringify(latestOrder));

        setTimeout(() => {
            setLoading(false);
            window.location.href = '/order-success';
        }, 1500);
    };

    // EMPTY CART
    if (!isOrdered && cartItems.length === 0) {
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
                            const total = getCartTotal();
                            const orderId = Math.floor(100000 + Math.random() * 900000).toString();
                            const now = new Date();
                            
                            // Explicitly get name from formData state
                            const currentName = (formData?.firstName && formData?.lastName) 
                                ? `${formData.firstName} ${formData.lastName}` 
                                : "Premium Customer";
                            
                            console.log("Saving Order Data:", { orderId, total, currentName });

                            const latestOrder = {
                                orderId,
                                total,
                                items: cartItems.map(item => ({
                                    title: item.title,
                                    price: item.price,
                                    quantity: item.quantity,
                                    thumbnail: item.thumbnail || item.images?.[0]
                                })),
                                date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                paymentMethod: 'Card Payment',
                                cardHolder: currentName,
                                maskedCard: '**** **** **** 4242',
                                receivedBy: 'ZARA INSPIRED STORE'
                            };

                            localStorage.setItem('latestOrder', JSON.stringify(latestOrder));
                            window.location.href = '/order-success';
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
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b border-gray-100 pb-10 gap-8">
                    <div className="w-full md:w-auto flex justify-start">
                        <Link href="/cart" className="btn-animate flex items-center gap-3 px-8 py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-full shadow-lg">
                            <ChevronLeft size={16} /> Back to Bag
                        </Link>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black text-center md:absolute md:left-1/2 md:-translate-x-1/2">Checkout</h2>
                    <div className="hidden md:block w-32">
                        {/* Spacer for symmetry on desktop */}
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
                                    <FloatingInput label="Your First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                    <FloatingInput label="Your Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                    <div className="md:col-span-2">
                                        <FloatingInput label="Global Shipping Address" name="address" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <FloatingSelect label="City / Region" options={cities} name="city" value={formData.city} onChange={handleInputChange} />
                                    <FloatingInput label="Active Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* PAYMENT */}
                            <div className="space-y-8">
                                <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-black/30">Step 02 / Payment Mode</p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-5 border transition-all rounded-2xl ${paymentMethod === 'card' ? 'border-black bg-black text-white shadow-xl scale-[1.02]' : 'border-gray-100 bg-white text-gray-400 hover:border-black'}`}
                                    >
                                        <CreditCard size={20} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Card Payment</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-5 border transition-all rounded-2xl ${paymentMethod === 'cod' ? 'border-black bg-black text-white shadow-xl scale-[1.02]' : 'border-gray-100 bg-white text-gray-400 hover:border-black'}`}
                                    >
                                        <Banknote size={20} />
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Cash on Delivery</span>
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
                                        className="w-full md:w-auto md:min-w-[280px] btn-animate px-10 py-3.5 bg-black text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 rounded-full"
                                    >
                                        {loading ? 'Processing...' : 'Pay Now'}
                                        {!loading && <ArrowRight size={16} />}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* RIGHT: SUMMARY (INVOICE STYLE) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-white border border-gray-100 p-10 space-y-10 rounded-[32px] shadow-sm">
                            <div className="space-y-2 text-center pb-6 border-b border-gray-50">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black">Order Summary</h3>
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Premium Logistics & Secure Checkout</p>
                            </div>
                            
                            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-5 group">
                                        <div className="w-16 h-20 bg-[#F9F9F9] overflow-hidden flex-shrink-0 rounded-xl border border-gray-50">
                                            <img src={item.thumbnail || item.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <p className="text-[10px] font-black text-black uppercase tracking-tight leading-tight">{item.title}</p>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty {item.quantity}</span>
                                                <span className="text-[12px] font-black text-black">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-50">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    <span>Subtotal</span>
                                    <span className="text-black font-black">${getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-black">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    <span>Taxes</span>
                                    <span className="text-black font-black">$0.00</span>
                                </div>
                                
                                <div className="pt-8 mt-6 border-t border-black">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-black">Total Amount</span>
                                            <span className="block text-[8px] font-bold text-gray-300 uppercase tracking-widest">All inclusive</span>
                                        </div>
                                        <span className="text-4xl font-black text-black tracking-tighter leading-none">${getCartTotal()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TRUST BADGE (MOVED HERE) */}
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 text-black">
                                <ShieldCheck size={18} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Payment</span>
                            </div>
                            <div className="flex items-center gap-4 w-full text-gray-100">
                                <div className="h-px flex-1 bg-gray-100"></div>
                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-200 text-center">Your security is our priority</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
