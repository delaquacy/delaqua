/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    REVOLUT_KEY: process.env.REVOLUT_KEY,
  },
};

module.exports = nextConfig;
