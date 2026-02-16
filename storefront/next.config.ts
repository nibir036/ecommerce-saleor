import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // Add more patterns for production later
      // {
      //   protocol: 'https',
      //   hostname: 'your-saleor-domain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;