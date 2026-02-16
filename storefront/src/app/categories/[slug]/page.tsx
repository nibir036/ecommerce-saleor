// src/app/categories/[slug]/page.tsx
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// TypeScript types
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  products: {
    edges: ProductEdge[];
  };
}

interface CategoryData {
  category: Category | null;
}

// GraphQL Query
const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts($slug: String!, $first: Int!, $channel: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      products(first: $first, channel: $channel) {
        edges {
          node {
            id
            name
            slug
            description
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
  }
`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch category and products
  const { data, error } = await getClient().query<CategoryData>({
    query: GET_CATEGORY_PRODUCTS,
    variables: {
      slug,
      first: 50,
      channel: 'default-channel',
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error loading category: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.category) {
    notFound();
  }

  const category = data.category;
  const products = category.products.edges;

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
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 text-lg">{category.description}</p>
          )}
          <p className="text-gray-500 mt-2">{products.length} products</p>
        </div>

        {/* Sort & Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A-Z</option>
              <option>Name: Z-A</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(({ node: product }) => (
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
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No products in this category yet.</p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const { data } = await getClient().query<CategoryData>({
    query: GET_CATEGORY_PRODUCTS,
    variables: {
      slug,
      first: 1,
      channel: 'default-channel',
    },
  });

  if (!data?.category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${data.category.name} | My Store`,
    description: data.category.description || `Shop ${data.category.name} products`,
  };
}