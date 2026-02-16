// src/app/page.tsx
import Link from 'next/link';
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import { ProductCard } from '@/components/ProductCard';

// TypeScript types
interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail: {
    url: string;
    alt: string | null;
  } | null;
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
}

interface ProductEdge {
  node: Product;
}

interface ProductsData {
  products: {
    edges: ProductEdge[];
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: {
    totalCount: number;
  };
}

interface CategoryEdge {
  node: Category;
}

interface CategoriesData {
  categories: {
    edges: CategoryEdge[];
  } | null;
}

// GraphQL Query for featured products
const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int!, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          thumbnail {
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
        }
      }
    }
  }
`;

// GraphQL Query for categories (no channel needed for category list)
const GET_CATEGORIES = gql`
  query GetCategories($first: Int!) {
    categories(first: $first, level: 0) {
      edges {
        node {
          id
          name
          slug
          products(channel: "default-channel") {
            totalCount
          }
        }
      }
    }
  }
`;

export default async function Home() {
  // Fetch featured products
  let featuredProducts: ProductEdge[] = [];
  
  try {
    const { data } = await getClient().query<ProductsData>({
      query: GET_FEATURED_PRODUCTS,
      variables: {
        first: 8,
        channel: 'default-channel',
      },
    });
    featuredProducts = data?.products?.edges || [];
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Fetch categories
  let topCategories: Category[] = [];
  
  try {
    const { data: categoriesData } = await getClient().query<CategoriesData>({
      query: GET_CATEGORIES,
      variables: {
        first: 100,
      },
    });
    
    // Get top-level categories with products
    const allCategories = categoriesData?.categories?.edges
      .map(({ node }) => node)
      .filter(cat => cat.products.totalCount > 0) || [];
    
    // Take first 4 categories with products
    topCategories = allCategories.slice(0, 4);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to static categories if query fails
    topCategories = [
      { id: '1', name: 'Apparel', slug: 'apparel', products: { totalCount: 0 } },
      { id: '2', name: 'Accessories', slug: 'accessories', products: { totalCount: 0 } },
      { id: '3', name: 'Groceries', slug: 'groceries', products: { totalCount: 0 } },
      { id: '4', name: 'Gift Cards', slug: 'gift-cards', products: { totalCount: 0 } },
    ];
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to My Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. Shop with confidence using secure Sonali Bank payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="#featured"
                className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors shadow-lg text-lg border-2 border-white"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over BDT 1000</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Powered by Sonali Payment Gateway</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">7-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          {topCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:shadow-xl transition-shadow"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-90 transition-opacity" />
                  <div className="relative h-full flex flex-col items-center justify-center p-4">
                    <span className="text-xl font-semibold text-gray-900 group-hover:text-white transition-colors z-10 text-center">
                      {category.name}
                    </span>
                    {category.products.totalCount > 0 && (
                      <span className="mt-2 text-sm text-gray-600 group-hover:text-white/80 transition-colors z-10">
                        {category.products.totalCount} products
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              View All
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map(({ node: product }) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  thumbnail={product.thumbnail}
                  price={{
                    amount: product.pricing?.priceRange?.start?.gross?.amount || 0,
                    currency: product.pricing?.priceRange?.start?.gross?.currency || 'USD',
                  }}
                  category={product.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading featured products...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of happy customers today!
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}