/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  reactStrictMode: false // to avoid rendering all elements twice
};

module.exports = nextConfig;
