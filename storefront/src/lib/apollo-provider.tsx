// src/lib/apollo-provider.tsx
'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';

// Client-side Apollo Client (for Client Components with hooks)
const makeClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/',
      headers: {
        // Add authentication token if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  });
};

let client: ApolloClient | null = null;

// Get or create the Apollo Client (singleton pattern)
const getApolloClient = () => {
  if (!client) {
    client = makeClient();
  }
  return client;
};

// Apollo Provider wrapper for Client Components
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
}