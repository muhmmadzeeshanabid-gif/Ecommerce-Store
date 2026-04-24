import React from 'react';
import { fetchApi } from '../../lib/api';
import CategoryPageClient from './CategoryPageClient';

// Server-side dynamic metadata
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { slug } = params;
  
  try {
    const result = await fetchApi(`/api/categories/${slug}/products?page=1&limit=1`);
    const category = result.category;
    
    return {
      title: `${category.name} | Zara Store`,
      description: category.description || `Browse our exclusive collection of ${category.name}.`,
    };
  } catch (error) {
    return {
      title: 'Category | Zara Store',
    };
  }
}

const CategoryPage = async ({ params: paramsPromise }) => {
  const params = await paramsPromise;
  const { slug } = params;

  let initialData = null;
  try {
    initialData = await fetchApi(`/api/categories/${slug}/products?page=1&limit=10`);
  } catch (error) {
    console.error("Error fetching category server-side:", error);
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-6">
        <h2 className="text-2xl font-black uppercase mb-4">Category Not Found</h2>
        <a href="/" className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase text-xs">Back to Home</a>
      </div>
    );
  }

  return (
    <CategoryPageClient initialData={initialData} slug={slug} />
  );
};

export default CategoryPage;
