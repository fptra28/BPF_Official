import type { NextConfig } from "next";
import nextI18nConfig from './next-i18next.config';

const nextConfig: NextConfig = {
  output: 'standalone',
  i18n: {
    ...nextI18nConfig.i18n,
    localeDetection: false, // sudah pas
  },
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bpf-admin.newsmaker.id',
  },
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  images: {
    domains: [
      'bpf-official.vercel.app',
      'bpf-admin.newsmaker.id',
      'portalnews.test',
      'localhost',
      '127.0.0.1',
      'bpf-backend.test',
      'kpf-backpanel-production.up.railway.app',
      'placehold.co',
      'images.unsplash.com',
      'source.unsplash.com',
      'via.placeholder.com',
      'portalnews.newsmaker.id'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'portalnews.test',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kpf-backpanel-production.up.railway.app',
        pathname: '/storage/banners/**',
      },
      {
        protocol: 'https',
        hostname: 'bpf-admin.newsmaker.id',
        pathname: '/storage/banners/**',
      },
      {
        protocol: 'https',
        hostname: 'portalnews.newsmaker.id',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'bpf-backend.test',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  swcMinify: true,
};

export default nextConfig;
