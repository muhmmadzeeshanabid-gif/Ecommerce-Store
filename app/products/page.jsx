import React from 'react';
import { fetchApi } from '../lib/api';
import AllProductsClient from './AllProductsClient';

export const metadata = {
  title: 'Shop All Products | Zara Store',
  description: 'Explore our full collection of premium fashion, electronics, and accessories.',
};

export const revalidate = 60;

const AllProductsPage = async () => {
  let initialData = null;
  try {
    initialData = await fetchApi('/api/products?page=1&limit=20');
  } catch (error) {
    console.error("Error fetching all products server-side:", error);
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-6">
        <h2 className="text-2xl font-black uppercase mb-4">Store Unavailable</h2>
        <a href="/" className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase text-xs">Back to Home</a>
      </div>
    );
  }

  return (
    <AllProductsClient initialData={initialData} />
  );
};

export default AllProductsPage;
