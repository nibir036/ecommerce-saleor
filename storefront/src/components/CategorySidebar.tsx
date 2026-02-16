// src/components/CategorySidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface CategorySidebarProps {
  categories: Category[];
}

export function CategorySidebar({ categories }: CategorySidebarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
      
      <div className="space-y-2">
        {/* All Products Link */}
        <Link
          href="/products"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            pathname === '/products'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>All Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Category Links */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === `/categories/${category.slug}`
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{category.name}</span>
              <span className="text-sm opacity-75">({category.productCount})</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Price Filter Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">Under $10</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">$10 - $50</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">$50 - $100</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">$100+</span>
          </label>
        </div>
      </div>
    </div>
  );
}