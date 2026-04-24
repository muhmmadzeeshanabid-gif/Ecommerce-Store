"use client";
import React, { useState } from 'react';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
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
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20 relative">
      <main className="container mx-auto px-6 lg:px-20 pt-12">
        <div className="mb-12 space-y-4 pb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-black/10"></div>
            <p className="text-[10px] font-black tracking-[0.6em] text-black/20 uppercase">
              Archive Collection / 2026
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none mb-4">
            All Items
          </h1>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest pt-6 border-t border-gray-100 inline-block">
            Showing {products.length} of {pagination.total} Selected Items
          </p>
        </div>

        <div className="sticky top-[80px] z-[40] bg-[#FAF9F6]/90 backdrop-blur-md mb-16 -mx-6 lg:-mx-20 px-6 lg:px-20 py-6 border-b border-gray-100">
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
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">You have reached the end of the collection</p>
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
