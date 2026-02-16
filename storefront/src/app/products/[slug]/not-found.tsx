// src/app/products/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the product may have been removed or is no longer available.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse All Products
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}