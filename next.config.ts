import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi i18n
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    localeDetection: false, // sama seperti di EWF
  },

  // Nonaktifkan trailing slash untuk konsistensi
  trailingSlash: false,

  // Redirect ke /en kalau browser pakai bahasa Inggris
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "header",
            key: "accept-language",
            value: "en",
          },
        ],
        destination: "/en",
        permanent: false,
        locale: false,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://bpf-admin.newsmaker.id",
  },

  reactStrictMode: true,

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = "eval-source-map";
    }
    return config;
  },

  images: {
    domains: [
      "bpf-official.vercel.app",
      "bpf-admin.newsmaker.id",
      "portalnews.test",
      "localhost",
      "127.0.0.1",
      "kpf-backend.test",
      "ewf-backend.test",
      "kpf-backpanel-production.up.railway.app",
      "placehold.co",
      "images.unsplash.com",
      "source.unsplash.com",
      "via.placeholder.com",
      "portalnews.newsmaker.id",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bpf-admin.newsmaker.id",
        port: "",
        pathname: "/storage/banners/**",
      },
      {
        protocol: "https",
        hostname: "kpf-backpanel-production.up.railway.app",
        port: "",
        pathname: "/storage/banners/**",
      },
      {
        protocol: "https",
        hostname: "portalnews.newsmaker.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  swcMinify: true,
};

export default nextConfig;
