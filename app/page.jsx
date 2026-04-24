import React from 'react';
import { fetchApi } from './lib/api';
import HomeClient from './HomeClient';

export const metadata = {
  title: 'Zara Store | Minimalist E-commerce',
  description: 'Experience clean and minimal shopping with Zara. Discover the latest fashion trends.',
};

export default async function Home() {
  const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "CALVIN KLEIN"];
  let featuredProducts = [];

  try {
    const result = await fetchApi('/api/products?limit=50');
    // Shuffle products to show a mix (Bags, Clothes, Phones, etc.)
    const shuffled = [...result.data].sort(() => 0.5 - Math.random());
    featuredProducts = shuffled.slice(0, 12);
  } catch (error) {
    console.error("Failed to fetch featured products server-side:", error);
  }

  return (
    <HomeClient featuredProducts={featuredProducts} brands={brands} />
  );
}
