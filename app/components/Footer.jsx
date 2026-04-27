"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    // You could add actual API call here
    setTimeout(() => setSubscribed(false), 5000); // Reset after 5s
  };
  const categories = [
    { name: "Electronics & Tech", slug: "electronics-tech" },
    { name: "Men's Fashion", slug: "mens-fashion" },
    { name: "Women's Fashion", slug: "womens-fashion" },
    { name: "Home & Lifestyle", slug: "home-and-lifestyle" },
    { name: "Beauty & Care", slug: "beauty-personal-care" },
    { name: "Sports & Outdoors", slug: "sports-outdoors" },
  ];

  return (
    <footer id="footer" className="bg-white text-black mt-24 border-t border-gray-100">

      {/* MAIN LINKS GRID */}
      <div className="container mx-auto px-6 lg:px-20 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-8">
            <Link href="/" className="text-2xl font-black tracking-[0.3em] uppercase text-black block">
              ZARA
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-light max-w-[220px]">
              Premium fashion, minimal design. Built for those who appreciate the art of restraint.
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-black">Shop</p>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="text-sm text-gray-500 hover:text-black transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-black">Help</p>
            <ul className="space-y-4">
              {['Customer Support', 'Delivery Details', 'Returns & Refunds', 'Terms', 'Privacy'].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-black">Contact</p>
            <div className="space-y-4">
              <a href="mailto:support@zara.st" className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors">
                <Mail size={14} />
                support@zara.st
              </a>
              <a href="tel:+12025550192" className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors">
                <Phone size={14} />
                +1 202 555 0192
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin size={14} />
                New York, USA
              </div>
            </div>
          </div>

          {/* Column 5: Newsletter (moved here) */}
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-black">Newsletter</p>
            {subscribed ? (
              <div className="pt-2 animate-in fade-in slide-in-from-left-4 duration-700">
                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-black">
                  THANK YOU.
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">
                  YOUR EMAIL HAS BEEN REGISTERED.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  Get early access to new drops & exclusive offers.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex items-center gap-0 bg-gray-50 border border-gray-200 p-1.5 rounded-full hover:border-black transition-all focus-within:border-black">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs text-black placeholder:text-gray-300 outline-none"
                    />
                    <button type="submit" className="flex-shrink-0 w-9 h-9 bg-black rounded-full flex items-center justify-center hover:bg-neutral-800 transition-all">
                      <ArrowRight size={16} className="text-white" />
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                    No spam. Unsubscribe any time.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-20 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            &copy; 2026 Zara Store — All rights reserved
          </p>
          <div className="flex items-center gap-3">
            <div className="h-8 px-4 bg-gray-50 border border-gray-100 rounded-md flex items-center">
              <span className="text-[10px] font-black italic text-[#1434CB]">VISA</span>
            </div>
            <div className="h-8 px-3 bg-gray-50 border border-gray-100 rounded-md flex items-center gap-1">
              <div className="w-3 h-3 bg-[#EB001B] rounded-full"></div>
              <div className="w-3 h-3 bg-[#F79E1B] rounded-full -ml-1"></div>
            </div>
            <div className="h-8 px-4 bg-gray-50 border border-gray-100 rounded-md flex items-center">
              <span className="text-[9px] font-black"><span className="text-[#003087]">Pay</span><span className="text-[#009CDE]">Pal</span></span>
            </div>
            <div className="h-8 px-4 bg-gray-50 border border-gray-100 rounded-md flex items-center">
              <span className="text-[9px] font-bold text-gray-500">AMEX</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
