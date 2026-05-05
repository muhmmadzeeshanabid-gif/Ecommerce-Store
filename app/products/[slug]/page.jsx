import React from 'react';
import { fetchApi } from '../../lib/api';
import ProductDetailClient from './ProductDetailClient';

// Server-side function to generate dynamic metadata
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { slug } = params;
  
  try {
    const data = await fetchApi(`/api/products/${slug}`);
    const product = data.product;
    
    return {
      title: `${product.title} | Zara Store`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Product Not Found | Zara Store',
    };
  }
}

export const revalidate = 60;

const ProductDetailPage = async ({ params: paramsPromise }) => {
  const params = await paramsPromise;
  const { slug } = params;

  let product = null;
  let recommendations = [];
  let error = null;

  try {
    const data = await fetchApi(`/api/products/${slug}`);
    product = data.product;
    recommendations = data.recommendations || [];
  } catch (err) {
    console.error('Error fetching product server-side:', err);
    error = err.message;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h2 className="text-2xl font-black uppercase mb-4">Product Not Found</h2>
        <a href="/" className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase text-xs">Back to Home</a>
      </div>
    );
  }

  return (
    <ProductDetailClient product={product} recommendations={recommendations} />
  );
};

export default ProductDetailPage;
