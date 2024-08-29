/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  reactStrictMode: false // to avoid rendering all elements twice
};

module.exports = nextConfig;
