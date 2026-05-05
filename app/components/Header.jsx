"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Mail, Lock, ChevronDown, Heart, Eye, EyeOff, LogOut, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';

const Header = () => {
  const pathname = usePathname();
  const { getCartCount, wishlistItems } = useCart();
  const { user, login, signup, signInWithGoogle, logout, showAuthModal, openAuthModal, closeAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await fetchApi('/api/categories');
        setCategories(data);
      } catch (err) { console.error(err); }
    };
    fetchCats();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(""); setIsAuthLoading(true);
    try {
      if (isSignUp) await signup(e.target.email.value, e.target.password.value, e.target.name.value);
      else await login(e.target.email.value, e.target.password.value);
      closeAuthModal();
    } catch (err) { 
      // Firebase error messages ko user-friendly banao
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") setAuthError("No account found. Please sign up first.");
      else if (code === "auth/wrong-password") setAuthError("Incorrect password.");
      else if (code === "auth/email-already-in-use") setAuthError("Email already registered. Please login.");
      else if (code === "auth/weak-password") setAuthError("Password must be at least 6 characters.");
      else if (code === "auth/invalid-email") setAuthError("Invalid email address.");
      else setAuthError(err.message);
    }
    finally { setIsAuthLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(""); setIsAuthLoading(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError("Google sign-in failed. Please try again.");
      }
    }
    finally { setIsAuthLoading(false); }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-gray-100 h-20 flex items-center font-inter text-black">
      <nav className="container mx-auto px-6 lg:px-20 flex items-center justify-between">
        
        {/* LOGO: Keep the refined style */}
        <div className="flex-1">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-playfair italic font-black tracking-tighter uppercase">
              Zara
            </span>
          </Link>
        </div>

        {/* NAVIGATION: Revert to simple links */}
        <ul className={`flex list-none flex-col md:flex-row gap-8 md:gap-10 fixed md:static top-20 md:top-0 left-0 w-full md:w-auto h-[calc(100vh-80px)] md:h-auto bg-white md:bg-transparent items-start md:items-center justify-start md:justify-center pt-8 md:pt-0 px-8 md:px-0 transition-all duration-300 z-[1500] ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:flex'}`}>
          <li className="flex items-center">
            <Link href="/" className="text-[12px] uppercase tracking-[0.2em] font-bold hover:text-zinc-400 transition-colors py-2">Home</Link>
          </li>
          <li className="relative group flex items-center" onMouseEnter={() => window.innerWidth > 768 && setIsDropdownOpen(true)} onMouseLeave={() => window.innerWidth > 768 && setIsDropdownOpen(false)}>
             <button className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] font-bold hover:text-zinc-400 transition-colors py-2 outline-none">
              Categories <ChevronDown size={14} className="opacity-50" />
             </button>
             {isDropdownOpen && (
               <div className="absolute top-full left-0 pt-4 w-64 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="bg-white shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-zinc-50 p-6">
                   <div className="flex flex-col gap-4">
                     {categories.map(cat => (
                       <Link 
                         key={cat.id} 
                         href={`/categories/${cat.slug}`} 
                         className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors whitespace-nowrap"
                       >
                         {cat.name}
                       </Link>
                     ))}
                   </div>
                 </div>
               </div>
             )}
          </li>
          <li className="flex items-center">
            <Link href="/products" className="text-[12px] uppercase tracking-[0.2em] font-bold hover:text-zinc-400 transition-colors py-2">Latest</Link>
          </li>
          <li className="flex items-center">
            <Link href="#footer" className="text-[12px] uppercase tracking-[0.2em] font-bold hover:text-zinc-400 transition-colors py-2">Contact</Link>
          </li>
        </ul>

        {/* ACTIONS: Simplified Icons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <Link href="/wishlist" className="relative text-black hover:text-zinc-400 transition-colors">
            <Heart size={20} strokeWidth={1.5} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative text-black hover:text-zinc-400 transition-colors">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
          <button className="group" onClick={openAuthModal}>
            <div className="flex items-center justify-center w-9 h-9 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all border border-gray-100 overflow-hidden">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || ""} width={36} height={36} className="rounded-full object-cover" />
              ) : user ? (
                <span className="text-[14px] font-medium uppercase">{user.displayName ? user.displayName[0] : user.email[0]}</span>
              ) : (
                <User size={18} strokeWidth={1.5} />
              )}
            </div>
          </button>
          <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4" onClick={closeAuthModal}>
           <div className="bg-white w-full max-w-[420px] shadow-2xl p-10 relative rounded-[40px] overflow-hidden" onClick={e => e.stopPropagation()}>
             <button className="absolute top-8 right-8 text-zinc-300 hover:text-black" onClick={closeAuthModal}><X size={24} /></button>
             {user ? (
               /* ===== LOGGED-IN VIEW ===== */
               <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                 <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-medium mx-auto shadow-2xl overflow-hidden">
                   {user.photoURL ? (
                     <Image src={user.photoURL} alt={user.displayName || ""} width={96} height={96} className="object-cover" />
                   ) : (
                     user.displayName ? user.displayName[0] : user.email[0]
                   )}
                 </div>
                 <div className="space-y-1">
                   <p className="text-lg font-medium uppercase tracking-tight">{user.displayName || "User"}</p>
                   <p className="text-[11px] font-medium text-zinc-400 tracking-wide">{user.email}</p>
                 </div>
                 <button onClick={() => { logout(); closeAuthModal(); }} className="w-full bg-black text-white py-5 text-[11px] font-medium uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
                   <LogOut size={16} />
                   Logout
                 </button>
               </div>
             ) : (
               /* ===== AUTH FORM VIEW ===== */
               <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <h4 className="text-2xl font-medium uppercase tracking-[0.2em] text-black">{isSignUp ? "Create Account" : "Welcome Back"}</h4>
                  <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">{isSignUp ? "Join the Zara experience" : "Sign in to continue"}</p>
                  
                  {/* Email/Password Form */}
                  <form onSubmit={handleAuth} className="space-y-4 text-left">
                     {isSignUp && <input type="text" name="name" placeholder="Full Name" className="w-full bg-gray-50 p-5 text-[13px] font-medium outline-none rounded-2xl focus:ring-2 focus:ring-black/10 transition-all placeholder:text-zinc-300 placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest" required />}
                     <input type="email" name="email" placeholder="Email Address" className="w-full bg-gray-50 p-5 text-[13px] font-medium outline-none rounded-2xl focus:ring-2 focus:ring-black/10 transition-all placeholder:text-zinc-300 placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest" required />
                     <div className="relative">
                         <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full bg-gray-50 p-5 pr-14 text-[13px] font-medium outline-none rounded-2xl focus:ring-2 focus:ring-black/10 transition-all placeholder:text-zinc-300 placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest" required minLength={6} />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                     </div>
                     {authError && <div className="text-[10px] font-medium text-red-500 uppercase tracking-widest px-2 animate-in fade-in duration-300">⚠ {authError}</div>}
                     <button type="submit" disabled={isAuthLoading} className="w-full bg-black text-white py-5 text-[11px] font-medium uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:bg-neutral-800 transition-all disabled:opacity-50">{isAuthLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}</button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-[1.5px] bg-zinc-200"></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Or</span>
                    <div className="flex-1 h-[1.5px] bg-zinc-200"></div>
                  </div>

                  {/* Google Sign-In Button */}
                  <button 
                    onClick={handleGoogleSignIn} 
                    disabled={isAuthLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl hover:border-black hover:shadow-lg transition-all group"
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-600 group-hover:text-black">Continue with Google</span>
                  </button>

                  {/* Toggle + Footer */}
                  <div className="flex items-center justify-center pt-4 border-t border-gray-50">
                     <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }} className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                       {isSignUp ? "Already have an account? Login" : "New here? Create Account"}
                     </button>
                  </div>
               </div>
             )}
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;
