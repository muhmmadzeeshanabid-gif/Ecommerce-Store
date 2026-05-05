"use client";
import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { fetchApi } from '../lib/api';

const AllProductsClient = ({ initialData }) => {
  const [products, setProducts] = useState(initialData.data);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(2);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [hasMore, setHasMore] = useState(initialData.pagination.page < initialData.pagination.totalPages);
  
  const itemsPerBatch = 20;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const result = await fetchApi(`/api/products?page=${nextPage}&limit=${itemsPerBatch}`);
      setProducts(prev => [...prev, ...result.data]);
      setPagination(result.pagination);
      setNextPage(prev => prev + 1);
      
      if (nextPage >= result.pagination.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center mb-8 md:mb-10 mt-4 text-center px-4">
          <h1 className="text-5xl md:text-[70px] font-playfair italic font-medium text-zinc-900 tracking-tight leading-none mb-4">
            All Items
          </h1>
          <div className="flex items-center justify-center w-full max-w-sm gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-400"></div>
            <div className="w-2 h-2 rotate-45 bg-zinc-800 outline outline-offset-2 outline-1 outline-zinc-300"></div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-400"></div>
          </div>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase">
            Curated Selection 2026
          </span>
        </div>

        {/* STICKY CATEGORY FILTERS below Heading */}
        <div className="sticky top-[80px] z-[40] bg-[#FAF9F6]/90 backdrop-blur-md mb-16 -mx-6 px-6 py-6 border-b border-black/5">
          <CategoryNav />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-8">
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
          
          {loading && [...Array(5)].map((_, i) => (
            <div key={`skeleton-${i}`} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-[20px]"></div>
                <div className="h-4 bg-gray-100 w-3/4 rounded-full"></div>
                <div className="h-4 bg-gray-100 w-1/2 rounded-full"></div>
            </div>
          ))}
        </div>

        {hasMore && (
           <div className="mt-32 text-center pb-20">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="inline-block px-14 py-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-30 rounded-full btn-animate"
              >
                {loading ? 'Loading More...' : 'View More Items'}
              </button>
           </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="mt-32 text-center pb-20">
            <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.5em]">You have reached the end of the collection</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 p-4 rounded-full border border-gray-100 hover:border-black transition-all btn-animate"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProductsClient;
