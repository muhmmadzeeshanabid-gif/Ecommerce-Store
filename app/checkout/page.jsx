'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ChevronLeft, 
    ArrowRight, 
    CreditCard, 
    ShieldCheck, 
    ChevronRight,
    Loader2,
    Banknote
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';

// Initialize Stripe with the environment variable
const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PK);

const FloatingInput = ({ label, name, value, onChange, error }) => {
    return (
        <div className="relative group">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder=" "
                className={`block px-6 py-5 w-full text-[15px] font-medium text-black bg-white border appearance-none focus:outline-none focus:ring-0 peer transition-all duration-300 rounded-2xl ${error ? 'border-red-400 focus:border-red-500' : 'border-neutral-100 focus:border-black'}`}
            />
            <label className="absolute text-[11px] font-bold text-zinc-500 uppercase tracking-widest duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-4 pointer-events-none">
                {label}
            </label>
            {error && <p className="text-[9px] font-medium text-red-400 uppercase tracking-widest mt-1.5 pl-2">{error}</p>}
        </div>
    );
};

const FloatingSelect = ({ label, options, name, value, onChange, error }) => {
    return (
        <div className="relative group">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`block px-6 py-5 w-full text-[15px] font-medium text-black bg-white border appearance-none focus:outline-none focus:ring-0 peer transition-all duration-300 rounded-2xl ${error ? 'border-red-400 focus:border-red-500' : 'border-neutral-100 focus:border-black'}`}
            >
                <option value="" disabled className="text-zinc-200">Select City</option>
                {options.map((option, idx) => (
                    <option key={idx} value={option} className="text-black font-medium">{option}</option>
                ))}
            </select>
            <label className="absolute text-[11px] font-bold text-zinc-500 uppercase tracking-widest duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-4 pointer-events-none">
                {label}
            </label>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-300">
                <ChevronLeft size={16} className="-rotate-90" />
            </div>
            {error && <p className="text-[9px] font-medium text-red-400 uppercase tracking-widest mt-1.5 pl-2">{error}</p>}
        </div>
    );
};

export default function CheckoutPage() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentError, setPaymentError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phone: ''
    });

    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot'];

    const [hasFetchedSecret, setHasFetchedSecret] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
            return;
        }

        // Only fetch if we need card payment and haven't fetched yet
        if (paymentMethod === 'card' && !hasFetchedSecret) {
            const total = getCartTotal();
            console.log("Initializing secure gateway via local API for amount:", total);
            
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: total })
            })
            .then(res => {
                console.log("Local API response status:", res.status);
                // Check if response is JSON
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        console.error("Received non-JSON response:", text);
                        throw new Error("Server returned non-JSON response");
                    });
                }
            })
            .then(data => {
                console.log("Local API data received:", data);
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setHasFetchedSecret(true);
                } else {
                    setPaymentError(data.error || 'Invalid response from payment server.');
                }
            })
            .catch(err => {
                console.error('Payment intent error:', err);
                setPaymentError('Failed to initialize secure gateway.');
            });
        }
    }, [cartItems, getCartTotal, router, paymentMethod, hasFetchedSecret]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep1 = () => {
        const errors = {};
        const fields = ['firstName', 'lastName', 'address', 'city', 'phone'];
        for (const field of fields) {
            if (!formData[field]) {
                errors[field] = 'This field is required';
                setFieldErrors(errors);
                const element = document.getElementsByName(field)[0];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        if (!validateStep1()) return;
        setLoading(true);

        if (paymentMethod === 'cod') {
            // Handle COD directly
            setTimeout(() => {
                clearCart();
                router.push('/order-success');
            }, 1500);
        }
    };

    const shippingInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        address: {
            line1: formData.address,
            city: formData.city,
            country: 'PK',
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-40 font-inter flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    <p className="text-[14px] font-medium uppercase tracking-widest text-zinc-400">Your cart is empty</p>
                    <Link href="/products" className="btn-animate inline-block px-10 py-5 bg-black text-white text-[10px] font-medium uppercase tracking-[0.3em] rounded-full shadow-lg">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }



    const renderCodPayment = () => {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                <div className="p-8 bg-zinc-50/50 border border-zinc-100 rounded-[24px] flex items-start gap-6">
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Banknote size={24} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[14px] font-medium uppercase tracking-widest text-black">Cash on Delivery</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs uppercase tracking-widest">
                            Pay when your package arrives at your doorstep. Please ensure you have <span className="text-black font-medium">${getCartTotal()}</span> ready.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-6 bg-black text-white text-[11px] font-medium uppercase tracking-[0.4em] rounded-full shadow-2xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-4"
                >
                    {loading ? "Confirming..." : "Confirm Order"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </div>
        );
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-40 font-inter">
            <div className="container mx-auto px-6 lg:px-20 max-w-7xl">
                
                <div className="flex flex-col items-center justify-center mb-8 md:mb-10 mt-4 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-playfair italic font-medium text-zinc-900 tracking-tight leading-none mb-4">
                        Secure Checkout
                    </h1>
                    <div className="flex items-center justify-center w-full max-w-sm gap-4 mb-4">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-400"></div>
                        <div className="w-2 h-2 rotate-45 bg-zinc-800 outline outline-offset-2 outline-1 outline-zinc-300"></div>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-400"></div>
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase">
                        Finalize Your Order
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT: FORM */}
                    <div className="lg:col-span-8">
                        <div className="space-y-10">
                            
                            {/* STEP 1: SHIPPING */}
                            <div className="bg-white border border-neutral-100 p-10 shadow-sm space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[14px] font-bold bg-black text-white shadow-xl hover:scale-110 transition-all duration-500 cursor-default group-hover:bg-zinc-800 animate-in fade-in zoom-in duration-1000">
                                        01
                                    </div>
                                    <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-black">Shipping Details</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FloatingInput label="Your First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={fieldErrors.firstName} />
                                    <FloatingInput label="Your Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={fieldErrors.lastName} />
                                    <div className="md:col-span-2">
                                        <FloatingInput label="Global Shipping Address" name="address" value={formData.address} onChange={handleInputChange} error={fieldErrors.address} />
                                    </div>
                                    <FloatingSelect label="City / Region" options={cities} name="city" value={formData.city} onChange={handleInputChange} error={fieldErrors.city} />
                                    <FloatingInput label="Active Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} error={fieldErrors.phone} />
                                </div>
                            </div>

                            {/* STEP 2: PAYMENT */}
                            <div className="bg-white border border-neutral-100 p-10 shadow-sm space-y-10">
                                <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[14px] font-bold bg-black text-white shadow-xl hover:scale-110 transition-all duration-500 cursor-default group-hover:bg-zinc-800 animate-in fade-in zoom-in duration-1000">
                                        02
                                    </div>
                                    <p className="text-[14px] font-medium uppercase tracking-[0.4em] text-black">Payment Method</p>
                                </div>

                                {/* Selection Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-6 border transition-all rounded-2xl ${paymentMethod === 'card' ? 'border-black bg-black text-white shadow-2xl scale-[1.02]' : 'border-neutral-100 bg-gray-50/50 text-zinc-400 hover:border-black hover:bg-white'}`}
                                    >
                                        <CreditCard size={20} />
                                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] leading-none">Card Payment</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex-1 flex items-center justify-center gap-4 py-6 border transition-all rounded-2xl ${paymentMethod === 'cod' ? 'border-black bg-black text-white shadow-2xl scale-[1.02]' : 'border-neutral-100 bg-gray-50/50 text-zinc-400 hover:border-black hover:bg-white'}`}
                                    >
                                        <Banknote size={20} />
                                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] leading-none">Cash on Delivery</span>
                                    </button>
                                </div>

                                <div className="p-2 min-h-[300px] pt-8 mt-8 border-t border-gray-50">
                                    {paymentMethod === 'card' ? (
                                        paymentError ? (
                                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center px-4">
                                                <p className="text-[12px] font-medium uppercase tracking-widest text-red-500 mb-2">Payment Error</p>
                                                <p className="text-[10px] text-zinc-400">{paymentError}</p>
                                            </div>
                                        ) : !clientSecret ? (
                                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center px-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-zinc-200 mb-4" />
                                                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Initializing Secure Gateway...</p>
                                            </div>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                    <StripePaymentForm 
                                                        clientSecret={clientSecret}
                                                        isStep1Complete={
                                                            formData.firstName && 
                                                            formData.lastName && 
                                                            formData.address && 
                                                            formData.city && 
                                                            formData.phone
                                                        }
                                                        onSuccess={() => {
                                                            clearCart();
                                                            router.push('/order-success');
                                                        }}
                                                        onLoading={setLoading}
                                                        onValidate={validateStep1}
                                                    />
                                                </Elements>
                                            </div>
                                        )
                                    ) : (
                                        renderCodPayment()
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-white border border-gray-100 p-10 space-y-10 shadow-sm">
                            <div className="space-y-2 text-center pb-6 border-b border-gray-50">
                                <h3 className="text-[11px] font-medium uppercase tracking-[0.4em] text-black">Order Summary</h3>
                                <p className="text-[9px] font-medium text-zinc-300 uppercase tracking-widest">Premium Logistics & Secure Checkout</p>
                            </div>
                            
                            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-5 group">
                                        <div className="relative w-16 h-20 bg-[#F9F9F9] overflow-hidden flex-shrink-0 rounded-xl border border-gray-100">
                                            <Image src={item.thumbnail || item.images?.[0]} alt={item.title} fill sizes="64px" quality={60} className="object-cover transition-transform group-hover:scale-110 duration-700" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <p className="text-[10px] font-medium text-black uppercase tracking-tight leading-tight">{item.title}</p>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-widest">Qty {item.quantity}</span>
                                                <span className="text-[12px] font-medium text-black">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-50">
                                <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em]">
                                    <span>Subtotal</span>
                                    <span className="text-black font-medium">${getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em]">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-medium">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em]">
                                    <span>Taxes</span>
                                    <span className="text-black font-medium">$0.00</span>
                                </div>
                                
                                <div className="pt-8 mt-6 border-t border-black">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-black">Total Amount</span>
                                            <span className="block text-[8px] font-medium text-zinc-300 uppercase tracking-widest">All inclusive</span>
                                        </div>
                                        <span className="text-4xl font-medium text-black tracking-tighter leading-none">${getCartTotal()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
