// src/lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Server-side Apollo Client (for Server Components and Server Actions)
export const getClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/',
      fetchOptions: { cache: 'no-store' }, // Disable caching for SSR
      headers: {
        // Add authentication token if needed
        // 'Authorization': `Bearer ${process.env.SALEOR_API_TOKEN}`,
      },
    }),
  });
};