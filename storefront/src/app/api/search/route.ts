// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int!, $channel: String!) {
    products(first: $first, channel: $channel, filter: { search: $search }) {
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
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const { data } = await getClient().query({
      query: SEARCH_PRODUCTS,
      variables: {
        search: query,
        first: 10,
        channel: 'default-channel',
      },
    });

    const results = data?.products?.edges.map((edge: any) => edge.node) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}