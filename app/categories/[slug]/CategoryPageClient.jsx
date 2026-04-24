"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import CategoryNav from '../../components/CategoryNav';
import ProductCard from '../../components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryPageClient = ({ initialData, slug }) => {
  const [products, setProducts] = useState(initialData.data);
  const [category, setCategory] = useState(initialData.category);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const handlePaginate = async (newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
    try {
      const result = await fetch(`/api/categories/${slug}/products?page=${newPage}&limit=${itemsPerPage}`).then(r => r.json());
      setProducts(result.data);
      setPagination(result.pagination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error paginating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20">
      <main className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-black/10"></div>
            <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
              Category Collection / 2026
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none mb-4">
            {category ? category.name : 'Category'}
          </h1>
          {category?.description && (
            <p className="max-w-md text-gray-500 text-sm font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* STICKY CATEGORY FILTERS below Heading */}
        <div className="sticky top-[80px] z-[40] bg-[#FAF9F6]/90 backdrop-blur-md mb-16 -mx-6 px-6 py-6 border-b border-black/5">
          <CategoryNav />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Centered Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-24 border-t border-gray-100 pt-12 flex flex-col items-center gap-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handlePaginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-4 border border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePaginate(i + 1)}
                        className={`w-12 h-12 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer
                          ${currentPage === i + 1 ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-100 hover:border-black'}
                        `}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => handlePaginate(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="p-4 border border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center space-y-6">
            <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-bold">No products found in this category</p>
            <Link href="/" className="px-10 py-4 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Return Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPageClient;
