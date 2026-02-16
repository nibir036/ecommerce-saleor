// src/app/products/page.tsx
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import { ProductCard } from '@/components/ProductCard';

// TypeScript types for the GraphQL response
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

interface ProductsData {
  products: {
    edges: ProductEdge[];
  } | null;
}

// GraphQL Query
const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $channel: String!) {
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
`;

export default async function ProductsPage() {
  // Fetch data on the server with proper typing
  const { data, error } = await getClient().query<ProductsData>({
    query: GET_PRODUCTS,
    variables: {
      first: 50,
      channel: 'default-channel',
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading products: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const products = data?.products?.edges || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-600">
            Showing {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No products found.</p>
            <p className="text-gray-400 mt-2">
              {/* Make sure you've added products in the Saleor Dashboard. */}
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

// Optional: Add metadata for SEO
export const metadata = {
  title: 'Products | My Store',
  description: 'Browse our collection of products',
};