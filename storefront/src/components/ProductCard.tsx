// src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  thumbnail?: {
    url: string;
    alt?: string | null;
  } | null;
  price: {
    amount: number;
    currency: string;
  };
  category?: {
    name: string;
  } | null;
}

export function ProductCard({ 
  name, 
  slug, 
  thumbnail, 
  price,
  category 
}: ProductCardProps) {
  return (
    <Link 
      href={`/products/${slug}`}
      className="group block rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {thumbnail?.url ? (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt || name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg 
              className="w-16 h-16" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white">
        {/* Category Badge */}
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full uppercase tracking-wide">
            {category.name}
          </span>
        )}
        
        {/* Product Name */}
        <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {name}
        </h3>
        
        {/* Price */}
        <p className="mt-3 text-xl font-bold text-gray-900">
          {price.currency} {price.amount.toFixed(2)}
        </p>

        {/* View Details Link */}
        <div className="mt-3 text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center">
          View Details
          <svg 
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}