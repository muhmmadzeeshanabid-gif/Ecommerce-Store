"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, ShoppingCart, User, Menu, X, LogIn, UserPlus, Mail, Lock, UserCircle, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchApi } from '../lib/api';

const Header = () => {
  const pathname = usePathname();
  const { getCartCount, notification, setNotification, wishlistItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [userName, setUserName] = useState("Zeeshan"); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await fetchApi('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories for header:", err);
      }
    };
    fetchCats();
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-gray-200 h-20 flex items-center">
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
        {/* Left: Brand - Wrapper for centering */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-3 no-underline cursor-pointer">
            <span className="text-2xl font-bold tracking-widest text-black uppercase">
              ZARA
            </span>
          </Link>
        </div>

        {/* Center: Nav Links */}
        <ul className={`
          flex list-none flex-col md:flex-row gap-8 md:gap-10
          fixed md:static top-20 md:top-0 left-0 w-full md:w-auto h-[calc(100vh-80px)] md:h-auto 
          bg-black md:bg-transparent items-start md:items-center justify-start md:justify-center pt-8 md:pt-0 px-8 md:px-0
          transition-all duration-300 z-[1500] border-t border-white/5 md:border-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:flex'}
        `}>
          <li className="w-full border-b border-white/10 md:border-none py-6 md:py-0">
            <Link href="/" className={`text-xl md:text-xs uppercase tracking-[0.2em] md:tracking-wider font-bold transition-all relative pb-1 ${pathname === '/' ? 'text-white md:text-black md:after:absolute md:after:bottom-0 md:after:left-0 md:after:w-full md:after:h-[2px] md:after:bg-black' : 'text-gray-500 md:text-gray-400 md:hover:text-black hover:text-white'}`} onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          
          <li 
            className="w-full border-b border-white/10 md:border-none py-6 md:py-0 relative group"
            onMouseEnter={() => window.innerWidth > 768 && setIsDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setIsDropdownOpen(false)}
          >
             <button 
              onClick={() => window.innerWidth <= 768 && setIsDropdownOpen(!isDropdownOpen)}
              className={`flex md:inline-flex items-center gap-1.5 justify-between md:justify-center w-full md:w-auto text-xl md:text-xs uppercase tracking-[0.2em] md:tracking-wider font-bold transition-all relative pb-1 cursor-pointer ${pathname.startsWith('/categories') ? 'text-white md:text-black md:after:absolute md:after:bottom-0 md:after:left-0 md:after:w-full md:after:h-[2px] md:after:bg-black' : 'text-gray-500 md:text-gray-400 md:hover:text-black hover:text-white'}`}
            >
              <span>Categories</span>
              <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''} mt-0.5`} />
            </button>
            
            <div 
              className={`
              ${isDropdownOpen ? 'max-h-96 opacity-100 mt-6 md:mt-0' : 'max-h-0 opacity-0 overflow-hidden'}
              md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 md:w-52 bg-black md:bg-white md:border md:border-gray-100 md:shadow-xl py-4 md:p-6 transition-all duration-300 z-50
            `}>
                <div className="flex flex-col gap-4 md:gap-3 text-left">
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <Link 
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className={`text-[12px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${pathname === `/categories/${cat.slug}` ? 'text-white md:text-black' : 'text-gray-500 md:text-gray-400 hover:text-white md:hover:text-black'}`}
                        onClick={() => {
                            setIsDropdownOpen(false);
                            setIsOpen(false);
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">No categories</span>
                  )}
                </div>
            </div>
          </li>

          <li className="w-full border-b border-white/10 md:border-none py-6 md:py-0">
            <Link href="/products" className={`text-xl md:text-xs uppercase tracking-[0.2em] md:tracking-wider font-bold transition-all relative pb-1 ${pathname === '/products' ? 'text-white md:text-black md:after:absolute md:after:bottom-0 md:after:left-0 md:after:w-full md:after:h-[2px] md:after:bg-black' : 'text-gray-500 md:text-gray-400 md:hover:text-black hover:text-white'}`} onClick={() => setIsOpen(false)}>
              Latest
            </Link>
          </li>
          <li className="w-full border-b border-white/10 md:border-none py-6 md:py-0">
            <button 
              onClick={() => {
                const footer = document.getElementById('footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                setIsOpen(false);
              }} 
              className="text-gray-500 md:text-gray-400 md:hover:text-black hover:text-white font-bold text-xl md:text-xs uppercase tracking-[0.2em] md:tracking-wider cursor-pointer w-full text-left md:w-auto whitespace-nowrap pb-1"
            >
              Contact Us
            </button>
          </li>
        </ul>

        {/* Right: Icons - Wrapper for centering */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative flex items-center justify-center text-black hover:scale-110 transition-transform" aria-label="Cart">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          {/* Profile Section with Personalized Avatar */}
          <button 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all border border-gray-100 overflow-hidden">
              {isLoggedIn ? (
                <span className="text-[14px] md:text-[16px] font-black uppercase text-black group-hover:text-white transform transition-transform group-active:scale-90">
                  {userName[0]}
                </span>
              ) : (
                <User size={18} strokeWidth={1.5} className="text-black group-hover:text-white transition-transform group-active:scale-95" />
              )}
            </div>
            <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors whitespace-nowrap">
               {isLoggedIn ? userName : "Sign In"}
            </span>
          </button>

          <button 
            className="md:hidden flex items-center justify-center text-black" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* SUCCESS NOTIFICATION TOAST - SIMPLIFIED */}
      <div className="fixed top-24 right-5 z-[5000] flex flex-col gap-3 pointer-events-none">
        {notification && (
          <div className="bg-black text-white shadow-xl px-6 py-4 flex items-center gap-4 pointer-events-auto">
            <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              Successfully your item is cart
            </p>
            <button onClick={() => setNotification(null)} className="text-white/50 hover:text-white cursor-pointer ml-4">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={() => setIsProfileOpen(false)}>
           <div className="bg-white w-full max-w-[400px] shadow-2xl p-8 relative" onClick={e => e.stopPropagation()}>
             <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={() => setIsProfileOpen(false)}><X size={20} /></button>
             {isLoggedIn ? (
               <div className="space-y-8 text-center">
                 <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold mx-auto">{userName[0]}</div>
                 <h3 className="text-xl font-bold text-black uppercase tracking-widest">{userName}</h3>
                 <button onClick={handleLogout} className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full btn-animate">Logout Session</button>
               </div>
             ) : (
                 <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                       <h4 className="text-2xl font-black uppercase tracking-[0.2em] text-black">
                         {isSignUp ? "Create Account" : "Welcome Back"}
                       </h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         {isSignUp ? "Join the Zara Fashion Club" : "Login to your account"}
                       </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                       {isSignUp && (
                         <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-transparent p-4 pl-12 text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:border-black transition-all outline-none" required />
                         </div>
                       )}
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-transparent p-4 pl-12 text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:border-black transition-all outline-none" required />
                       </div>
                       <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-transparent p-4 pl-12 text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:border-black transition-all outline-none" required />
                       </div>
                       
                       <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 mt-4 rounded-full btn-animate">
                          {isSignUp ? "Sign Up Now" : "Login Session"}
                       </button>
                    </form>

                    <div className="pt-4 border-t border-gray-50">
                       <button 
                         onClick={() => setIsSignUp(!isSignUp)}
                         className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                       >
                         {isSignUp ? "Already have an account? Login" : "Don't have an account? Create One"}
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
