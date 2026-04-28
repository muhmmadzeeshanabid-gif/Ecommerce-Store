"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, ShoppingCart, User, Menu, X, LogIn, UserPlus, Mail, Lock, UserCircle, ChevronDown, Heart, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';

const Header = () => {
  const pathname = usePathname();
  const { getCartCount, notification, setNotification, wishlistItems } = useCart();
  const { user, login, signup, resetPassword, logout, showAuthModal, openAuthModal, closeAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Default to login
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Security Questions + New Password
  const [showPassword, setShowPassword] = useState(false);
  const [userSecurityQuestions, setUserSecurityQuestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const securityQuestionsList = [
    "What was your childhood nickname?",
    "What is the name of your favorite childhood friend?",
    "In what city or town did your parents meet?",
    "What is the middle name of your oldest sibling?",
    "What is the name of the first beach you visited?",
    "What was the name of your first stuffed animal?",
    "What is your favorite movie?",
    "What is the name of the street you grew up on?",
    "What is your favorite food?",
    "What is the name of your first employer?",
    "What was your dream job as a child?",
    "What was the first concert you attended?",
    "What is the name of your favorite teacher?",
    "What is the name of your first pet?",
    "What is your grandmother's first name?"
  ];

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

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setIsAuthLoading(true);

    const email = e.target.email.value;
    const password = e.target.password?.value;
    const confirmPassword = e.target.confirmPassword?.value;
    const name = e.target.name?.value;
    
    // Recovery Answers
    const recoveryAnswer = e.target.recoveryAnswer?.value;

    // Signup Questions/Answers
    const signupQuestion = e.target.signupQuestion?.value;
    const signupAnswer = e.target.signupAnswer?.value;

    try {
      if (isForgotPassword) {
        if (forgotStep === 1) {
            // Check if user exists and get their questions
            const users = JSON.parse(localStorage.getItem('zara_users') || '[]');
            const found = users.find(u => u.email === email);
            if (!found) throw new Error("No account found with this email.");
            
            if (found.securityQuestions && found.securityQuestions.length > 0) {
                setUserSecurityQuestions(found.securityQuestions.map(q => q.question));
                setForgotStep(2);
            } else {
                // Legacy users or no questions set
                setForgotStep(2);
                setUserSecurityQuestions(["Question (Not set)"]);
            }
            setIsAuthLoading(false);
            return;
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await resetPassword(email, password, [recoveryAnswer]);
        setAuthSuccess("Password reset successfully! Please login.");
        setIsForgotPassword(false);
        setForgotStep(1);
        setIsSignUp(false);
      } else if (isSignUp) {
        const securityData = [
            { question: signupQuestion, answer: signupAnswer }
        ];
        await signup(email, password, name, securityData);
        closeAuthModal();
      } else {
        await login(email, password);
        closeAuthModal();
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError(err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeAuthModal();
    } catch (err) {
      console.error("Logout error:", err);
    }
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
            onClick={openAuthModal}
          >
            <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all border border-gray-100 overflow-hidden">
              {user ? (
                <span className="text-[14px] md:text-[16px] font-black uppercase text-black group-hover:text-white transform transition-transform group-active:scale-90">
                  {user.displayName ? user.displayName[0] : user.email[0]}
                </span>
              ) : (
                <User size={18} strokeWidth={1.5} className="text-black group-hover:text-white transition-transform group-active:scale-95" />
              )}
            </div>
            <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors whitespace-nowrap">
               {user ? (user.displayName || user.email.split('@')[0]) : "Sign In"}
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
              Item successfully added to cart
            </p>
            <button onClick={() => setNotification(null)} className="text-white/50 hover:text-white cursor-pointer ml-4">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={closeAuthModal}>
           <div className="bg-white w-full max-w-[400px] shadow-2xl p-8 relative" onClick={e => e.stopPropagation()}>
             <button className="absolute top-4 right-4 text-gray-400 hover:text-black" onClick={closeAuthModal}><X size={20} /></button>
             
             {user ? (
               <div className="space-y-8 text-center">
                 <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold mx-auto">{user.displayName ? user.displayName[0] : user.email[0]}</div>
                 <h3 className="text-xl font-bold text-black uppercase tracking-widest">{user.displayName || user.email}</h3>
                 <button onClick={handleLogout} className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full btn-animate">Logout Session</button>
               </div>
             ) : (
                  <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black uppercase tracking-[0.2em] text-black">
                          {isForgotPassword ? (forgotStep === 1 ? "Verify Email" : "Reset Password") : (isSignUp ? "Create Account" : "Welcome Back")}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {isForgotPassword ? (forgotStep === 1 ? "Enter your email to find account" : "Answer security questions to reset") : (isSignUp ? "Join the Zara Fashion Club" : "Login to your account")}
                        </p>
                     </div>
 
                     <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                          <div className="relative">
                             <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${authError ? 'text-red-400' : 'text-gray-300'}`} size={16} />
                             <input type="text" name="name" placeholder="Full Name" className={`w-full bg-gray-50 border ${authError ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-black'} p-4 pl-12 text-[11px] font-medium uppercase tracking-widest transition-all outline-none`} required />
                          </div>
                        )}
                        
                        {(isSignUp || !isForgotPassword || (isForgotPassword && forgotStep === 1)) && (
                          <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${authError ? 'text-red-400' : 'text-gray-300'}`} size={16} />
                            <input type="email" name="email" placeholder="Email Address" className={`w-full bg-gray-50 border ${authError ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-black'} p-4 pl-12 text-[11px] font-medium uppercase tracking-widest transition-all outline-none`} required readOnly={isForgotPassword && forgotStep === 2} />
                          </div>
                        )}

                        {((!isForgotPassword && !isSignUp) || isSignUp) && (
                          <div className="relative">
                             <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${authError ? 'text-red-400' : 'text-gray-300'}`} size={16} />
                             <input 
                               type={showPassword ? "text" : "password"} 
                               name="password" 
                               placeholder="Password (Min. 8 chars)" 
                               minLength="8" 
                               className={`w-full bg-gray-50 border ${authError ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-black'} p-4 pl-12 pr-12 text-[11px] font-medium uppercase tracking-widest transition-all outline-none`} 
                               required 
                             />
                             <button 
                               type="button"
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                             >
                               {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                             </button>
                          </div>
                        )}

                        {isForgotPassword && forgotStep === 2 && (
                          <div className="space-y-4">
                            <div className="relative">
                               <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${authError ? 'text-red-400' : 'text-gray-300'}`} size={16} />
                               <input 
                                 type={showPassword ? "text" : "password"} 
                                 name="password" 
                                 placeholder="New Password" 
                                 minLength="8" 
                                 className={`w-full bg-gray-50 border ${authError ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-black'} p-4 pl-12 pr-12 text-[11px] font-medium uppercase tracking-widest transition-all outline-none`} 
                                 required 
                               />
                               <button 
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                               >
                                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                               </button>
                            </div>
                            <div className="relative">
                               <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${authError ? 'text-red-400' : 'text-gray-300'}`} size={16} />
                               <input 
                                 type={showPassword ? "text" : "password"} 
                                 name="confirmPassword" 
                                 placeholder="Confirm New Password" 
                                 minLength="8" 
                                 className={`w-full bg-gray-50 border ${authError ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-black'} p-4 pl-12 pr-12 text-[11px] font-medium uppercase tracking-widest transition-all outline-none`} 
                                 required 
                               />
                            </div>

                            {userSecurityQuestions[0] !== "Question (Not set)" && (
                              <div className="space-y-4 pt-2">
                                  <p className="text-[9px] text-left font-black uppercase tracking-widest text-black mb-1">Verify Security Answer:</p>
                                  <div className="space-y-3">
                                      <div className="text-left bg-gray-50 p-4 border border-gray-100 rounded-lg">
                                          <p className="text-[10px] font-black text-black uppercase tracking-[0.1em] mb-2 leading-relaxed">
                                              {userSecurityQuestions[0]}
                                          </p>
                                          <input type="text" name="recoveryAnswer" placeholder="Your Answer" className="w-full bg-transparent border-b border-gray-200 py-2 text-[12px] font-medium outline-none focus:border-black transition-colors" required />
                                      </div>
                                  </div>
                              </div>
                            )}
                          </div>
                        )}

                        {isSignUp && (
                          <div className="space-y-5 pt-2">
                             <div className="space-y-4">
                                <div className="space-y-3">
                                    <p className="text-[9px] text-left font-black uppercase tracking-widest text-black">Quick Pick Questions:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {securityQuestionsList.slice(0, 3).map((q, i) => (
                                            <button 
                                                key={i} 
                                                type="button" 
                                                onClick={() => {
                                                    const select = document.getElementsByName('signupQuestion')[0];
                                                    if (select) {
                                                        select.value = q;
                                                        // Trigger change for UI if needed
                                                    }
                                                }}
                                                className="text-left p-3 bg-gray-50 hover:bg-black hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest border border-gray-100"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[9px] text-left font-black uppercase tracking-widest text-black">Or Select from List:</p>
                                    <select name="signupQuestion" className="w-full bg-gray-50 border border-transparent p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-black cursor-pointer" required>
                                        {securityQuestionsList.map((q, i) => <option key={i} value={q}>{q}</option>)}
                                    </select>
                                    <div className="relative">
                                        <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input type="text" name="signupAnswer" placeholder="Write Your Answer" className="w-full bg-gray-50 border border-transparent p-4 pl-12 text-[11px] font-medium uppercase tracking-widest outline-none focus:border-black" required />
                                    </div>
                                </div>
                             </div>
                          </div>
                        )}
                        
                        {authError && (
                          <div className="bg-red-50 p-3 border-l-4 border-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
                            <p className="text-[10px] font-medium text-red-600 uppercase tracking-widest text-left">
                              * {authError}
                            </p>
                          </div>
                        )}

                        {authSuccess && (
                          <div className="bg-green-50 p-3 border-l-4 border-green-500 animate-in fade-in slide-in-from-top-1 duration-300">
                            <p className="text-[10px] font-medium text-green-600 uppercase tracking-widest text-left">
                              {authSuccess}
                            </p>
                          </div>
                        )}

                        <button 
                          type="submit" 
                          disabled={isAuthLoading}
                          className={`w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95 mt-4 rounded-full btn-animate ${isAuthLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                           {isAuthLoading ? "Processing..." : (isForgotPassword ? (forgotStep === 1 ? "Find Account" : "Reset Password") : (isSignUp ? "Sign Up Now" : "Login Session"))}
                        </button>
                     </form>
 
                     <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                        {!isForgotPassword && !isSignUp && (
                          <button 
                            onClick={() => {
                              setIsForgotPassword(true);
                              setForgotStep(1);
                              setAuthError("");
                              setAuthSuccess("");
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                          >
                            Forgot Password?
                          </button>
                        )}

                        <button 
                          onClick={() => {
                            if (isForgotPassword) {
                                if (forgotStep === 2) {
                                    setForgotStep(1);
                                } else {
                                    setIsForgotPassword(false);
                                }
                            } else {
                              setIsSignUp(!isSignUp);
                            }
                            setUserSecurityQuestions([]);
                            setAuthError("");
                            setAuthSuccess("");
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                          {isForgotPassword ? (forgotStep === 2 ? "Back to Email Verification" : "Back to Login") : (isSignUp ? "Already have an account? Login" : "Don't have an account? Create One")}
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
