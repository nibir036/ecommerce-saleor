// src/components/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/lib/cart-store';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    thumbnail?: string;
    variantId?: string;
  };
  className?: string;
}

export function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.variantId || product.id,
      productId: product.id,
      variantId: product.variantId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      currency: product.currency,
      thumbnail: product.thumbnail,
    });

    // Show "Added!" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`
        ${className}
        ${added 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-blue-600 hover:bg-blue-700'
        }
        w-full text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl
        flex items-center justify-center space-x-2
      `}
    >
      {added ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}