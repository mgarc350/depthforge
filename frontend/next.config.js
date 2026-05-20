/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
};

module.exports = nextConfig;
