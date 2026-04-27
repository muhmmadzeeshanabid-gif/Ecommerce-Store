"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchApi } from '../lib/api';

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      // Try to load from cache first for instant appearance
      const cached = localStorage.getItem('zara_categories_cache');
      if (cached) {
        setCategories(JSON.parse(cached));
        setLoading(false);
      }

      try {
        const data = await fetchApi('/api/categories');
        setCategories(data);
        localStorage.setItem('zara_categories_cache', JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading && categories.length === 0) return (
    <div className="w-full py-4 px-6 flex justify-center">
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-32 bg-gray-100 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-transparent">
      <div className="flex flex-nowrap items-center justify-start gap-x-1.5 md:gap-x-2.5 w-full px-4 overflow-x-auto lg:overflow-x-hidden no-scrollbar py-4">
        <Link 
          href="/products" 
          className={`flex-shrink-0 h-9 md:h-10 flex items-center justify-center px-4 md:px-5 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.1em] transition-all duration-500 border rounded-full
            ${pathname === '/products' 
              ? 'bg-black text-white border-black shadow-lg scale-105' 
              : 'bg-white text-gray-400 border-gray-100 hover:text-black hover:border-black'}
          `}
        >
          All
        </Link>
        
        {categories.map((cat) => {
          const isActive = pathname === `/categories/${cat.slug}`;
          return (
            <Link 
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`flex-shrink-0 h-9 md:h-10 flex items-center justify-center px-4 md:px-5 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.1em] transition-all duration-500 border rounded-full
                ${isActive 
                  ? 'bg-black text-white border-black shadow-lg scale-105' 
                  : 'bg-white text-gray-400 border-gray-100 hover:text-black hover:border-black'}
              `}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
