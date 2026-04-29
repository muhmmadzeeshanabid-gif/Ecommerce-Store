"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Mail, Lock, ChevronDown, Heart, Eye, EyeOff, Fingerprint, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';

const Header = () => {
  const pathname = usePathname();
  const { getCartCount, wishlistItems } = useCart();
  const { user, login, signup, logout, showAuthModal, openAuthModal, closeAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  
  // Advanced Animation States
  const [showBioOverlay, setShowBioOverlay] = useState(false);
  const [bioMode, setBioMode] = useState('login');
  const [bioProgress, setBioProgress] = useState(0);
  const [bioStatus, setBioStatus] = useState("");
  const [isHolding, setIsHolding] = useState(false);
  const [isHardwareVerified, setIsHardwareVerified] = useState(false);
  
  const holdInterval = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await fetchApi('/api/categories');
        setCategories(data);
      } catch (err) { console.error(err); }
    };
    fetchCats();

    if (window.PublicKeyCredential) {
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
            .then(available => setIsBiometricSupported(available))
            .catch(() => setIsBiometricSupported(false));
    }
  }, []);

  // HOLD LOGIC
  const startHolding = () => {
    if (!isHardwareVerified) return;
    setIsHolding(true);
    setBioStatus("Syncing Biometric Data...");
    
    holdInterval.current = setInterval(() => {
        setBioProgress(prev => {
            if (prev >= 100) {
                clearInterval(holdInterval.current);
                return 100;
            }
            return prev + 1.5; // Smooth slow filling
        });
    }, 50);
  };

  const stopHolding = () => {
    setIsHolding(false);
    if (bioProgress < 100) {
        setBioStatus("Paused. Hold to continue.");
        clearInterval(holdInterval.current);
    }
  };

  useEffect(() => {
    if (bioProgress >= 100) {
        handleFinalSuccess();
    }
  }, [bioProgress]);

  const handleFinalSuccess = async () => {
      clearInterval(holdInterval.current);
      setBioStatus("Synchronization Complete.");
      
      if (bioMode === 'register' && user) {
          setAuthSuccess("Fingerprint Secured.");
          setTimeout(() => setShowBioOverlay(false), 1500);
      } else if (bioMode === 'login') {
          // Final login logic...
          const passkeys = JSON.parse(localStorage.getItem('zara_passkeys_real') || '[]');
          const lastUserKey = passkeys[passkeys.length - 1]; // Mocking the match
          const users = JSON.parse(localStorage.getItem('zara_users') || '[]');
          const foundUser = users.find(u => u.email === lastUserKey.userEmail);
          if (foundUser) {
              await login(foundUser.email, foundUser.password);
              setAuthSuccess("Access Authorized.");
              setTimeout(() => { setShowBioOverlay(false); closeAuthModal(); }, 1500);
          }
      }
  };

  const registerRealBiometric = async () => {
    if (!user) return;
    try {
        setAuthError(""); setAuthSuccess("");
        setShowBioOverlay(true);
        setBioMode('register');
        setBioStatus("Awaiting Hardware Touch...");
        setBioProgress(0);
        setIsHardwareVerified(false);

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userID = Uint8Array.from(user.email, c => c.charCodeAt(0));

        const publicKeyCredentialCreationOptions = {
            challenge: challenge,
            rp: { name: "Zara Inspired Store", id: window.location.hostname },
            user: { id: userID, name: user.email, displayName: user.displayName || user.email },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" }
        };

        const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });

        if (credential) {
            setIsHardwareVerified(true);
            setBioStatus("Hardware Verified. Now HOLD the screen icon to Sync.");
            const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
            const passkeys = JSON.parse(localStorage.getItem('zara_passkeys_real') || '[]');
            passkeys.push({ userEmail: user.email, credentialId: credentialId, registeredAt: new Date().toISOString() });
            localStorage.setItem('zara_passkeys_real', JSON.stringify(passkeys));
        }
    } catch (err) {
        setShowBioOverlay(false);
        setAuthError("Registration canceled.");
    }
  };

  const loginWithRealBiometric = async () => {
    try {
        setAuthError(""); setAuthSuccess("");
        const passkeys = JSON.parse(localStorage.getItem('zara_passkeys_real') || '[]');
        if (passkeys.length === 0) throw new Error("No Biometric ID found.");

        setShowBioOverlay(true);
        setBioMode('login');
        setBioStatus("Awaiting Hardware Identification...");
        setBioProgress(0);
        setIsHardwareVerified(false);

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const publicKeyCredentialRequestOptions = {
            challenge: challenge,
            allowCredentials: passkeys.map(pk => ({ id: Uint8Array.from(atob(pk.credentialId), c => c.charCodeAt(0)), type: 'public-key' })),
            userVerification: 'required'
        };

        const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

        if (assertion) {
            setIsHardwareVerified(true);
            setBioStatus("Identity Confirmed. HOLD the screen icon to Finish Login.");
        }
    } catch (err) {
        setShowBioOverlay(false);
        setAuthError(err.message || "Recognition failed.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setIsAuthLoading(true);
    try {
      if (isSignUp) await signup(e.target.email.value, e.target.password.value, e.target.name.value, []);
      else await login(e.target.email.value, e.target.password.value);
      closeAuthModal();
    } catch (err) { setAuthError(err.message); }
    finally { setIsAuthLoading(false); }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-gray-200 h-20 flex items-center font-outfit text-black">
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-2xl font-black tracking-[0.2em] uppercase">ZARA</Link>
        </div>

        <ul className={`flex list-none flex-col md:flex-row gap-8 md:gap-10 fixed md:static top-20 md:top-0 left-0 w-full md:w-auto h-[calc(100vh-80px)] md:h-auto bg-black md:bg-transparent items-start md:items-center justify-start md:justify-center pt-8 md:pt-0 px-8 md:px-0 transition-all duration-300 z-[1500] ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:flex'}`}>
          <li><Link href="/" className="text-xs uppercase tracking-wider font-bold">Home</Link></li>
          <li className="relative group" onMouseEnter={() => window.innerWidth > 768 && setIsDropdownOpen(true)} onMouseLeave={() => window.innerWidth > 768 && setIsDropdownOpen(false)}>
             <button className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">Categories <ChevronDown size={12} /></button>
             {isDropdownOpen && <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white border border-gray-100 shadow-xl p-6"><div className="flex flex-col gap-3">{categories.map(cat => <Link key={cat.id} href={`/categories/${cat.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">{cat.name}</Link>)}</div></div>}
          </li>
          <li><Link href="/products" className="text-xs uppercase tracking-wider font-bold">Latest</Link></li>
          <li><Link href="/contact" className="text-xs uppercase tracking-wider font-bold">Contact Us</Link></li>
        </ul>

        <div className="flex-1 flex items-center justify-end gap-6">
          <Link href="/wishlist" className="relative"><Heart size={20} strokeWidth={1.5} /></Link>
          <Link href="/cart" className="relative"><ShoppingCart size={20} strokeWidth={1.5} />{getCartCount() > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{getCartCount()}</span>}</Link>
          <button className="group" onClick={openAuthModal}>
            <div className="flex items-center justify-center w-9 h-9 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all border border-gray-100 overflow-hidden">
              {user ? <span className="text-[14px] font-black uppercase">{user.displayName ? user.displayName[0] : user.email[0]}</span> : <User size={18} strokeWidth={1.5} />}
            </div>
          </button>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4" onClick={closeAuthModal}>
           <div className="bg-white w-full max-w-[420px] shadow-2xl p-10 relative rounded-[40px] overflow-hidden" onClick={e => e.stopPropagation()}>
             <button className="absolute top-8 right-8 text-gray-300 hover:text-black" onClick={closeAuthModal}><X size={24} /></button>
             {user ? (
               <div className="space-y-10 text-center animate-in fade-in zoom-in-95 duration-500">
                 <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-black mx-auto shadow-2xl">{user.displayName ? user.displayName[0] : user.email[0]}</div>
                 <div className="space-y-4">
                    {isBiometricSupported && (
                        <button onClick={registerRealBiometric} className="w-full flex items-center justify-center gap-4 py-5 bg-gray-50 border border-gray-100 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-black hover:text-white transition-all group">
                            <Fingerprint size={20} className="group-hover:animate-pulse" /> Register Hardware ID
                        </button>
                    )}
                    <button onClick={() => logout()} className="w-full bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-xl">Logout</button>
                 </div>
               </div>
             ) : (
                  <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                     <h4 className="text-2xl font-black uppercase tracking-[0.2em] text-black">Authentication</h4>
                     <form onSubmit={handleAuth} className="space-y-4 text-left">
                        {isSignUp && <input type="text" name="name" placeholder="Full Name" className="w-full bg-gray-50 p-5 text-[12px] font-medium uppercase tracking-widest outline-none rounded-2xl" required />}
                        <input type="email" name="email" placeholder="Email Address" className="w-full bg-gray-50 p-5 text-[12px] font-medium uppercase tracking-widest outline-none rounded-2xl" required />
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full bg-gray-50 p-5 pr-14 text-[12px] font-medium uppercase tracking-widest outline-none rounded-2xl" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>
                        {authError && <div className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2">* {authError}</div>}
                        <button type="submit" className="w-full bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl">{isSignUp ? "Sign Up" : "Sign In"}</button>
                     </form>
                     <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">{isSignUp ? "Login" : "Register"}</button>
                        <div className="flex items-center gap-4">
                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Forgot?</button>
                            {isBiometricSupported && (
                                <button onClick={loginWithRealBiometric} className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl group">
                                    <Fingerprint size={22} />
                                </button>
                            )}
                        </div>
                     </div>
                  </div>
             )}
           </div>
        </div>
      )}

      {/* ADVANCED HOLD-TO-SCAN OVERLAY */}
      {showBioOverlay && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-700">
            <div className="text-center space-y-12 max-w-sm px-6">
                <div className="relative w-56 h-56 mx-auto">
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-spin-slow"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <Fingerprint size={100} className="text-white/5" />
                            <div className="absolute inset-0 text-white overflow-hidden transition-all duration-300 ease-out" style={{ clipPath: `inset(${100 - bioProgress}% 0 0 0)` }}>
                                <Fingerprint size={100} />
                            </div>
                        </div>
                    </div>
                    
                    {/* HOLD BUTTON OVERLAY */}
                    <button 
                        onMouseDown={startHolding}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        onTouchStart={startHolding}
                        onTouchEnd={stopHolding}
                        disabled={!isHardwareVerified || bioProgress >= 100}
                        className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-500 z-50 ${isHardwareVerified ? 'cursor-pointer' : 'cursor-wait opacity-20'}`}
                    >
                        <div className={`w-full h-full rounded-full transition-all duration-500 ${isHolding ? 'bg-white/5 scale-110 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : ''}`}></div>
                    </button>

                    {isHolding && bioProgress < 100 && (
                        <div className="absolute left-0 w-full h-1 bg-white shadow-[0_0_30px_#fff] animate-scan-line z-10" style={{ top: `${bioProgress}%` }}></div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-3xl font-black uppercase tracking-[0.5em] text-white">
                            {bioProgress === 100 ? "Verified" : (isHardwareVerified ? (isHolding ? "Syncing" : "HOLD ICON") : "HARDWARE")}
                        </h3>
                        <p className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${isHolding ? 'text-white' : 'text-white/40'}`}>
                            {bioStatus}
                        </p>
                    </div>

                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_20px_#fff]" style={{ width: `${bioProgress}%` }}></div>
                    </div>
                </div>

                {!isHardwareVerified && (
                    <div className="flex items-center justify-center gap-3 text-yellow-400 animate-pulse">
                        <AlertCircle size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Touch Physical Sensor First</span>
                    </div>
                )}

                {bioProgress === 0 && !isHolding && (
                    <button onClick={() => setShowBioOverlay(false)} className="px-10 py-4 border border-white/20 text-white/50 text-[9px] font-black uppercase tracking-widest rounded-full hover:text-white transition-all">Cancel</button>
                )}
            </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan-line { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan-line { animation: scan-line 2s infinite linear; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s infinite linear; }
      `}</style>
    </header>
  );
};

export default Header;
