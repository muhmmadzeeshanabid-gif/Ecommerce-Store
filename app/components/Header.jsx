"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Mail, Lock, ChevronDown, Heart, Eye, EyeOff } from 'lucide-react';
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
          <li><Link href="#footer" className="text-xs uppercase tracking-wider font-bold">Contact Us</Link></li>
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
                        <button type="submit" disabled={isAuthLoading} className="w-full bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl">{isAuthLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}</button>
                     </form>
                     <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">{isSignUp ? "Login" : "Register"}</button>
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
