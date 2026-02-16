// src/app/products/[slug]/page.tsx
import { AddToCartButton } from '@/components/AddToCartButton';
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// TypeScript types
interface ProductVariant {
  id: string;
  name: string;
  pricing: {
    price: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  } | null;
}

interface ProductMedia {
  url: string;
  alt: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: {
    url: string;
    alt: string | null;
  } | null;
  media: ProductMedia[];
  pricing: {
    priceRange: {
      start: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  variants: ProductVariant[];
}

interface ProductData {
  product: Product | null;
}

// GraphQL Query
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      thumbnail {
        url
        alt
      }
      media {
        url
        alt
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
        }
      }
      category {
        id
        name
      }
      variants {
        id
        name
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch product data
  const { data, error } = await getClient().query<ProductData>({
    query: GET_PRODUCT_BY_SLUG,
    variables: {
      slug,
      channel: 'default-channel',
    },
  });

  // Handle errors
  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error loading product: {error.message}</p>
        </div>
      </div>
    );
  }

  // Handle product not found
  if (!data?.product) {
    notFound();
  }

  const product = data.product;
  const price = product.pricing?.priceRange?.start?.gross;
  
  // Combine all images - prioritize media, fallback to thumbnail
  const allImages: ProductMedia[] = [];
  
  if (product.media && product.media.length > 0) {
    allImages.push(...product.media);
  } else if (product.thumbnail) {
    allImages.push(product.thumbnail);
  }

  // Debug: Log images to console
  console.log('Product:', product.name);
  console.log('Images:', allImages);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-6 lg:p-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  {/* Debug overlay - remove after fixing */}
                  {/* <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {allImages[0].url}
                  </div> */}
                  <Image
                    src={allImages[0].url}
                    alt={allImages[0].alt || product.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No Image Available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(0, 4).map((media, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <Image
                      src={media.url}
                      alt={media.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                {product.category.name}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            {price && (
              <div className="text-3xl font-bold text-gray-900">
                {price.currency} {price.amount.toFixed(2)}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Options</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <span className="text-gray-900 font-medium">{variant.name}</span>
                      {variant.pricing?.price && (
                        <span className="text-gray-900 font-semibold">
                          {variant.pricing.price.gross.currency} {variant.pricing.price.gross.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button (Placeholder for now) */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: price?.amount || 0,
                currency: price?.currency || 'USD',
                thumbnail: allImages[0]?.url,
              }}
            />

            {/* Payment Gateway Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Secure Payment with Sonali Payment Gateway</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free shipping on orders over BDT 1000</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>7-day return policy</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout with Sonali Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Products Link */}
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const { data } = await getClient().query<ProductData>({
    query: GET_PRODUCT_BY_SLUG,
    variables: {
      slug,
      channel: 'default-channel',
    },
  });

  if (!data?.product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${data.product.name} | My Store`,
    description: data.product.description || `Buy ${data.product.name}`,
  };
}