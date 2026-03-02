import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Bundle analyzer for production build analysis
// Run with: ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // SEO: Prevent duplicate URLs with/without trailing slash
  trailingSlash: false,
  
  // Optimize barrel file imports for faster builds and smaller bundles
  // Per Vercel best practices: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
  experimental: {
    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      'react-hot-toast',
      'date-fns',
      'swr',
    ],
  },

  compress: true,
  poweredByHeader: false,
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // Webpack optimization for smaller bundles
  webpack: (config, { isServer }) => {
    // Tree shake unused code from packages
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate vendor chunks for better caching
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }
    return config;
  },

  // Security + performance headers  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HTTPS enforcement (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // XSS protection  
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

